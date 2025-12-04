import React, { useState, useEffect } from 'react';
import NotebookList from '../notebook/NotebookList';
import NotebookCreate from '../notebook/NotebookCreate';
import NotebookWorkspace from '../notebook/NotebookWorkspace';
import { Notebook } from '../../types/notebook.types';
import { fetchNotebooks, deleteNotebook, updateNotebook  } from '../../services/notebookapi';
import { NOTEBOOK_ERROR_MESSAGES } from '../../constants/notebook.contants';

type ViewState = 'list' | 'create' | 'workspace' | 'editSources';

const NotebookScreen: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNotebooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNotebooks();
      setNotebooks(data);
    } catch (err) {
      console.error(err);
      setError(NOTEBOOK_ERROR_MESSAGES.loadFailed);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      loadNotebooks();
    }
  }, [view]);

  const handleOpenCreate = () => {
    setView('create');
  };

  const handleNotebookCreated = (newNotebook: Notebook) => {
    setNotebooks(prev => [newNotebook, ...prev]);
    setSelectedNotebook(newNotebook);
    setView('workspace');
  };

  const handleOpenNotebook = (notebook: Notebook) => {
    setSelectedNotebook(notebook);
    setView('workspace');
  };

  const handleBackToList = () => {
    setSelectedNotebook(null);
    setView('list');
  };

  const handleCancelCreate = () => {
    setView('list');
  };

  const handleEditSources = () => {
    setView('editSources');
  };

  const handleSourcesSaved = () => {
    setView('workspace');
  };

  const handleDeleteNotebook = async (id: string) => {
    try {
      await deleteNotebook(id);
      setNotebooks(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to delete", err);
      // In a real app show a toast
      alert("Failed to delete notebook");
    }
  };

  const handleUpdateNotebook = async (updated: Notebook) => {
    try {
      const result = await updateNotebook(updated.id, { 
        title: updated.title, 
        description: updated.description 
      });
      // Update local state
      setNotebooks(prev => prev.map(n => n.id === result.id ? result : n));
    } catch (err) {
      console.error("Failed to update", err);
      alert("Failed to update notebook");
    }
  };

  return (
    <div className="w-full h-full bg-gray-50">
      {view === 'list' && (
        <NotebookList
          notebooks={notebooks}
          loading={loading}
          error={error}
          onCreate={handleOpenCreate}
          onOpenNotebook={handleOpenNotebook}
          onDelete={handleDeleteNotebook}
          onUpdate={handleUpdateNotebook}
        />
      )}
      
      {view === 'create' && (
        <NotebookCreate
          onCreated={handleNotebookCreated}
          onCancel={handleCancelCreate}
        />
      )}

      {view === 'editSources' && selectedNotebook && (
        <NotebookCreate
          existingNotebook={selectedNotebook}
          onCreated={() => {}} // Not used in edit mode
          onSaved={handleSourcesSaved}
          onCancel={() => setView('workspace')}
        />
      )}

      {view === 'workspace' && selectedNotebook && (
        <NotebookWorkspace
          notebook={selectedNotebook}
          onBackToNotebooks={handleBackToList}
          onAddSources={handleEditSources}
        />
      )}
    </div>
  );
};

export default NotebookScreen;