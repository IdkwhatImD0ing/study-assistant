import { NextResponse, NextRequest } from "next/server";
import { Readable } from "stream";
const sdk = require("microsoft-cognitiveservices-speech-sdk");

export async function POST(req) {
  const chunks = [];
  for await (const chunk of req.body) {
    chunks.push(chunk);
  }

  // Parsing the body of the request
  const body = JSON.parse(Buffer.concat(chunks).toString());
  const text = body.text;

  // This example requires environment constiables named "SPEECH_KEY" and "SPEECH_REGION"
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY,
    process.env.SPEECH_REGION
  );

  // The language of th   e voice that speaks.
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

  // Create the speech synthesizer.
  let synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  // Create a promise to handle the completion of synthesis
  const synthesisPromise = new Promise((resolve, reject) => {
    synthesizer.speakTextAsync(
      text,
      (result) => {
        if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
          console.log("Synthesis finished.");
          resolve(result.audioData);
        } else {
          console.error(
            "Speech synthesis canceled, " +
              result.errorDetails +
              "\nDid you set the speech resource key and region values?"
          );
          reject(result.errorDetails);
        }
        synthesizer.close();
        synthesizer = null;
      },
      (err) => {
        console.trace("err - " + err);
        reject(err);
        synthesizer.close();
        synthesizer = null;
      }
    );
  });

  // wait for synthesis to complete
  // Returns arrayBuffer
  const audioData = await synthesisPromise;

  // Convert arrayBuffer to Buffer
  const audioBuffer = Buffer.from(audioData);

  // create a Readable stream from the Buffer
  const audioStream = Readable.from(audioBuffer);

  return new NextResponse(audioStream, {
    headers: { "Content-Type": "audio/wav" },
  });
}
