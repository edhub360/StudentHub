import React, { useState, useRef } from 'react';
import { Notebook } from '../../types/notebook.types';
import { createNotebook, uploadSourceFile, addSourceUrl } from '../../services/notebookapi';
import { NOTEBOOK_ERROR_MESSAGES } from '../../constants/notebook.contants';
import { Upload, FileText, Youtube, Globe, X, ArrowLeft, AlertCircle } from 'lucide-react';

// Single source of truth for supported formats
const SUPPORTED_EXTENSIONS = new Set(['.pdf', '.docx', '.pptx', '.txt']);
const SUPPORTED_MIME_TYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/plain',
]);
const MAX_FILE_SIZE_MB = 20;
const ACCEPT_STRING = '.pdf,.docx,.pptx,.txt';

interface FileWithError {
  file: File;
  error?: string; // if set, file is invalid
}

interface NotebookCreateProps {
  onCreated: (notebook: Notebook) => void;
  onSaved?: () => void;
  onCancel: () => void;
  existingNotebook?: Notebook;
}

const getExtension = (filename: string): string =>
  filename.slice(filename.lastIndexOf('.')).toLowerCase();

const validateFile = (file: File): string | null => {
  const ext = getExtension(file.name);
  if (!SUPPORTED_EXTENSIONS.has(ext)) {
    return `Unsupported format "${ext}". Only PDF, DOCX, PPTX, TXT are allowed.`;
  }
  if (!SUPPORTED_MIME_TYPES.has(file.type)) {
    return `Invalid file type for "${file.name}". File may be corrupted or misnamed.`;
  }
  if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
    return `"${file.name}" exceeds the ${MAX_FILE_SIZE_MB}MB size limit.`;
  }
  return null;
};

