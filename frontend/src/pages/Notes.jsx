import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Box, Grid, Card, CardContent, Typography, IconButton, Button,
  TextField, InputAdornment, Chip,
  Dialog, DialogTitle, DialogContent, DialogActions,
  FormControl, InputLabel, Select, MenuItem, Tooltip, OutlinedInput,
  InputLabel as MuiInputLabel
} from '@mui/material';
import {
  Add as AddIcon, Search as SearchIcon,
  Edit as EditIcon, Delete as DeleteIcon,
  Folder as FolderIcon,
  Star as StarIcon, StarBorder as StarBorderIcon,
  RestoreFromTrash as RestoreIcon, DeleteForever as DeleteForeverIcon,
  Share as ShareIcon
} from '@mui/icons-material';

import { auth } from '../firebase/config';
import { getNotes, createNote, updateNote, deleteNote, deleteNotePermanently, getFolders, getTags } from '../services/api';
import { format } from 'date-fns';
import RichTextEditor from '../components/notes/RichTextEditor';

export default function Notes() {
  const user = auth.currentUser;
  const location = useLocation();

  const isStarredPage = location.pathname === '/starred';
  const isTrashPage = location.pathname === '/trash';

  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [openDialog, setOpenDialog] = useState(false);
  const [openShareDialog, setOpenShareDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [sharingNote, setSharingNote] = useState(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    folderId: '', 
    tagIds: [] 
  });
  
  const [shareEmail, setShareEmail] = useState('');
  const [sharePermission, setSharePermission] = useState('view');

  useEffect(() => {
    const fetchData = async () => {
      if (user?.uid) {
        setLoading(true);
        try {
          const isDeleted = isTrashPage; 

          const [notesData, foldersData, tagsData] = await Promise.all([
            getNotes(user.uid, null, isDeleted),
            getFolders(user.uid),
            getTags(user.uid)
          ]);
          
          const processedNotes = Array.isArray(notesData) ? notesData.map(n => ({ 
            ...n, 
            is_starred: n.is_starred || false 
          })) : [];
          setNotes(processedNotes);
          if (Array.isArray(foldersData)) setFolders(foldersData);
          if (Array.isArray(tagsData)) setTags(tagsData);
        } catch (error) {
          console.error("Lỗi:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [user, isTrashPage]);

  const handleOpenCreate = () => {
    setEditingNote(null);
    setFormData({ title: '', content: '', folderId: '', tagIds: [] });
    setOpenDialog(true);
  };

  const handleOpenEdit = (note) => {
    setEditingNote(note);
    const currentTagIds = note.tags ? note.tags.map(t => t.id) : [];
    setFormData({ 
      title: note.title, 
      content: note.content || '', 
      folderId: note.folder_id || '', 
      tagIds: currentTagIds 
    });
    setOpenDialog(true);
  };

  const handleOpenShare = (note) => {
    setSharingNote(note);
    setShareEmail('');
    setSharePermission('view');
    setOpenShareDialog(true);
  };

  const handleShare = async () => {
    if (!shareEmail.trim()) return alert("Vui lòng nhập email người nhận!");
    try {
      alert(`Chia sẻ ghi chú "${sharingNote.title}" với ${shareEmail} (quyền: ${sharePermission})`);
      setOpenShareDialog(false);
    } catch (error) {
      alert("Lỗi chia sẻ!");
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) return alert("Tiêu đề không được để trống!");
    try {
      if (editingNote) {
        const updated = await updateNote(editingNote.id, {
          title: formData.title, 
          content: formData.content, 
          folder_id: formData.folderId || null, 
          tag_ids: formData.tagIds
        });
        if (updated) {
          setNotes(notes.map(n => (n.id === editingNote.id ? { ...updated, is_starred: n.is_starred } : n)));
          setOpenDialog(false);
        }
      } else {
        const created = await createNote(
          formData.title, 
          formData.content, 
          formData.folderId || null, 
          formData.tagIds, 
          user.uid
        );
        if (created) {
          setNotes([{ ...created, is_starred: false }, ...notes]);
          setOpenDialog(false);
        }
      }
    } catch (error) { 
      console.error("Lỗi:", error);
      alert("Lỗi lưu ghi chú!"); 
    }
  };

  const handleSoftDelete = async (id) => {
    if (window.confirm("Chuyển ghi chú này vào thùng rác?")) {
      const success = await deleteNote(id);
      if (success) setNotes(notes.filter(n => n.id !== id));
    }
  };

  const handleHardDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa VĨNH VIỄN? Không thể khôi phục đâu nhé!")) {
      const success = await deleteNotePermanently(id);
      if (success) setNotes(notes.filter(n => n.id !== id));
    }
  };

  const handleRestore = async (id) => {
    // Lưu ý: Cần đảm bảo hàm restoreNote đã được import nếu dùng
    // Trong file cũ cậu gửi chưa thấy import restoreNote, nếu chưa có thì updateNote(id, { is_deleted: false })
    const updated = await updateNote(id, { is_deleted: false });
    if (updated) {
      setNotes(notes.filter(n => n.id !== id));
      alert("Đã khôi phục ghi chú!");
    }
  };

  const handleToggleStar = async (noteId) => {
    const note = notes.find(n => n.id === noteId);
    const newStarStatus = !note.is_starred;
    
    const updatedNotes = notes.map(n => 
      n.id === noteId ? { ...n, is_starred: newStarStatus } : n
    );
    setNotes(updatedNotes);
    
    await updateNote(noteId, { is_starred: newStarStatus });
  };

  const stripHtml = (html) => {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const filteredNotes = notes.filter(note => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      stripHtml(note.content).toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStar = isStarredPage ? note.is_starred === true : true;
    return matchesSearch && matchesStar;
  });

  let pageTitle = 'Tất cả Ghi chú';
  if (isStarredPage) pageTitle = 'Ghi chú được gắn sao';
  if (isTrashPage) pageTitle = 'Thùng rác';

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold', color: isTrashPage ? '#ef4444' : '#1e293b' }}>
          {pageTitle}
        </Typography>
        {!isTrashPage && !isStarredPage && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={handleOpenCreate} 
              sx={{ bgcolor: '#3b82f6' }}
            >
              Ghi chú mới
            </Button>
        )}
      </Box>

      <Box sx={{ mb: 4 }}>
        <TextField 
          fullWidth 
          placeholder="Tìm kiếm..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
          InputProps={{ 
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ) 
          }} 
          sx={{ bgcolor: 'white', borderRadius: 2 }} 
        />
      </Box>

      <Grid container spacing={3}>
        {filteredNotes.length === 0 && !loading && (
            <Grid item xs={12}>
              <Typography align="center" color="#94a3b8" sx={{ mt: 4 }}>
                {isTrashPage ? 'Thùng rác trống' : 
                 isStarredPage ? 'Chưa có ghi chú nào được gắn sao' : 
                 'Chưa có ghi chú nào. Tạo ghi chú đầu tiên của bạn!'}
              </Typography>
            </Grid>
        )}

        {filteredNotes.map((note) => (
          <Grid item xs={12} sm={6} md={4} key={note.id}>
            <Card sx={{ 
              height: '100%', 
              borderRadius: 3, 
              display: 'flex', 
              flexDirection: 'column', 
              transition: '0.3s', 
              '&:hover': { 
                transform: 'translateY(-5px)', 
                boxShadow: 3 
              }, 
              opacity: isTrashPage ? 0.8 : 1 
            }}>
              <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 0.5 }}>
                  {!isTrashPage && (
                    <IconButton 
                      size="small" 
                      onClick={() => handleToggleStar(note.id)} 
                      sx={{ ml: -1 }}
                    >
                      {note.is_starred ? 
                        <StarIcon sx={{ color: '#f59e0b' }} /> : 
                        <StarBorderIcon sx={{ color: '#94a3b8' }} />
                      }
                    </IconButton>
                  )}
                  <Typography 
                    variant="h6" 
                    fontWeight="bold" 
                    noWrap 
                    sx={{
                      textDecoration: isTrashPage ? 'line-through' : 'none',
                      flex: 1
                    }}
                  >
                    {note.title}
                  </Typography>
                </Box>

                <Typography 
                  variant="body2" 
                  color="#64748b" 
                  sx={{ 
                    mb: 2, 
                    display: '-webkit-box', 
                    WebkitLineClamp: 3, 
                    WebkitBoxOrient: 'vertical', 
                    overflow: 'hidden',
                    minHeight: '40px',
                    lineHeight: 1.5
                  }}
                >
                  {stripHtml(note.content).substring(0, 150) || "Không có nội dung"}
                </Typography>

                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2, mt: 'auto' }}>
                  {note.tags && note.tags.slice(0, 3).map(tag => (
                    <Chip 
                      key={tag.id} 
                      label={tag.name} 
                      size="small" 
                      sx={{ 
                        bgcolor: tag.color || '#cbd5e1', 
                        color: '#fff', 
                        fontSize: '10px', 
                        height: 22, 
                        fontWeight: 'bold' 
                      }} 
                    />
                  ))}
                  {note.tags && note.tags.length > 3 && (
                    <Chip 
                      label={`+${note.tags.length - 3}`} 
                      size="small" 
                      sx={{ bgcolor: '#e2e8f0', color: '#64748b', fontSize: '10px', height: 22 }} 
                    />
                  )}
                </Box>

                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  pt: 2, 
                  borderTop: '1px solid #f1f5f9' 
                }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    {note.folder ? (
                      <Chip 
                        icon={<FolderIcon style={{ fontSize: 14 }} />} 
                        label={note.folder.name} 
                        size="small" 
                        sx={{ bgcolor: '#eff6ff', color: '#3b82f6', fontSize: 11 }} 
                      />
                    ) : (
                      <Typography variant="caption" color="#94a3b8">Chưa phân loại</Typography>
                    )}
                    <Typography variant="caption" color="#94a3b8">
                      {note.created_at ? format(new Date(note.created_at), 'dd/MM/yyyy') : 'Mới tạo'}
                    </Typography>
                  </Box>

                  <Box>
                    {isTrashPage ? (
                      <>
                        <Tooltip title="Khôi phục">
                          <IconButton size="small" onClick={() => handleRestore(note.id)} sx={{ color: '#10b981' }}>
                            <RestoreIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa vĩnh viễn">
                          <IconButton size="small" onClick={() => handleHardDelete(note.id)} sx={{ color: '#ef4444' }}>
                            <DeleteForeverIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <Tooltip title="Chia sẻ">
                          <IconButton size="small" onClick={() => handleOpenShare(note)} sx={{ color: '#3b82f6' }}>
                            <ShareIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Sửa">
                          <IconButton size="small" onClick={() => handleOpenEdit(note)} sx={{ color: '#64748b' }}>
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Xóa">
                          <IconButton size="small" onClick={() => handleSoftDelete(note.id)} sx={{ color: '#ef4444' }}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
                    )}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      
      {/* Dialog tạo/chỉnh sửa ghi chú */}
      {!isTrashPage && (
        <Dialog 
          open={openDialog} 
          onClose={() => setOpenDialog(false)} 
          fullWidth 
          maxWidth="md"
          PaperProps={{
            sx: { maxHeight: '90vh', height: '700px' }
          }}
        >
          <DialogTitle>
            {editingNote ? 'Chỉnh sửa ghi chú' : 'Tạo ghi chú mới'}
          </DialogTitle>
          <DialogContent dividers sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              label="Tiêu đề"
              fullWidth
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              sx={{ mb: 1 }}
              placeholder="Nhập tiêu đề ghi chú"
            />
            
            <Box sx={{ flex: 1, minHeight: '300px', display: 'flex', flexDirection: 'column' }}>
              <MuiInputLabel shrink sx={{ mb: 1, color: 'text.primary' }}>
                Nội dung
              </MuiInputLabel>
              
              {/* 2. CHỖ NÀY ĐÃ ĐƯỢC THAY BẰNG EDITOR XỊN */}
              <RichTextEditor 
                  content={formData.content}
                  onChange={(html) => setFormData({ ...formData, content: html })}
                  placeholder="Bắt đầu viết gì đó..."
              />
            </Box>
            
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Thư mục</InputLabel>
                <Select
                  value={formData.folderId}
                  label="Thư mục"
                  onChange={(e) => setFormData({ ...formData, folderId: e.target.value })}
                >
                  <MenuItem value=""><em>Không chọn</em></MenuItem>
                  {folders.map(f => (
                    <MenuItem key={f.id} value={f.id}>{f.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth>
                <InputLabel>Thẻ</InputLabel>
                <Select
                  multiple
                  value={formData.tagIds}
                  onChange={(e) => {
                    const { target: { value } } = e;
                    setFormData({ 
                      ...formData, 
                      tagIds: typeof value === 'string' ? value.split(',') : value 
                    });
                  }}
                  input={<OutlinedInput label="Thẻ" />}
                  renderValue={(selectedIds) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selectedIds.map((id) => {
                        const tag = tags.find(t => t.id === id);
                        return tag ? (
                          <Chip
                            key={id}
                            label={tag.name}
                            size="small"
                            sx={{ bgcolor: tag.color, color: '#fff' }}
                          />
                        ) : null;
                      })}
                    </Box>
                  )}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.id}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: tag.color }} />
                        {tag.name}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Hủy</Button>
            <Button 
              variant="contained" 
              onClick={handleSave}
              disabled={!formData.title.trim()}
            >
              {editingNote ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </DialogActions>
        </Dialog>
      )}

      {/* Dialog chia sẻ (Giữ nguyên) */}
      <Dialog 
        open={openShareDialog} 
        onClose={() => setOpenShareDialog(false)} 
        fullWidth 
        maxWidth="sm"
      >
        <DialogTitle>Chia sẻ ghi chú</DialogTitle>
        <DialogContent>
          <Typography variant="subtitle1" sx={{ mb: 2, fontWeight: 'bold' }}>
            {sharingNote?.title}
          </Typography>
          <TextField
            autoFocus margin="dense" label="Email người nhận" fullWidth
            value={shareEmail} onChange={(e) => setShareEmail(e.target.value)}
            sx={{ mb: 2 }}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Quyền truy cập</InputLabel>
            <Select
              value={sharePermission}
              label="Quyền truy cập"
              onChange={(e) => setSharePermission(e.target.value)}
            >
              <MenuItem value="view">Chỉ xem</MenuItem>
              <MenuItem value="edit">Chỉnh sửa</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenShareDialog(false)}>Hủy</Button>
          <Button variant="contained" onClick={handleShare} disabled={!shareEmail.trim()}>Chia sẻ</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}