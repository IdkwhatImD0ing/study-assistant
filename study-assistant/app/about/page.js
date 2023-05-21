"use client";

import Navbar from "../home/Components/NavBar/NavBar";
import Footer from "../home/Components/Footer/Footer";
import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import FaceIcon from '@mui/icons-material/Face';

const names = ["Bill", "Sophia", "Varuun", "Ryan"];
const desc = ["YESYESYESYESYESYES", "YESYESYESYESYESYESYESYESYES", "YESYESYESYESYESYESYESYESYES", "YESYESYESYESYESYESYESYESYES"];

export default function AboutPage() {
  const [descIndex, setDescIndex] = useState(0);

  return (
    <section className="about">
      <Navbar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          height: "100vh",
          wrap: "nowrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: "30%",
            height: "100%",
            backgroundColor: "beige",
            gap: "2em",
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: "black",
              textAlign: "center",
              mt: "1em",
              fontWeight: "bold",
            }}
          >
            Makers
          </Typography>
          {names.map((name, index) => (
            <IconButton
              onClick={() => setDescIndex(index)}
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <FaceIcon sx={{ color: "blue", fontSize: "5em" }} />
              <Typography variant="h5" sx={{ color: "black" }}>
                {name}
              </Typography>
            </IconButton>
          ))}
        </Box>
        <Box
          sx={{
            width: "70%",
            height: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            outline: "3px solid #636363",
          }}
        >
          <Box
            sx={{
              display: "flex",
              height: "100%",
              flexDirection: "column",
              alignItems: "center",
              justifyItems: "center",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "black",
                textAlign: "center",
                mt: ".5em",
                fontWeight: "bold",
              }}
            >
              Contribution
            </Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "column", 
                height: "100%",
                justifyContent: "center",

            }}>
              <Typography variant="h4" sx={{ color: "black", width: "50%", height: "50%", }}>
                {desc[descIndex]}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
      <Footer />
    </section>
  );
}
