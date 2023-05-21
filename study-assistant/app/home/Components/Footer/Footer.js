import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Link from "next/link";

import AdbIcon from "@mui/icons-material/Adb";

const pages = ["Home", "Chat", "About"];

export default function Footer(props) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "20vh",
          backgroundColor: "black",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            {pages.map((page) => (
              <Link href={`/${page.toLowerCase()}`}>
                <Button
                  sx={{
                    color: "white",
                  }}
                >
                  {page}
                </Button>
              </Link>
            ))}
          </Box>
          <IconButton>
            <AdbIcon fontSize="large" sx={{ color: "white" }} />
          </IconButton>
        </Box>
        <Typography variant="h6" color={"white"}></Typography>
      </Box>
    </Box>
  );
}
