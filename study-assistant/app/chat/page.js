'use client'

import {useState, useEffect, useRef} from 'react'
import {Box, TextField, Button, Typography} from '@mui/material'
import UUIDProvider from '../UUIDProvider'
import UUIDContext from '../UUIDContext'
import {useContext} from 'react'

function ChatInterface() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const endOfMessagesRef = useRef(null)

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({behavior: 'smooth'})
  }

  useEffect(scrollToBottom, [messages])

  const handleSubmit = (e) => {
    e.preventDefault()
    setInput('')
    messages.push({role: 'user', content: input})
    setMessages(messages)

    // make an post request to api/chat with message as body
    fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({messages: messages}),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setMessages([...messages, {role: 'assistant', content: data.content}])
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        justifyContent: 'space-between',
        overflow: 'hidden',
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
            }}
          >
            <Box
              sx={{
                backgroundColor:
                  message.role === 'user' ? '#e2f2ff' : '#f7f7f7',
                borderRadius: 4,
                padding: 1,
                maxWidth: '70%',
                wordBreak: 'break-word',
              }}
            >
              <Typography variant="body1">
                <strong>
                  {message.role === 'user' ? 'You: ' : 'Assistant: '}
                </strong>
                {message.content}
              </Typography>
            </Box>
          </Box>
        ))}
        <div ref={endOfMessagesRef} />
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          borderTop: 1,
          display: 'flex',
          alignItems: 'center',
          backgroundColor: 'rgba(255,255,255,0.2)',
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{
            margin: 3,
            backgroundColor: '#fff',
          }}
          autoComplete="off"
        />
        <Button
          variant="contained"
          type="submit"
          sx={{backgroundColor: '#4f8cff', mr: 3}}
        >
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default ChatInterface
