// modernMinimalistPDF.ts

import { Education, Experience, Personal, Reference } from "../../interfaces";


export const modernMinimalistPDF = (
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
          body { font-family: 'Inter', sans-serif; padding: 30px; color: #2d3748; background: white; font-size: 13px; line-height: 1.5; }
          .container { max-width: 1000px; margin: 0 auto; }
          .header { text-align: center; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e2e8f0; }
          .header h1 { font-size: 32px; font-weight: 700; margin: 0 0 8px 0; color: #1a202c; letter-spacing: -0.5px; }
          .header-title { font-size: 18px; color: #4a5568; margin-bottom: 12px; font-weight: 500; }
          .contact-info { display: flex; justify-content: center; flex-wrap: wrap; gap: 16px; color: #718096; }
          .two-column { display: flex; gap: 40px; align-items: flex-start; }
          .main-content { flex: 1; }
          .sidebar { flex: 0 0 300px; }
          .section { margin-bottom: 24px; }
          .section-title { font-size: 16px; font-weight: 700; color: #2d3748; margin-bottom: 16px; padding-bottom: 6px; border-bottom: 1px solid #e2e8f0; text-transform: uppercase; letter-spacing: 0.5px; }
          .experience-item { margin-bottom: 20px; padding-left: 16px; border-left: 3px solid #4299e1; }
          .education-item { margin-bottom: 16px; padding-left: 16px; border-left: 3px solid #48bb78; }
          .item-header { display: flex; justify-content: between; align-items: flex-start; margin-bottom: 6px; }
          .item-title { font-weight: 600; color: #2d3748; font-size: 15px; }
          .item-subtitle { color: #4a5568; font-weight: 500; }
          .item-date { color: #718096; font-size: 12px; background: #f7fafc; padding: 2px 8px; border-radius: 12px; white-space: nowrap; }
          .skills-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
          .skill-item { background: #f7fafc; padding: 8px 12px; border-radius: 8px; text-align: center; font-size: 12px; font-weight: 500; color: #4a5568; }
          .reference-item { background: #f7fafc; padding: 12px; border-radius: 8px; margin-bottom: 12px; }
          .reference-name { font-weight: 600; color: #2d3748; }
          .summary { background: #f0fff4; padding: 16px; border-radius: 8px; border-left: 4px solid #48bb78; line-height: 1.6; }
          @media print { body { padding: 20px; } .two-column { gap: 30px; } }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${personal.fullName || ""}</h1>
            <div class="header-title">${personal.title || ""}</div>
            <div class="contact-info">
              ${personal.email ? `<div>${personal.email}</div>` : ""}
              ${personal.phone ? `<div>${personal.phone}</div>` : ""}
              ${personal.location ? `<div>${personal.location}</div>` : ""}
            </div>
          </div>

          <div class="two-column">
            <div class="main-content">
              ${
                personal.summary
                  ? `<div class="section"><div class="section-title">Professional Profile</div><div class="summary">${personal.summary}</div></div>`
                  : ""
              }
              ${
                experience.length
                  ? `<div class="section"><div class="section-title">Work Experience</div>${experience
                      .map(
                        (exp) =>
                          `<div class="experience-item"><div class="item-header"><div><div class="item-title">${exp.role}</div><div class="item-subtitle">${exp.company}</div></div><div class="item-date">${exp.start} - ${exp.end}</div></div><div>${exp.details}</div></div>`
                      )
                      .join("")}</div>`
                  : ""
              }
            </div>
            <div class="sidebar">
              ${
                skills.length
                  ? `<div class="section"><div class="section-title">Technical Skills</div><div class="skills-grid">${skills
                      .map((skill) => `<div class="skill-item">${skill}</div>`)
                      .join("")}</div></div>`
                  : ""
              }
              ${
                education.length
                  ? `<div class="section"><div class="section-title">Education</div>${education
                      .map(
                        (edu) =>
                          `<div class="education-item"><div class="item-header"><div><div class="item-title">${
                            edu.degree
                          }</div><div class="item-subtitle">${
                            edu.school
                          }</div></div><div class="item-date">${edu.start} - ${
                            edu.end
                          }</div></div>${
                            edu.details ? `<div>${edu.details}</div>` : ""
                          }</div>`
                      )
                      .join("")}</div>`
                  : ""
              }
              ${
                references.length
                  ? `<div class="section"><div class="section-title">References</div>${references
                      .map(
                        (ref) =>
                          `<div class="reference-item"><div class="reference-name">${ref.name}</div><div>${ref.relation}</div><div>${ref.contact}</div></div>`
                      )
                      .join("")}</div>`
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
