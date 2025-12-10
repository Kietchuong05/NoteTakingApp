import React from 'react';
import Layout from '../components/layout/Layout';
import { Box, Typography, Paper } from '@mui/material';
import { Tag as TagIcon } from '@mui/icons-material';

export default function Tags() {
  return (
    <Layout>
      <Box className="page-container">
        <Paper className="page-header" elevation={0}>
          <Typography variant="h4" fontWeight="bold">
            Quản Lý Thẻ
          </Typography>
          <Typography variant="body1" color="#64748b">
            Tổ chức ghi chú với các thẻ phân loại
          </Typography>
        </Paper>
        
        <Paper sx={{ 
          textAlign: 'center', 
          padding: '80px 20px',
          mt: 3,
          backgroundColor: 'white',
          borderRadius: '12px'
        }}>
          <TagIcon sx={{ fontSize: '60px', color: '#8b5cf6', mb: 2 }} />
          <Typography variant="h5" fontWeight="bold" mb={1}>
            Tính năng thẻ đang được phát triển
          </Typography>
          <Typography color="#64748b">
            Bạn sẽ sớm có thể tạo và quản lý thẻ tại đây
          </Typography>
        </Paper>
      </Box>
    </Layout>
  );
}