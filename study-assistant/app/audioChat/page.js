"use client";

import { useState, useEffect, useRef } from "react";
import { Box, Button, CircularProgress } from "@mui/material";
import Navbar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";
import { saveAs } from "file-saver";
let RecordRTC;
import { Mic, MicOff } from "@mui/icons-material";

function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const recorder = useRef(null);
  const microphone = useRef(null);
  const endOfMessagesRef = useRef(null);

  useEffect(() => {
    import("recordrtc").then((r) => {
      RecordRTC = r.default;
    });

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [recording]);

  const handleKeyDown = (event) => {
    if (event.code === "Space") {
      if (recording) {
        stopRecording();
      } else {
        startRecording();
      }
    }
  };

  const captureMicrophone = async (callback) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      callback(stream);
    } catch (error) {
      alert("Unable to access your microphone.");
      console.error(error);
    }
  };

  const stopRecordingCallback = () => {
    const audioBlob = recorder.current.getBlob();
    setRecording(false);
    setLoading(true);

    fetch("/api/stt", {
      method: "POST",
      headers: {
        "Content-Type": "audio/wav",
      },
      body: audioBlob,
    })
      .then((response) => response.json())
      .then((data) => {
        const temp = [];
        for (let i = 0; i < messages.length; i++) {
          temp.push({ role: messages[i].role, content: messages[i].content });
        }
        temp.push({ role: "user", content: data.body });
        setMessages([
          ...messages,
          {
            role: "user",
            content: data.body,
            audioURL: URL.createObjectURL(audioBlob),
          },
        ]);

        fetch("/api/chat", {
          method: "POST",
          body: JSON.stringify({ messages: temp }),
          headers: {
            "Content-Type": "application/json",
          },
        })
          .then((response) => response.json())
          .then((data) => {
            fetch("/api/tts", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ text: data.content }),
            })
              .then((response) => response.blob())
              .then((audioBlob) => {
                const newAudioURL = URL.createObjectURL(audioBlob);
                setMessages((prevMessages) => {
                  const newMessages = [...prevMessages];
                  newMessages.push({
                    role: "assistant",
                    content: data.content,
                    audioURL: newAudioURL,
                  });
                  return newMessages;
                });
                const audio = new Audio(newAudioURL);
                audio.play();
                setLoading(false);
              });
          });
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    recorder.current.microphone.stop();
  };

  const startRecording = async () => {
    if (!recording) {
      await captureMicrophone((stream) => {
        microphone.current = stream;

        const options = {
          type: "audio",
          recorderType: RecordRTC.StereoAudioRecorder,
          desiredSampRate: 16000,
          numberOfAudioChannels: 1,
        };

        recorder.current = RecordRTC(stream, options);
        recorder.current.startRecording();
        recorder.current.microphone = microphone.current;

        setRecording(true);
      });
    }
  };

  const stopRecording = () => {
    if (recorder.current) {
      recorder.current.stopRecording(stopRecordingCallback);
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  return (
    <section className="audioChat">
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Box
          sx={{
            padding: 2,
            overflowY: "auto",
            height: "80vh",
          }}
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                justifyContent:
                  message.role === "user" ? "flex-end" : "flex-start",
                marginBottom: 1,
              }}
            >
              <Button
                onClick={() => {
                  new Audio(message.audioURL).play();
                }}
              >
                {message.role === "user" ? "You: " : "Assistant: "}
              </Button>
              {loading && message.role === "assistant" && <CircularProgress />}
            </Box>
          ))}
          <div ref={endOfMessagesRef} />
        </Box>
        <Box
          sx={{
            padding: 2,
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Button
            variant="contained"
            onClick={recording ? stopRecording : startRecording}
            sx={{ marginRight: 2, padding: 2 }}
          >
            {recording ? <MicOff fontSize="large" /> : <Mic fontSize="large" />}
          </Button>
        </Box>
      </Box>
      <Footer />
    </section>
  );
}

export default ChatInterface;
