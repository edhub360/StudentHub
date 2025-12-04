import React, { useState } from 'react';
import { Notebook } from '../../types/notebook.types';
import { Plus, BookOpen, Clock, Search, MoreVertical, Edit2, Trash2, X } from 'lucide-react';

interface NotebookListProps {
  notebooks: Notebook[];
  loading: boolean;
  error: string | null;
  onCreate: () => void;
  onOpenNotebook: (notebook: Notebook) => void;
  onDelete: (id: string) => void;
  onUpdate: (notebook: Notebook) => void;
}

const NotebookList: React.FC<NotebookListProps> = ({ 
  notebooks, 
  loading, 
  error, 
  onCreate, 
  onOpenNotebook,
  onDelete,
  onUpdate
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  
  // Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [notebookToDelete, setNotebookToDelete] = useState<string | null>(null);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [notebookToEdit, setNotebookToEdit] = useState<Notebook | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const toggleMenu = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setActiveMenuId(prev => prev === id ? null : id);
  };

  // Close menu when clicking outside (handled via backend of cards for simplicity in this demo)
  React.useEffect(() => {
    const closeMenu = () => setActiveMenuId(null);
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const initiateDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotebookToDelete(id);
    setIsDeleteModalOpen(true);
    setActiveMenuId(null);
  };

  const confirmDelete = () => {
    if (notebookToDelete) {
      onDelete(notebookToDelete);
    }
    setIsDeleteModalOpen(false);
    setNotebookToDelete(null);
  };

  const initiateEdit = (e: React.MouseEvent, notebook: Notebook) => {
    e.stopPropagation();
    setNotebookToEdit(notebook);
    setEditTitle(notebook.title);
    setEditDescription(notebook.description || '');
    setIsEditModalOpen(true);
    setActiveMenuId(null);
  };

  const confirmEdit = () => {
    if (notebookToEdit && editTitle.trim()) {
      onUpdate({
        ...notebookToEdit,
        title: editTitle,
        description: editDescription
      });
      setIsEditModalOpen(false);
      setNotebookToEdit(null);
    }
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto relative">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Notebooks</h1>
          <p className="text-gray-500 mt-1">Organize your study materials with AI-powered insights</p>
        </div>
        <button
          onClick={onCreate}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium transition-colors shadow-sm"
        >
          <Plus size={20} />
          Create New Notebook
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative mb-8 max-w-lg">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input
          type="text"
          placeholder="Search notebooks or ask for course recommendations..."
          className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700"
        />
      </div>

      {/* Content State */}
      {loading ? (
        <div className="flex items-center justify-center h-64 text-gray-400">
          <div className="flex flex-col items-center gap-3">
             <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
             <p>Loading notebooks...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          {error}
        </div>
      ) : notebooks.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50/50">
          <BookOpen size={48} className="text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-700">No notebooks yet</h3>
          <p className="text-gray-500 mb-6">Create your first notebook to get started studying.</p>
          <button
            onClick={onCreate}
            className="text-blue-600 font-medium hover:underline"
          >
            Create Notebook now
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {notebooks.map((notebook) => (
            <div
              key={notebook.id}
              onClick={() => onOpenNotebook(notebook)}
              className="group bg-white rounded-xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer flex flex-col justify-between h-[240px] relative"
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg text-blue-600 group-hover:bg-blue-100 transition-colors">
                    <BookOpen size={24} />
                  </div>
                  
                  {/* 3-Dot Menu */}
                  <div className="relative">
                    <button 
                      onClick={(e) => toggleMenu(e, notebook.id)}
                      className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    {activeMenuId === notebook.id && (
                      <div className="absolute right-0 top-8 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-10 animate-in fade-in zoom-in-95 duration-100">
                        <button 
                          onClick={(e) => initiateEdit(e, notebook)}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit2 size={14} />
                          Edit title & description
                        </button>
                        <button 
                          onClick={(e) => initiateDelete(e, notebook.id)}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete notebook
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">
                  {notebook.title}
                </h3>
                <p className="text-gray-500 text-sm line-clamp-3">
                  {notebook.description || "No description provided."}
                </p>
              </div>

              <div className="flex justify-between items-center text-xs text-gray-400 mt-4 pt-4 border-t border-gray-50">
                <div className="flex items-center gap-1">
                  <Clock size={12} />
                  <span>{notebook.lastUpdated || "Just now"}</span>
                </div>
                <span className="text-gray-300 group-hover:text-blue-500 transition-colors">
                  &rarr;
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete notebook?</h3>
            <p className="text-gray-600 mb-6">
              Delete this notebook and its sources? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-gray-900">Edit Notebook</h3>
               <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                 <X size={20} />
               </button>
            </div>
            
            <div className="flex justify-center mb-6">
               <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                  <BookOpen size={32} />
               </div>
            </div>

            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notebook Title *</label>
                <input 
                  type="text" 
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea 
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors font-medium"
              >
                Cancel
              </button>
              <button 
                onClick={confirmEdit}
                disabled={!editTitle.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default NotebookList;