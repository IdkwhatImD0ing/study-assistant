const mongoose = require('mongoose')
const {v4: uuidv4} = require('uuid')

// SCHEMA FOR files
const FileDataSchema = new mongoose.Schema({
  _id: {type: String, default: uuidv4},
  contents: {
    type: String,
    required: true,
  },
  embedding: {
    type: [Number],
    required: true,
  },
})

// Repsitory Schema
// Define the Repository schema
const RepositorySchema = new mongoose.Schema({
  _id: {type: String, default: uuidv4},
  files: {
    type: Map,
    of: FileDataSchema,
  },
})
let Speech = mongoose.model('Speeches', RepositorySchema)

module.exports = Speech
