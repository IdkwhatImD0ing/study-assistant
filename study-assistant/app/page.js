'use client'

import Navbar from './Components/NavBar/NavBar'
import Footer from './Components/Footer/Footer'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Image from 'next/image'
import Button from '@mui/material/Button'
import HomepageImg from './home/Assets/homepage.png'

export default function Homepage() {
  return (
    <section className="homepage">
      <Navbar />
      <Box
        sx={{
          width: '100%',
          positive: 'relative',
          backgroundColor: 'black',
          overflow: 'hidden',
        }}
      >
        <Box
          component="img"
          src="homepage.png"
          alt="homepage"
          sx={{
            top: 0,
            left: 0,
            position: 'absolute',
            height: '100vh',
            width: '100%',
            objectFit: 'cover',
            filter: 'brightness(0.5)',
          }}
        />
        <Typography
          variant="h1"
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
          }}
        >
          IntelliConverse
        </Typography>
        <Typography
          variant="h5"
          sx={{
            position: 'absolute',
            top: '60%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
          }}
        >
          An AI study pal for students, by students.
        </Typography>
        <Button
          variant="contained"
          size="large"
          href="/chat"
          sx={{
            position: 'absolute',
            top: '70%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontColor: 'white',
            }}
          >
            Get Started
          </Typography>
        </Button>
      </Box>
    </section>
  )
}
