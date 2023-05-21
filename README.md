# IntelliConverse

## Overview

IntelliConverse is a project developed to assist individuals with learning disabilities like dyslexia and ADHD, and those who struggle with reading due to various situational factors. Leveraging the power of the Chat-GPT language model, IntelliConverse provides comprehensive and accessible answers to user queries. With support for typed and spoken inputs and outputs, our solution fosters effective communication and empowers individuals to overcome their unique challenges.

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
- [What is IntelliConverse?](#what-is-intelliconverse)
	- [How we built it:](#how-we-built-it)
		- [Backend Development Approach:](#backend-development-approach-1)
		- [Frontend Development Approach:](#frontend-development-approach-1)
	- [Things that challenged us:](#things-that-challenged-us)
	- [Accomplishments](#accomplishments-1)
	- [What we learned](#what-we-learned-1)
	- [What’s next](#whats-next-1)

## Backend Development Approach
The backend is developed using an API route with OpenAPI and Chat-GPT for conversational capabilities. We integrated text-to-speech (TTS) and speech-to-text (STT) features with React, Next.js, and Microsoft Cloud services, and used MongoDB for data storage.

## Frontend Development Approach
We employed websockets for real-time communication on the frontend and used Material UI to create a user-friendly interface.

## Challenges
We faced challenges while testing the Azure Speech to Text backend route and ensuring the reliability of the speech-to-text conversion. Capturing and recording audio on the frontend that met Azure Speech to Text specifications was another major challenge we tackled.

## Accomplishments
	Cont…

## What We Learned
	Cont…

## What's Next
	Cont…

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


# What is IntelliConverse?
Our project aims to address the challenges faced by individuals with learning disabilities, such as dyslexia and ADHD, as well as those who struggle with reading due to various situational factors. These individuals often find it difficult to comprehend written text, hindering their ability to access information and communicate effectively.

To overcome these challenges, we have developed a program that leverages Chat-GPT, a powerful language model, to provide comprehensive and accessible answers to questions. The program accommodates both typed and spoken inputs, allowing users to interact with the system in a way that suits their preferences and abilities.
Targeting the main group of people with learning disabilities, our solution enables them to receive text and speech outputs that effectively address their queries and provide the information they need. Additionally, we recognize the potential of our program to support individuals with mental health concerns. By offering a platform for expressing emotions, whether through typed or spoken input, our solution aims to provide a supportive and inclusive environment for individuals dealing with mental health challenges.
Overall, our program seeks to enhance accessibility, promote effective communication, and empower individuals with learning disabilities and mental health issues to overcome their unique challenges.

## How we built it:
### Backend Development Approach:
We built the backend using an API route with OpenAPI and integrated Chat-GPT for conversational agent capabilities. To enable text-to-speech (TTS) and speech-to-text (STT), we utilized React, Next.js, and Microsoft Cloud services. MongoDB was used for efficient data storage.
### Frontend Development Approach:
For the frontend, we implemented websockets for real-time communication and utilized Material UI to create an appealing and user-friendly interface.

## Things that challenged us:
-	Testing Azure Speech to Text Backend Route: We encountered challenges while testing the integration of the Azure Speech to Text backend route. Ensuring the accuracy and reliability of the speech-to-text conversion posed difficulties during the development process.

-	Recording Frontend Audio for Azure Speech to Text: Capturing and recording audio in the frontend that met the specific requirements and specifications of Azure Speech to Text was a significant challenge. Achieving optimal audio quality and format compatibility was crucial for accurate transcription.
Overcoming these challenges required careful debugging, troubleshooting, and fine-tuning of the audio recording and speech-to-text conversion processes to ensure seamless integration and reliable performance.

## Accomplishments
	Cont…
## What we learned
	Cont…
## What’s next
	Cont…
