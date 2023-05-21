"use client";

import { React, useState, useMemo } from "react";
import Navbar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import HomepageImg from "./Assets/homepage.png";
import Image from "next/image";

export default function Homepage() {
  return (
    <section className="homepage">
      <Navbar />
      <Box
        sx={{
          width: "100%",
        }}
      >
        <Image
          src={HomepageImg}
          alt="homepage"
          width={1920}
          height={1080}
          style={{ objectFit: "cover", transition: "0.6s", filter: "brightness(50%)" }}
        />
      </Box>
      <Footer />
    </section>
  );
}
