// hooks/useTags.js
import { useState, useEffect } from 'react';
import { mockTags } from '../services/mockData';

export function useTags() {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setTags(mockTags);
      setLoading(false);
    }, 500);
  }, []);

  const addTag = (tagData) => {
    const newTag = {
      ...tagData,
      id: Date.now(),
      createdAt: new Date(),
      count: 0,
      starred: false
    };
    setTags([...tags, newTag]);
    return newTag;
  };

  const updateTag = (id, updates) => {
    setTags(tags.map(tag => 
      tag.id === id ? { ...tag, ...updates, updatedAt: new Date() } : tag
    ));
  };

  const deleteTag = (id) => {
    setTags(tags.filter(tag => tag.id !== id));
  };

  const toggleStarTag = (id) => {
    setTags(tags.map(tag => 
      tag.id === id ? { ...tag, starred: !tag.starred } : tag
    ));
  };

  const searchTags = (query) => {
    if (!query.trim()) return tags;
    return tags.filter(tag => 
      tag.name.toLowerCase().includes(query.toLowerCase()) ||
      tag.description?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getTagById = (id) => {
    return tags.find(tag => tag.id === id);
  };

  return {
    tags,
    loading,
    addTag,
    updateTag,
    deleteTag,
    toggleStarTag,
    searchTags,
    getTagById
  };
}