(() => {
  const canvas = document.getElementById("travel-globe");
  const frame = document.getElementById("travel-globe-frame");
  const tooltip = document.getElementById("travel-globe-tooltip");
  if (!canvas || !frame || !tooltip) return;

  const context = canvas.getContext("2d");
  if (!context) {
    document.getElementById("travel-status").textContent = "The interactive globe is unavailable in this browser.";
    return;
  }

  const scene = document.createElement("canvas");
  const sceneContext = scene.getContext("2d", { willReadFrequently: true });
  if (!sceneContext) {
    document.getElementById("travel-status").textContent = "The interactive globe is unavailable in this browser.";
    return;
  }
  const sceneSize = 420;
  const sceneCenter = sceneSize / 2;
  const sceneRadius = sceneSize * 0.425;
  scene.width = sceneSize;
  scene.height = sceneSize;

  const places = [...document.querySelectorAll("[data-place-select]")].map((button, index) => ({
    id: button.dataset.placeSelect,
    name: button.dataset.placeName,
    latitude: Number(button.dataset.lat),
    longitude: Number(button.dataset.lon),
    color: ["#a84f3b", "#28715b", "#456db0"][index % 3],
    button,
    entry: document.querySelector(`[data-place-entry="${CSS.escape(button.dataset.placeSelect)}"]`),
  }));
  const destinationButtons = places.map((place) => place.button);
  const entries = places.map((place) => place.entry);
  const status = document.getElementById("travel-status");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const textureImage = new Image();
  let landMask;
  let canvasSize = 0;
  let pixelRatio = 1;
  let centerLongitude = 35;
  let centerLatitude = 12;
  let zoom = 1;
  let drag = null;
  let pointer = null;
  let hoveredPlace = null;
  let selectedPlaceId = "";
  let autoRotateAfter = 0;
  let animationFrame = 0;
  let lastFrame = 0;
  const initialView = { longitude: 35, latitude: 12, zoom: 1 };
  const imageData = sceneContext.createImageData(sceneSize, sceneSize);

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const degrees = (radiansValue) => (radiansValue * 180) / Math.PI;
  const modulo = (value, base) => ((value % base) + base) % base;

  function resize() {
    const rect = frame.getBoundingClientRect();
    canvasSize = Math.min(rect.width, 440);
    pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;
    canvas.width = Math.round(canvasSize * pixelRatio);
    canvas.height = Math.round(canvasSize * pixelRatio);
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    draw();
  }

  function project(latitude, longitude) {
    const lat = radians(latitude);
    const centerLat = radians(centerLatitude);
    const longitudeDelta = radians(longitude - centerLongitude);
    const sinLat = Math.sin(lat);
    const cosLat = Math.cos(lat);
    const sinCenter = Math.sin(centerLat);
    const cosCenter = Math.cos(centerLat);
    const cosLongitude = Math.cos(longitudeDelta);
    const depth = sinCenter * sinLat + cosCenter * cosLat * cosLongitude;
    if (depth < 0) return null;

    const radius = canvasSize * 0.425 * zoom;
    return {
      x: canvasSize / 2 + radius * cosLat * Math.sin(longitudeDelta),
      y: canvasSize / 2 - radius * (cosCenter * sinLat - sinCenter * cosLat * cosLongitude),
      depth,
    };
  }

  function rasterizeLand() {
    const texture = document.createElement("canvas");
    texture.width = sceneSize * 2;
    texture.height = sceneSize;
    const textureContext = texture.getContext("2d", { willReadFrequently: true });
    if (!textureContext) return;

    textureContext.drawImage(textureImage, 0, 0, texture.width, texture.height);
    const pixels = textureContext.getImageData(0, 0, texture.width, texture.height).data;
    landMask = new Uint8Array(texture.width * texture.height);
    for (let index = 0; index < landMask.length; index += 1) {
      landMask[index] = pixels[index * 4 + 3] > 28 ? 1 : 0;
    }
    draw();
  }

  function renderSurface() {
    const dark = document.documentElement.dataset.theme === "dark";
    const ocean = dark ? [25, 49, 61] : [174, 207, 220];
    const land = dark ? [87, 130, 93] : [94, 139, 101];
    const centerLon = radians(centerLongitude);
    const centerLat = radians(centerLatitude);
    const cosCenter = Math.cos(centerLat);
    const sinCenter = Math.sin(centerLat);
    const textureWidth = sceneSize * 2;
    const textureHeight = sceneSize;
    const data = imageData.data;

    for (let y = 0; y < sceneSize; y += 1) {
      const ny = (sceneCenter - y) / sceneRadius;
      for (let x = 0; x < sceneSize; x += 1) {
        const nx = (x - sceneCenter) / sceneRadius;
        const radiusSquared = nx * nx + ny * ny;
        if (radiusSquared > 1) continue;

        const z = Math.sqrt(1 - radiusSquared);
        const sinLatitude = ny * cosCenter + z * sinCenter;
        const latitude = Math.asin(clamp(sinLatitude, -1, 1));
        const longitudeDelta = Math.atan2(nx, z * cosCenter - ny * sinCenter);
        const longitude = centerLon + longitudeDelta;
        const textureX = Math.floor(modulo((degrees(longitude) + 180) / 360, 1) * textureWidth);
        const textureY = clamp(Math.floor(((Math.PI / 2 - latitude) / Math.PI) * textureHeight), 0, textureHeight - 1);
        const isLand = landMask && landMask[textureY * textureWidth + textureX] === 1;
        const light = clamp(0.76 + (nx * -0.25 + ny * 0.28 + z * 0.55) * 0.25, 0.58, 1);
        const index = (y * sceneSize + x) * 4;
        const color = isLand ? land : ocean;

        data[index] = Math.round(color[0] * light);
        data[index + 1] = Math.round(color[1] * light);
        data[index + 2] = Math.round(color[2] * light);
        data[index + 3] = 255;
      }
    }

    sceneContext.putImageData(imageData, 0, 0);
  }

  function drawGraticule() {
    const radius = canvasSize * 0.425 * zoom;
    context.save();
    context.beginPath();
    context.arc(canvasSize / 2, canvasSize / 2, Math.min(radius, canvasSize / 2 - 1), 0, Math.PI * 2);
    context.clip();
    context.strokeStyle = document.documentElement.dataset.theme === "dark"
      ? "rgba(224, 240, 228, 0.18)"
      : "rgba(35, 75, 84, 0.20)";
    context.lineWidth = 0.55;

    for (let latitude = -60; latitude <= 60; latitude += 30) {
      drawLine(Array.from({ length: 181 }, (_, index) => [latitude, index * 2 - 180]));
    }
    for (let longitude = -180; longitude < 180; longitude += 30) {
      drawLine(Array.from({ length: 151 }, (_, index) => [index * 1.2 - 90, longitude]));
    }
    context.restore();

    function drawLine(points) {
      context.beginPath();
      let penDown = false;
      for (const [lat, lon] of points) {
        const point = project(lat, lon);
        if (!point) {
          penDown = false;
          continue;
        }
        if (penDown) context.lineTo(point.x, point.y);
        else context.moveTo(point.x, point.y);
        penDown = true;
      }
      context.stroke();
    }
  }

  function drawPlaces() {
    for (const place of places) {
      const point = project(place.latitude, place.longitude);
      if (!point) continue;
      const pinRadius = 4 + point.depth * 1.7;
      context.beginPath();
      context.arc(point.x, point.y, pinRadius + 5, 0, Math.PI * 2);
      context.fillStyle = `${place.color}30`;
      context.fill();
      context.beginPath();
      context.arc(point.x, point.y, pinRadius, 0, Math.PI * 2);
      context.fillStyle = place.color;
      context.fill();
      context.lineWidth = 1.5;
      context.strokeStyle = "#fff";
      context.stroke();
    }
  }

  function updateHover() {
    hoveredPlace = null;
    if (!pointer || drag) {
      tooltip.style.display = "none";
      return;
    }
    let nearestDistance = Infinity;
    for (const place of places) {
      const point = project(place.latitude, place.longitude);
      if (!point) continue;
      const distance = Math.hypot(pointer.x - point.x, pointer.y - point.y);
      if (distance < 18 && distance < nearestDistance) {
        hoveredPlace = { place, point };
        nearestDistance = distance;
      }
    }
    if (!hoveredPlace) {
      tooltip.style.display = "none";
      return;
    }
    tooltip.textContent = hoveredPlace.place.name;
    tooltip.style.left = `${clamp(hoveredPlace.point.x + 12, 8, frame.clientWidth - 205)}px`;
    tooltip.style.top = `${clamp(hoveredPlace.point.y - 36, 8, frame.clientHeight - 36)}px`;
    tooltip.style.display = "block";
  }

  function draw() {
    if (!canvasSize) return;
    renderSurface();
    context.clearRect(0, 0, canvasSize, canvasSize);
    context.drawImage(scene, 0, 0, canvasSize, canvasSize);

    const radius = canvasSize * 0.425 * zoom;
    if (radius <= canvasSize / 2) {
      context.beginPath();
      context.arc(canvasSize / 2, canvasSize / 2, radius, 0, Math.PI * 2);
      context.strokeStyle = document.documentElement.dataset.theme === "dark"
        ? "rgba(160, 204, 207, 0.55)"
        : "rgba(54, 105, 117, 0.45)";
      context.lineWidth = 1;
      context.stroke();
    }
    drawGraticule();
    drawPlaces();
    updateHover();
  }

  function focusView(longitude, latitude, targetZoom = 1.12) {
    const from = { longitude: centerLongitude, latitude: centerLatitude, zoom };
    const deltaLongitude = ((longitude - from.longitude + 540) % 360) - 180;
    const start = performance.now();
    const duration = reduceMotion ? 0 : 650;
    autoRotateAfter = start + duration + 2600;

    function step(now) {
      const amount = duration === 0 ? 1 : clamp((now - start) / duration, 0, 1);
      const eased = 1 - (1 - amount) * (1 - amount) * (1 - amount);
      centerLongitude = from.longitude + deltaLongitude * eased;
      centerLatitude = from.latitude + (clamp(latitude, -78, 78) - from.latitude) * eased;
      zoom = from.zoom + (clamp(targetZoom, 0.8, 1.65) - from.zoom) * eased;
      draw();
      if (amount < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function selectPlace(place, revealOnMobile = false) {
    selectedPlaceId = place ? place.id : "";
    destinationButtons.forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.placeSelect === selectedPlaceId));
    });
    entries.forEach((entry) => {
      if (entry) entry.hidden = !place || entry.dataset.placeEntry !== selectedPlaceId;
    });
    if (place) {
      const photoCount = place.entry ? place.entry.querySelectorAll(".travel-gallery img").length : 0;
      status.textContent = photoCount
        ? `Showing ${photoCount} ${photoCount === 1 ? "photo" : "photos"} for ${place.name}.`
        : `No photos have been shared for ${place.name} yet.`;
      focusView(place.longitude, place.latitude);
      if (revealOnMobile && window.matchMedia("(max-width: 767px)").matches) {
        requestAnimationFrame(() => place.entry?.scrollIntoView({
          behavior: reduceMotion ? "auto" : "smooth",
          block: "start",
        }));
      }
    } else {
      status.textContent = "Select a destination to focus the globe and view its photos.";
      focusView(initialView.longitude, initialView.latitude, initialView.zoom);
    }
  }

  function zoomBy(factor) {
    zoom = clamp(zoom * factor, 0.8, 1.65);
    draw();
  }

  destinationButtons.forEach((button, index) => {
    button.addEventListener("click", (event) => selectPlace(places[index], event.detail > 0));
  });
  const resetPlacesButton = document.querySelector("[data-place-reset]");
  if (resetPlacesButton) resetPlacesButton.addEventListener("click", () => selectPlace(null));
  document.querySelectorAll("[data-globe-zoom]").forEach((button) => {
    button.addEventListener("click", () => zoomBy(button.dataset.globeZoom === "in" ? 1.18 : 1 / 1.18));
  });
  const resetGlobeButton = document.querySelector("[data-globe-reset]");
  if (resetGlobeButton) resetGlobeButton.addEventListener("click", () => {
    selectPlace(null);
    zoom = initialView.zoom;
    draw();
  });

  canvas.addEventListener("pointerdown", (event) => {
    drag = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      longitude: centerLongitude,
      latitude: centerLatitude,
      moved: false,
    };
    canvas.setPointerCapture(event.pointerId);
    autoRotateAfter = performance.now() + 2600;
  });
  canvas.addEventListener("pointermove", (event) => {
    const rect = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    if (drag && drag.pointerId === event.pointerId) {
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      drag.moved = drag.moved || Math.hypot(dx, dy) > 4;
      centerLongitude = drag.longitude - dx * (0.35 / zoom);
      centerLatitude = clamp(drag.latitude + dy * (0.35 / zoom), -78, 78);
      draw();
    } else {
      updateHover();
    }
  });
  canvas.addEventListener("pointerup", (event) => {
    if (!drag || drag.pointerId !== event.pointerId) return;
    const moved = drag.moved;
    drag = null;
    const rect = canvas.getBoundingClientRect();
    pointer = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    updateHover();
    if (!moved && hoveredPlace) selectPlace(hoveredPlace.place, true);
    else {
      autoRotateAfter = performance.now() + 2600;
      draw();
    }
  });
  canvas.addEventListener("pointercancel", () => {
    drag = null;
    draw();
  });
  canvas.addEventListener("pointerleave", () => {
    pointer = null;
    updateHover();
  });
  canvas.addEventListener("wheel", (event) => {
    event.preventDefault();
    zoomBy(event.deltaY < 0 ? 1.12 : 1 / 1.12);
  }, { passive: false });
  canvas.addEventListener("keydown", (event) => {
    const rotationStep = event.shiftKey ? 14 : 7;
    if (event.key === "ArrowLeft") centerLongitude -= rotationStep;
    else if (event.key === "ArrowRight") centerLongitude += rotationStep;
    else if (event.key === "ArrowUp") centerLatitude = clamp(centerLatitude + rotationStep, -78, 78);
    else if (event.key === "ArrowDown") centerLatitude = clamp(centerLatitude - rotationStep, -78, 78);
    else if (event.key === "+" || event.key === "=") zoomBy(1.12);
    else if (event.key === "-") zoomBy(1 / 1.12);
    else return;
    event.preventDefault();
    draw();
  });

  textureImage.addEventListener("load", rasterizeLand);
  textureImage.addEventListener("error", () => {
    status.textContent = "The globe’s local land texture could not be loaded.";
  });
  textureImage.src = canvas.dataset.landTexture;
  new ResizeObserver(resize).observe(frame);

  function animate(now) {
    animationFrame = requestAnimationFrame(animate);
    if (now - lastFrame < 33) return;
    const elapsed = Math.min(now - lastFrame, 50);
    lastFrame = now;
    if (!reduceMotion && !drag && now >= autoRotateAfter) {
      centerLongitude = modulo(centerLongitude + elapsed * 0.006, 360);
    }
    draw();
  }
  animationFrame = requestAnimationFrame(animate);
  window.addEventListener("pagehide", () => cancelAnimationFrame(animationFrame), { once: true });
})();