const NotebookCreate: React.FC<NotebookCreateProps> = ({
  onCreated,
  onSaved,
  onCancel,
  existingNotebook,
}) => {
  const isEditMode = !!existingNotebook;

  const [title, setTitle] = useState(existingNotebook?.title || '');
  const [description, setDescription] = useState(existingNotebook?.description || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [fileEntries, setFileEntries] = useState<FileWithError[]>([]);
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = (incoming: File[]) => {
    const entries: FileWithError[] = incoming.map((file) => ({
      file,
      error: validateFile(file) ?? undefined,
    }));
    // Deduplicate by filename — prevents adding same file twice
    setFileEntries((prev) => {
      const existingNames = new Set(prev.map((e) => e.file.name));
      const newEntries = entries.filter((e) => !existingNames.has(e.file.name));
      return [...prev, ...newEntries];
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(Array.from(e.target.files));
      // Reset input so same file can be re-added after removal
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const dropped = Array.from(e.dataTransfer.files);
    if (dropped.length > 0) processFiles(dropped);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // required to allow drop
  };

  const removeFile = (index: number) => {
    setFileEntries((prev) => prev.filter((_, i) => i !== index));
  };

  const validFiles = fileEntries.filter((e) => !e.error);
  const hasInvalidFiles = fileEntries.some((e) => !!e.error);

  const handleCreate = async () => {
    if (!isEditMode && !title.trim()) {
      setError(NOTEBOOK_ERROR_MESSAGES.missingTitle);
      return;
    }
    if (validFiles.length === 0 && !websiteUrl && !youtubeUrl) {
      setError(NOTEBOOK_ERROR_MESSAGES.missingSources);
      return;
    }
    // Block submit if invalid files are still in the list
    if (hasInvalidFiles) {
      setError('Remove unsupported files before saving.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let targetNotebookId = existingNotebook?.id;
      let targetNotebook = existingNotebook;

      if (!isEditMode) {
        targetNotebook = await createNotebook(title, description);
        targetNotebookId = targetNotebook.id;
      }

      if (!targetNotebookId) throw new Error('Notebook ID missing');

      const uploadPromises = validFiles.map(({ file }) =>
        uploadSourceFile(targetNotebookId!, file, {
          description: `Uploaded file: ${file.name}`,
        }).catch((err) => console.error('File upload failed', err))
      );

      if (websiteUrl.trim()) {
        uploadPromises.push(
          addSourceUrl(targetNotebookId!, 'website', websiteUrl.trim()).catch(
            (err) => console.error('Website add failed', err)
          )
        );
      }

      if (youtubeUrl.trim()) {
        uploadPromises.push(
          addSourceUrl(targetNotebookId!, 'youtube', youtubeUrl.trim()).catch(
            (err) => console.error('YouTube add failed', err)
          )
        );
      }

      await Promise.all(uploadPromises);

      if (isEditMode) {
        if (onSaved) onSaved();
      } else {
        if (targetNotebook) onCreated(targetNotebook);
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || NOTEBOOK_ERROR_MESSAGES.createFailed);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full p-8 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode ? 'Add Sources' : 'Create New Notebook'}
          </h1>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 space-y-8">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notebook Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Physics - Quantum Mechanics"
                disabled={isEditMode}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg outline-none transition-shadow ${
                  isEditMode
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of what this notebook covers..."
                rows={3}
                disabled={isEditMode}
                className={`w-full px-4 py-3 border border-gray-200 rounded-lg outline-none transition-shadow resize-none ${
                  isEditMode
                    ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                    : 'focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                }`}
              />
            </div>
          </div>

          <div className="border-t border-gray-100 pt-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Sources</h2>

            {/* File Upload Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative mb-6 cursor-pointer"
              onClick={() => inputRef.current?.click()}
            >
              {/* accept attribute blocks unsupported files in file picker */}
              <input
                ref={inputRef}
                type="file"
                multiple
                accept={ACCEPT_STRING}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="flex flex-col items-center pointer-events-none">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-3">
                  <Upload size={24} />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">Upload Files</h3>
                <p className="text-gray-500 text-sm">Drag and drop files or click to browse</p>
                <p className="text-gray-400 text-xs mt-2">Supports PDF, DOCX, PPTX, TXT · Max {MAX_FILE_SIZE_MB}MB</p>
              </div>
            </div>

            {/* File List — valid and invalid */}
            {fileEntries.length > 0 && (
              <div className="mb-6 space-y-2">
                {fileEntries.map(({ file, error: fileError }, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      fileError
                        ? 'bg-red-50 border-red-200'   // red for invalid
                        : 'bg-gray-50 border-gray-100'  // green/neutral for valid
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {fileError ? (
                        <AlertCircle size={18} className="text-red-500 shrink-0" />
                      ) : (
                        <FileText size={18} className="text-blue-500 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <span className="text-sm font-medium text-gray-700 truncate block">
                          {file.name}
                        </span>
                        {fileError ? (
                          // Show exactly why the file was rejected
                          <span className="text-xs text-red-500">{fileError}</span>
                        ) : (
                          <span className="text-xs text-gray-400">
                            {(file.size / 1024).toFixed(1)} KB
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => removeFile(idx)}
                      className="text-gray-400 hover:text-red-500 shrink-0 ml-2"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* URL Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Website URL
                </label>
                <div className="relative">
                  <Globe
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="url"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://example.com/article"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  YouTube URL
                </label>
                <div className="relative">
                  <Youtube
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="url"
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    placeholder="https://youtube.com/watch?v=..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm border border-red-100">
              {error}
            </div>
          )}

          <div className="flex justify-end items-center gap-3 pt-4">
            <button
              onClick={onCancel}
              className="px-6 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleCreate}
              disabled={loading || hasInvalidFiles}
              className={`px-6 py-2.5 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 transition-colors shadow-sm flex items-center gap-2 ${
                loading || hasInvalidFiles ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {isEditMode ? 'Save Sources' : 'Create Notebook'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotebookCreate;
