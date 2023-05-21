"use client";

import Navbar from "../Components/NavBar/NavBar";
import Footer from "../Components/Footer/Footer";
import { useState } from "react";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FaceIcon from '@mui/icons-material/Face';
import { Avatar, Grid, Box } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';

const teamMembers = [
  {
    name: 'Bill Zhang',
    role: 'Full Stack',
    avatar: 'bill.jpg',
  },
  {
    name: 'Varun Swaminathan',
    role: 'Backend',
    avatar: 'varun.jpg',
  },
  {
    name: 'Ryan Yu',
    role: 'Frontend',
    avatar: 'ryan.jpg',
  },
  {
    name: 'Sophia Thompson',
    role: 'Full Stack',
    avatar: 'sophia.jpg',
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
          Introducing IntelliConverse, the ultimate tool for empowering individuals with learning
          disabilities and reading difficulties. Harnessing the power of Chat-GPT technology, our
          project provides comprehensive support through both typed and spoken interactions. Say
          goodbye to barriers and hello to effective communication, as IntelliConverse helps you
          overcome challenges and unlock your full potential.
        </Typography>
      </Box>
      <Box my={10} />
      <Typography variant="h5" align="center" alignSelf="center">
        The Team
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
      <Box my={12} />
      <Footer />
    </section>
  );
}
