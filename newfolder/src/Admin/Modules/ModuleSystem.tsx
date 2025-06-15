import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Plus } from 'lucide-react';
import { ModulesList } from './ModulesList';
import { AddModuleModal } from './modal/AddModuleModal';
import { EditModuleModal } from './modal/EditModuleModal';
import { Module, Video } from './types/moduleTypes';
import { AddVideoModal } from './modal/AddVideoModal';
import { EditVideoModal } from './modal/EditVideoModal';

const ModuleManager: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();

  // State declarations
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState<boolean>(false);
  const [isAddVideoModalOpen, setIsAddVideoModalOpen] = useState<boolean>(false);
  const [isEditModuleModalOpen, setIsEditModuleModalOpen] = useState<boolean>(false);
  const [isEditVideoModalOpen, setIsEditVideoModalOpen] = useState<boolean>(false);
  
  // Selection states
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);
  const [expandedModule, setExpandedModule] = useState<string | null>(null);
  const [editingModule, setEditingModule] = useState<Module | null>(null);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Load token and API URL
  const token = localStorage.getItem('token');
  const API_URL = 'http://localhost:5000/api';

  // Fetch modules by course ID
  const fetchModules = async () => {
    try {
      const res = await axios.get(`${API_URL}/modules/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = Array.isArray(res.data) ? res.data : res.data.modules || [];
      setModules