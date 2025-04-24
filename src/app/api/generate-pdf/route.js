import { PDFDocument, rgb } from 'pdf-lib';

export async function POST(request) {
  try {
    const { resumeText } = await request.json();
    
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([595.28, 841.89]); // A4 size
    const { width, height } = page.getSize();
    
    // Add text to the PDF
    page.drawText(resumeText, {
      x: 50,
      y: height - 50,
      size: 12,
      color: rgb(0, 0, 0),
      maxWidth: width - 100,
    });
    
    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    
    return new Response(pdfBytes, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to generate PDF' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
} 