// Layout.jsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Sidebar from './Sidebar';

export default function Layout() {
  return (
    <Box sx={{ 
      display: 'flex', 
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* Sidebar - luôn hiển thị */}
      <Sidebar />
      
      {/* Main content area */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column'
      }}>
        
        <Box 
          component="main"
          sx={{
            flex: 1,
            mt: '70px', // Height of header
            minHeight: 'calc(100vh - 70px)',
            backgroundColor: 'white',
            overflow: 'hidden'
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}