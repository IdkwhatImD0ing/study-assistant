"use client";
import React, { useState, useCallback } from "react";
import { Button, Container, Box, Typography } from "@mui/material";

export default function Pdf() {
  const [file, setFile] = useState();
  const [extractedText, setExtractedText] = useState("");

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const extractText = async () => {
    if (!file) {
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const arrayBuffer = event.target.result;

        const response = await fetch("/api/upload", {
          method: "POST",
          headers: {
            "Content-Type": "application/pdf",
          },
          body: arrayBuffer,
        });

        if (response.ok) {
          const data = await response.json();
          setExtractedText(data.text);
        } else {
          throw new Error("Failed to extract text");
        }
      };

      reader.readAsArrayBuffer(file);
    } catch (error) {
      console.error(error);
      setExtractedText("Error occurred during text extraction");
    }
  };

  return (
    <Container>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
          marginTop: 5,
          height: "100vh",
        }}
      >
        <input
          type="file"
          onChange={handleFileChange}
          accept="application/pdf"
          style={{ margin: "20px 0" }}
        />
        <Button variant="contained" color="primary" onClick={extractText}>
          Extract Text
        </Button>
        <Typography variant="body1">{extractedText}</Typography>
      </Box>
    </Container>
  );
}
