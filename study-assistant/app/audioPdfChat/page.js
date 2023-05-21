'use client'

import {useState, useEffect, useRef} from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import {saveAs} from 'file-saver'
let RecordRTC
import {Mic, MicOff} from '@mui/icons-material'
import {styled} from '@mui/system'

const Input = styled('input')({
  display: 'none',
})

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [recording, setRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const recorder = useRef(null)
  const microphone = useRef(null)
  const endOfMessagesRef = useRef(null)

  // PDF
  const uuid = useRef(null)
  const [pdfParsed, setPdfParsed] = useState(false)
  const [file, setFile] = useState()
  const [loadingPDF, setLoadingPDF] = useState(false)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const extractText = async () => {
    setLoadingPDF(true)
    if (!file) {
      return
    }

    try {
      const formData = new FormData()
      formData.append('pdf', file)

      const response = await fetch('http://localhost:3001/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const text = await response.text()
        // Split into array of strings of size 4000 characters
        const chunks = []
        for (let i = 0; i < text.length; i += 4000) {
          chunks.push(text.substring(i, i + 4000))
        }
        const temp = {
          userUUID: 'temp',
          contents: chunks,
        }
        fetch('/api/database', {
          method: 'PUT',
          body: JSON.stringify(temp),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.body === 'Success') {
              setPdfParsed(true)
              setLoadingPDF(false)
            }
          })
      } else {
        throw new Error('Failed to extract text')
      }
    } catch (error) {
      console.error(error)
    }
  }
  //END PDF

  //Delete Database on refresh or exit
  useEffect(() => {
    const handleUnload = async (event) => {
      event.preventDefault()

      fetch('/api/database', {
        method: 'PATCH',
        body: JSON.stringify({userUUID: 'temp'}),
        keepalive: true,
      })

      event.returnValue = ''
    }

    window.addEventListener('unload', handleUnload)

    // Cleanup
    return () => {
      window.removeEventListener('unload', handleUnload)
    }
  }, []) // Empty dependency array means this effect runs once on mount and cleanup on unmount

  useEffect(() => {
    import('recordrtc').then((r) => {
      RecordRTC = r.default
    })

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [recording])

  const handleKeyDown = (event) => {
    if (event.code === 'Space') {
      if (recording) {
        stopRecording()
      } else {
        startRecording()
      }
    }
  }

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
    setRecording(false)
    setLoading(true)

    fetch('/api/stt', {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/wav',
      },
      body: audioBlob,
    })
      .then((response) => response.json())
      .then((data) => {
        const temp = []
        for (let i = 0; i < messages.length; i++) {
          temp.push({role: messages[i].role, content: messages[i].content})
        }

        setMessages([
          ...messages,
          {
            role: 'user',
            content: data.body,
            audioURL: URL.createObjectURL(audioBlob),
          },
        ])

        fetch('/api/database', {
          method: 'POST',
          body: JSON.stringify({
            userUUID: 'temp',
            query: data.body,
            conversation: temp,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            fetch('/api/tts', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({text: data.content}),
            })
              .then((response) => response.blob())
              .then((audioBlob) => {
                const newAudioURL = URL.createObjectURL(audioBlob)
                setMessages((prevMessages) => {
                  const newMessages = [...prevMessages]
                  newMessages.push({
                    role: 'assistant',
                    content: data.content,
                    audioURL: newAudioURL,
                  })
                  return newMessages
                })
                const audio = new Audio(newAudioURL)
                audio.play()
                setLoading(false)
              })
          })
      })
      .catch((error) => {
        console.error('Error:', error)
      })

    recorder.current.microphone.stop()
  }

  const startRecording = async () => {
    if (!recording) {
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
  }

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stopRecording(stopRecordingCallback)
    }
  }

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom
    }
  }, [messages])

  if (!pdfParsed) {
    return (
      <Container>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            marginTop: 5,
            overflow: 'auto',
            minHeight: '100vh',
          }}
        >
          <Typography variant="h2" gutterBottom>
            PDF Text Extractor
          </Typography>
          <label htmlFor="contained-button-file">
            <Input
              accept="application/pdf"
              id="contained-button-file"
              type="file"
              onChange={handleFileChange}
            />
            <Button variant="outlined" component="span">
              Upload PDF
            </Button>
          </label>
          <Button
            variant="contained"
            color="primary"
            onClick={extractText}
            disabled={!file || loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Extract Text'}
          </Button>
        </Box>
      </Container>
    )
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          padding: 2,
          overflowY: 'auto',
          height: '80vh',
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              justifyContent:
                message.role === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 1,
            }}
          >
            <Button
              onClick={() => {
                new Audio(message.audioURL).play()
              }}
            >
              {message.role === 'user' ? 'You: ' : 'Assistant: '}
            </Button>
            {loading && message.role === 'assistant' && <CircularProgress />}
          </Box>
        ))}
        <div ref={endOfMessagesRef} />
      </Box>
      <Box
        sx={{
          padding: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Button
          variant="contained"
          onClick={recording ? stopRecording : startRecording}
          sx={{marginRight: 2, padding: 2}}
        >
          {recording ? <MicOff fontSize="large" /> : <Mic fontSize="large" />}
        </Button>
      </Box>
    </Box>
  )
}

export default ChatInterface
