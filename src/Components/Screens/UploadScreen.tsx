import React, { useState, useCallback, useRef } from 'react';
import { UploadCloud, File as FileIcon, X, Check, AlertCircle, Loader2 } from 'lucide-react';
import { solveImage } from '../../services/uploadsolveApi';
import { useAuth } from '../../context/AuthContext';
import { SolveMode, Subject, SolveImageResponse } from '../../types/uploadsolve.types';

const UploadScreen: React.FC = () => {
  // useAuth provides user identity if needed, but token is handled by TokenManager in the API
  const { } = useAuth(); 
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [mode, setMode] = useState<SolveMode>(SolveMode.STEPS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<SolveImageResponse | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Handlers
  const handleFileSelect = (selectedFile: File) => {
    // Reset previous results/errors
    setError(null);
    setResult(null);

    // Validate type
    if (!selectedFile.type.match('image.*')) {
      setError("Please select a valid image file (JPG or PNG).");
      return;
    }

    setFile(selectedFile);

    // Create preview
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0]);
    }
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  }, []);

  const clearFile = () => {
    setFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      // API client now handles token retrieval internally
      const response = await solveImage(file, subject, mode);
      setResult(response);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Card */}
      <div className="bg-white rounded-xl shadow-lg border border-slate-100 p-6 md:p-8">
        
        {/* Drop Zone */}
        {!file ? (
          <div
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-lg p-10 
              flex flex-col items-center justify-center text-center cursor-pointer transition-colors duration-200
              ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'}
            `}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={onInputChange}
              accept="image/png, image/jpeg, image/jpg"
              className="hidden"
            />
            <div className="bg-blue-100 p-3 rounded-full mb-4">
              <UploadCloud className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-slate-700 mb-1">Upload your question image</h3>
            <p className="text-sm text-slate-500 mb-4">Drag and drop or click to select • Supports JPG, PNG</p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors">
              Choose Image
            </button>
          </div>
        ) : (
          /* File Preview & Actions */
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 relative animate-in fade-in zoom-in duration-300">
             <button 
              onClick={clearFile}
              className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm hover:bg-slate-100 text-slate-500 transition-colors"
              title="Remove image"
            >
              <X className="w-5 h-5" />
            </button>
            
            <div className="flex flex-col items-center">
              <div className="relative mb-4">
                {previewUrl && (
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className="max-h-64 object-contain rounded-md shadow-sm"
                  />
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-sm">
                <FileIcon className="w-4 h-4 text-blue-500" />
                <span className="truncate max-w-xs">{file.name}</span>
              </div>
            </div>
          </div>
        )}

        {/* Configuration Controls */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Subject Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Subject</label>
            <div className="relative">
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value as Subject)}
                className="w-full pl-3 pr-10 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none text-slate-700"
              >
                {Object.values(Subject).map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              {/* Custom arrow for select */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-slate-700">Response Mode</label>
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setMode(SolveMode.STEPS)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  mode === SolveMode.STEPS ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>Step-by-step</span>
              </button>
              <button
                onClick={() => setMode(SolveMode.FINAL)}
                className={`flex-1 flex items-center justify-center space-x-2 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                  mode === SolveMode.FINAL ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                <span>Final Answer</span>
              </button>
            </div>
          </div>
        </div>

        {/* Analyze Button */}
        <div className="mt-8">
          <button
            onClick={handleAnalyze}
            disabled={!file || isLoading}
            className={`
              w-full flex items-center justify-center py-3 px-4 rounded-lg text-white font-semibold text-lg transition-all
              ${!file || isLoading 
                ? 'bg-slate-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg transform active:scale-[0.99]'}
            `}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Image"
            )}
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start animate-in slide-in-from-bottom-2 fade-in">
          <AlertCircle className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div className="bg-white rounded-xl shadow-lg border border-slate-100 overflow-hidden animate-in slide-in-from-bottom-4 fade-in duration-500">
          <div className="bg-emerald-50 border-b border-emerald-100 px-6 py-4 flex items-center">
            <div className="bg-emerald-100 p-1.5 rounded-full mr-3">
              <Check className="w-5 h-5 text-emerald-600" />
            </div>
            <h3 className="font-semibold text-emerald-900">Analysis Complete</h3>
            <span className="ml-auto text-xs font-medium text-emerald-700 bg-emerald-200/50 px-2 py-1 rounded">
              {result.mode === 'steps' ? 'Step-by-step' : 'Final Answer'}
            </span>
          </div>
          <div className="p-6 md:p-8">
            <div className="prose prose-slate max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-slate-800 text-base leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-100">
                {result.answer}
              </pre>
            </div>
            
            {result.token_count && (
              <div className="mt-4 text-xs text-slate-400 text-right">
                Tokens used: {result.token_count}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadScreen;