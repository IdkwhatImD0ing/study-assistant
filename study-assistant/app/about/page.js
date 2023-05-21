"use client";

import Navbar from "../home/Components/NavBar/NavBar";
import Footer from "../home/Components/Footer/Footer";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FaceIcon from '@mui/icons-material/Face';
import { Avatar, Grid, Box } from '@mui/material';

const teamMembers = [
  {
    name: 'John Doe',
    role: 'CEO',
    avatar: 'https://example.com/avatar1.png',
  },
  {
    name: 'Jane Smith',
    role: 'CTO',
    avatar: 'https://example.com/avatar2.png',
  },
  {
    name: 'John Doe',
    role: 'CEO',
    avatar: 'https://example.com/avatar1.png',
  },
  {
    name: 'Jane Smith',
    role: 'CTO',
    avatar: 'https://example.com/avatar2.png',
  },
];

export default function AboutPage() {
  return (
    <section className="about" >
      <Navbar />
      <Box my={4} />
      <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
        <Typography variant="h4" align="center" gutterBottom>
          About
        </Typography>
        <Typography variant="body1" maxWidth="sm" style={{ textAlign: 'center' }}>
          body1. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quos
          blanditiis tenetur unde suscipit, quam beatae rerum inventore consectetur,
          neque doloribus, cupiditate numquam dignissimos laborum fugiat deleniti? Eum
          quasi quidem quibusdam.
        </Typography>
      </Box>
      <Box my={10} />
      <Typography variant="h5" align="center">
        The team
      </Typography>
      <Box my={4} />
      <Grid container spacing={8} justifyContent="center">
        {teamMembers.map((member, index) => (
          <Grid item key={index} alignItems="center" justifyContent="center" direction="column">
            <Box display="flex" flexDirection="column" alignItems="center">
              <Avatar alt={member.name} src={member.avatar} sx={{ width: 96, height: 96, mb: 1 }} />
              <Typography variant="subtitle1" style={{ textAlign: 'center' }}>
                {member.name}
              </Typography>
              <Typography variant="caption" style={{ textAlign: 'center' }}>
                {member.role}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Box my={8} />
      <Footer />
    </section>
  );
}
