import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/config";
import Layout from "../components/layout/Layout";
import FolderCard from "../components/folders/FolderCard";
import FolderStats from "../components/folders/FolderStats"; // Sửa đường dẫn này
// Nếu FolderCard chưa có, import tạm thời
import {
  Box,
  Typography,
  Grid,
  Button,
  Paper,
  Avatar,
  Chip
} from "@mui/material";
import {
  Add as AddIcon,
  Folder as FolderIcon,
  Share as ShareIcon,
  Star as StarIcon
} from "@mui/icons-material";
import "../styles/pages/home.css";

export default function Home() {
  const navigate = useNavigate();
  const user = auth.currentUser;

  // Dữ liệu mẫu cho thư mục
  const recentFolders = [
    { id: 1, name: "Công việc", noteCount: 12, color: "#3b82f6", lastModified: "2 giờ trước", isStarred: true },
    { id: 2, name: "Học tập", noteCount: 8, color: "#10b981", lastModified: "Hôm qua", isStarred: true },
    { id: 3, name: "Cá nhân", noteCount: 5, color: "#f59e0b", lastModified: "2 ngày trước", isStarred: false },
    { id: 4, name: "Dự án", noteCount: 3, color: "#8b5cf6", lastModified: "1 tuần trước", isStarred: false },
  ];

  return (
    <Layout>
      <Box className="home-container">
        {/* Welcome Header */}
        <Paper elevation={0} className="welcome-card">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="h4" fontWeight="bold">
                Xin chào, {user?.displayName || "Người dùng"}! 👋
              </Typography>
              <Typography variant="body1" color="rgba(255,255,255,0.9)" mt={1}>
                Chào mừng trở lại. Bạn có 50 ghi chú trong 6 thư mục.
              </Typography>
            </Box>
            <Avatar
              src={user?.photoURL}
              sx={{ width: 60, height: 60, bgcolor: '#ffffff' }}
            >
              {user?.displayName?.charAt(0) || 'U'}
            </Avatar>
          </Box>
        </Paper>

        {/* Quick Stats - Sử dụng FolderStats component */}
        <Box mt={4}>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Thống Kê Nhanh
          </Typography>
          <FolderStats />
        </Box>

        {/* Recent Folders */}
        <Box mt={4}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" fontWeight="bold">
              Thư Mục Gần Đây
            </Typography>
            <Button
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={() => navigate('/folders')}
            >
              Xem tất cả
            </Button>
          </Box>
          
          {/* Tạm thời dùng thẻ Paper thay vì FolderCard nếu chưa có */}
          <Grid container spacing={3}>
            {recentFolders.map((folder) => (
              <Grid item xs={12} sm={6} md={3} key={folder.id}>
                <Paper 
                  className="folder-preview-card"
                  sx={{ 
                    p: 3,
                    borderRadius: '12px',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    borderLeft: `4px solid ${folder.color}`,
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                    }
                  }}
                  onClick={() => navigate('/folders')}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                    <Box sx={{ 
                      backgroundColor: `${folder.color}20`,
                      borderRadius: '50%',
                      width: 40,
                      height: 40,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: folder.color
                    }}>
                      <FolderIcon />
                    </Box>
                    <Typography variant="h6" fontWeight="bold">
                      {folder.name}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Chip 
                      label={`${folder.noteCount} ghi chú`}
                      size="small"
                      sx={{ 
                        backgroundColor: `${folder.color}20`,
                        color: folder.color,
                        fontWeight: 'medium'
                      }}
                    />
                    {folder.isStarred && (
                      <StarIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                    )}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Box>

        {/* Quick Actions */}
        <Box mt={4}>
          <Typography variant="h6" fontWeight="bold" mb={3}>
            Hành Động Nhanh
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                className="action-card" 
                onClick={() => navigate('/folders?new=true')}
                sx={{
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(59, 130, 246, 0.15)',
                    borderColor: '#3b82f6'
                  }
                }}
              >
                <AddIcon sx={{ fontSize: 40, color: '#3b82f6' }} />
                <Typography variant="subtitle1" fontWeight="bold" mt={1}>
                  Tạo thư mục mới
                </Typography>
              </Paper>
            </Grid>
            
            {/* Các action cards khác... */}
          </Grid>
        </Box>
      </Box>
    </Layout>
  );
}