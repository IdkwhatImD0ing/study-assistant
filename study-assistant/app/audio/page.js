'use client'

import {useState, useRef} from 'react'
import {useAudio} from 'react-use'
import {saveAs} from 'file-saver'

function AudioRecorder() {
  const [audioData, setAudioData] = useState(null)
  const [recording, setRecording] = useState(false)
  const [audioURL, setAudioURL] = useState('')
  const mediaRecorder = useRef(null)

  const [audio, state, controls, ref] = useAudio({
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
    <div>
      <button onClick={recording ? stopRecording : startRecording}>
        {recording ? 'Stop Recording' : 'Start Recording'}
      </button>
      {audioData && (
        <>
          {audio}
          <button onClick={controls.play}>Play</button>
          <button onClick={controls.pause}>Pause</button>
          <button onClick={downloadRecording}>Download</button>
        </>
      )}
    </div>
  )
}

export default AudioRecorder
