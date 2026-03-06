import React, { useState, useEffect, useCallback } from 'react';
import NotebookList from '../notebook/NotebookList';
import NotebookCreate from '../notebook/NotebookCreate';
import NotebookWorkspace from '../notebook/NotebookWorkspace';
import { Notebook } from '../../types/notebook.types';
import { fetchNotebooks, deleteNotebook, updateNotebook } from '../../services/notebookapi';
import { NOTEBOOK_ERROR_MESSAGES } from '../../constants/notebook.contants';

type ViewState = 'list' | 'create' | 'workspace' | 'editSources';

const NotebookScreen: React.FC = () => {
  const [view, setView] = useState<ViewState>('list');
  const [notebooks, setNotebooks] = useState<Notebook[]>([]);
  const [selectedNotebook, setSelectedNotebook] = useState<Notebook | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // useCallback — stable reference, safe to use in useEffect dependency array
  const loadNotebooks = useCallback(async () => {
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
  }, []);

  useEffect(() => {
    if (view === 'list') {
      loadNotebooks();
    }
  }, [view, loadNotebooks]); // loadNotebooks now safe in deps array

  const handleOpenCreate = () => setView('create');
  const handleCancelCreate = () => setView('list');
  const handleEditSources = () => setView('editSources');
  const handleSourcesSaved = () => setView('workspace');

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

  const handleDeleteNotebook = async (id: string) => {
    try {
      await deleteNotebook(id);
      setNotebooks(prev => prev.filter(n => n.id !== id));
      // If the deleted notebook is currently selected, go back to list
      if (selectedNotebook?.id === id) {
        setSelectedNotebook(null);
        setView('list');
      }
    } catch (err) {
      console.error("Failed to delete", err);
      alert("Failed to delete notebook"); // replace with toast when available
    }
  };

  const handleUpdateNotebook = async (updated: Notebook) => {
    try {
      const result = await updateNotebook(updated.id, {
        title: updated.title,
        description: updated.description,
      });
      setNotebooks(prev => prev.map(n => n.id === result.id ? result : n));
      // Sync selectedNotebook so workspace reflects the updated title/description
      if (selectedNotebook?.id === result.id) {
        setSelectedNotebook(result);
      }
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
          onCreated={() => {}}
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
