'use client'
import {Container, Typography, TextField, Button, Grid} from '@mui/material'

export default function SignIn() {
  return (
    <Container maxWidth="sm" sx={{mt: 4}}>
      <Grid container justifyContent="center">
        <Grid item xs={12} sx={{mb: 2}}>
          <Typography variant="h4" align="center" sx={{color: '#333'}}>
            Welcome to
            <br />
            Study Assistant
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{mb: 2}}>
          <Typography variant="body1" align="center" sx={{color: '#666'}}>
            Please enter your username and password
          </Typography>
        </Grid>
        <Grid item xs={12} sx={{mb: 2}}>
          <TextField id="username" label="Username" fullWidth required />
        </Grid>
        <Grid item xs={12} sx={{mb: 2}}>
          <TextField
            id="password"
            label="Password"
            type="password"
            fullWidth
            required
          />
        </Grid>
        <Grid item xs={12} sx={{mb: 2}}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{
              transition: 'background-color 0.3s',
              '&:hover': {backgroundColor: '#45a049'},
            }}
          >
            Sign In
          </Button>
        </Grid>
      </Grid>
    </Container>
  )
}
