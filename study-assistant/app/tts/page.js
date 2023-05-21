'use client';

import React, { useState } from 'react';
import { TextField, Button } from '@mui/material';

export default function MyForm() {
  const [inputValue, setInputValue] = useState('');
  const [audioData, setAudioData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform submit logic here
    console.log('Submitted:', inputValue);
    await fetchAudio(inputValue);
  };

  const fetchAudio = async (input) => {
    try {
      const response = await fetch('/api/tts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text: input })
      });
      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioData(audioUrl);
      } else {
        console.error('Error fetching audio');
      }
    } catch (error) {
      console.error('Error fetching audio:', error);
    }
  };

  const handlePlay = () => {
    const audioElement = document.getElementById('audio-player');
    audioElement.play();
  };

  const handlePause = () => {
    const audioElement = document.getElementById('audio-player');
    audioElement.pause();
  };

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Input"
          value={inputValue}
          onChange={handleChange}
          variant="outlined"
          margin="normal"
        />
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
      </form>
      <audio id="audio-player" src={audioData} controls />
      <Button variant="contained" color="primary" onClick={handlePlay}>
        Play
      </Button>
      <Button variant="contained" color="primary" onClick={handlePause}>
        Pause
      </Button>
    </>
  );
};


