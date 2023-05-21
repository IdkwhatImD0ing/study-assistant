import {NextResponse, NextRequest} from 'next/server'

// OpenAI API
const {Configuration, OpenAIApi} = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
})
const openai = new OpenAIApi(configuration)

// POST /api/chat
export async function POST(req) {
  const chunks = []
  for await (const chunk of req.body) {
    chunks.push(chunk)
  }

  // Parsing the body of the request
  const body = JSON.parse(Buffer.concat(chunks).toString())
  const messages = body.messages

  // Body is of array of objects of the form {role: "assistant", message: "value"}
  const completion = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: messages,
  })

  const reply = completion.data.choices[0].message.content

  return NextResponse.json({role: 'assistant', content: reply})
}
