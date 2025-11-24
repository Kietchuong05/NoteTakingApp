import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Outlet, RouterProvider } from 'react-router-dom'
import router from './router';
import Container from '@mui/material/Container';

createRoot(document.getElementById("root")).render(
  <Container maxWidth="lg" sx ={{textAlign: 'center', marginTop: '100px'} }>
    <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
  </Container>
);
