import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Button,
  Chip,
  Tooltip
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  Note as NoteIcon,
  Tag as TagIcon,
  Logout as LogoutIcon,
  Star as StarIcon,
  Share as ShareIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';

const drawerWidth = 280;

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  // Dữ liệu menu
  const menuItems = [
    { text: 'Thư mục', icon: <FolderIcon />, path: '/folders', count: 6 },
    { text: 'Ghi chú', icon: <NoteIcon />, path: '/notes', count: 50 },
    { text: 'Thẻ', icon: <TagIcon />, path: '/tags', count: 12 },
  ];

  // Dữ liệu thư mục nhanh
  const quickFolders = [
    { id: 1, name: 'Công việc', noteCount: 12, color: '#3b82f6', isStarred: true },
    { id: 2, name: 'Học tập', noteCount: 8, color: '#10b981', isStarred: true },
    { id: 3, name: 'Cá nhân', noteCount: 5, color: '#f59e0b', isStarred: false },
  ];

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 70,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 70,
          boxSizing: 'border-box',
          borderRight: '1px solid #e2e8f0',
          transition: 'width 0.3s ease',
          overflowX: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        },
      }}
    >
      {/* Header với toggle button */}
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: '1px solid #e2e8f0'
      }}>
        {open ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32 }}>
              <NoteIcon fontSize="small" />
            </Avatar>
            <Typography variant="h6" fontWeight="bold" color="#1e293b">
              NoteApp
            </Typography>
          </Box>
        ) : (
          <Avatar sx={{ bgcolor: '#3b82f6', width: 32, height: 32, mx: 'auto' }}>
            <NoteIcon fontSize="small" />
          </Avatar>
        )}
        <IconButton 
          onClick={() => setOpen(!open)} 
          size="small"
          sx={{ 
            color: '#64748b',
            '&:hover': { backgroundColor: '#f1f5f9' }
          }}
        >
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* Thông tin người dùng */}
      <Box sx={{ 
        p: 3, 
        borderBottom: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar
            src={user?.photoURL}
            sx={{ 
              width: 48, 
              height: 48, 
              bgcolor: '#3b82f6',
              border: '2px solid white',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
          >
            {user?.displayName?.charAt(0) || 'U'}
          </Avatar>
          {open && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="#1e293b">
                {user?.displayName || 'Người dùng'}
              </Typography>
              <Typography variant="caption" color="#64748b">
                {user?.email || 'technology16@gmail.com'}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>

      {/* Menu chính */}
      <Box sx={{ flex: 1, p: 2 }}>
        <Typography variant="caption" color="#64748b" fontWeight="bold" sx={{ 
          display: 'block', 
          mb: 2, 
          px: 1,
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          {open ? 'Menu chính' : ''}
        </Typography>
        
        <List sx={{ p: 0 }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              component="div"  // ĐÃ SỬA: Thay thế prop button bằng component="div"
              onClick={() => navigate(item.path)}
              selected={location.pathname === item.path}
              sx={{
                borderRadius: 2,
                mb: 0.5,
                px: 2,
                py: 1.5,
                cursor: 'pointer',  // Thêm cursor pointer cho rõ ràng
                '&.Mui-selected': {
                  backgroundColor: '#eff6ff',
                  '& .MuiListItemIcon-root': {
                    color: '#3b82f6'
                  },
                  '& .MuiListItemText-primary': {
                    color: '#3b82f6',
                    fontWeight: '600'
                  }
                },
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: 40,
                color: location.pathname === item.path ? '#3b82f6' : '#64748b'
              }}>
                {item.icon}
              </ListItemIcon>
              {open && (
                <ListItemText 
                  primary={item.text}
                  sx={{ 
                    '& .MuiTypography-root': {
                      fontSize: '0.875rem',
                      fontWeight: location.pathname === item.path ? '600' : '400'
                    }
                  }}
                />
              )}
              {open && item.count !== null && (
                <Chip 
                  label={item.count}
                  size="small"
                  sx={{ 
                    height: 20,
                    fontSize: '0.7rem',
                    fontWeight: 'bold',
                    backgroundColor: location.pathname === item.path ? '#3b82f6' : '#e2e8f0',
                    color: location.pathname === item.path ? 'white' : '#64748b'
                  }}
                />
              )}
            </ListItem>
          ))}
        </List>

        {/* Bộ lọc nhanh */}
        {open && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="caption" color="#64748b" fontWeight="bold" sx={{ 
              display: 'block', 
              mb: 2, 
              px: 1,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Bộ lọc nhanh
            </Typography>
            
            <Button
              fullWidth
              startIcon={<StarIcon />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontSize: '0.875rem',
                color: '#1e293b',
                mb: 1,
                borderRadius: 2,
                px: 2,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
              onClick={() => navigate('/folders?filter=starred')}
            >
              Được gắn sao
            </Button>
            
            <Button
              fullWidth
              startIcon={<ShareIcon />}
              sx={{
                justifyContent: 'flex-start',
                textTransform: 'none',
                fontSize: '0.875rem',
                color: '#1e293b',
                borderRadius: 2,
                px: 2,
                py: 1.5,
                '&:hover': {
                  backgroundColor: '#f1f5f9'
                }
              }}
              onClick={() => navigate('/folders?filter=shared')}
            >
              Được chia sẻ
            </Button>
          </Box>
        )}
      </Box>

      {/* Đăng xuất */}
      <Box sx={{ 
        p: 2, 
        borderTop: '1px solid #e2e8f0',
        backgroundColor: '#f8fafc'
      }}>
        <Button
          fullWidth
          startIcon={<LogoutIcon />}
          onClick={handleLogout}
          sx={{
            justifyContent: open ? 'flex-start' : 'center',
            textTransform: 'none',
            color: '#ef4444',
            borderRadius: 2,
            px: 2,
            py: 1.5,
            '&:hover': {
              backgroundColor: '#fef2f2'
            }
          }}
        >
          {open && 'Đăng xuất'}
        </Button>
      </Box>
    </Drawer>
  );
}