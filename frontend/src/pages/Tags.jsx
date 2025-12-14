// Tags.jsx
import React, { useState, useEffect } from 'react';
import {
  Box, Grid, Card, CardContent, Typography, IconButton, Button,
  TextField, Dialog, DialogTitle, DialogContent, DialogActions,
  Chip, Tooltip, CircularProgress, Alert, InputAdornment,
  Avatar, Badge, MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import {
  Label as LabelIcon, Edit as EditIcon, Delete as DeleteIcon,
  Add as AddIcon, Search as SearchIcon, 
  Star as StarIcon, StarBorder as StarBorderIcon,
  Sort as SortIcon
} from '@mui/icons-material'; 

import { auth } from '../firebase/config';

import { getTags, createTag, deleteTag, updateTag } from '../services/api';

export default function Tags() {

  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const user = auth.currentUser;

  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('count');
  
  const [newTag, setNewTag] = useState({
    name: '',
    color: '#3b82f6',
    description: ''
  });

  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444',
    '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#6366f1',
  ];

  useEffect(() => {
    const fetchTags = async () => {
      if (user?.uid) {
        setLoading(true);
        try {
          const data = await getTags(user.uid);
          if (Array.isArray(data)) {
            setTags(data);
          }
        } catch (error) {
          console.error("Lỗi tải tags:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchTags();
  }, [user]);

  const getNotesWithTag = (tagName) => {
    if (!notes) return [];
    // Fix nhẹ để tìm chính xác hơn
    return notes.filter(note => 
      note.tags?.some(tag => {
          const tName = typeof tag === 'object' ? tag.name : tag;
          return tName.toLowerCase() === tagName.toLowerCase();
      })
    );
  };

  const handleOpenDialog = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setNewTag({
        name: tag.name,
        color: tag.color || '#3b82f6',
        description: tag.description || ''
      });
    } else {
      setEditingTag(null);
      setNewTag({ name: '', color: '#3b82f6', description: '' });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTag(null);
    setNewTag({ name: '', color: '#3b82f6', description: '' });
  };

  // --- PHẦN SỬA LOGIC CHÍNH Ở ĐÂY ---
  const handleSubmit = async () => {
    if (!newTag.name.trim()) return;
    if (!user?.uid) return alert("Vui lòng đăng nhập!");

    try {
        if (editingTag) {
            // LOGIC SỬA (UPDATE)
            const updated = await updateTag(editingTag.id, newTag.name, newTag.color, user.uid);
            if (updated) {
                // Cập nhật lại danh sách ngay lập tức
                setTags(tags.map(t => t.id === editingTag.id ? updated : t));
                handleCloseDialog();
            } else {
                alert("Lỗi khi cập nhật thẻ!");
            }
        } else {
            // LOGIC TẠO MỚI (CREATE)
            const createdTag = await createTag(newTag.name, newTag.color, user.uid);
            if (createdTag) {
                setTags([...tags, createdTag]);
                handleCloseDialog();
            }
        }
    } catch (error) {
        console.error(error);
        alert("Lỗi kết nối!");
    }
  };

  // --- PHẦN SỬA LOGIC XÓA Ở ĐÂY ---
  const handleDelete = async (tagId) => {
    if (confirm("Bạn có chắc muốn xóa thẻ này không?")) {
        const success = await deleteTag(tagId);
        if (success) {
            setTags(tags.filter(t => t.id !== tagId)); 
        } else {
            alert("Lỗi rồi, không xóa được!");
        }
    }
  }

  const toggleStarTag = (id) => {
      console.log("Toggle star:", id);
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedTags = [...filteredTags].sort((a, b) => {
    const notesA = getNotesWithTag(a.name).length;
    const notesB = getNotesWithTag(b.name).length;
    
    switch (sortBy) {
      case 'count': return notesB - notesA;
      case 'name': return a.name.localeCompare(b.name);
      case 'starred': return (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
      default: return 0;
    }
  });

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const totalNotesWithTags = notes.filter(note => note.tags && note.tags.length > 0).length;
  const mostUsedTag = tags.length > 0 ? tags.reduce((prev, current) => 
    getNotesWithTag(prev.name).length > getNotesWithTag(current.name).length ? prev : current
  , tags[0]) : null;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
            Thẻ
          </Typography>
          <Typography variant="body2" color="#64748b">
            Tổng: {tags.length} thẻ • {totalNotesWithTags} ghi chú được gắn thẻ
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: '#3b82f6',
            '&:hover': { backgroundColor: '#2563eb' }
          }}
        >
          Thẻ mới
        </Button>
      </Box>

      {/* Toolbar giữ nguyên */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm thẻ..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: '#94a3b8' }} />
              </InputAdornment>
            ),
          }}
          sx={{ backgroundColor: 'white', borderRadius: 2 }}
        />
        
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Sắp xếp</InputLabel>
          <Select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            label="Sắp xếp"
            startAdornment={<SortIcon sx={{ color: '#64748b', mr: 1 }} />}
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="count">Số lượng ghi chú</MenuItem>
            <MenuItem value="name">Tên A-Z</MenuItem>
            <MenuItem value="starred">Gắn sao</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {mostUsedTag && tags.length > 0 && (
        <Card sx={{ mb: 3, backgroundColor: '#f8fafc', borderRadius: 2 }}>
          <CardContent sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LabelIcon sx={{ color: mostUsedTag.color }} />
                <Typography variant="body2" color="#64748b">
                  Thẻ được sử dụng nhiều nhất:
                </Typography>
              </Box>
              <Chip
                label={mostUsedTag.name}
                size="small"
                sx={{
                  backgroundColor: `${mostUsedTag.color}20`,
                  color: mostUsedTag.color,
                  fontWeight: 'bold'
                }}
              />
              <Typography variant="body2" color="#64748b">
                ({getNotesWithTag(mostUsedTag.name).length} ghi chú)
              </Typography>
            </Box>
          </CardContent>
        </Card>
      )}

      {sortedTags.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
          {searchQuery ? 'Không tìm thấy thẻ phù hợp' : 'Chưa có thẻ nào. Hãy tạo thẻ đầu tiên!'}
        </Alert>
      ) : null}

      <Grid container spacing={3}>
        {sortedTags.map((tag) => {
          const notesWithTag = getNotesWithTag(tag.name);
          
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={tag.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  borderTop: `4px solid ${tag.color || '#ccc'}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s',
                  '&:hover': { transform: 'translateY(-4px)' }
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: `${tag.color}20`, color: tag.color, width: 48, height: 48 }}>
                        <LabelIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                          {tag.name}
                        </Typography>
                        <Badge badgeContent={notesWithTag.length} color="primary"
                          sx={{ '& .MuiBadge-badge': { backgroundColor: tag.color } }}>
                          <Typography variant="caption" color="#64748b">ghi chú</Typography>
                        </Badge>
                      </Box>
                    </Box>
                    <IconButton size="small" onClick={() => toggleStarTag(tag.id)}>
                      {tag.starred ? <StarIcon sx={{color: '#f59e0b'}}/> : <StarBorderIcon />}
                    </IconButton>
                  </Box>

                  {tag.description && (
                    <Typography variant="body2" color="#64748b" sx={{ mb: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {tag.description}
                    </Typography>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    </Box>
                    {/* GIỮ NGUYÊN GIAO DIỆN CŨ CỦA EM Ở ĐÂY, CHỈ GẮN HÀM VÀO THÔI */}
                    <Box sx={{ display: 'flex' }}>
                       <Tooltip title="Sửa">
                           <IconButton onClick={() => handleOpenDialog(tag)} size="small" sx={{ color: '#64748b' }}><EditIcon /></IconButton>
                       </Tooltip>
                       <Tooltip title="Xóa">
                           <IconButton onClick={() => handleDelete(tag.id)} size="small" sx={{ color: '#ef4444' }}><DeleteIcon /></IconButton>
                       </Tooltip>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTag ? 'Chỉnh sửa thẻ' : 'Thẻ mới'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus margin="dense" label="Tên thẻ" fullWidth
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            sx={{ mb: 3 }} helperText="Tên thẻ nên ngắn gọn và dễ nhớ"
          />
          
          <TextField
            margin="dense" label="Mô tả" fullWidth multiline rows={2}
            value={newTag.description}
            onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
            sx={{ mb: 3 }} helperText="Mô tả ngắn về mục đích sử dụng của thẻ"
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b' }}>Chọn màu:</Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {colors.map((color) => (
              <Tooltip key={color} title={color} arrow>
                <Box
                  onClick={() => setNewTag({ ...newTag, color })}
                  sx={{
                    width: 36, height: 36, borderRadius: '50%', backgroundColor: color, cursor: 'pointer',
                    border: newTag.color === color ? '3px solid #1e293b' : '2px solid transparent',
                    transition: 'transform 0.2s', '&:hover': { transform: 'scale(1.1)' }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button onClick={handleSubmit} variant="contained" disabled={!newTag.name.trim()}
            sx={{ backgroundColor: newTag.color, '&:hover': { backgroundColor: newTag.color, opacity: 0.9 } }}>
            {editingTag ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}