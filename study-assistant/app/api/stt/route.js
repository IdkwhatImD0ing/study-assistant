import { NextRequest, NextResponse } from "next/server";
const sdk = require("microsoft-cognitiveservices-speech-sdk");
const util = require("util");

export async function POST(req) {
  // Assume body = the .wav file
  // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
  let speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY,
    process.env.SPEECH_REGION
  );
  speechConfig.speechRecognitionLanguage = "en-US";

  const pushStream = sdk.AudioInputStream.createPushStream();
  for await (const chunk of req.body) {
    pushStream.write(chunk);
  }
  pushStream.close();

  console.log(pushStream);

  let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream);
  let speechRecognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

  const resultPromise = new Promise((resolve, reject) => {
    speechRecognizer.recognizeOnceAsync((result) => {
      switch (result.reason) {
        case sdk.ResultReason.RecognizedSpeech:
          speechRecognizer.close();
          resolve(NextResponse.json({ text: result.text }));
          break;
        case sdk.ResultReason.NoMatch:
          speechRecognizer.close();
          console.log("NOMATCH: Speech could not be recognized.");
          resolve(
            NextResponse({
              status: 400,
              body: "NOMATCH: Speech could not be recognized.",
            })
          );
          break;
        case sdk.ResultReason.Canceled:
          const cancellation = sdk.CancellationDetails.fromResult(result);
          console.log(`CANCELED: Reason=${cancellation.reason}`);

          if (cancellation.reason == sdk.CancellationReason.Error) {
            console.log(`CANCELED: ErrorCode=${cancellation.ErrorCode}`);
            console.log(`CANCELED: ErrorDetails=${cancellation.errorDetails}`);
            console.log(
              "CANCELED: Did you update the speech key and location?"
            );
          }
          speechRecognizer.close();
          resolve(
            NextResponse({
              status: 500,
              body: "CANCELED: Speech could not be recognized.",
            })
          );
          break;
      }
    });
  });

  try {
    const response = await resultPromise;
    return response;
  } catch (err) {
    console.log(err);
    return NextResponse({ status: 500, body: err });
  }
}
