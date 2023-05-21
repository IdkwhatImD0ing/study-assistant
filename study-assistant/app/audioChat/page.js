'use client'

import {useState, useEffect, useRef} from 'react'
import {Box, TextField, Button, Typography} from '@mui/material'
import {saveAs} from 'file-saver'
let RecordRTC
import {
  Mic,
  MicOff,
  PlayCircleOutline,
  PauseCircleOutline,
} from '@mui/icons-material'

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [recording, setRecording] = useState(false)
  const recorder = useRef(null)
  const microphone = useRef(null)
  const endOfMessagesRef = useRef(null)

  useEffect(() => {
    import('recordrtc').then((r) => {
      RecordRTC = r.default
    })

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [recording]) // add recording as dependency

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

    // Send audio to /api/stt
    fetch('/api/stt', {
      method: 'POST',
      headers: {
        'Content-Type': 'audio/wav',
      },
      body: audioBlob,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data.body)
        // Make a local copy of messages but only role and content
        const temp = []
        for (let i = 0; i < messages.length; i++) {
          temp.push({role: messages[i].role, content: messages[i].content})
        }
        // Add user message to messages
        temp.push({role: 'user', content: data.body})
        setMessages([
          ...messages,
          {
            role: 'user',
            content: data.body,
            audioURL: URL.createObjectURL(audioBlob),
          },
        ])
        // Send text to /api/chat
        fetch('/api/chat', {
          method: 'POST',
          body: JSON.stringify({messages: temp}),
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((data) => {
            // Send text to /api/tts
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
                  // Add assistant message.
                  newMessages.push({
                    role: 'assistant',
                    content: data.content,
                    audioURL: newAudioURL,
                  })
                  return newMessages
                })
                // Auto-play assistant's speech response
                const audio = new Audio(newAudioURL)
                audio.play()
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
      // prevent starting another recording
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

  useEffect(scrollToBottom, [messages])

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
            {message.audioURL && (
              <Button
                onClick={() => {
                  new Audio(message.audioURL).play()
                }}
              >
                {message.role === 'user' ? 'You: ' : 'Assistant: '}
              </Button>
            )}
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
          alignItems: 'center',
        }}
      >
        <Button
          variant="contained"
          onClick={recording ? stopRecording : startRecording}
          sx={{marginRight: 2}}
        >
          {recording ? <MicOff /> : <Mic />}
        </Button>
      </Box>
    </Box>
  )
}

export default ChatInterface
