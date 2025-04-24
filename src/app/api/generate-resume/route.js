import { PDFDocument, rgb } from 'pdf-lib';

export async function POST(request) {
  try {
    const data = await request.json();
    
    // Generate formatted resume text
    const resume = `
${data.name}
${data.email} | ${data.phone}
${data.linkedin ? `LinkedIn: ${data.linkedin}` : ''}
${data.github ? `GitHub: ${data.github}` : ''}

EDUCATION
${data.degree} in ${data.field}
${data.school}, ${data.year}

SKILLS
${data.skills}

EXPERIENCE
${data.experience}

CAREER GOAL
${data.careerGoal}
    `.trim();

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    // Add text to the PDF with better formatting
    const lines = resume.split('\n');
    let y = height - 50;
    const lineHeight = 20;
    
    for (const line of lines) {
      if (line.trim()) {
        page.drawText(line, {
          x: 50,
          y,
          size: 12,
          color: rgb(0, 0, 0),
          maxWidth: width - 100,
        });
        y -= lineHeight;
      } else {
        y -= lineHeight / 2; // Add some space between sections
      }
    }
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${data.name.replace(/\s+/g, '_')}_resume.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating resume:', error);
    return new Response(JSON.stringify({ error: 'Failed to generate resume' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}