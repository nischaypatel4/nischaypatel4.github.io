document.querySelectorAll("[data-copy-email]").forEach((button) => {
  button.addEventListener("click", async () => {
    const status = button.parentElement.querySelector(".copy-status");
    try {
      if (!navigator.clipboard) throw new Error("Clipboard access is unavailable.");
      await navigator.clipboard.writeText(button.dataset.copyEmail);
      status.textContent = "Email copied.";
    } catch (error) {
      console.warn("Unable to copy the email address.", error);
      status.textContent = "Copy unavailable. Select the address or use the email link.";
    }
  });
});

const readingSearch = document.getElementById("reading-search");
const readingRecommended = document.getElementById("reading-recommended");
const readingTypes = document.getElementById("reading-types");
const readingSummary = document.querySelector(".reading-count");
const readingEmpty = document.getElementById("reading-empty");
if (readingSearch && readingRecommended && readingTypes && readingSummary && readingEmpty) {
  const entries = [...document.querySelectorAll(".reading-entry")];
  const state = { type: "all", tag: "" };
  const types = [...new Set(entries.map((entry) => entry.dataset.type))];
  const createTypeButton = (type, label) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "reading-type-filter";
    button.dataset.readingType = type;
    button.textContent = label;
    button.setAttribute("aria-pressed", String(state.type === type));
    button.addEventListener("click", () => {
      state.type = type;
      updateReading();
    });
    readingTypes.append(button);
  };
  createTypeButton("all", "All");
  types.forEach((type) => createTypeButton(type, `${type[0].toLocaleUpperCase()}${type.slice(1)}`));

  const updateReading = () => {
    const query = readingSearch.value.trim().toLocaleLowerCase();
    let count = 0;
    entries.forEach((entry) => {
      const tags = entry.dataset.tags.split(",").filter(Boolean);
      const matches = entry.textContent.toLocaleLowerCase().includes(query);
      const matchesType = state.type === "all" || entry.dataset.type === state.type;
      const matchesTag = !state.tag || tags.includes(state.tag);
      const starred = !readingRecommended.checked || entry.dataset.recommended === "true";
      entry.hidden = !(matches && matchesType && matchesTag && starred);
      if (!entry.hidden) count += 1;
    });
    readingTypes.querySelectorAll("[data-reading-type]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.readingType === state.type));
    });
    document.querySelectorAll("[data-reading-tag]").forEach((button) => {
      button.setAttribute("aria-pressed", String(button.dataset.readingTag === state.tag));
    });
    document.querySelectorAll(".reading-month").forEach((month) => {
      month.hidden = ![...month.querySelectorAll(".reading-entry")].some((entry) => !entry.hidden);
    });
    readingEmpty.hidden = count > 0;
    readingSummary.textContent = `${count} ${count === 1 ? "entry" : "entries"} shown`;
    if (state.tag) readingSummary.textContent += ` · #${state.tag}`;
    if (state.type !== "all") readingSummary.textContent += ` · ${state.type}`;
  };
  document.querySelectorAll("[data-reading-tag]").forEach((button) => {
    button.addEventListener("click", () => {
      state.tag = state.tag === button.dataset.readingTag ? "" : button.dataset.readingTag;
      updateReading();
    });
  });
  readingSearch.addEventListener("input", updateReading);
  readingRecommended.addEventListener("change", updateReading);
  updateReading();
}

