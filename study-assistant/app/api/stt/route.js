import {NextRequest, NextResponse} from 'next/server'
const sdk = require('microsoft-cognitiveservices-speech-sdk')

export async function POST(req) {
  // This example requires environment variables named "SPEECH_KEY" and "SPEECH_REGION"
  let speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.SPEECH_KEY,
    process.env.SPEECH_REGION,
  )
  speechConfig.speechRecognitionLanguage = 'en-US'
  const pushStream = sdk.AudioInputStream.createPushStream(
    sdk.AudioStreamFormat.getWaveFormatPCM(16000, 16, 1),
  )

  // Assume body = the .wav file
  for await (const chunk of req.body) {
    pushStream.write(chunk.buffer)
  }
  pushStream.close()

  let audioConfig = sdk.AudioConfig.fromStreamInput(pushStream)
  let recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig)

  let text = ''
  let error = null
  async function recognizeSpeech() {
    return new Promise((resolve, reject) => {
      recognizer.recognizeOnceAsync(
        (result) => {
          switch (result.reason) {
            case sdk.ResultReason.RecognizedSpeech:
              console.log(`RECOGNIZED: Text=${result.text}`)
              text = result.text
              resolve({
                status: 200,
                body: text,
              })
            case sdk.ResultReason.NoMatch:
              error = 'NOMATCH: Speech could not be recognized.'
              resolve({
                status: 400,
                body: error,
              })
            case sdk.ResultReason.Canceled:
              const cancellation = sdk.CancellationDetails.fromResult(result)
              if (cancellation.reason == sdk.CancellationReason.Error) {
                error = `CANCELED: ErrorCode=${cancellation.ErrorCode}. ErrorDetails=${cancellation.errorDetails}`
              } else {
                error = `CANCELED: Reason=${cancellation.reason}`
              }
              resolve({
                status: 400,
                body: error,
              })
          }
          recognizer.close()
        },
        (error) => {
          error = `Failed: ${error}`
          recognizer.close()
          resolve({
            status: 400,
            body: error,
          })
        },
      )
    })
  }

  const response = await recognizeSpeech()
  return NextResponse.json(response)
}
