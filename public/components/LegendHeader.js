class LegendHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title");
    const subtitle = this.getAttribute("subtitle") || "";

    this.shadowRoot.innerHTML = `
            <style>
                h1 {
                    font-size: 2.5rem;
                    margin-bottom: 0.5rem;
                }
                p {
                    font-size: 1.25rem;
                    color: #777676;
                }
            </style>
            ${title ? `<h1>${title}</h1>` : ""}
            <p>${subtitle}</p>
        `;
  }
}

customElements.define("csl-legend-header", LegendHeader);
