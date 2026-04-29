export function header(title, subtitle) {
  const container = document.createElement("div");
  container.classList.add("legend-header");

  if (title) {
    const h1 = document.createElement("h1");
    h1.textContent = title;
    container.appendChild(h1);
  }

  if (subtitle) {
    const p = document.createElement("p");
    p.textContent = subtitle;
    container.appendChild(p);
  }

  return container;
}
