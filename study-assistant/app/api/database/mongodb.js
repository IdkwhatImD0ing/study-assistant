/*
Inserts data into mongodb
Input: User UUID, File UUID, Path, Summary, Original Contents, Embedding
Output: None
What it does: 
Stores data in mongodb in the user UUID with the file UUID as key
*/
const Speech = require('./data')

async function insertData(userUUID, mongoData) {
  // Check if there is any data to process
  if (mongoData.length === 0) {
    return
  }

  // Prepare the updates
  const updates = {}
  for (const data of mongoData) {
    const {fileUUID, contents, embedding} = data

    // Create new file data
    const fileData = {
      _id: fileUUID,
      contents,
      embedding,
    }

    // Add this to the updates
    updates[`files.${fileUUID}`] = fileData
  }

  // Find the repository with the given UUID and update it
  await Speech.findByIdAndUpdate(
    userUUID,
    {$set: updates},
    {new: true, upsert: true},
  )
    .then(() => {
      console.log(`Data inserted for repository UUID: ${userUUID}`)
    })
    .catch((err) => {
      console.error('Error inserting data:', err)
    })
}

module.exports = insertData
