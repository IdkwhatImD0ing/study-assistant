const express = require('express');
const { TextToSpeechClient } = require('azure-tts');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// azure tts client
const client = new TextToSpeechClient({
  subscriptionKey: 'subscription-key-sub',
  region: 'region-sub'
});

// routing text-to-speech
router.post('/', async (req, res) => {
  const { text } = req.body;

  try {
    // gen audio from text using azure
    const audioData = await client.synthesize(text);

    // save the audio file to a folder
    const fileName = `${Date.now()}.wav`;
    const filePath = path.join(__dirname, 'audio', fileName);

    fs.writeFileSync(filePath, audioData);

    res.status(200).send('Audio file saved successfully');
  } catch (error) {
    console.error('Error in text-to-speech:', error);
    res.status(500).send('Error in text-to-speech');
  }
});

module.exports = router;
