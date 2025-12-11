import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export function AppProvider({ children }) {
  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tags, setTags] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [currentNote, setCurrentNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Folder functions
  const addFolder = (folder) => {
    setFolders([...folders, { ...folder, id: Date.now() }]);
  };

  const updateFolder = (id, updates) => {
    setFolders(folders.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFolder = (id) => {
    setFolders(folders.filter(f => f.id !== id));
    // Also delete notes in this folder
    setNotes(notes.filter(n => n.folderId !== id));
  };

  // Note functions
  const addNote = (note) => {
    setNotes([...notes, { ...note, id: Date.now(), createdAt: new Date() }]);
  };

  const updateNote = (id, updates) => {
    setNotes(notes.map(n => n.id === id ? { ...n, ...updates, updatedAt: new Date() } : n));
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(n => n.id !== id));
  };

  // Tag functions
  const addTag = (tag) => {
    setTags([...tags, { ...tag, id: Date.now() }]);
  };

  const updateTag = (id, updates) => {
    setTags(tags.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTag = (id) => {
    setTags(tags.filter(t => t.id !== id));
  };

  // Filter functions
  const getNotesByFolder = (folderId) => {
    return notes.filter(note => note.folderId === folderId);
  };

  const getStarredNotes = () => {
    return notes.filter(note => note.starred);
  };

  const getSharedNotes = () => {
    return notes.filter(note => note.shared);
  };

  const searchNotes = (query) => {
    if (!query) return notes;
    return notes.filter(note => 
      note.title.toLowerCase().includes(query.toLowerCase()) ||
      note.content.toLowerCase().includes(query.toLowerCase())
    );
  };

  const value = {
    folders,
    notes,
    tags,
    currentFolder,
    currentNote,
    loading,
    searchQuery,
    setSearchQuery,
    setCurrentFolder,
    setCurrentNote,
    addFolder,
    updateFolder,
    deleteFolder,
    addNote,
    updateNote,
    deleteNote,
    addTag,
    updateTag,
    deleteTag,
    getNotesByFolder,
    getStarredNotes,
    getSharedNotes,
    searchNotes
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}