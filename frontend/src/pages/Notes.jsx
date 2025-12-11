// Notes.jsx
import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardActions,
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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Badge
} from '@mui/material';
import {
  Note as NoteIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  Share as ShareIcon,
  ShareOutlined as ShareOutlinedIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Folder as FolderIcon,
  Label as LabelIcon,
  AccessTime as AccessTimeIcon,
  Visibility as VisibilityIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { useNotes } from '../hooks/useNotes';
import { useFolders } from '../hooks/useFolders';
import { format } from 'date-fns';

export default function Notes() {
  const { notes, loading, addNote, updateNote, deleteNote, toggleStarNote, toggleShareNote, searchNotes } = useNotes();
  const { folders } = useFolders();
  const [openDialog, setOpenDialog] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    folderId: '',
    tags: []
  });

  const filteredNotes = searchQuery ? searchNotes(searchQuery) : notes;
  
  // Lọc theo thư mục
  const notesByFolder = selectedFolder === 'all' 
    ? filteredNotes 
    : filteredNotes.filter(note => note.folderId === parseInt(selectedFolder));

  // Lấy tên thư mục
  const getFolderName = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.name : 'Không có thư mục';
  };

  // Lấy màu thư mục
  const getFolderColor = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    return folder ? folder.color : '#64748b';
  };

  const handleOpenDialog = (note = null) => {
    if (note) {
      setEditingNote(note);
      setNewNote({
        title: note.title,
        content: note.content,
        folderId: note.folderId || '',
        tags: note.tags || []
      });
    } else {
      setEditingNote(null);
      setNewNote({
        title: '',
        content: '',
        folderId: folders.length > 0 ? folders[0].id : '',
        tags: []
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingNote(null);
    setNewNote({ title: '', content: '', folderId: '', tags: [] });
  };

  const handleSubmit = () => {
    if (!newNote.title.trim()) return;

    if (editingNote) {
      updateNote(editingNote.id, newNote);
    } else {
      addNote(newNote);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa ghi chú này?')) {
      deleteNote(id);
    }
  };

  const handleAddTag = (tag) => {
    if (tag.trim() && !newNote.tags.includes(tag.trim())) {
      setNewNote({ ...newNote, tags: [...newNote.tags, tag.trim()] });
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setNewNote({
      ...newNote,
      tags: newNote.tags.filter(tag => tag !== tagToRemove)
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // Thống kê
  const totalNotes = notes.length;
  const starredNotes = notes.filter(note => note.starred).length;
  const sharedNotes = notes.filter(note => note.shared).length;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
            Ghi chú
          </Typography>
          <Typography variant="body2" color="#64748b">
            Tổng số: {totalNotes} • Gắn sao: {starredNotes} • Chia sẻ: {sharedNotes}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant={viewMode === 'grid' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('grid')}
            size="small"
          >
            Lưới
          </Button>
          <Button
            variant={viewMode === 'list' ? 'contained' : 'outlined'}
            onClick={() => setViewMode('list')}
            size="small"
          >
            Danh sách
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              backgroundColor: '#3b82f6',
              '&:hover': { backgroundColor: '#2563eb' }
            }}
          >
            Ghi chú mới
          </Button>
        </Box>
      </Box>

      {/* Search and Filter Bar */}
      <Box sx={{ display: 'flex', gap: 2, mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Tìm kiếm ghi chú..."
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
        
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>Lọc theo thư mục</InputLabel>
          <Select
            value={selectedFolder}
            onChange={(e) => setSelectedFolder(e.target.value)}
            label="Lọc theo thư mục"
            sx={{ borderRadius: 2 }}
          >
            <MenuItem value="all">Tất cả thư mục</MenuItem>
            {folders.map((folder) => (
              <MenuItem key={folder.id} value={folder.id}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: folder.color }} />
                  {folder.name} ({folder.noteCount})
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {notesByFolder.length === 0 ? (
        <Alert severity="info" sx={{ borderRadius: 2, mb: 3 }}>
          {searchQuery || selectedFolder !== 'all' 
            ? 'Không tìm thấy ghi chú phù hợp' 
            : 'Chưa có ghi chú nào. Hãy tạo ghi chú đầu tiên!'}
        </Alert>
      ) : null}

      {/* Notes Grid/List View */}
      {viewMode === 'grid' ? (
        <Grid container spacing={3}>
          {notesByFolder.map((note) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={note.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 3,
                  borderTop: `4px solid ${getFolderColor(note.folderId)}`,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  }
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Chip
                        label={getFolderName(note.folderId)}
                        size="small"
                        sx={{
                          backgroundColor: `${getFolderColor(note.folderId)}20`,
                          color: getFolderColor(note.folderId),
                          fontSize: '0.7rem',
                          height: 24
                        }}
                      />
                      {note.shared && (
                        <Chip
                          label="Chia sẻ"
                          size="small"
                          icon={<ShareIcon sx={{ fontSize: 14 }} />}
                          sx={{
                            backgroundColor: '#dbeafe',
                            color: '#1d4ed8',
                            fontSize: '0.7rem',
                            height: 24
                          }}
                        />
                      )}
                    </Box>
                    <IconButton
                      onClick={() => toggleStarNote(note.id)}
                      size="small"
                      sx={{ color: note.starred ? '#f59e0b' : '#cbd5e1' }}
                    >
                      {note.starred ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                  </Box>

                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#1e293b', mb: 1 }}>
                    {note.title}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="#64748b"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}
                  >
                    {note.content.replace(/#/g, '').substring(0, 150)}...
                  </Typography>

                  {note.tags && note.tags.length > 0 && (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                      {note.tags.slice(0, 3).map((tag, index) => (
                        <Chip
                          key={index}
                          label={tag}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 20,
                            backgroundColor: '#f1f5f9',
                            color: '#64748b'
                          }}
                        />
                      ))}
                      {note.tags.length > 3 && (
                        <Chip
                          label={`+${note.tags.length - 3}`}
                          size="small"
                          sx={{
                            fontSize: '0.65rem',
                            height: 20,
                            backgroundColor: '#f1f5f9',
                            color: '#64748b'
                          }}
                        />
                      )}
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 'auto' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AccessTimeIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                      <Typography variant="caption" color="#94a3b8">
                        {format(new Date(note.updatedAt), 'dd/MM/yyyy')}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <VisibilityIcon sx={{ fontSize: 14, color: '#94a3b8' }} />
                      <Typography variant="caption" color="#94a3b8">
                        {Math.ceil(note.content.length / 1000)}k
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                <CardActions sx={{ p: 2, pt: 0, borderTop: '1px solid #e2e8f0' }}>
                  <Tooltip title={note.shared ? "Đã chia sẻ" : "Chia sẻ"}>
                    <IconButton
                      onClick={() => toggleShareNote(note.id)}
                      size="small"
                      sx={{ color: note.shared ? '#3b82f6' : '#64748b' }}
                    >
                      {note.shared ? <ShareIcon /> : <ShareOutlinedIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Chỉnh sửa">
                    <IconButton
                      onClick={() => handleOpenDialog(note)}
                      size="small"
                      sx={{ color: '#64748b' }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Xóa">
                    <IconButton
                      onClick={() => handleDelete(note.id)}
                      size="small"
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        // List View
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {notesByFolder.map((note) => (
            <Card
              key={note.id}
              sx={{
                borderRadius: 2,
                borderLeft: `4px solid ${getFolderColor(note.folderId)}`,
                '&:hover': {
                  backgroundColor: '#f8fafc'
                }
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#1e293b' }}>
                        {note.title}
                      </Typography>
                      {note.starred && (
                        <StarIcon sx={{ fontSize: 16, color: '#f59e0b' }} />
                      )}
                      {note.shared && (
                        <ShareIcon sx={{ fontSize: 16, color: '#3b82f6' }} />
                      )}
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                      <Chip
                        label={getFolderName(note.folderId)}
                        size="small"
                        sx={{
                          backgroundColor: `${getFolderColor(note.folderId)}20`,
                          color: getFolderColor(note.folderId),
                          fontSize: '0.7rem',
                          height: 20
                        }}
                      />
                      
                      <Typography
                        variant="body2"
                        color="#64748b"
                        sx={{
                          flex: 1,
                          display: '-webkit-box',
                          WebkitLineClamp: 1,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {note.content.replace(/#/g, '').substring(0, 100)}...
                      </Typography>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      {note.tags && note.tags.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 0.5 }}>
                          {note.tags.slice(0, 2).map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              sx={{
                                fontSize: '0.65rem',
                                height: 20,
                                backgroundColor: '#f1f5f9',
                                color: '#64748b'
                              }}
                            />
                          ))}
                        </Box>
                      )}
                      
                      <Typography variant="caption" color="#94a3b8">
                        {format(new Date(note.updatedAt), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    </Box>
                  </Box>
                  
                  <Box>
                    <IconButton
                      onClick={() => toggleStarNote(note.id)}
                      size="small"
                      sx={{ color: note.starred ? '#f59e0b' : '#cbd5e1' }}
                    >
                      {note.starred ? <StarIcon /> : <StarBorderIcon />}
                    </IconButton>
                    <IconButton
                      onClick={() => handleOpenDialog(note)}
                      size="small"
                      sx={{ color: '#64748b' }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => handleDelete(note.id)}
                      size="small"
                      sx={{ color: '#ef4444' }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}

      {/* Add/Edit Note Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingNote ? 'Chỉnh sửa ghi chú' : 'Ghi chú mới'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tiêu đề"
            fullWidth
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            sx={{ mb: 3 }}
          />
          
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Thư mục</InputLabel>
            <Select
              value={newNote.folderId}
              onChange={(e) => setNewNote({ ...newNote, folderId: e.target.value })}
              label="Thư mục"
            >
              {folders.map((folder) => (
                <MenuItem key={folder.id} value={folder.id}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: folder.color }} />
                    {folder.name}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Nội dung"
            fullWidth
            multiline
            rows={10}
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            sx={{ mb: 3 }}
            placeholder="Nhập nội dung ghi chú của bạn..."
          />

          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, color: '#64748b' }}>
              Thẻ
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
              {newNote.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag}
                  onDelete={() => handleRemoveTag(tag)}
                  size="small"
                />
              ))}
            </Box>
            <TextField
              size="small"
              placeholder="Nhập thẻ và nhấn Enter..."
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleAddTag(e.target.value);
                  e.target.value = '';
                }
              }}
              sx={{ width: 200 }}
            />
            <Typography variant="caption" color="#64748b" sx={{ ml: 2 }}>
              Nhấn Enter để thêm thẻ
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Hủy</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!newNote.title.trim()}
          >
            {editingNote ? 'Cập nhật' : 'Lưu'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}