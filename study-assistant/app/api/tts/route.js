import { NextResponse, NextRequest } from "next/server";
const sdk = require("microsoft-cognitiveservices-speech-sdk");

export async function POST(req) {
  const audioFile = "YourAudioFile.wav";
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
  const audioConfig = sdk.AudioConfig.fromAudioFileOutput(audioFile);

  // The language of th   e voice that speaks.
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

  // Create the speech synthesizer.
  let synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);

  // Start the synthesizer and wait for a result.
  synthesizer.speakTextAsync(
    text,
    function (result) {
      if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
        console.log("synthesis finished.");
      } else {
        console.error(
          "Speech synthesis canceled, " +
            result.errorDetails +
            "\nDid you set the speech resource key and region values?"
        );
      }
      synthesizer.close();
      synthesizer = null;
    },
    function (err) {
      console.trace("err - " + err);
      synthesizer.close();
      synthesizer = null;
    }
  );
  console.log("Now synthesizing to: " + audioFile);

  return NextResponse.json({ body: "Finished!" });
}
