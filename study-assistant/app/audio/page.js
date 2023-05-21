'use client'
import {useState, useRef, useEffect} from 'react'
import {useAudio} from 'react-use'
let RecordRTC
import {saveAs} from 'file-saver'
import {
  Button,
  Box,
  IconButton,
  Slider,
  Stack,
  Typography,
  Input,
} from '@mui/material'
import {
  PlayCircleOutline,
  PauseCircleOutline,
  Mic,
  MicOff,
  Download,
  CloudUpload,
} from '@mui/icons-material'

function AudioRecorder() {
  const [audioData, setAudioData] = useState(null)
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const [responseBody, setResponseBody] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const recorder = useRef(null)
  const microphone = useRef(null)

  const fileInputRef = useRef()

  const triggerFileSelect = () => {
    fileInputRef.current.click()
  }

  useEffect(() => {
    import('recordrtc').then((r) => {
      RecordRTC = r.default
    })
  }, [])

  const [audio, state, controls] = useAudio({
    src: audioURL,
    autoPlay: false,
  })

  const captureMicrophone = async (callback) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({audio: true})
      callback(stream)
    } catch (error) {
      alert('Unable to access your microphone.')
      console.error(error)
    }
  }

  const stopRecordingCallback = () => {
    const audioBlob = recorder.current.getBlob()
    setAudioData(audioBlob)
    const audioURL = URL.createObjectURL(audioBlob)
    setAudioURL(audioURL)

    recorder.current.microphone.stop()
    setRecording(false)
  }

  const startRecording = async () => {
    await captureMicrophone((stream) => {
      microphone.current = stream

      const options = {
        type: 'audio',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
      }

      recorder.current = RecordRTC(stream, options)
      recorder.current.startRecording()
      recorder.current.microphone = microphone.current

      setRecording(true)
    })
  }

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stopRecording(stopRecordingCallback)
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)

    // Send audio to /api/stt
    try {
      const response = await fetch('/api/stt', {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/wav',
        },
        body: audioData,
      })

      const responseData = await response.json()
      setResponseBody(responseData.body)
    } catch (error) {
      console.error('Error:', error)
    }

    setSubmitting(false)
  }

  const downloadRecording = () => {
    if (audioData) {
      saveAs(audioData, 'recording.wav')
    }
  }

  const handleUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      setAudioData(file)
      const audioURL = URL.createObjectURL(file)
      setAudioURL(audioURL)
    }
  }
  return (
    <Box
      component="img"
      src="background.png"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 2,
        padding: '20px',
        backgroundColor: '#f5f5f5',
      }}
    >
      <Button
        variant="outlined"
        color="primary"
        startIcon={recording ? <MicOff /> : <Mic />}
        onClick={recording ? stopRecording : startRecording}
        sx={{marginBottom: '20px'}}
      >
        {recording ? 'Stop Recording' : 'Start Recording'}
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={triggerFileSelect}
        startIcon={<CloudUpload />}
      >
        Choose file
      </Button>
      <Input
        type="file"
        accept="audio/wav"
        onChange={handleUpload}
        style={{display: 'none'}}
        ref={fileInputRef}
      />
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

          <Button
            variant="contained"
            color="primary"
            startIcon={<CloudUpload />}
            onClick={handleSubmit}
            disabled={!audioData}
          >
            Submit
          </Button>
        </Stack>
      )}

      <Typography variant="caption" color="text.secondary">
        Note: Make sure to give the browser permission to access your
        microphone.
      </Typography>

      {audio}

      {responseBody && (
        <Box>
          <Typography variant="h6">Response Body:</Typography>
          <pre>{JSON.stringify(responseBody, null, 2)}</pre>
        </Box>
      )}
    </Box>
  )
}

export default AudioRecorder
