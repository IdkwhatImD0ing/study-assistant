/*
Processes input data
Input: array of strings
Output: None
What it does:
Call embedding based on contents
Call add to vector with embedding
*/
const embedding = require('./embedding')

const {v4: uuidv4} = require('uuid')
const processData = async (openai, userUUID, data) => {
  // Create arrays to store data for Milvus and MongoDB
  let milvusData = []
  let mongoData = []

  for (const item in data) {
    // Recursively traverse this subdirectory
    try {
      // Call the embedding function
      const vector = await embedding(openai, data[item])
      // Generate a file UUID
      const fileUUID = uuidv4()
      milvusData.push({vector, userUUID, fileUUID})
      mongoData.push({
        fileUUID,
        contents: data[item],
        embedding: vector,
      })
    } catch (err) {
      console.log(err)
    }
  }
  // Return the data
  return {milvusData, mongoData}
}

module.exports = processData
