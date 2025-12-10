import React from 'react';
import Layout from '../components/layout/Layout';
import { Box, Typography, Paper } from '@mui/material';
import { NoteAdd as NoteAddIcon } from '@mui/icons-material';

export default function Notes() {
  return (
    <Layout>
      <Box className="page-container">
        <Paper className="page-header" elevation={0}>
          <Typography variant="h4" fontWeight="bold">
            Quản Lý Ghi Chú
          </Typography>
          <Typography variant="body1" color="#64748b">
            Tạo và quản lý các ghi chú của bạn
          </Typography>
        </Paper>
        
        <Paper sx={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          mt: 3,
          backgroundColor: 'white',
          borderRadius: '12px'
        }}>
          <NoteAddIcon sx={{ fontSize: '60px', color: '#10b981', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Tính năng ghi chú đang được phát triển
          </Typography>
          <Typography color="#64748b">
            Bạn sẽ sớm có thể tạo và quản lý ghi chú tại đây
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}