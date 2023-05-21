const pdfParse = require("pdf-parse");

import { NextResponse, NextRequest } from "next/server";

export async function POST(req) {
  let chunks = [];
  for await (const chunk of req.body) {
    chunks.push(chunk);
  }
  const pdfBuffer = Buffer.concat(chunks);

  try {
    const pdfData = await pdfParse(pdfBuffer);
    return NextResponse.json({ text: pdfData.text });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json({
      status: 500,
      body: "Error processing PDF",
    });
  }
}
