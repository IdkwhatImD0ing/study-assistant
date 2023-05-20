'use client'

import {useState, useEffect, useRef} from 'react'
import {Box, TextField, Button, Typography, Stack} from '@mui/material'

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

    setMessages([
      ...messages,
      {user: 'user', text: input},
      {user: 'bot', text: input},
    ])
    setInput('')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        justifyContent: 'space-between',
      }}
    >
      <Box
        sx={{
          overflowY: 'scroll',
          padding: 2,
        }}
      >
        {messages.map((message, index) => (
          <Box
            key={index}
            sx={{
              textAlign: message.user === 'user' ? 'right' : 'left',
            }}
          >
            <Typography variant="body1">
              <strong>{message.user === 'user' ? 'You: ' : 'Bot: '}</strong>
              {message.text}
            </Typography>
          </Box>
        ))}
        <div ref={endOfMessagesRef} />
      </Box>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          padding: 2,
          borderTop: 1,
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <TextField
          variant="outlined"
          fullWidth
          value={input}
          onChange={(e) => setInput(e.target.value)}
          sx={{marginRight: 2}}
        />
        <Button variant="contained" type="submit">
          Send
        </Button>
      </Box>
    </Box>
  )
}

export default ChatInterface
