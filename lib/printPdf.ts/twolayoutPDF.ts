// twolayoutPDF.ts

import { Education, Experience, Personal, Reference } from "../../interfaces";


export const twolayoutPDF = (
  personal: Personal,
  experience: Experience[] = [],
  education: Education[] = [],
  references: Reference[] = [],
  skills: string[] = []
) => {
  const printWindow = window.open("", "PRINT", "height=800,width=1000");
  if (!printWindow) return;

  printWindow.document.write(`
    <html>
      <head>
        <title>${personal.fullName || "Resume"}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: Inter, ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial;
            padding: 20px;
            color: #1a1a1a;
            background: white;
            font-size: 12px;
            line-height: 1.3;
          }
          .container { max-width: 900px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #e5e5e5; }
          .header h1 { font-size: 20px; font-weight: bold; margin: 0 0 5px 0; color: #1a1a1a; }
          .header-info { display: flex; justify-content: center; flex-wrap: wrap; gap: 8px; color: #666; }
          .two-column { display: flex; gap: 20px; }
          .main-content { flex: 2; }
          .sidebar { flex: 1; }
          .section { margin-bottom: 15px; }
          .section-title { font-size: 13px; font-weight: bold; border-bottom: 1px solid #e5e5e5; padding-bottom: 3px; margin-bottom: 8px; color: #1a1a1a; }
          .experience-item, .education-item { margin-bottom: 10px; }
          .item-header { display: flex; justify-content: space-between; align-items: flex-start; }
          .item-title { font-weight: 600; color: #1a1a1a; }
          .item-subtitle { color: #666; margin-bottom: 2px; }
          .item-date { color: #666; font-size: 11px; white-space: nowrap; }
          .skills-container { display: flex; flex-wrap: wrap; gap: 4px; }
          .skill-tag { background: #f3f4f6; padding: 2px 6px; border-radius: 3px; font-size: 11px; }
          .reference-item { margin-bottom: 8px; }
          .reference-name { font-weight: 600; }
          .reference-relation { color: #666; font-size: 11px; }
          .reference-contact { color: #666; font-size: 11px; }
          .summary { text-align: justify; line-height: 1.4; }
          @media print {
            body { padding: 15px; }
            .two-column { gap: 15px; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${personal.fullName || ""}</h1>
            <div class="header-info">
              ${personal.title ? `<span>${personal.title}</span>` : ""}
              ${personal.title && personal.email ? "<span>•</span>" : ""}
              ${personal.email ? `<span>${personal.email}</span>` : ""}
              ${personal.email && personal.phone ? "<span>•</span>" : ""}
              ${personal.phone ? `<span>${personal.phone}</span>` : ""}
              ${personal.phone && personal.location ? "<span>•</span>" : ""}
              ${personal.location ? `<span>${personal.location}</span>` : ""}
            </div>
          </div>

          <div class="two-column">
            <div class="main-content">
              ${
                personal.summary
                  ? `
                <div class="section">
                  <div class="section-title">PROFESSIONAL SUMMARY</div>
                  <div class="summary">${personal.summary}</div>
                </div>`
                  : ""
              }

              ${
                experience.length
                  ? `
                <div class="section">
                  <div class="section-title">EXPERIENCE</div>
                  ${experience
                    .map(
                      (exp) => `
                    <div class="experience-item">
                      <div class="item-header">
                        <div>
                          <div class="item-title">${exp.role || ""}</div>
                          <div class="item-subtitle">${exp.company || ""}</div>
                        </div>
                        <div class="item-date">${exp.start || ""} - ${
                        exp.end || ""
                      }</div>
                      </div>
                      <div>${exp.details || ""}</div>
                    </div>`
                    )
                    .join("")}
                </div>`
                  : ""
              }
            </div>

            <div class="sidebar">
              ${
                skills.length
                  ? `
                <div class="section">
                  <div class="section-title">SKILLS</div>
                  <div class="skills-container">
                    ${skills
                      .map((skill) => `<div class="skill-tag">${skill}</div>`)
                      .join("")}
                  </div>
                </div>`
                  : ""
              }

              ${
                education.length
                  ? `
                <div class="section">
                  <div class="section-title">EDUCATION</div>
                  ${education
                    .map(
                      (edu) => `
                    <div class="education-item">
                      <div class="item-title">${edu.degree || ""}</div>
                      <div class="item-subtitle">${edu.school || ""}</div>
                      <div class="item-date">${edu.start || ""} - ${
                        edu.end || ""
                      }</div>
                      ${edu.details ? `<div>${edu.details}</div>` : ""}
                    </div>`
                    )
                    .join("")}
                </div>`
                  : ""
              }

              ${
                references.length
                  ? `
                <div class="section">
                  <div class="section-title">REFERENCES</div>
                  ${references
                    .map(
                      (ref) => `
                    <div class="reference-item">
                      <div class="reference-name">${ref.name || ""}</div>
                      <div class="reference-relation">${
                        ref.relation || ""
                      }</div>
                      <div class="reference-contact">${ref.contact || ""}</div>
                    </div>`
                    )
                    .join("")}
                </div>`
                  : ""
              }
            </div>
          </div>
        </div>
      </body>
    </html>
  `);

  printWindow.document.close();
  printWindow.focus();

  setTimeout(() => {
    printWindow.print();
    printWindow.close();
  }, 500);
};
