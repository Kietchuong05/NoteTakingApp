import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, Chip, Alert, CircularProgress } from '@mui/material';
import { Folder as FolderIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { auth } from '../firebase/config';
import { getNotes } from '../services/api';

export default function Folder() {
  const { folderId } = useParams();
  const user = auth.currentUser;
  
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchNotesInFolder = async () => {
      if (user?.uid && folderId) {
        setLoading(true);
        try {
          const data = await getNotes(user.uid, folderId);
          if (Array.isArray(data)) {
            setNotes(data);
          }
        } catch (error) {
          console.error("Lỗi:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchNotesInFolder();
  }, [user, folderId]);

  if (loading) return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, display: 'flex', alignItems: 'center', gap: 1 }}>
        <FolderIcon sx={{ color: '#f59e0b', fontSize: 35 }} /> 
        Danh sách ghi chú
      </Typography>

      {notes.length === 0 ? (
        <Alert severity="info">Thư mục này chưa có ghi chú nào. Hãy tạo ghi chú mới và chọn thư mục này nhé!</Alert>
      ) : (
        <Grid container spacing={3}>
          {notes.map((note) => (
            <Grid item xs={12} sm={6} md={4} key={note.id}>
              <Card sx={{ height: '100%', borderRadius: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>{note.title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, minHeight: '40px' }}>
                    {note.content || "Không có nội dung"}
                  </Typography>

                  {/* Hiển thị Tags */}
                  <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 2 }}>
                    {note.tags && note.tags.map(tag => (
                      <Chip key={tag.id} label={tag.name} size="small" sx={{ bgcolor: tag.color, color: '#fff', fontSize: '10px' }} />
                    ))}
                  </Box>

                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2, pt: 1, borderTop: '1px solid #eee' }}>
                     {note.created_at ? format(new Date(note.created_at), 'dd/MM/yyyy') : 'Mới tạo'}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}