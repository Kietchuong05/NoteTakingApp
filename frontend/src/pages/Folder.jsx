// src/pages/Folder.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Typography, Grid, Card, CardContent, Chip, Alert, CircularProgress, 
  IconButton, Tooltip 
} from '@mui/material';
import { 
  Folder as FolderIcon, 
  Edit as EditIcon, 
  DeleteOutline as DeleteIcon,
  Star as StarIcon, 
  StarBorder as StarBorderIcon 
} from '@mui/icons-material';
import { format } from 'date-fns';
import { auth } from '../firebase/config';
import { getNotes, getFolders, updateNote, deleteNote } from '../services/api'; 

export default function Folder() {
  const { folderId } = useParams(); // Lấy ID từ URL (ví dụ: /folders/123 -> folderId = 123)
  const navigate = useNavigate();
  const user = auth.currentUser;
  
  const [notes, setNotes] = useState([]);
  const [folderName, setFolderName] = useState("Đang tải...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid && folderId) {
        setLoading(true);
        try {
          // Gọi API lấy Note và Folder
          const [notesData, foldersData] = await Promise.all([
            getNotes(user.uid, folderId), // Truyền folderId vào đây luôn
            getFolders(user.uid)
          ]);

          // 1. Tìm tên folder để hiển thị lên tiêu đề
          if (Array.isArray(foldersData)) {
            const currentFolder = foldersData.find(f => String(f.id) === String(folderId));
            setFolderName(currentFolder ? currentFolder.name : "Thư mục không tồn tại");
          }

          // 2. Set dữ liệu notes
          if (Array.isArray(notesData)) {
            const filtered = notesData.filter(n => String(n.folder_id) === String(folderId));
            setNotes(filtered);
          }

        } catch (error) {
          console.error("Lỗi tải dữ liệu:", error);
          setFolderName("Lỗi kết nối");
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user, folderId]);

  // --- XỬ LÝ ĐÁNH SAO ---
  const handleToggleStar = async (note) => {
    const newStatus = !note.is_starred;
    
    setNotes(prev => prev.map(n => n.id === note.id ? { ...n, is_starred: newStatus } : n));

    try {
      await updateNote(note.id, { is_starred: newStatus }); 
    } catch (error) {
      console.error("Lỗi star:", error);
      // Hoàn tác nếu lỗi
      setNotes(prev => prev.map(n => n.id === note.id ? { ...n, is_starred: !newStatus } : n));
    }
  };

  // --- XỬ LÝ XÓA ---
  const handleDelete = async (noteId) => {
    if (confirm("Bạn có chắc muốn xóa ghi chú này không?")) {
      try {
        await deleteNote(noteId);
        setNotes(prev => prev.filter(n => n.id !== noteId));
      } catch (error) {
        alert("Lỗi khi xóa!");
      }
    }
  };

  // --- CHUYỂN HƯỚNG SANG TRANG SỬA ---
  const handleEdit = (note) => {
    navigate(`/notes/${note.id}`);
  };

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 4, display: 'flex', alignItems: 'center', gap: 1, color: '#1e293b' }}>
        <FolderIcon sx={{ color: '#f59e0b', fontSize: 40 }} /> 
        {folderName} 
      </Typography>

      {notes.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2 }}>
            Thư mục này đang trống. Hãy tạo ghi chú mới và chọn thư mục "{folderName}" nhé!
        </Alert>
      ) : (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card 
                sx={{ 
                    height: '100%', 
                    borderRadius: 4, 
                    boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                    display: 'flex', flexDirection: 'column',
                    transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold" sx={{ color: '#334155', lineHeight: 1.3 }}>
                        {note.title || "Không tiêu đề"}
                    </Typography>
                    <IconButton 
                        size="small" 
                        onClick={() => handleToggleStar(note)}
                        sx={{ mt: -0.5, mr: -1 }}
                    >
                        {note.is_starred ? <StarIcon sx={{ color: '#f59e0b' }} /> : <StarBorderIcon sx={{ color: '#cbd5e1' }} />}
                    </IconButton>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {note.content ? note.content.replace(/<[^>]+>/g, '') : "Chưa có nội dung..."}
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 3 }}>
                    {note.tags && note.tags.map(tag => (
                      <Chip key={tag.id} label={tag.name} size="small" sx={{ bgcolor: `${tag.color}15`, color: tag.color, fontWeight: 600, fontSize: '11px', height: 24 }} />
                    ))}
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 2, borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 500 }}>
                      {note.created_at ? format(new Date(note.created_at), 'dd/MM/yyyy') : 'Mới tạo'}
                    </Typography>

                    <Box>
                        <Tooltip title="Chỉnh sửa">
                            <IconButton size="small" onClick={() => handleEdit(note)} sx={{ color: '#64748b', '&:hover': { color: '#3b82f6' } }}>
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                            <IconButton size="small" onClick={() => handleDelete(note.id)} sx={{ color: '#64748b', '&:hover': { color: '#ef4444' } }}>
                                <DeleteIcon fontSize="small" />
                            </IconButton>
                        </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}