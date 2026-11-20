---
layout: page
title: Travel
permalink: /travel/
description: An interactive globe of destinations, with shared travel photos.
nav: true
---

<div class="travel-explorer">
  <figure class="travel-globe">
    <div class="travel-globe-frame" id="travel-globe-frame">
      <canvas
        id="travel-globe"
        data-land-texture="{{ '/assets/img/world-land.svg' | relative_url }}"
        width="420"
        height="420"
        role="application"
        tabindex="0"
        aria-label="Interactive world globe. Drag or use arrow keys to rotate; use plus and minus to zoom."
      ></canvas>
      <p class="travel-globe-tooltip" id="travel-globe-tooltip" aria-hidden="true"></p>
      <div class="travel-globe-controls" aria-label="Globe controls">
        <button type="button" data-globe-zoom="in" aria-label="Zoom in">+</button>
        <button type="button" data-globe-reset aria-label="Reset globe view">&#8634;</button>
        <button type="button" data-globe-zoom="out" aria-label="Zoom out">&minus;</button>
      </div>
    </div>
    <figcaption>Rotate the globe by dragging, select a destination, or use the keyboard controls. Land data: <a href="https://www.naturalearthdata.com/about/terms-of-use/">Natural Earth</a> (public domain).</figcaption>
  </figure>

  <section class="travel-destination-panel" aria-labelledby="destinations-title">
    <h2 id="destinations-title">Destinations</h2>
    <p class="travel-instruction">Choose a destination to center the globe and view its photos.</p>
    <div class="travel-entries">
      {% for place in site.data.travel.places %}
        <article class="travel-entry" data-place-entry="{{ place.id }}" hidden>
          <h3>{{ place.name }}</h3>
          {% if place.photos.size > 0 %}
            <p class="travel-gallery-hint">Select a photo to open the full-size image.</p>
            <div class="travel-gallery" aria-label="Photos from {{ place.name }}">
              {% for photo in place.photos %}
                {% assign photo_path = photo.file | prepend: 'assets/img/travel/' %}
                <a href="{{ photo_path | prepend: '/' | relative_url }}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size photo {{ forloop.index }} from {{ place.name }} in a new tab">
                  {% include figure.liquid path=photo_path sizes="(max-width: 575px) 50vw, 150px" alt=photo.alt loading="lazy" %}
                </a>
              {% endfor %}
            </div>
          {% else %}
            <p class="travel-empty">No photos have been shared for this destination yet.</p>
          {% endif %}
        </article>
      {% endfor %}
    </div>
    <p class="travel-status" id="travel-status" role="status" aria-live="polite">Select a destination to focus the globe and view its photos.</p>
    <div class="travel-destinations" aria-label="Travel destinations">
      {% for place in site.data.travel.places %}
        <button
          type="button"
          class="travel-destination"
          data-place-select="{{ place.id }}"
          data-place-name="{{ place.name }}"
          data-lat="{{ place.latitude }}"
          data-lon="{{ place.longitude }}"
          aria-pressed="false"
        >
          <span>{{ place.name }}</span>
          {% if place.photos.size > 0 %}
            <span class="travel-photo-count">{{ place.photos.size }} photos</span>
          {% endif %}
        </button>
      {% endfor %}
      <button type="button" class="travel-reset" data-place-reset>Clear selection</button>
    </div>
  </section>
</div>
<noscript><p>The globe requires JavaScript. The destination list remains available above.</p></noscript>
<script defer src="{{ '/assets/js/travel-globe.js' | relative_url | bust_file_cache }}"></script>
