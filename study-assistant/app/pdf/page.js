'use client'
import React, { useState } from 'react'
import {
  Button,
  Container,
  Box,
  Typography,
  TextField,
  CircularProgress,
} from '@mui/material'
import { styled } from '@mui/system'
import UUIDProvider from '../UUIDProvider'
import UUIDContext from '../UUIDContext'
import { useContext } from 'react';

const Input = styled('input')({
  display: 'none',
})

export default function Pdf() {
  const [file, setFile] = useState()
  const [extractedText, setExtractedText] = useState([])
  const [loading, setLoading] = useState(false)

  const handleFileChange = (event) => {
    setFile(event.target.files[0])
  }

  const extractText = async () => {
    setLoading(true)
    setExtractedText('')
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
        setExtractedText(text)
      } else {
        throw new Error('Failed to extract text')
      }
    } catch (error) {
      console.error(error)
      setExtractedText('Error occurred during text extraction')
    } finally {
      setLoading(false)
    }
  }

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
        {extractedText && (
          <Typography
            variant="body1"
            sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 2 }}
          >
            {extractedText}
          </Typography>
        )}
      </Box>
      <UUIDProvider>
        <MyComponent />
      </UUIDProvider>
    </Container>
  )
}

const MyComponent = () => {
  const uuid = useContext(UUIDContext);

  return (
    <div>
      Unique Value: {uuid}
    </div>
  );
};
