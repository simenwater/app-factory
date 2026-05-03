import type { ResumeData, ExportFormat } from "@/types";

/**
 * @description 导出简历为指定格式
 * @param {ResumeData} resume - 简历数据
 * @param {ExportFormat} format - 导出格式（pdf/docx）
 */
export async function exportResume(
  resume: ResumeData,
  format: ExportFormat
): Promise<void> {
  if (format === "pdf") {
    await exportToPDF(resume);
  } else if (format === "docx") {
    await exportToDocx(resume);
  }
}

/**
 * @description 导出为 PDF 格式
 * @param {ResumeData} resume - 简历数据
 */
async function exportToPDF(resume: ResumeData): Promise<void> {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "a4" });

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = 20;

  const addText = (
    text: string,
    size: number,
    style: "normal" | "bold" = "normal",
    color: [number, number, number] = [33, 33, 33]
  ) => {
    doc.setFontSize(size);
    doc.setFont("helvetica", style);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, contentWidth);
    for (const line of lines) {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += size * 0.45;
    }
  };

  const addSectionTitle = (title: string) => {
    y += 4;
    doc.setDrawColor(59, 130, 246);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 5;
    addText(title.toUpperCase(), 11, "bold", [59, 130, 246]);
    y += 2;
  };

  // Header
  addText(resume.personalInfo.fullName || "Your Name", 22, "bold", [30, 41, 59]);
  y += 2;

  const contactParts = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
  ].filter(Boolean);
  if (contactParts.length > 0) {
    addText(contactParts.join("  |  "), 9, "normal", [100, 116, 139]);
    y += 1;
  }

  const linkParts = [
    resume.personalInfo.linkedin,
    resume.personalInfo.website,
  ].filter(Boolean);
  if (linkParts.length > 0) {
    addText(linkParts.join("  |  "), 9, "normal", [59, 130, 246]);
    y += 1;
  }

  // Summary
  if (resume.personalInfo.summary) {
    addSectionTitle("Professional Summary");
    addText(resume.personalInfo.summary, 10);
  }

  // Work Experience
  if (resume.workExperience.length > 0) {
    addSectionTitle("Work Experience");
    for (const exp of resume.workExperience) {
      addText(exp.position, 11, "bold");
      addText(
        `${exp.company} | ${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`,
        9,
        "normal",
        [100, 116, 139]
      );
      y += 1;
      if (exp.description) {
        addText(exp.description, 9);
      }
      for (const ach of exp.achievements) {
        addText(`• ${ach}`, 9);
      }
      y += 3;
    }
  }

  // Education
  if (resume.education.length > 0) {
    addSectionTitle("Education");
    for (const edu of resume.education) {
      addText(`${edu.degree} in ${edu.field}`, 11, "bold");
      addText(
        `${edu.institution} | ${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`,
        9,
        "normal",
        [100, 116, 139]
      );
      y += 3;
    }
  }

  // Skills
  if (resume.skills.length > 0) {
    addSectionTitle("Skills");
    const skillText = resume.skills.map((s) => s.name).join("  •  ");
    addText(skillText, 10);
  }

  // Projects
  if (resume.projects.length > 0) {
    addSectionTitle("Projects");
    for (const proj of resume.projects) {
      addText(proj.name, 11, "bold");
      if (proj.description) {
        addText(proj.description, 9);
      }
      if (proj.technologies.length > 0) {
        addText(
          `Technologies: ${proj.technologies.join(", ")}`,
          9,
          "normal",
          [100, 116, 139]
        );
      }
      y += 3;
    }
  }

  doc.save(`${resume.title || "resume"}.pdf`);
}

/**
 * @description 导出为 Word (DOCX) 格式
 * @param {ResumeData} resume - 简历数据
 */
