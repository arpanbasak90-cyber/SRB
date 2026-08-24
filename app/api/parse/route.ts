import { NextResponse } from 'next/server';
const pdfParse = require('pdf-parse');
import mammoth from 'mammoth';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded.' }, { status: 400 });
    }

    const fileName = file.name;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const ext = fileName.split('.').pop()?.toLowerCase();

    let extractedText = '';

    if (ext === 'pdf') {
      const pdfData = await pdfParse(buffer);
      extractedText = pdfData.text || '';
    } else if (ext === 'docx' || ext === 'doc') {
      const docxResult = await mammoth.extractRawText({ buffer });
      extractedText = docxResult.value || '';
    } else if (ext === 'txt' || ext === 'md' || ext === 'rtf') {
      extractedText = buffer.toString('utf-8');
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format. Please upload a PDF (.pdf), Word document (.docx), or Text file (.txt).' },
        { status: 400 }
      );
    }

    const cleanedText = extractedText.trim();

    if (!cleanedText || cleanedText.length < 20) {
      return NextResponse.json(
        { error: 'Could not extract sufficient text from the file. Please ensure the document is not an empty image/scanned PDF.' },
        { status: 400 }
      );
    }

    return NextResponse.json({ text: cleanedText, fileName });
  } catch (error: any) {
    console.error('File parsing error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process file on server.' },
      { status: 500 }
    );
  }
}
