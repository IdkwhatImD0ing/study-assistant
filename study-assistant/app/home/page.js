"use client";
import Navbar from "./Components/NavBar/NavBar";
import Footer from "./Components/Footer/Footer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Image from "next/image";
import Button from "@mui/material/Button";
import HomepageImg from "./Assets/homepage.png";

export default function Homepage() {
  return (
    <section className="homepage">
      <Navbar />
      <Box
        sx={{
          width: "100%",
          positive: "relative",
        }}
      >
        <Image
          src={HomepageImg}
          alt="homepage"
          width={1920}
          height={1080}
          style={{
            objectFit: "cover",
            transition: "0.6s",
            filter: "brightness(30%)",
          }}
        />
        <Typography
          variant="h1"
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
          }}
        >
          Hello, World!
        </Typography>
        <Typography
          variant="h4"
          sx={{
            position: "absolute",
            top: "60%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "white",
          }}
        >
          A study assistant for students, by students.
        </Typography>
        <Button
          variant="contained"
          color = "primary"
          size = "large"
          href="/chat"
          sx={{
            position: "absolute",
            top: "70%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Typography
            variant="h5"
            sx={{
              fontColor: "white",
            }}
          >
            Get Started
          </Typography>
        </Button>
      </Box>
      <Footer />
    </section>
  );
}
