'use client'

import Navbar from '../Components/NavBar/NavBar'
import Footer from '../Components/Footer/Footer'
import {useState, useEffect, useRef} from 'react'
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import {v4 as uuidv4} from 'uuid'

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
  const [uuid, setUUID] = useState(uuidv4())

  // PDF
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

      const response = await fetch(
        'https://intelliconverse.azurewebsites.net/upload',
        {
          method: 'POST',
          body: formData,
        },
      )

      if (response.ok) {
        const text = await response.text()
        // Split into array of strings of size 4000 characters
        const chunks = []
        for (let i = 0; i < text.length; i += 4000) {
          chunks.push(text.substring(i, i + 4000))
        }
        const temp = {
          userUUID: uuid,
          contents: chunks,
        }
        fetch('https://intelliconverse.azurewebsites.net/database', {
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

      fetch('https://intelliconverse.azurewebsites.net/database', {
        method: 'PATCH',
        body: JSON.stringify({userUUID: uuid}),
        keepalive: true,
      })

      event.returnValue = ''
    }

    window.addEventListener('unload', handleUnload)

    // Cleanup
    return () => {
      window.removeEventListener('unload', handleUnload)
    }
  }, [uuid]) // Empty dependency array means this effect runs once on mount and cleanup on unmount

  useEffect(() => {
    import('recordrtc').then((r) => {
      RecordRTC = r.default
    })

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // Clone of messages without audioURLs
        const temp = []
        for (let i = 0; i < messages.length; i++) {
          temp.push({role: messages[i].role, content: messages[i].content})
        }
        temp.push({role: 'user', content: data.body})

        const userMessage = {
          role: 'user',
          content: data.body,
          audioURL: URL.createObjectURL(audioBlob),
        }
        const assistantPlaceholder = {
          role: 'assistant',
          content: '', // placeholder content if you have any
          audioURL: null,
        }
        setMessages([...messages, userMessage, assistantPlaceholder])

        fetch('https://intelliconverse.azurewebsites.net/database', {
          method: 'POST',
          body: JSON.stringify({
            userUUID: uuid,
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
                  newMessages[newMessages.length - 1] = {
                    // Replace the assistant's placeholder with the real response
                    role: 'assistant',
                    content: data.content,
                    audioURL: newAudioURL,
                  }
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

  // Use loadingPDF state to disable button and display loading symbol
  const ExtractButton = () => (
    <Button
      variant="contained"
      color="primary"
      onClick={extractText}
      disabled={!file || loadingPDF}
      sx={{
        backgroundColor: loadingPDF ? '#9E9E9E' : '#3f51b5', // grey color when loading
      }}
    >
      {loadingPDF ? (
        <CircularProgress size={24} color="secondary" />
      ) : (
        'Extract Text'
      )}
    </Button>
  )

  // Determine if the assistant is thinking by checking if the last message was a user message or an assistant message without an audioURL
  const assistantThinking =
    messages.length > 0 &&
    (messages[messages.length - 1].role === 'user' ||
      (messages[messages.length - 1].role === 'assistant' &&
        !messages[messages.length - 1].audioURL))

  if (!pdfParsed) {
    return (
      <section className="audioPdfChat">
        <Navbar />
        <Container>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              overflow: 'hidden ',
              minHeight: '90vh',
            }}
          >
            <Box
              component="img"
              src="background.png"
              sx={{
                position: 'absolute',
                width: '100vw',
                height: '100vh',
                objectFit: 'cover',
                zIndex: -1,
                top: 0,
                left: 0,
              }}
            />
            <Typography
              variant="h2"
              gutterBottom
              sx={{
                mt: 15,
              }}
            >
              Let&apos;s Index your PDF!
            </Typography>
            <label htmlFor="contained-button-file">
              <Input
                accept="application/pdf"
                id="contained-button-file"
                type="file"
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                component="span"
                sx={{
                  mb: 3,
                }}
              >
                Upload PDF
              </Button>
            </label>
            <ExtractButton />
          </Box>
        </Container>
      </section>
    )
  }

  return (
    <section className="audioPdfChat">
      <Navbar />
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'space-between',
        }}
      >
        <Box
          component="img"
          src="background.png"
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: -1,
            top: 0,
            left: 0,
          }}
        />
        <Box
          sx={{
            padding: 2,
            overflowY: 'auto',
            height: '80vh',
            '&::-webkit-scrollbar': {
              display: 'none',
            },
            scrollbarWidth: 'none',
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
                sx={{
                  backgroundColor:
                    message.role === 'user' ? '#e2f2ff' : '#f7f7f7',
                  borderRadius: 4,
                  padding: 1,
                  maxWidth: '70%',
                  wordBreak: 'break-word',
                  mr: 5,
                }}
              >
                {message.role === 'user' ? 'You: ' : 'Assistant: '}
              </Button>
              {assistantThinking &&
                message.role === 'assistant' &&
                !message.audioURL && <CircularProgress />}
            </Box>
          ))}
          <div ref={endOfMessagesRef} />
        </Box>
        <Box
          component="form"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            borderTop: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255,255,255,0.2)',
          }}
        >
          <Button
            variant="contained"
            onClick={recording ? stopRecording : startRecording}
            sx={{backgroundColor: '#4f8cff', m: 3}}
            disabled={assistantThinking}
          >
            {recording ? <MicOff fontSize="large" /> : <Mic fontSize="large" />}
          </Button>
        </Box>
      </Box>
    </section>
  )
}

export default ChatInterface
