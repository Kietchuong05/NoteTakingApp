import React from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase/config";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import "../styles/pages/login.css";

export default function Login() {
  const navigate = useNavigate();

  async function signIn() {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
    }
  }

  return (
    <div className="login-container">
      <Typography variant="h3" sx={{ 
        fontWeight: 'bold', 
        mb: 4,
        background: 'linear-gradient(45deg, #ffffff 30%, #e0f7fa 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        Chào mừng đến với Note Taking App!!
      </Typography>
      <Button
        variant="contained"
        onClick={signIn}
        startIcon={<GoogleIcon />}
        sx={{
          background: 'linear-gradient(45deg, #ffffff 0%, #f5f5f5 100%)',
          borderRadius: '25px',
          padding: '12px 32px',
          textTransform: 'none',
          fontWeight: 'bold',
          fontSize: '16px',
          color: '#333',
          boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          transition: 'all 0.3s ease',
          '&:hover': {
            background: 'linear-gradient(45deg, #f5f5f5 0%, #e8e8e8 100%)',
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 20px rgba(0, 0, 0, 0.25)',
          },
          '&:active': {
            transform: 'translateY(0)',
          }
        }}
      >
        Đăng nhập với Google
      </Button>
    </div>
  );
}