const mongoose = require('mongoose')

const connectDB = async (url) => {
  mongoose.set('strictQuery', true)

  try {
    await mongoose.connect(url)
    console.log('Connected to MongoDB')
  } catch (err) {
    console.log(err)
  }
}

module.exports = connectDB
