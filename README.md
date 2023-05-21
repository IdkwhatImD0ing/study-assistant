# IntelliConverse




## Overview

IntelliConverse is a project using Chat-GPT to assist individuals with learning disabilities (like dyslexia and ADHD) and reading difficulties. Our solution offers comprehensive answers through typed and spoken inputs/outputs, fostering effective communication and empowering users to overcome challenges.

## Table of Contents
- [IntelliConverse](#intelliconverse)
	- [Overview](#overview)
	- [Table of Contents](#table-of-contents)
	- [Backend Development Approach](#backend-development-approach)
	- [Frontend Development Approach](#frontend-development-approach)
	- [How to run](#how-to-run)
	- [Things that challenged us:](#things-that-challenged-us)
	- [Accomplishments](#accomplishments)
	- [What we learned](#what-we-learned)
	- [What’s next](#whats-next)

## Backend Development Approach
 - Custom NextJS server as well as Express Server
 - Routes:
   - Speech to text
   - Text to speech
   - Adding Data to Milvus and MongoDB
   - Querying Milvus and MongoDB
   - Removing Data from Milvus and MongoDB
   - Chat GPT


## Frontend Development Approach
 - NextJS with Material UI
 - Implemented three chat interfaces
   - Regular chat
   - Voice chat
   - Voice chat with PDF
 - Voice chat with pdf allows the assistant to answer your questions with references from the pdf


## How to run

1. Clone the repository
2. Run Frontend
   1. `cd server`
   2. `npm install`
   3. `npm start`
3. Run Backend
   1. `cd server`
   2. `npm install`
   3. `npm start`

For further backend links and environmental variables, please contact us.

## Things that challenged us:
-	Testing Azure Speech to Text Backend Route: We encountered challenges while testing the integration of the Azure Speech to Text backend route. Ensuring the accuracy and reliability of the speech-to-text conversion posed difficulties during the development process.

-	Recording Frontend Audio for Azure Speech to Text: Achieving high-quality audio and format compatibility was difficult but essential for accurate transcription. Overcoming these challenges involved debugging, troubleshooting, and fine-tuning the recording and conversion processes to ensure seamless integration and reliable performance.

## Accomplishments
 - Really happy that we managed to successfully implement both the text to speech and speech to text features
 - Allows us to implement a voice chat functionality as well as a voice chat with pdf functionality

## What we learned
 - We gained insights in audio capture, ensuring compatibility with Azure Speech to Text. Debugging and fine-tuning ensured seamless integration and reliable performance. 
 - We enhanced our skills in audio processing and frontend implementation for audio-based applications.

## What’s next
- Customization and Training: We'll customize the Chat GPT model to meet our project's objectives, emphasizing a safe and supportive environment.
- User Feedback and Iteration: Collecting user feedback to enhance the system and improve user experiences.
- Features: Allow uploading more than one pdf at a time, audio streaming to ensure faster responses
- Bugs: Fix known bugs such as over context limit, and improve the UI/UX
