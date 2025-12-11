import { useState, useEffect } from 'react';
import { mockFolders } from '../services/mockData';

export function useFolders() {
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setFolders(mockFolders);
      setLoading(false);
    }, 500);
  }, []);

  const addFolder = (folderData) => {
    const newFolder = {
      ...folderData,
      id: Date.now(),
      createdAt: new Date(),
      noteCount: 0
    };
    setFolders([...folders, newFolder]);
    return newFolder;
  };

  const updateFolder = (id, updates) => {
    setFolders(folders.map(folder => 
      folder.id === id ? { ...folder, ...updates } : folder
    ));
  };

  const deleteFolder = (id) => {
    setFolders(folders.filter(folder => folder.id !== id));
  };

  const toggleStarFolder = (id) => {
    setFolders(folders.map(folder => 
      folder.id === id ? { ...folder, starred: !folder.starred } : folder
    ));
  };

  const toggleShareFolder = (id) => {
    setFolders(folders.map(folder => 
      folder.id === id ? { ...folder, shared: !folder.shared } : folder
    ));
  };

  return {
    folders,
    loading,
    addFolder,
    updateFolder,
    deleteFolder,
    toggleStarFolder,
    toggleShareFolder
  };
}