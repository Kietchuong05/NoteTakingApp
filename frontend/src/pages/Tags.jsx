// Tags.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  IconButton,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Tooltip,
  CircularProgress,
  Alert,
  InputAdornment,
  Avatar,
  Badge,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Label as LabelIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Note as NoteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AccessTime as AccessTimeIcon,
  ColorLens as ColorLensIcon,
  Sort as SortIcon
} from '@mui/icons-material';
import { useTags } from '../hooks/useTags';
import { useNotes } from '../hooks/useNotes';
import { format } from 'date-fns';

export default function Tags() {
  const { tags, loading, addTag, updateTag, deleteTag, toggleStarTag } = useTags();
  const { notes } = useNotes();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingTag, setEditingTag] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('count'); // 'count', 'name', 'date'
  const [newTag, setNewTag] = useState({
    name: '',
    color: '#3b82f6',
    description: ''
  });

  const colors = [
    '#3b82f6', // blue
    '#10b981', // green
    '#f59e0b', // orange
    '#8b5cf6', // purple
    '#ef4444', // red
    '#06b6d4', // cyan
    '#ec4899', // pink
    '#84cc16', // lime
    '#f97316', // orange-500
    '#6366f1', // indigo
  ];

  const getNotesWithTag = (tagName) => {
    return notes.filter(note => 
      note.tags?.some(tag => tag.toLowerCase() === tagName.toLowerCase())
    );
  };

  const handleOpenDialog = (tag = null) => {
    if (tag) {
      setEditingTag(tag);
      setNewTag({
        name: tag.name,
        color: tag.color,
        description: tag.description || ''
      });
    } else {
      setEditingTag(null);
      setNewTag({
        name: '',
        color: '#3b82f6',
        description: ''
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingTag(null);
    setNewTag({ name: '', color: '#3b82f6', description: '' });
  };

  const handleSubmit = () => {
    if (!newTag.name.trim()) return;

    if (editingTag) {
      updateTag(editingTag.id, newTag);
    } else {
      addTag(newTag);
    }
    handleCloseDialog();
  };

  const handleDelete = (id, tagName) => {
    const notesWithTag = getNotesWithTag(tagName);
    if (notesWithTag.length > 0) {
      if (window.confirm(`Thẻ này đang được sử dụng trong ${notesWithTag.length} ghi chú. Bạn vẫn muốn xóa?`)) {
        deleteTag(id);
      }
    } else {
      if (window.confirm('Bạn có chắc chắn muốn xóa thẻ này?')) {
        deleteTag(id);
      }
    }
  };

  const filteredTags = tags.filter(tag =>
    tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sắp xếp tags
  const sortedTags = [...filteredTags].sort((a, b) => {
    const notesA = getNotesWithTag(a.name).length;
    const notesB = getNotesWithTag(b.name).length;
    
    switch (sortBy) {
      case 'count':
        return notesB - notesA; // Giảm dần
      case 'name':
        return a.name.localeCompare(b.name);
      case 'starred':
        return (b.starred ? 1 : 0) - (a.starred ? 1 : 0);
      default:
        return 0;
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
  ) : null;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
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

      {/* Search and Sort Bar */}
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
          sx={{
            backgroundColor: 'white',
            borderRadius: 2,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            }
          }}
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

      {/* Thống kê nhanh */}
      {mostUsedTag && (
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

      {/* Tags Grid */}
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
                  borderTop: `4px solid ${tag.color}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar
                        sx={{
                          backgroundColor: `${tag.color}20`,
                          color: tag.color,
                          width: 48,
                          height: 48
                        }}
                      >
                        <LabelIcon />
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                          {tag.name}
                        </Typography>
                        <Badge
                          badgeContent={notesWithTag.length}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: tag.color,
                              fontSize: '0.7rem',
                              height: 20,
                              minWidth: 20
                            }
                          }}
                        >
                          <Typography variant="caption" color="#64748b">
                            ghi chú
                          </Typography>
                        </Badge>
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => toggleStarTag(tag.id)}
                      size="small"
                      sx={{ color: tag.starred ? '#f59e0b' : '#cbd5e1' }}
                    >
                      {tag.starred ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Box>

                  {tag.description && (
                    <Typography
                      variant="body2"
                      color="#64748b"
                      sx={{
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {tag.description}
                    </Typography>
                  )}

                  {/* Hiển thị 2 note gần đây với tag này */}
                  {notesWithTag.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="caption" color="#64748b" sx={{ display: 'block', mb: 1 }}>
                        Ghi chú gần đây:
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        {notesWithTag.slice(0, 2).map((note) => (
                          <Box
                            key={note.id}
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: 1,
                              p: 1,
                              borderRadius: 1,
                              backgroundColor: '#f8fafc',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: '#f1f5f9'
                              }
                            }}
                          >
                            <NoteIcon sx={{ fontSize: 16, color: tag.color }} />
                            <Typography variant="caption" sx={{ flex: 1 }}>
                              {note.title}
                            </Typography>
                          </Box>
                        ))}
                        {notesWithTag.length > 2 && (
                          <Typography variant="caption" color="#64748b" sx={{ textAlign: 'center' }}>
                            +{notesWithTag.length - 2} ghi chú khác
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto', pt: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <ColorLensIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                      <Box
                        sx={{
                          width: 16,
                          height: 16,
                          borderRadius: '50%',
                          backgroundColor: tag.color,
                          border: '1px solid #e2e8f0'
                        }}
                      />
                    </Box>
                    {tag.createdAt && (
                      <Typography variant="caption" color="#94a3b8">
                        {format(new Date(tag.createdAt), 'dd/MM/yyyy')}
                      </Typography>
                    )}
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0, borderTop: '1px solid #e2e8f0' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          onClick={() => handleOpenDialog(tag)}
                          size="small"
                          sx={{ color: '#64748b' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          onClick={() => handleDelete(tag.id, tag.name)}
                          size="small"
                          sx={{ color: '#ef4444' }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                    <Button
                      size="small"
                      variant="outlined"
                      sx={{
                        fontSize: '0.75rem',
                        textTransform: 'none',
                        borderColor: tag.color,
                        color: tag.color,
                        '&:hover': {
                          backgroundColor: `${tag.color}10`,
                          borderColor: tag.color
                        }
                      }}
                    >
                      Xem tất cả ({notesWithTag.length})
                    </Button>
                  </Box>
                </Box>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Add/Edit Tag Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTag ? 'Chỉnh sửa thẻ' : 'Thẻ mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tên thẻ"
            fullWidth
            value={newTag.name}
            onChange={(e) => setNewTag({ ...newTag, name: e.target.value })}
            sx={{ mb: 3 }}
            helperText="Tên thẻ nên ngắn gọn và dễ nhớ"
          />
          
          <TextField
            margin="dense"
            label="Mô tả"
            fullWidth
            multiline
            rows={2}
            value={newTag.description}
            onChange={(e) => setNewTag({ ...newTag, description: e.target.value })}
            sx={{ mb: 3 }}
            helperText="Mô tả ngắn về mục đích sử dụng của thẻ"
          />
          
          <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b' }}>
            Chọn màu:
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
            {colors.map((color) => (
              <Tooltip key={color} title={color} arrow>
                <Box
                  onClick={() => setNewTag({ ...newTag, color })}
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    backgroundColor: color,
                    cursor: 'pointer',
                    border: newTag.color === color ? '3px solid #1e293b' : '2px solid transparent',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.1)'
                    }
                  }}
                />
              </Tooltip>
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newTag.name.trim()}
            sx={{
              backgroundColor: newTag.color,
              '&:hover': {
                backgroundColor: newTag.color,
                opacity: 0.9
              }
            }}
          >
            {editingTag ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}