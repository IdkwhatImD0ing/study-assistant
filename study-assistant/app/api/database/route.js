import {NextResponse, NextRequest} from 'next/server'
const {connectDB, disConnectDB} = require('./connect.js')
const {addToMilvus, queryMilvus} = require('./milvus.js')
const embedding = require('./embedding.js')
const insertData = require('./mongodb.js')
const processData = require('./process.js')

// OpenAI API
const {Configuration, OpenAIApi} = require('openai')

// Milvus Database Setup
const {MilvusClient} = require('@zilliz/milvus2-sdk-node')
const config = require('./config.js')
const {uri, user, password, secure} = config

// PUT /api/database
export async function PUT(req) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
  })
  const openai = new OpenAIApi(configuration)
  const milvusClient = new MilvusClient(uri, secure, user, password, secure)
  // MongoDB Setup
  await connectDB(process.env.MONGODB_URL)
  const Speech = require('./data.js')
  const chunks = []
  for await (const chunk of req.body) {
    chunks.push(chunk)
  }

  // Parsing the body of the request
  const data = JSON.parse(Buffer.concat(chunks).toString())

  // Structure of data = {userUUID: string, contents: [string]}
  try {
    // Get the user UUID
    const userUUID = data.userUUID

    // Get Milvus and MongoDB data
    const {milvusData, mongoData} = await processData(
      openai,
      userUUID,
      data.contents,
    )

    // milvusData = [{vector: [float], userUUID: string, fileUUID: string}]
    // mongoData = [{fileUUID: string, contents: string, embedding: [float]}]

    await addToMilvus(milvusClient, milvusData)
    await insertData(userUUID, mongoData)
    await disConnectDB()

    return NextResponse.json({body: 'Success'})
  } catch (err) {
    console.log(err)
    await disConnectDB()
    return new NextResponse({
      status: 500,
      body: 'Error',
    })
  }
}

// Post request for querying the database
// POST /api/database
export async function POST(req) {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_TOKEN,
  })
  const openai = new OpenAIApi(configuration)
  const milvusClient = new MilvusClient(uri, secure, user, password, secure)
  // MongoDB Setup
  await connectDB(process.env.MONGODB_URL)
  const Speech = require('./data.js')
  const chunks = []
  for await (const chunk of req.body) {
    chunks.push(chunk)
  }

  // Parsing the body of the request
  const data = JSON.parse(Buffer.concat(chunks).toString())

  // Structure of data = {userUUID: string, query: string, conversation: [{role: string, message: string}]}
  try {
    // Get the user UUID
    const userUUID = data.userUUID

    // Get the embedding of the query
    const queryEmbedding = await embedding(openai, data.query)

    // Query Milvus
    const fileUUID = await queryMilvus(milvusClient, queryEmbedding, userUUID)

    // Get the contents of the file
    const files = await Speech.findOne({_id: userUUID})
    const filesMap = new Map(files.files.entries())
    const fileArray = []
    fileUUID.forEach((id) => {
      if (filesMap.has(id.id)) {
        fileArray.push(filesMap.get(id.id).contents)
      }
    })
    const file = fileArray.join('\n\n')

    // Create the message
    const message = {
      role: 'user',
      content: `Answer the following question:\n${data.query}\nThe following information may be useful, if it isn't useful, don't mention it and answer to the best of your ability\n\n${file}`,
    }

    // Add the message to the conversation
    const updatedConversation = data.conversation
    updatedConversation.push(message)

    // Create the completion
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: updatedConversation,
    })

    const reply = completion.data.choices[0].message.content
    await disConnectDB()
    return NextResponse.json({role: 'assistant', content: reply})
  } catch (err) {
    console.log(err)
    await disConnectDB()
    return new NextResponse({
      status: 500,
      body: 'Error',
    })
  }
}

// Delete request for deleting the database
// PATCH /api/database
export async function PATCH(req) {
  const milvusClient = new MilvusClient(uri, secure, user, password, secure)
  // MongoDB Setup
  await connectDB(process.env.MONGODB_URL)
  const Speech = require('./data.js')
  const chunks = []
  for await (const chunk of req.body) {
    chunks.push(chunk)
  }

  // Parsing the body of the request
  const data = JSON.parse(Buffer.concat(chunks).toString())

  // Structure of data = {userUUID: string}
  try {
    // Get the user UUID
    const userUUID = data.userUUID
    // Find the Speech Database
    const speech = await Speech.findOne({_id: userUUID})
    if (!speech) {
      return new NextResponse({
        status: 404,
        body: 'Not Found',
      })
    }
    const fileUUIDs = []
    if (speech) {
      const files = speech.files
      for (const [key, value] of files.entries()) {
        fileUUIDs.push(value._id)
      }
    }

    // Format the fileUUIDs for the deleteEntities expression
    const expr = `fileUUID in [${fileUUIDs.map((id) => `"${id}"`).join(', ')}]`

    // Delete the record in Milvus
    const ret = await milvusClient.deleteEntities({
      collection_name: 'Speech',
      expr: expr,
    })

    // Delete the repository in MongoDB
    await Speech.findByIdAndDelete(userUUID)
    await disConnectDB()
    return NextResponse.json({body: 'Success'})
  } catch (err) {
    console.log(err)
    await disConnectDB()
    return new NextResponse({
      status: 500,
      body: 'Error',
    })
  }
}
