// Sidebar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Drawer, Box, List, ListItem, ListItemIcon, ListItemText,
  Typography, Avatar, IconButton, Button, Divider, Tooltip
} from '@mui/material';
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Folder as FolderIcon,
  Note as NoteIcon,
  Tag as TagIcon,
  Logout as LogoutIcon,
  Star as StarIcon,
  DeleteOutline as TrashIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { auth } from '../../firebase/config';
import { signOut } from 'firebase/auth';
import { getFolders, createTag, syncUser, getTags } from '../../services/api';

const drawerWidth = 280;

export default function Sidebar() {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const user = auth.currentUser;

  const [myFolders, setMyFolders] = useState([]);
  const [myTags, setMyTags] = useState([]);

  useEffect(() => {
    const initData = async () => {
      if (user?.uid) {
        try {
          await syncUser(user);
          const [foldersData, tagsData] = await Promise.all([
             getFolders(user.uid),
             getTags(user.uid)
          ]);

          if (Array.isArray(foldersData)) setMyFolders(foldersData);
          if (Array.isArray(tagsData)) setMyTags(tagsData);

        } catch (error) {
          console.error("Lỗi khởi tạo dữ liệu:", error);
        }
      }
    };
    initData();
  }, [user]);

  const handleCreateTag = async () => {
    if (!user?.uid) return alert("Đăng nhập đi em!");
    const name = prompt("Nhập tên thẻ mới:");
    if (!name) return;
    
    const newTag = await createTag(name, "#10b981", user.uid); 
    if (newTag) setMyTags([...myTags, newTag]);
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  // Hiện 5 thư mục gần nhất
  const recentFolders = myFolders.slice(0, 5);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 70,
        flexShrink: 0,
        '& .MuiDrawer-paper': { width: open ? drawerWidth : 70, boxSizing: 'border-box', overflowX: 'hidden' },
      }}
    >
      {/* 1. HEADER */}
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {open && <Typography variant="h6" fontWeight="bold" color="primary">NoteApp</Typography>}
        <IconButton onClick={() => setOpen(!open)}>
          {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>

      {/* 2. USER INFO */}
      <Box sx={{ p: 2, bgcolor: '#f8fafc', mb: 2, mx: 1, borderRadius: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar src={user?.photoURL} sx={{ width: 32, height: 32 }}>{user?.displayName?.charAt(0)}</Avatar>
          {open && (
             <Box sx={{ overflow: 'hidden' }}>
                <Typography fontWeight="bold" variant="body2" noWrap>{user?.displayName}</Typography>
                <Typography variant="caption" noWrap sx={{display:'block', color: '#64748b'}}>{user?.email}</Typography>
             </Box>
          )}
        </Box>
      </Box>

      {/* 3. MENU CHÍNH */}
      <Box sx={{ flex: 1, overflowY: 'auto' }}>
        <List>
            <ListItem 
                button 
                onClick={() => navigate('/notes')} 
                selected={location.pathname === '/notes' || location.pathname === '/'}
                sx={{ mb: 0.5, borderRadius: '0 24px 24px 0', '&.Mui-selected': { bgcolor: '#eff6ff', color: '#2563eb' } }}
            >
                <ListItemIcon><NoteIcon color={location.pathname === '/notes' ? "primary" : "inherit"} /></ListItemIcon>
                {open && <ListItemText primary="Tất cả ghi chú" />}
            </ListItem>

            <ListItem 
                button 
                onClick={() => navigate('/starred')} 
                selected={location.pathname === '/starred'}
                sx={{ mb: 0.5, borderRadius: '0 24px 24px 0', '&.Mui-selected': { bgcolor: '#fff7ed', color: '#ea580c' } }}
            >
                <ListItemIcon><StarIcon sx={{ color: '#f59e0b' }} /></ListItemIcon>
                {open && <ListItemText primary="Được gắn sao" />}
            </ListItem>

            <ListItem 
                button 
                onClick={() => navigate('/trash')} 
                selected={location.pathname === '/trash'}
                sx={{ mb: 0.5, borderRadius: '0 24px 24px 0', '&.Mui-selected': { bgcolor: '#fef2f2', color: '#dc2626' } }}
            >
                <ListItemIcon><TrashIcon sx={{ color: '#ef4444' }} /></ListItemIcon>
                {open && <ListItemText primary="Thùng rác" />}
            </ListItem>
        </List>

        <Divider sx={{ my: 2 }} />

        {/* --- KHU VỰC FOLDER (ĐÃ SỬA) --- */}
        <Box sx={{ px: 2, mt: 1, mb: 1 }}>
            {/* Tiêu đề tĩnh */}
            {open && <Typography variant="caption" fontWeight="bold" color="text.secondary">THƯ MỤC</Typography>}
        </Box>
        
        <List>
            {/* 1. Nút Quản lý thư mục (Dẫn sang trang Grid) */}
            <ListItem 
                button 
                onClick={() => navigate('/folders')} 
                selected={location.pathname === '/folders'}
                sx={{ mb: 0.5 }}
            >
                <ListItemIcon><FolderIcon color={location.pathname === '/folders' ? "primary" : "inherit"} /></ListItemIcon>
                {open && <ListItemText primary="Quản lý thư mục" />}
            </ListItem>

            {/* 2. Danh sách 5 folder gần đây (Thụt vào 1 chút để phân cấp) */}
            {recentFolders.map(folder => (
                <ListItem 
                    key={folder.id} 
                    button
                    onClick={() => navigate(`/folders/${folder.id}`)} 
                    selected={location.pathname === `/folders/${folder.id}`}
                    sx={{ borderRadius: '0 24px 24px 0', pl: 4 }} // Thụt lề (padding-left) để thụt vào
                >
                    <ListItemIcon sx={{ minWidth: 30 }}>
                        <FolderIcon sx={{ color: '#f59e0b', fontSize: 20 }} />
                    </ListItemIcon>
                    {open && <ListItemText primary={folder.name} primaryTypographyProps={{ noWrap: true, variant: 'body2' }} />}
                </ListItem>
            ))}
        </List>

        {/* --- KHU VỰC TAGS --- */}
        <Box sx={{ px: 2, mt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {open && <Typography variant="caption" fontWeight="bold" color="text.secondary">THẺ (TAGS)</Typography>}
        </Box>
        <List>
            <ListItem button onClick={() => navigate('/tags')} selected={location.pathname === '/tags'}>
                 <ListItemIcon><TagIcon /></ListItemIcon>
                 {open && <ListItemText primary="Quản lý thẻ" />}
            </ListItem>

            {myTags.map(tag => (
                <ListItem key={tag.id} button sx={{ py: 0.5 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}><TagIcon sx={{ color: tag.color, fontSize: 18 }} /></ListItemIcon>
                    {open && <ListItemText primary={tag.name} primaryTypographyProps={{ variant: 'body2' }} />}
                </ListItem>
            ))}
        </List>
      </Box>

      {/* 4. LOGOUT */}
      <Box sx={{ p: 2, borderTop: '1px solid #eee' }}>
         <Button fullWidth color="error" startIcon={<LogoutIcon />} onClick={handleLogout}>
            {open && "Đăng xuất"}
         </Button>
      </Box>
    </Drawer>
  );
}