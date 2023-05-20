'use client'

import {useState, useRef} from 'react'
import {useAudio} from 'react-use'
import {saveAs} from 'file-saver'
import {Button, Box, IconButton, Slider, Stack, Typography} from '@mui/material'
import {
  PlayCircleOutline,
  PauseCircleOutline,
  Mic,
  MicOff,
  Download,
} from '@mui/icons-material'

function AudioRecorder() {
  const [audioData, setAudioData] = useState(null)
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const mediaRecorder = useRef(null)

  const [audio, state, controls] = useAudio({
    src: audioURL,
    autoPlay: false,
  })

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({audio: true})
    mediaRecorder.current = new MediaRecorder(stream)
    mediaRecorder.current.start()

    setRecording(true)

    const audioChunks = []
    mediaRecorder.current.addEventListener('dataavailable', (event) => {
      audioChunks.push(event.data)
    })

    mediaRecorder.current.addEventListener('stop', () => {
      const audioBlob = new Blob(audioChunks, {type: 'audio/wav'})
      setAudioData(audioBlob)
      const audioURL = URL.createObjectURL(audioBlob)
      setAudioURL(audioURL)
    })
  }

  const stopRecording = () => {
    if (mediaRecorder.current) {
      mediaRecorder.current.stop()
      setRecording(false)
    }
  }

  const downloadRecording = () => {
    if (audioData) {
      saveAs(audioData, 'recording.wav')
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
      }}
    >
      <Button
        variant="outlined"
        startIcon={recording ? <MicOff /> : <Mic />}
        onClick={recording ? stopRecording : startRecording}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </Button>

      {audioData && (
        <Stack direction="row" spacing={2} alignItems="center">
          <IconButton onClick={state.paused ? controls.play : controls.pause}>
            {state.paused ? <PlayCircleOutline /> : <PauseCircleOutline />}
          </IconButton>

          <Slider
            value={state.volume}
            min={0}
            max={1}
            step={0.01}
            onChange={(event, newValue) => controls.volume(newValue)}
            aria-label="Volume"
            valueLabelDisplay="auto"
            sx={{
              width: '200px',
            }}
          />

          <IconButton onClick={downloadRecording}>
            <Download />
          </IconButton>
        </Stack>
      )}

      <Typography variant="caption" color="text.secondary">
        Note: Make sure to give the browser permission to access your
        microphone.
      </Typography>

      {audio}
    </Box>
  )
}

export default AudioRecorder
