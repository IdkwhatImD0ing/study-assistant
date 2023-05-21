var express = require('express')
var router = express.Router()
var cors = require('cors')
var dotenv = require('dotenv')
dotenv.config()

const multer = require('multer')
const pdfParse = require('pdf-parse')
const upload = multer({storage: multer.memoryStorage()})
const {connectDB} = require('./connect.js')
const processData = require('./process.js')
const {addToMilvus, queryMilvus} = require('./milvus.js')
const insertData = require('./mongodb.js')
const embedding = require('./embedding.js')

// MongoDB Setup
connectDB(process.env.MONGODB_URL)
const Speech = require('./data.js')

// Middleware
router.use(express.json())
router.use(cors())

// Milvus Database Setup
const {MilvusClient} = require('@zilliz/milvus2-sdk-node')
const config = require('./config.js')
const {uri, user, password, secure} = config
const milvusClient = new MilvusClient(uri, secure, user, password, secure)

// OpenAI API
const {Configuration, OpenAIApi} = require('openai')
const configuration = new Configuration({
  apiKey: process.env.OPENAI_TOKEN,
})
const openai = new OpenAIApi(configuration)

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', {title: 'Express'})
})

router.post('/upload', upload.single('pdf'), async (req, res) => {
  //PDF to text
  if (!req.file) {
    console.error('No file received')
    return res.status(400).send('No file received')
  }
  try {
    const pdfBuffer = req.file.buffer
    const pdfData = await pdfParse(pdfBuffer)
    res.send(pdfData.text)
  } catch (error) {
    res.status(500).send('Error processing PDF')
  }
})

router.put('/database', async (req, res) => {
  // Parsing the body of the request
  const data = req.body

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

    await addToMilvus(milvusClient, milvusData)
    await insertData(userUUID, mongoData)

    return res.json({body: 'Success'})
  } catch (err) {
    console.log(err)
    return res.status(500).send('Error')
  }
})

router.post('/database', async (req, res) => {
  // Parsing the body of the request
  const data = req.body

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
    return res.json({role: 'assistant', content: reply})
  } catch (err) {
    console.log(err)
    return res.status(500).send('Error')
  }
})

router.patch('/database', async (req, res) => {
  // Parsing the body of the request
  const data = req.body

  // Structure of data = {userUUID: string}
  try {
    // Get the user UUID
    const userUUID = data.userUUID
    const speech = await Speech.findOne({_id: userUUID})

    if (!speech) {
      return res.status(404).send('Not Found User ID')
    }
    const fileUUIDs = []
    if (speech) {
      const files = speech.files
      for (const [key, value] of files.entries()) {
        fileUUIDs.push(value._id)
      }
    }

    const expr = `fileUUID in [${fileUUIDs.map((id) => `"${id}"`).join(', ')}]`

    const ret = await milvusClient.deleteEntities({
      collection_name: 'Speech',
      expr: expr,
    })

    await Speech.findByIdAndDelete(userUUID)
    return res.json({body: 'Success'})
  } catch (err) {
    console.log(err)
    return res.status(500).send('Error')
  }
})

module.exports = router
