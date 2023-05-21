# IntelliConverse

## Overview

IntelliConverse is a project using Chat-GPT to assist individuals with learning disabilities (like dyslexia and ADHD) and reading difficulties. Our solution offers comprehensive answers through typed and spoken inputs/outputs, fostering effective communication and empowering users to overcome challenges.

## Table of Contents

- [IntelliConverse](#intelliconverse)
	- [Overview](#overview)
	- [Table of Contents](#table-of-contents)
	- [Backend Development Approach](#backend-development-approach)
	- [Frontend Development Approach](#frontend-development-approach)
	- [Challenges](#challenges)
	- [Accomplishments](#accomplishments)
	- [What We Learned](#what-we-learned)
	- [What's Next](#whats-next)
	- [How to run](#how-to-run)

### Backend Development Approach
The backend is developed using an API route with OpenAPI and Chat-GPT for conversational capabilities. We integrated text-to-speech (TTS) and speech-to-text (STT) features with React, Next.js, and Microsoft Cloud services, and used MongoDB for data storage.

### Frontend Development Approach
We employed websockets for real-time communication on the frontend and used Material UI to create a user-friendly interface.

## Challenges
We faced challenges while testing the Azure Speech to Text backend route and ensuring the reliability of the speech-to-text conversion. Capturing and recording audio on the frontend that met Azure Speech to Text specifications was another major challenge we tackled.

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
Our achievements include impressive developments in text-to-speech and speech-to-text capabilities, alongside overcoming challenging debugging tasks. These efforts resulted in a highly satisfactory and capable system, enabling seamless conversion between spoken and written communication for an inclusive and accessible user experience.

## What we learned
We gained insights in audio capture, ensuring compatibility with Azure Speech to Text. Debugging and fine-tuning ensured seamless integration and reliable performance. We enhanced our skills in audio processing and frontend implementation for audio-based applications.

## What’s next
- Customization and Training: We'll customize the Chat GPT model to meet our project's objectives, emphasizing a safe and supportive environment.
- Safety Measures: Robust safety measures will be implemented, including human moderation, filters, and AI techniques to handle sensitive content.
- User Feedback and Iteration: Collecting user feedback to enhance the system and improve user experiences.
- Expansion and Outreach: Exploring opportunities to reach a wider audience through partnerships and outreach efforts.
