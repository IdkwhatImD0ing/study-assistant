var express = require('express')
var router = express.Router()
var cors = require('cors')
router.use(cors())
const multer = require('multer')
const pdfParse = require('pdf-parse')
const upload = multer({storage: multer.memoryStorage()})

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

module.exports = router
