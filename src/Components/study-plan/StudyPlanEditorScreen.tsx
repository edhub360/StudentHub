
import React, { useState, useEffect, useCallback } from 'react';
import { Term, StudyItem, NewStudyItemPayload, RequirementCategory, StudyPlan } from '../../types/studyPlan.types';
import * as api from '../../services/studyPlanApi';
import StudyPlanToolbar from './StudyPlanToolbar';
import StudyPlanList from './StudyPlanList';
import CourseModal from './CourseModal';

interface StudyPlanEditorScreenProps {
  planId: string;
  onBack: () => void;
}

const StudyPlanEditorScreen: React.FC<StudyPlanEditorScreenProps> = ({ planId, onBack }) => {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
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

  const handleError = useCallback((err: any) => {
    console.error(err);
    if (err.message?.includes('Session expired')) {
      setError("Session expired. Please sign in again.");
    } else {
      setError("Network error. Please check your connection.");
    }
  }, []);

  const loadData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [fetchedPlan, fetchedTerms, fetchedReqs] = await Promise.all([
        api.fetchStudyPlan(planId),
        api.fetchTerms(),
        api.fetchRequirementCategories(),
      ]);
      
      const mappedItems = (fetchedPlan.studyitems || []).map(api.mapReadToStudyItem);

      setPlan({
        id: fetchedPlan.id,
        name: fetchedPlan.name,
        description: fetchedPlan.description,
        study_items: mappedItems
      });
      setStudyItems(mappedItems);
      setTerms(fetchedTerms);
      setRequirementCategories(fetchedReqs);
      
      if (fetchedTerms.length > 0 && !selectedTermId) {
        setSelectedTermId(fetchedTerms[0].id);
      }
    } catch (err: any) {
      handleError(err);
    } finally {
      setIsLoading(false);
    }
  }, [planId, selectedTermId, handleError]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        handleError(err);
      }
    }
  };

  const handleToggleLock = async (item: StudyItem) => {
    const newStatus = item.status === 'locked' ? 'planned' : 'locked';
    try {
      const updatedRead = await api.updateStudyItem(item.id, { status: newStatus });
      const updated = api.mapReadToStudyItem(updatedRead);
      setStudyItems(prev => prev.map(i => i.id === item.id ? updated : i));
    } catch (err: any) {
      handleError(err);
    }
  };

  const handleModalSubmit = async (payload: NewStudyItemPayload) => {
    try {
      if (editingItem) {
        const updatedRead = await api.updateStudyItem(editingItem.id, payload);
        const updated = api.mapReadToStudyItem(updatedRead);
        setStudyItems(prev => prev.map(i => i.id === editingItem.id ? updated : i));
      } else {
        const createdRead = await api.createStudyItem({ ...payload, studyplanid: planId });
        const created = api.mapReadToStudyItem(createdRead);
        setStudyItems(prev => [...prev, created]);
      }
      setIsModalOpen(false);
    } catch (err: any) {
      handleError(err);
    }
  };

  const currentTerm = terms.find(t => t.id === selectedTermId) || null;

  // Search filter logic
  const filteredItems = studyItems.filter((item) =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.course_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-8 md:p-12 max-w-7xl mx-auto animate-in fade-in duration-500">
      <header className="mb-10">
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-400 text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.2em] mb-4 hover:text-teal-600 transition-colors group"
        >
          <svg className="w-3 h-3 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M15 19l-7-7 7-7"/></svg>
          <span>Back to Plans</span>
        </button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
               <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight">
                {plan?.name || "Loading Plan..."}
              </h1>
              <div className="px-3 py-1 bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest rounded-full">Active Editor</div>
            </div>
            <p className="text-slate-500 text-base sm:text-lg font-medium">{plan?.description || "Building your academic roadmap, one term at a time."}</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-6 py-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-50 transition-all flex items-center space-x-2">
               <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 6h16M4 12h16m-7 6h7"/></svg>
               <span>Reorder Terms</span>
            </button>
          </div>
        </div>
      </header>

      {error && (
        <div className="bg-rose-50 border border-rose-100 text-rose-700 px-6 py-4 rounded-2xl mb-8 flex items-center shadow-sm">
          <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          <span className="font-semibold">{error}</span>
          <button onClick={() => setError(null)} className="ml-auto p-2 hover:bg-rose-100 rounded-full transition-colors text-rose-400">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>
      )}

      <div className="space-y-6">
        <StudyPlanToolbar 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onAddCourse={handleAddCourse}
        />

        {isLoading ? (
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-100 p-24 text-center">
            <div className="animate-spin w-10 h-10 border-[4px] border-teal-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <p className="text-slate-400 font-bold tracking-tight">Syncing roadmap...</p>
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

export default StudyPlanEditorScreen;
