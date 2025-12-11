import { useState, useEffect } from 'react';
import { mockNotes } from '../services/mockData';

export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setNotes(mockNotes);
      setLoading(false);
    }, 500);
  }, []);

  const addNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: Date.now(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes([...notes, newNote]);
    return newNote;
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
    ));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const toggleStarNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, starred: !note.starred } : note
    ));
  };

  const toggleShareNote = (id) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, shared: !note.shared } : note
    ));
  };

  const searchNotes = (query) => {
    if (!query.trim()) return notes;
    return notes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase()) ||
      note.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const getNotesByFolder = (folderId) => {
    return notes.filter(note => note.folderId === folderId);
  };

  const getStarredNotes = () => {
    return notes.filter(note => note.starred);
  };

  return {
    notes,
    loading,
    addNote,
    updateNote,
    deleteNote,
    toggleStarNote,
    toggleShareNote,
    searchNotes,
    getNotesByFolder,
    getStarredNotes
  };
}