async function exportToDocx(resume: ResumeData): Promise<void> {
  const {
    Document,
    Paragraph,
    TextRun,
    HeadingLevel,
    AlignmentType,
    Packer,
    BorderStyle,
  } = await import("docx");
  const { saveAs } = await import("file-saver");

  const children: InstanceType<typeof Paragraph>[] = [];

  // Header
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 100 },
      children: [
        new TextRun({
          text: resume.personalInfo.fullName || "Your Name",
          bold: true,
          size: 32,
          color: "1E293B",
        }),
      ],
    })
  );

  const contactLine = [
    resume.personalInfo.email,
    resume.personalInfo.phone,
    resume.personalInfo.location,
  ]
    .filter(Boolean)
    .join("  |  ");
  if (contactLine) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
        children: [
          new TextRun({
            text: contactLine,
            size: 20,
            color: "64748B",
          }),
        ],
      })
    );
  }

  const addSection = (title: string) => {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        spacing: { before: 300, after: 100 },
        border: {
          bottom: { style: BorderStyle.SINGLE, size: 1, color: "3B82F6" },
        },
        children: [
          new TextRun({
            text: title.toUpperCase(),
            bold: true,
            size: 24,
            color: "3B82F6",
          }),
        ],
      })
    );
  };

  // Summary
  if (resume.personalInfo.summary) {
    addSection("Professional Summary");
    children.push(
      new Paragraph({
        spacing: { after: 200 },
        children: [
          new TextRun({ text: resume.personalInfo.summary, size: 22 }),
        ],
      })
    );
  }

  // Work Experience
  if (resume.workExperience.length > 0) {
    addSection("Work Experience");
    for (const exp of resume.workExperience) {
      children.push(
        new Paragraph({
          spacing: { before: 100 },
          children: [
            new TextRun({
              text: exp.position,
              bold: true,
              size: 24,
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${exp.company} | ${exp.startDate} - ${exp.current ? "Present" : exp.endDate}`,
              size: 20,
              color: "64748B",
              italics: true,
            }),
          ],
        })
      );
      if (exp.description) {
        children.push(
          new Paragraph({
            spacing: { before: 50 },
            children: [new TextRun({ text: exp.description, size: 22 })],
          })
        );
      }
      for (const ach of exp.achievements) {
        children.push(
          new Paragraph({
            bullet: { level: 0 },
            children: [new TextRun({ text: ach, size: 22 })],
          })
        );
      }
    }
  }

  // Education
  if (resume.education.length > 0) {
    addSection("Education");
    for (const edu of resume.education) {
      children.push(
        new Paragraph({
          spacing: { before: 100 },
          children: [
            new TextRun({
              text: `${edu.degree} in ${edu.field}`,
              bold: true,
              size: 24,
            }),
          ],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${edu.institution} | ${edu.startDate} - ${edu.endDate}${edu.gpa ? ` | GPA: ${edu.gpa}` : ""}`,
              size: 20,
              color: "64748B",
              italics: true,
            }),
          ],
        })
      );
    }
  }

  // Skills
  if (resume.skills.length > 0) {
    addSection("Skills");
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: resume.skills.map((s) => s.name).join("  •  "),
            size: 22,
          }),
        ],
      })
    );
  }

  // Projects
  if (resume.projects.length > 0) {
    addSection("Projects");
    for (const proj of resume.projects) {
      children.push(
        new Paragraph({
          spacing: { before: 100 },
          children: [
            new TextRun({ text: proj.name, bold: true, size: 24 }),
          ],
        })
      );
      if (proj.description) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: proj.description, size: 22 })],
          })
        );
      }
      if (proj.technologies.length > 0) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: `Technologies: ${proj.technologies.join(", ")}`,
                size: 20,
                color: "64748B",
                italics: true,
              }),
            ],
          })
        );
      }
    }
  }

  const docFile = new Document({
    sections: [{ children }],
  });

  const blob = await Packer.toBlob(docFile);
  saveAs(blob, `${resume.title || "resume"}.docx`);
}
