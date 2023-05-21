"use client";

import Navbar from "../home/Components/NavBar/NavBar";
import Footer from "../home/Components/Footer/Footer";

import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { textAlign, width } from "@mui/system";

export default function AboutPage() {
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
            width: "30%",
            height: "100%",
            backgroundColor: "beige",
          }}
        >
          <Typography variant="h3" sx={{ color: "black", textAlign: "center", mt: "1em", textDecoration: "underline" }}>
            About
          </Typography>
        </Box>
        <Box
          sx={{
            width: "70%",
            height: "100%",
            backgroundColor: "#636363",
          }}
        >
          <Typography variant="h3" sx={{ color: "black", textAlign: "center", mt: "1em", textDecoration: "underline" }}>
            About text
          </Typography>
        </Box>
      </Box>
      <Footer />
    </section>
  );
}
