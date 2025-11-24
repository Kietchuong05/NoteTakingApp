import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  async function signIn() {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/"); // Chuyển hướng về trang chủ sau khi đăng nhập thành công
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <>
      <Typography variant="h3" sx={{ color: "white" }}>
        Chào mừng đến với Note Taking App!!
      </Typography>
      <Button
        onClick={signIn}
        sx={{ background: "#ffffffff", borderRadius: "20px", margin: "20px" }}
      >
        Đăng nhập với <span>Google</span>
      </Button>
    </>
  );
}