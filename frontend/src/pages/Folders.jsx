// src/pages/Folders.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Card, CardContent, CircularProgress, 
  IconButton, Tooltip, Alert, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions
} from '@mui/material';
import { 
  Folder as FolderIcon, 
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { auth } from '../firebase/config';
import { getFolders, createFolder, deleteFolder, updateFolder } from '../services/api'; 

export default function Folders() {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Dialog (Dùng chung cho cả Tạo mới và Sửa)
  const [openDialog, setOpenDialog] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [editingFolderId, setEditingFolderId] = useState(null); // Nếu null là tạo mới, có ID là sửa

  const fetchAllFolders = async () => {
    if (user?.uid) {
      setLoading(true);
      try {
        const data = await getFolders(user.uid);
        if (Array.isArray(data)) setFolders(data);
      } catch (error) {
        console.error("Lỗi:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchAllFolders();
  }, [user]);

  const handleOpenCreate = () => {
      setEditingFolderId(null); // Chế độ tạo mới
      setFolderName('');
      setOpenDialog(true);
  }

  const handleOpenEdit = (e, folder) => {
      e.stopPropagation();
      setEditingFolderId(folder.id); // Chế độ sửa
      setFolderName(folder.name); // Điền tên cũ vào ô input
      setOpenDialog(true);
  }

  //  XỬ LÝ SUBMIT (TẠO HOẶC SỬA)
  const handleSubmit = async () => {
    if(!folderName.trim()) return;

    try {
        if (editingFolderId) {
            // --- LOGIC SỬA ---
            const updated = await updateFolder(editingFolderId, folderName, user.uid);
            if (updated) {
                setFolders(folders.map(f => f.id === editingFolderId ? updated : f));
            }
        } else {
            // --- LOGIC TẠO MỚI ---
            const created = await createFolder(folderName, user.uid);
            if (created) {
                setFolders([...folders, created]);
            }
        }
        setOpenDialog(false);
        setFolderName('');
    } catch (e) {
        alert("Có lỗi xảy ra!");
        console.error(e);
    }
  }

  // ---  XỬ LÝ XÓA ---
  const handleDelete = async (e, id) => {
    e.stopPropagation();
    
    if(confirm("Bạn có chắc chắn muốn xóa thư mục này? (Lưu ý: Các ghi chú bên trong sẽ mất liên kết folder)")) {
        try {
            const success = await deleteFolder(id);
            if (success) {
                setFolders(folders.filter(f => f.id !== id));
            } else {
                alert("Không xóa được (Lỗi API)");
            }
        } catch (err) {
            alert("Lỗi khi xóa folder");
        }
    }
  }

  if (loading) return <Box sx={{ display:'flex', justifyContent:'center', mt: 5 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" color="#1e293b">Quản lý Thư mục</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>Tạo mới</Button>
      </Box>

      {folders.length === 0 ? (
        <Alert severity="info">Chưa có thư mục nào.</Alert>
      ) : (
        <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', 
            gap: 2 
        }}>
          {folders.map((folder) => (
            <Card 
                key={folder.id}
                onClick={() => navigate(`/folders/${folder.id}`)}
                sx={{ 
                    cursor: 'pointer',
                    borderRadius: 3,
                    transition: '0.2s',
                    border: '1px solid #e2e8f0',
                    '&:hover': { transform: 'translateY(-4px)', borderColor: '#3b82f6', boxShadow: 3 }
                }}
            >
                <CardContent sx={{ textAlign: 'center', p: 2 }}>
                    <FolderIcon sx={{ fontSize: 48, color: '#f59e0b', mb: 1 }} />
                    <Tooltip title={folder.name}>
                        <Typography variant="subtitle1" fontWeight="bold" noWrap>
                            {folder.name}
                        </Typography>
                    </Tooltip>
                    
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 1 }}>
                        <Tooltip title="Đổi tên">
                            {/* Nút Sửa */}
                            <IconButton size="small" onClick={(e) => handleOpenEdit(e, folder)}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            {/* Nút Xóa */}
                            <IconButton size="small" color="error" onClick={(e) => handleDelete(e, folder.id)}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                </CardContent>
            </Card>
          ))}
        </Box>
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editingFolderId ? 'Đổi tên thư mục' : 'Tạo thư mục mới'}</DialogTitle>
        <DialogContent>
            <TextField 
                autoFocus margin="dense" label="Tên thư mục" fullWidth 
                value={folderName} onChange={(e) => setFolderName(e.target.value)}
                onKeyDown={(e) => { if(e.key === 'Enter') handleSubmit() }} // Ấn Enter là submit luôn
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button onClick={handleSubmit} variant="contained">
                {editingFolderId ? 'Cập nhật' : 'Tạo'}
            </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}