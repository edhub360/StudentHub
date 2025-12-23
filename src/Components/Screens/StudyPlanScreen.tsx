
import React, { useState, useEffect, useCallback } from 'react';
import { Term, StudyItem, NewStudyItemPayload, RequirementCategory } from '../../types/studyPlan.types';
import * as api from '../../services/studyPlanApi';
import StudyPlanToolbar from '../study-plan/StudyPlanToolbar';
import StudyPlanList from '../study-plan/StudyPlanList';
import CourseModal from '../study-plan/CourseModal';
import { getValidAccessToken } from "../../services/TokenManager";

const StudyPlanScreen: React.FC = () => {
  const [terms, setTerms] = useState<Term[]>([]);
  const [requirementCategories, setRequirementCategories] = useState<RequirementCategory[]>([]);
  const [selectedTermId, setSelectedTermId] = useState<string>('');
  const [studyItems, setStudyItems] = useState<StudyItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<StudyItem | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // --------- NEW: Initialize API auth via TokenManager only ----------
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getValidAccessToken();   // uses localStorage + refresh
        api.setupApiAuth(token);                     // sets default Authorization header
        setIsAuthReady(true);
      } catch (err) {
        setError("Session expired. Please sign in again.");
      }
    };
    void initAuth();
  }, []);
  // -------------------------------------------------------------------
  const loadTerms = useCallback(async () => {
    try {
      setIsLoading(true);
      const fetchedTerms = await api.fetchTerms();
      setTerms(fetchedTerms);
      if (fetchedTerms.length > 0 && !selectedTermId) {
        setSelectedTermId(fetchedTerms[0].id);
      }
    } catch (err: any) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, [selectedTermId]);

  const loadRequirementCategories = useCallback(async () => {
    try {
      const data = await api.fetchRequirementCategories();
      setRequirementCategories(data);
    } catch (err: any) {
      // Keep existing error pattern
    }
  }, []);

  useEffect(() => {
    if (!isAuthReady) return;
    loadTerms();
    loadRequirementCategories();
  }, [isAuthReady, loadTerms, loadRequirementCategories]);

  const loadItems = useCallback(async (termId: string) => {
    if (!termId) return;
    try {
      setIsLoading(true);
      const items = await api.fetchStudyItems(termId);
      setStudyItems(items);
    } catch (err: any) {
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTerms();
    loadRequirementCategories();
  }, [loadTerms, loadRequirementCategories]);

  useEffect(() => {
    if (selectedTermId) {
      loadItems(selectedTermId);
    } else {
      setStudyItems([]);
    }
  }, [selectedTermId, loadItems]);

  const handleAddCourse = () => {
    if (!selectedTermId) {
      setError("Please select a term before adding a course.");
      return;
    }
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEditCourse = (item: StudyItem) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this course?")) {
      try {
        await api.deleteStudyItem(id);
        setStudyItems(prev => prev.filter(item => item.id !== id));
      } catch (err: any) {
        setError("Network error. Failed to delete the item.");
      }
    }
  };

  const handleToggleLock = async (item: StudyItem) => {
    const newStatus = item.status === 'locked' ? 'planned' : 'locked';
    try {
      await api.updateStudyItem(item.id, { status: newStatus });
      setStudyItems(prev => prev.map(i => i.id === item.id ? { ...i, status: newStatus } : i));
    } catch (err: any) {
      setError("Network error. Failed to update status.");
    }
  };

  const handleModalSubmit = async (payload: NewStudyItemPayload) => {
    try {
      if (editingItem) {
        const updated = await api.updateStudyItem(editingItem.id, payload);
        setStudyItems(prev => prev.map(i => i.id === editingItem.id ? updated : i));
      } else {
        const created = await api.createStudyItem(payload);
        setStudyItems(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      setError("Network error. Failed to save the course.");
    }
  };

  const currentTerm = terms.find(t => t.id === selectedTermId) || null;

  // Search filter logic
  const filteredItems = studyItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto">
      {/* Page Header */}
      <header className="mb-10">
        <div className="flex items-center space-x-2 text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-4">
          <span>Student Hub</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M9 5l7 7-7 7"/></svg>
          <span className="text-teal-600">Study Planner</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight">Study Planner</h1>
        <p className="text-slate-500 mt-2 text-base sm:text-lg">Build your academic roadmap, one term at a time.</p>
      </header>

      {/* Network Error Banner */}
      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-sm animate-in slide-in-from-top-2 duration-300">
          <div className="bg-rose-100 p-2 rounded-xl mr-4 text-rose-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          </div>
          <span className="font-semibold text-sm sm:text-base">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-400 hover:text-rose-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      <div className="space-y-6">
        {/* Toolbar Card */}
        <StudyPlanToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddCourse={handleAddCourse}
        />

        {/* Content Card / List */}
        {!selectedTermId ? (
          <div className="bg-white rounded-[24px] p-16 sm:p-24 text-center border border-slate-100 shadow-sm">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 text-slate-200">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.247 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
            </div>
            <h3 className="text-2xl font-black text-slate-800 mb-3">No term selected</h3>
            <p className="text-slate-400 max-w-sm mx-auto font-medium">Please select a term from the menu above to view or build your schedule.</p>
          </div>
        ) : (
          <StudyPlanList 
            items={filteredItems}
            isLoading={isLoading}
            terms={terms}
            requirementCategories={requirementCategories}
            onEdit={handleEditCourse}
            onDelete={handleDeleteCourse}
            onToggleLock={handleToggleLock}
          />
        )}
      </div>

      <CourseModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={editingItem}
        selectedTerm={currentTerm}
      />
    </div>
  );
};

export default StudyPlanScreen;