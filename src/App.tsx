import React, { useState } from 'react';
import { 
  Home, 
  MessageCircle, 
  FileText, 
  Brain, 
  BarChart3, 
  Upload,
  User,
  Settings,
  Bell,
  Trophy,
  Target,
  Clock,
  BookOpen,
  Zap,
  Camera,
  Search,
  ChevronRight,
  Play,
  RotateCcw,
  Check,
  X,
  Award,
  Calendar,
  TrendingUp,
  Image as ImageIcon,
  Send,
  Menu,
  ChevronLeft,
  ChevronRight as ChevronRightIcon,
  StickyNote,
  ExternalLink,
  Star,
  Plus,
  ArrowLeft,
  Globe,
  Volume2,
  GitBranch,
  Download,
  Share2
} from 'lucide-react';
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import HomeScreen from './Components/Screens/HomeScreen';
import CoursesScreen from './Components/Screens/CoursesScreen';
import ChatScreen from './Components/Screens/ChatScreen';
import FlashCardsScreen from './Components/Screens/FlashCardsScreen';
import UploadScreen from './Components/Screens/UploadScreen';
import QuizScreen from './Components/Screens/QuizScreen';
import ProgressScreen from './Components/Screens/ProgressScreen';
import Login from './Components/Login';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
}

interface FlashCard {
  id: string;
  front: string;
  back: string;
  subject: string;
  difficulty: 'easy' | 'medium' | 'hard';
  mastered: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

  const App: React.FC = () => {
    const [activeTab, setActiveTab] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // LocalStorage check, refresh handle panna
    return localStorage.getItem('isLoggedIn') === 'true';
  });
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeNotebook, setActiveNotebook] = useState<string | null>(null);
    const [showCreateNotebook, setShowCreateNotebook] = useState(false);
    const [currentFlashCard, setCurrentFlashCard] = useState(0);
    const [showFlashCardBack, setShowFlashCardBack] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [quizScore, setQuizScore] = useState(0);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatInput, setChatInput] = useState('');
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);
    const [dragActive, setDragActive] = useState(false);

    const navigation: NavigationItem[] = [
      { id: 'home', label: 'Dashboard', icon: Home },
      { id: 'chat', label: 'AI Chat', icon: MessageCircle },
      { id: 'flashcards', label: 'Flashcards', icon: FileText },
      { id: 'quiz', label: 'Quiz Mode', icon: Brain },
      { id: 'courses', label: 'Courses', icon: BookOpen },
      { id: 'notes', label: 'Notes', icon: BookOpen },
      { id: 'progress', label: 'Progress', icon: BarChart3 },
      { id: 'upload', label: 'Screenshot Solve', icon: Upload },
    ];

  const flashCards: FlashCard[] = [
    {
      id: '1',
      front: 'What is the derivative of x²?',
      back: '2x',
      subject: 'Calculus',
      difficulty: 'easy',
      mastered: true
    },
    {
      id: '2',
      front: 'Define photosynthesis',
      back: 'The process by which plants convert sunlight, carbon dioxide, and water into glucose and oxygen',
      subject: 'Biology',
      difficulty: 'medium',
      mastered: false
    },
    {
      id: '3',
      front: 'What year did World War II end?',
      back: '1945',
      subject: 'History',
      difficulty: 'easy',
      mastered: true
    }
  ];

  const quizQuestions: QuizQuestion[] = [
    {
      id: '1',
      question: 'What is the capital of France?',
      options: ['London', 'Berlin', 'Paris', 'Madrid'],
      correct: 2,
      explanation: 'Paris is the capital and largest city of France.'
    },
    {
      id: '2',
      question: 'Which element has the chemical symbol "O"?',
      options: ['Gold', 'Oxygen', 'Silver', 'Iron'],
      correct: 1,
      explanation: 'Oxygen is represented by the symbol "O" on the periodic table.'
    },
    {
      id: '3',
      question: 'What is 15 × 8?',
      options: ['120', '115', '125', '130'],
      correct: 0,
      explanation: '15 × 8 = 120'
    }
  ];

  // Sample course data
  const edhubCourses = [
    {
      id: 1,
      title: "Advanced Mathematics",
      description: "Master calculus, linear algebra, and advanced mathematical concepts with AI-powered assistance.",
      image: "https://images.pexels.com/photos/6238050/pexels-photo-6238050.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "Advanced",
      duration: "12 weeks"
    },
    {
      id: 2,
      title: "Physics Fundamentals",
      description: "Explore the laws of physics through interactive simulations and AI-guided problem solving.",
      image: "https://images.pexels.com/photos/2280549/pexels-photo-2280549.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "Intermediate",
      duration: "10 weeks"
    },
    {
      id: 3,
      title: "Chemistry Lab Mastery",
      description: "Learn chemistry concepts and lab techniques with virtual experiments and AI tutoring.",
      image: "https://images.pexels.com/photos/2280571/pexels-photo-2280571.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "Beginner",
      duration: "8 weeks"
    },
    {
      id: 4,
      title: "Computer Science Basics",
      description: "Introduction to programming, algorithms, and computational thinking with hands-on projects.",
      image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "Beginner",
      duration: "14 weeks"
    },
    {
      id: 5,
      title: "Biology & Life Sciences",
      description: "Discover the wonders of life through interactive diagrams and AI-powered explanations.",
      image: "https://images.pexels.com/photos/2280568/pexels-photo-2280568.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "Intermediate",
      duration: "12 weeks"
    },
    {
      id: 6,
      title: "Literature & Writing",
      description: "Enhance your writing skills and literary analysis with AI feedback and guidance.",
      image: "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=400",
      level: "All Levels",
      duration: "10 weeks"
    }
  ];

  const externalRecommendations = [
    {
      id: 1,
      title: "Machine Learning Specialization",
      description: "Learn the fundamentals of machine learning with hands-on projects and real-world applications.",
      platform: "Coursera",
      platformLogo: "🎓",
      rating: 4.9,
      url: "https://coursera.org"
    },
    {
      id: 2,
      title: "Data Science MicroMasters",
      description: "Comprehensive program covering statistics, programming, and data analysis techniques.",
      platform: "edX",
      platformLogo: "📚",
      rating: 4.7,
      url: "https://edx.org"
    },
    {
      id: 3,
      title: "Full Stack Web Development",
      description: "Build modern web applications using React, Node.js, and cloud technologies.",
      platform: "Udacity",
      platformLogo: "🚀",
      rating: 4.6,
      url: "https://udacity.com"
    }
  ];

    // Sample notebooks data
    const notebooks = [
      {
        id: '1',
        title: 'Calculus I - Derivatives',
        description: 'Complete notes and practice problems for differential calculus',
        lastUpdated: '2 hours ago',
        sourceCount: 8,
        thumbnail: '📊'
      },
      {
        id: '2',
        title: 'World History - Renaissance',
        description: 'Art, politics, and cultural changes during the Renaissance period',
        lastUpdated: '1 day ago',
        sourceCount: 12,
        thumbnail: '🏛️'
      },
      {
        id: '3',
        title: 'Chemistry - Organic Compounds',
        description: 'Molecular structures, reactions, and synthesis pathways',
        lastUpdated: '3 days ago',
        sourceCount: 6,
        thumbnail: '🧪'
      },
      {
        id: '4',
        title: 'Literature Analysis - Shakespeare',
        description: 'Character analysis and themes in Hamlet and Macbeth',
        lastUpdated: '1 week ago',
        sourceCount: 15,
        thumbnail: '📚'
      }
    ];

    // Sample sources for active notebook
    const notebookSources = [
      { id: '1', name: 'Calculus Textbook Ch. 3-5.pdf', type: 'pdf', size: '2.4 MB' },
      { id: '2', name: 'Derivative Rules Summary.docx', type: 'doc', size: '156 KB' },
      { id: '3', name: 'Khan Academy - Derivatives', type: 'youtube', url: 'youtube.com/watch?v=...' },
      { id: '4', name: 'MIT OpenCourseWare - Calculus', type: 'web', url: 'ocw.mit.edu/...' }
    ];

    const [courseSearchQuery, setCourseSearchQuery] = useState('');
    const [showRecommendations, setShowRecommendations] = useState(false);

    const handleCourseSearch = (query: string) => {
      setCourseSearchQuery(query);
      // Simulate search logic - if no exact match found, show recommendations
      const hasMatch = edhubCourses.some(course => 
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase())
      );
      setShowRecommendations(query.length > 0 && !hasMatch);
    };

    const filteredCourses = courseSearchQuery 
      ? edhubCourses.filter(course => 
          course.title.toLowerCase().includes(courseSearchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(courseSearchQuery.toLowerCase())
        )
      : edhubCourses;

    const handleSendMessage = () => {
      if (!chatInput.trim()) return;

      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        text: chatInput,
        isUser: true,
        timestamp: new Date()
      };

      const aiResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: "I'd be happy to help you with that! As your AI study assistant, I can explain concepts, solve problems, and provide detailed explanations. What specific topic would you like to explore?",
        isUser: false,
        timestamp: new Date()
      };

      setChatMessages([...chatMessages, userMessage, aiResponse]);
      setChatInput('');
    };

    const handleImageUpload = (file: File) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      
      const files = e.dataTransfer.files;
      if (files[0]) {
        handleImageUpload(files[0]);
      }
    };

    const nextFlashCard = () => {
      setShowFlashCardBack(false);
      setCurrentFlashCard((prev) => (prev + 1) % flashCards.length);
    };

    const answerQuizQuestion = (answerIndex: number) => {
      setSelectedAnswer(answerIndex);
      if (answerIndex === quizQuestions[currentQuestion].correct) {
        setQuizScore(prev => prev + 1);
      }
      
      setTimeout(() => {
        if (currentQuestion < quizQuestions.length - 1) {
          setCurrentQuestion(prev => prev + 1);
          setSelectedAnswer(null);
        } else {
          setQuizStarted(false);
          setCurrentQuestion(0);
          setSelectedAnswer(null);
        }
      }, 2000);
    };

    const startQuiz = () => {
      setQuizStarted(true);
      setCurrentQuestion(0);
      setQuizScore(0);
      setSelectedAnswer(null);
    };

    const handleNotebookSelect = (notebookId: string) => {
      setActiveNotebook(notebookId);
    };

    const handleBackToNotes = () => {
      setActiveNotebook(null);
    };

    const renderNotesContent = () => {
      if (activeNotebook) {
        return renderNotebookWorkspace();
      }
      
      if (showCreateNotebook) {
        return renderCreateNotebook();
      }
      
      return renderNotesHome();
    };

    const renderNotesHome = () => (
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Notebooks</h1>
            <p className="text-gray-600">Organize your study materials with AI-powered insights</p>
          </div>
          <button
            onClick={() => setShowCreateNotebook(true)}
            className="mt-4 sm:mt-0 bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Notebook
          </button>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search notebooks or ask for course recommendations..."
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Notebooks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {notebooks.map((notebook) => (
            <div
              key={notebook.id}
              onClick={() => handleNotebookSelect(notebook.id)}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer border border-gray-100 hover:border-blue-200 group"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-4xl">{notebook.thumbnail}</div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <FileText className="w-4 h-4" />
                    <span>{notebook.sourceCount}</span>
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {notebook.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {notebook.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{notebook.lastUpdated}</span>
                  <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {notebooks.length === 0 && (
          <div className="text-center py-16">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No notebooks yet</h3>
            <p className="text-gray-600 mb-6">Create your first notebook to get started with AI-powered studying</p>
            <button
              onClick={() => setShowCreateNotebook(true)}
              className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
            >
              Create Notebook
            </button>
          </div>
        )}
      </div>
    );

    const renderCreateNotebook = () => (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCreateNotebook(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">Create New Notebook</h2>
            </div>
          </div>

          <div className="p-6">
            {/* Notebook Details */}
            <div className="mb-8">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Notebook Title</label>
                <input
                  type="text"
                  placeholder="e.g., Physics - Quantum Mechanics"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                <textarea
                  placeholder="Brief description of what this notebook covers..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            {/* Add Sources */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Sources</h3>
              
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors mb-6">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h4>
                <p className="text-gray-600 mb-4">Drag and drop files or click to browse</p>
                <p className="text-sm text-gray-500">Supports PDF, DOCX, PPTX, TXT files</p>
                <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Choose Files
                </button>
              </div>

              {/* URL Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      placeholder="https://example.com/article"
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">YouTube URL</label>
                  <div className="relative">
                    <Play className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="url"
                      placeholder="https://youtube.com/watch?v=..."
                      className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowCreateNotebook(false)}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCreateNotebook(false);
                  setActiveNotebook('new');
                }}
                className="bg-gradient-to-r from-blue-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-teal-700 transition-all duration-200"
              >
                Create Notebook
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const renderNotebookWorkspace = () => (
      <div className="flex h-full">
        {/* Sources Panel */}
        <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
          {/* Sources Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={handleBackToNotes}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="text-sm">Back to Notebooks</span>
              </button>
            </div>
            <h2 className="font-semibold text-gray-900 mb-1">Calculus I - Derivatives</h2>
            <p className="text-sm text-gray-600">8 sources • Last updated 2 hours ago</p>
          </div>

          {/* Add Sources Button */}
          <div className="p-4 border-b border-gray-200">
            <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" />
              Add Sources
            </button>
          </div>

          {/* Sources List */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="space-y-3">
              {notebookSources.map((source) => (
                <div key={source.id} className="bg-white rounded-lg p-3 border border-gray-200 hover:border-blue-200 transition-colors group">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      {source.type === 'pdf' && <FileText className="w-5 h-5 text-red-500" />}
                      {source.type === 'doc' && <FileText className="w-5 h-5 text-blue-500" />}
                      {source.type === 'youtube' && <Play className="w-5 h-5 text-red-600" />}
                      {source.type === 'web' && <Globe className="w-5 h-5 text-green-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{source.name}</h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {source.size || source.url}
                      </p>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main Workspace */}
        <div className="flex-1 flex flex-col">
          {/* Workspace Header */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h3 className="font-semibold text-gray-900">Notebook Assistant</h3>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm">
                    <Volume2 className="w-4 h-4" />
                    Audio Overview
                  </button>
                  <button className="flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm">
                    <GitBranch className="w-4 h-4" />
                    Mindmap
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Share2 className="w-5 h-5 text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Settings className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
              <div className="max-w-4xl mx-auto space-y-6">
                {/* Welcome Message */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-2">Welcome to your Calculus notebook!</h4>
                      <p className="text-gray-600 mb-4">I've analyzed your 8 sources and I'm ready to help you study. Here are some things I can do:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <button className="text-left p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                          <div className="font-medium text-blue-900">📝 Generate Summary</div>
                          <div className="text-sm text-blue-700">Create a comprehensive overview</div>
                        </button>
                        <button className="text-left p-3 bg-teal-50 rounded-lg hover:bg-teal-100 transition-colors">
                          <div className="font-medium text-teal-900">🃏 Create Flashcards</div>
                          <div className="text-sm text-teal-700">Generate study cards from content</div>
                        </button>
                        <button className="text-left p-3 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                          <div className="font-medium text-purple-900">🎧 Audio Overview</div>
                          <div className="text-sm text-purple-700">Listen to a spoken summary</div>
                        </button>
                        <button className="text-left p-3 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                          <div className="font-medium text-green-900">🗺️ Create Mindmap</div>
                          <div className="text-sm text-green-700">Visualize key concepts</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sample Conversation */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-900">Can you explain the chain rule for derivatives?</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="prose prose-sm max-w-none">
                        <p className="text-gray-900 mb-4">Based on your uploaded materials, here's an explanation of the chain rule:</p>
                        <div className="bg-blue-50 rounded-lg p-4 mb-4">
                          <p className="font-medium text-blue-900 mb-2">Chain Rule Formula:</p>
                          <p className="font-mono text-blue-800">d/dx[f(g(x))] = f'(g(x)) × g'(x)</p>
                        </div>
                        <p className="text-gray-700">The chain rule is used when you have a composite function - a function inside another function. You differentiate the outer function first, then multiply by the derivative of the inner function.</p>
                      </div>
                      <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100">
                        <span className="text-xs text-gray-500">Sources:</span>
                        <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">Calculus Textbook Ch. 3-5.pdf</span>
                        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Derivative Rules Summary.docx</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Input */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <div className="max-w-4xl mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ask anything about your study materials..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

  // const renderSidebar = () => (
  //   <div className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-50 to-gray-100 border-r border-gray-200 transition-all duration-300 z-40 ${
  //     sidebarCollapsed ? 'w-16' : 'w-64'
  //   } ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
  //     {/* Logo Section */}
  //     <div className="p-4 border-b border-gray-200">
  //       <div className="flex items-center gap-3">
  //         <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center flex-shrink-0">
  //           <BookOpen className="w-6 h-6 text-white" />
  //         </div>
  //         {!sidebarCollapsed && (
  //           <div className="min-w-0">
  //             <h1 className="text-lg font-bold text-gray-900 truncate">Edhub360</h1>
  //             <p className="text-xs text-gray-500 truncate">Education without limits.</p>
  //           </div>
  //         )}
  //       </div>
  //     </div>

  //     {/* Navigation */}
  //     <nav className="flex-1 p-4">
  //       <div className="space-y-2">
  //         {navigation.map((item) => {
  //           const IconComponent = item.icon;
  //           const isActive = activeTab === item.id;
            
  //           return (
  //             <button
  //               key={item.id}
  //               onClick={() => {
  //                 setActiveTab(item.id);
  //                 setMobileMenuOpen(false);
  //               }}
  //               className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 ${
  //                 isActive 
  //                   ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white shadow-lg' 
  //                   : 'text-gray-600 hover:bg-white hover:text-gray-900 hover:shadow-sm'
  //               }`}
  //               title={sidebarCollapsed ? item.label : undefined}
  //             >
  //               <IconComponent className="w-5 h-5 flex-shrink-0" />
  //               {!sidebarCollapsed && (
  //                 <span className="font-medium truncate">{item.label}</span>
  //               )}
  //             </button>
  //           );
  //         })}
  //       </div>
  //     </nav>

  //     {/* Collapse Button */}
  //     <div className="p-4 border-t border-gray-200 hidden lg:block">
  //       <button
  //         onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
  //         className="w-full flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-white rounded-lg transition-colors"
  //       >
  //         {sidebarCollapsed ? (
  //           <ChevronRightIcon className="w-5 h-5" />
  //         ) : (
  //           <ChevronLeft className="w-5 h-5" />
  //         )}
  //       </button>
  //     </div>
  //   </div>
  // );

  // const renderHeader = () => (
  //   <header className={`bg-white shadow-sm border-b border-gray-100 transition-all duration-300 ${
  //     sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
  //   }`}>
  //     <div className="flex items-center justify-between px-4 py-3">
  //       {/* Mobile Menu Button */}
  //       <button
  //         onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
  //         className="lg:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
  //       >
  //         <Menu className="w-5 h-5" />
  //       </button>

  //       {/* Page Title - Hidden on mobile when menu is open */}
  //       <div className={`flex-1 ${mobileMenuOpen ? 'hidden' : 'block'} lg:block`}>
  //         <h2 className="text-xl font-semibold text-gray-900 capitalize">
  //           {activeTab === 'home' ? 'Dashboard' : activeTab.replace(/([A-Z])/g, ' $1').trim()}
  //         </h2>
  //       </div>

  //       {/* Right Side Actions */}
  //       <div className="flex items-center gap-2">
  //         <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg relative">
  //           <Bell className="w-5 h-5" />
  //           <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
  //         </button>
  //         <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg">
  //           <Settings className="w-5 h-5" />
  //         </button>
  //         <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full flex items-center justify-center ml-2">
  //           <User className="w-4 h-4 text-white" />
  //         </div>
  //       </div>
  //     </div>
  //   </header>
  // );

  // const renderHomeScreen = () => (
  //   <div className="p-6 space-y-6">
  //     {/* Welcome Section */}
  //     <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-6 text-white">
  //       <div className="flex items-center justify-between">
  //         <div>
  //           <h2 className="text-2xl font-bold mb-2">Welcome back, Alex!</h2>
  //           <p className="text-blue-100">Ready to continue your learning journey?</p>
  //         </div>
  //         <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
  //           <Zap className="w-8 h-8" />
  //         </div>
  //       </div>
  //     </div>

  //     {/* Quick Stats */}
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  //       <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
  //         <div className="flex items-center gap-2 mb-2">
  //           <Trophy className="w-5 h-5 text-yellow-500" />
  //           <span className="text-sm font-medium text-gray-700">Study Streak</span>
  //         </div>
  //         <p className="text-2xl font-bold text-gray-900">7 days</p>
  //         <p className="text-xs text-gray-500">Keep it up!</p>
  //       </div>
  //       <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
  //         <div className="flex items-center gap-2 mb-2">
  //           <Target className="w-5 h-5 text-green-500" />
  //           <span className="text-sm font-medium text-gray-700">Today's Goal</span>
  //         </div>
  //         <p className="text-2xl font-bold text-gray-900">75%</p>
  //         <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
  //           <div className="bg-green-500 h-2 rounded-full w-3/4"></div>
  //         </div>
  //       </div>
  //       <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
  //         <div className="flex items-center gap-2 mb-2">
  //           <Clock className="w-5 h-5 text-blue-500" />
  //           <span className="text-sm font-medium text-gray-700">Study Time</span>
  //         </div>
  //         <p className="text-2xl font-bold text-gray-900">2.5h</p>
  //         <p className="text-xs text-gray-500">Today</p>
  //       </div>
  //       <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
  //         <div className="flex items-center gap-2 mb-2">
  //           <Award className="w-5 h-5 text-purple-500" />
  //           <span className="text-sm font-medium text-gray-700">Badges</span>
  //         </div>
  //         <p className="text-2xl font-bold text-gray-900">12</p>
  //         <p className="text-xs text-gray-500">Earned</p>
  //       </div>
  //     </div>

  //     {/* Recent Activity & Quick Actions */}
  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       {/* Recent Activity */}
  //       <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
  //         <div className="p-4 border-b border-gray-100">
  //           <h3 className="font-semibold text-gray-900">Recent Activity</h3>
  //         </div>
  //         <div className="p-4 space-y-3">
  //           <div className="flex items-center gap-3">
  //             <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
  //               <FileText className="w-4 h-4 text-blue-600" />
  //             </div>
  //             <div className="flex-1">
  //               <p className="text-sm font-medium text-gray-900">Completed Calculus flashcards</p>
  //               <p className="text-xs text-gray-500">2 hours ago</p>
  //             </div>
  //           </div>
  //           <div className="flex items-center gap-3">
  //             <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
  //               <Brain className="w-4 h-4 text-green-600" />
  //             </div>
  //             <div className="flex-1">
  //               <p className="text-sm font-medium text-gray-900">Biology quiz - 85% score</p>
  //               <p className="text-xs text-gray-500">Yesterday</p>
  //             </div>
  //           </div>
  //           <div className="flex items-center gap-3">
  //             <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
  //               <MessageCircle className="w-4 h-4 text-purple-600" />
  //             </div>
  //             <div className="flex-1">
  //               <p className="text-sm font-medium text-gray-900">AI Chat session on Physics</p>
  //               <p className="text-xs text-gray-500">2 days ago</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Quick Actions */}
  //       <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
  //         <div className="p-4 border-b border-gray-100">
  //           <h3 className="font-semibold text-gray-900">Quick Actions</h3>
  //         </div>
  //         <div className="p-4 grid grid-cols-2 gap-3">
  //           <button 
  //             onClick={() => setActiveTab('chat')}
  //             className="p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors group"
  //           >
  //             <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
  //               <MessageCircle className="w-4 h-4 text-white" />
  //             </div>
  //             <p className="font-medium text-gray-900 text-sm">Ask AI</p>
  //             <p className="text-xs text-gray-500">Get instant help</p>
  //           </button>
  //           <button 
  //             onClick={() => setActiveTab('upload')}
  //             className="p-4 bg-teal-50 hover:bg-teal-100 rounded-xl transition-colors group"
  //           >
  //             <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
  //               <Camera className="w-4 h-4 text-white" />
  //             </div>
  //             <p className="font-medium text-gray-900 text-sm">Scan & Solve</p>
  //             <p className="text-xs text-gray-500">Photo questions</p>
  //           </button>
  //           <button 
  //             onClick={() => setActiveTab('flashcards')}
  //             className="p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors group"
  //           >
  //             <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
  //               <FileText className="w-4 h-4 text-white" />
  //             </div>
  //             <p className="font-medium text-gray-900 text-sm">Flashcards</p>
  //             <p className="text-xs text-gray-500">Review concepts</p>
  //           </button>
  //           <button 
  //             onClick={() => setActiveTab('quiz')}
  //             className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors group"
  //           >
  //             <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
  //               <Brain className="w-4 h-4 text-white" />
  //             </div>
  //             <p className="font-medium text-gray-900 text-sm">Take Quiz</p>
  //             <p className="text-xs text-gray-500">Test knowledge</p>
  //           </button>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const renderChatScreen = () => (
  //   <div className="flex flex-col h-full">
  //     {/* Chat Header */}
  //     <div className="p-6 border-b border-gray-100 bg-white">
  //       <div className="flex items-center gap-3">
  //         <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
  //           <Zap className="w-6 h-6 text-white" />
  //         </div>
  //         <div>
  //           <h2 className="font-semibold text-gray-900">AI Study Assistant</h2>
  //           <p className="text-sm text-gray-500">Powered by Gemini • Always ready to help</p>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Messages */}
  //     <div className="flex-1 p-6 space-y-4 overflow-y-auto">
  //       {chatMessages.length === 0 ? (
  //         <div className="text-center py-12">
  //           <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
  //             <MessageCircle className="w-10 h-10 text-blue-500" />
  //           </div>
  //           <h3 className="font-semibold text-gray-900 mb-2">Start a conversation</h3>
  //           <p className="text-gray-500 mb-6">Ask me anything about your studies!</p>
  //           <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto">
  //             <button className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-left transition-colors">
  //               <p className="font-medium text-blue-900 text-sm">Explain photosynthesis</p>
  //             </button>
  //             <button className="p-3 bg-teal-50 hover:bg-teal-100 rounded-lg text-left transition-colors">
  //               <p className="font-medium text-teal-900 text-sm">Solve math problems</p>
  //             </button>
  //             <button className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-left transition-colors">
  //               <p className="font-medium text-purple-900 text-sm">History questions</p>
  //             </button>
  //             <button className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-left transition-colors">
  //               <p className="font-medium text-green-900 text-sm">Study tips</p>
  //             </button>
  //           </div>
  //         </div>
  //       ) : (
  //         chatMessages.map((message) => (
  //           <div key={message.id} className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}>
  //             <div className={`max-w-md px-4 py-3 rounded-2xl ${
  //               message.isUser 
  //                 ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
  //                 : 'bg-gray-100 text-gray-900'
  //             }`}>
  //               <p className="text-sm">{message.text}</p>
  //               <p className={`text-xs mt-1 ${message.isUser ? 'text-blue-100' : 'text-gray-500'}`}>
  //                 {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  //               </p>
  //             </div>
  //           </div>
  //         ))
  //       )}
  //     </div>

  //     {/* Chat Input */}
  //     <div className="p-6 border-t border-gray-100 bg-white">
  //       <div className="flex items-center gap-3">
  //         <input
  //           type="text"
  //           value={chatInput}
  //           onChange={(e) => setChatInput(e.target.value)}
  //           onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
  //           placeholder="Ask your question..."
  //           className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
  //         />
  //         <button
  //           onClick={handleSendMessage}
  //           className="w-12 h-12 bg-gradient-to-r from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white hover:shadow-lg transition-all"
  //         >
  //           <Send className="w-5 h-5" />
  //         </button>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const renderFlashCardsScreen = () => (
  //   <div className="p-6 space-y-6">
  //     <div className="text-center">
  //       <h2 className="text-2xl font-bold text-gray-900 mb-2">Flashcards</h2>
  //       <p className="text-gray-600">Test your knowledge with AI-generated cards</p>
  //     </div>

  //     <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 min-h-80">
  //       <div className="text-center mb-6">
  //         <span className="text-sm font-medium text-blue-600 bg-blue-100 px-4 py-2 rounded-full">
  //           {flashCards[currentFlashCard].subject}
  //         </span>
  //       </div>

  //       <div className="flex items-center justify-center min-h-40 mb-8">
  //         <div className="text-center max-w-md">
  //           <p className="text-xl font-medium text-gray-900 mb-6 leading-relaxed">
  //             {showFlashCardBack ? flashCards[currentFlashCard].back : flashCards[currentFlashCard].front}
  //           </p>
  //           {!showFlashCardBack && (
  //             <button
  //               onClick={() => setShowFlashCardBack(true)}
  //               className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium border border-blue-200 hover:border-blue-300 rounded-lg transition-colors"
  //             >
  //               Show Answer
  //             </button>
  //           )}
  //         </div>
  //       </div>

  //       <div className="flex items-center justify-between">
  //         <div className="text-sm text-gray-500">
  //           Card {currentFlashCard + 1} of {flashCards.length}
  //         </div>
  //         <div className="flex gap-3">
  //           <button
  //             onClick={() => setShowFlashCardBack(false)}
  //             className="px-4 py-2 text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
  //           >
  //             <RotateCcw className="w-4 h-4" />
  //           </button>
  //           <button
  //             onClick={nextFlashCard}
  //             className="px-8 py-2 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-lg hover:shadow-lg transition-all"
  //           >
  //             Next Card
  //           </button>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
  //         <h3 className="font-semibold text-gray-900 mb-4">Your Progress</h3>
  //         <div className="space-y-4">
  //           <div className="flex justify-between text-sm">
  //             <span className="text-gray-600">Mastered Cards</span>
  //             <span className="font-medium">{flashCards.filter(card => card.mastered).length}/{flashCards.length}</span>
  //           </div>
  //           <div className="w-full bg-gray-200 rounded-full h-3">
  //             <div 
  //               className="bg-gradient-to-r from-green-500 to-teal-500 h-3 rounded-full transition-all duration-300"
  //               style={{ width: `${(flashCards.filter(card => card.mastered).length / flashCards.length) * 100}%` }}
  //             ></div>
  //           </div>
  //           <div className="grid grid-cols-3 gap-4 mt-6">
  //             <div className="text-center">
  //               <p className="text-2xl font-bold text-green-600">2</p>
  //               <p className="text-xs text-gray-500">Mastered</p>
  //             </div>
  //             <div className="text-center">
  //               <p className="text-2xl font-bold text-yellow-600">1</p>
  //               <p className="text-xs text-gray-500">Learning</p>
  //             </div>
  //             <div className="text-center">
  //               <p className="text-2xl font-bold text-gray-400">0</p>
  //               <p className="text-xs text-gray-500">New</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
  //         <h3 className="font-semibold text-gray-900 mb-4">Study Sets</h3>
  //         <div className="space-y-3">
  //           <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
  //             <div>
  //               <p className="font-medium text-gray-900">Mathematics</p>
  //               <p className="text-sm text-gray-600">15 cards</p>
  //             </div>
  //             <ChevronRight className="w-4 h-4 text-gray-400" />
  //           </div>
  //           <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
  //             <div>
  //               <p className="font-medium text-gray-900">Biology</p>
  //               <p className="text-sm text-gray-600">23 cards</p>
  //             </div>
  //             <ChevronRight className="w-4 h-4 text-gray-400" />
  //           </div>
  //           <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
  //             <div>
  //               <p className="font-medium text-gray-900">History</p>
  //               <p className="text-sm text-gray-600">18 cards</p>
  //             </div>
  //             <ChevronRight className="w-4 h-4 text-gray-400" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

    // const renderQuizScreen = () => (
    //   <div className="p-6 space-y-6">
    //     {!quizStarted ? (
    //       <div className="space-y-6">
    //         <div className="text-center">
    //           <h2 className="text-2xl font-bold text-gray-900 mb-2">Quiz Mode</h2>
    //           <p className="text-gray-600">Test your knowledge with adaptive questions</p>
    //         </div>

    //         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
    //           <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
    //             <Brain className="w-10 h-10 text-white" />
    //           </div>
    //           <h3 className="text-xl font-semibold text-gray-900 mb-3">Ready to test yourself?</h3>
    //           <p className="text-gray-600 mb-8">This quiz contains {quizQuestions.length} questions covering various topics.</p>
    //           <button
    //             onClick={startQuiz}
    //             className="px-10 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
    //           >
    //             Start Quiz
    //           </button>
    //         </div>

    //         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    //           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
    //             <h3 className="font-semibold text-gray-900 mb-4">Recent Scores</h3>
    //             <div className="space-y-3">
    //               <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
    //                 <span className="font-medium text-gray-900">Mathematics</span>
    //                 <span className="font-bold text-green-600">92%</span>
    //               </div>
    //               <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
    //                 <span className="font-medium text-gray-900">Science</span>
    //                 <span className="font-bold text-blue-600">85%</span>
    //               </div>
    //               <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
    //                 <span className="font-medium text-gray-900">History</span>
    //                 <span className="font-bold text-yellow-600">78%</span>
    //               </div>
    //             </div>
    //           </div>

    //           <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
    //             <h3 className="font-semibold text-gray-900 mb-4">Quiz Statistics</h3>
    //             <div className="space-y-4">
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Total Quizzes</span>
    //                 <span className="font-semibold">47</span>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Average Score</span>
    //                 <span className="font-semibold">85%</span>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Best Subject</span>
    //                 <span className="font-semibold">Mathematics</span>
    //               </div>
    //               <div className="flex justify-between">
    //                 <span className="text-gray-600">Improvement</span>
    //                 <span className="font-semibold text-green-600">+12%</span>
    //               </div>
    //             </div>
    //           </div>
    //         </div>
    //       </div>
    //     ) : (
    //       <div className="space-y-6">
    //         <div className="flex items-center justify-between">
    //           <h2 className="text-2xl font-bold text-gray-900">Question {currentQuestion + 1}</h2>
    //           <div className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
    //             {currentQuestion + 1} of {quizQuestions.length}
    //           </div>
    //         </div>

    //         <div className="w-full bg-gray-200 rounded-full h-3">
    //           <div 
    //             className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-300"
    //             style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
    //           ></div>
    //         </div>

    //         <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
    //           <h3 className="text-xl font-semibold text-gray-900 mb-8">
    //             {quizQuestions[currentQuestion].question}
    //           </h3>

    //           <div className="space-y-4">
    //             {quizQuestions[currentQuestion].options.map((option, index) => (
    //               <button
    //                 key={index}
    //                 onClick={() => answerQuizQuestion(index)}
    //                 disabled={selectedAnswer !== null}
    //                 className={`w-full p-5 text-left rounded-xl border-2 transition-all ${
    //                   selectedAnswer === null
    //                     ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
    //                     : selectedAnswer === index
    //                     ? index === quizQuestions[currentQuestion].correct
    //                       ? 'border-green-500 bg-green-50 text-green-700'
    //                       : 'border-red-500 bg-red-50 text-red-700'
    //                     : index === quizQuestions[currentQuestion].correct
    //                     ? 'border-green-500 bg-green-50 text-green-700'
    //                     : 'border-gray-200 text-gray-400'
    //                 }`}
    //               >
    //                 <div className="flex items-center justify-between">
    //                   <span className="font-medium">{option}</span>
    //                   {selectedAnswer !== null && (
    //                     <div>
    //                       {index === quizQuestions[currentQuestion].correct ? (
    //                         <Check className="w-6 h-6 text-green-600" />
    //                       ) : selectedAnswer === index ? (
    //                         <X className="w-6 h-6 text-red-600" />
    //                       ) : null}
    //                     </div>
    //                   )}
    //                 </div>
    //               </button>
    //             ))}
    //           </div>

    //           {selectedAnswer !== null && (
    //             <div className="mt-6 p-4 bg-blue-50 rounded-xl">
    //               <p className="text-blue-800 font-medium mb-2">Explanation:</p>
    //               <p className="text-blue-700">{quizQuestions[currentQuestion].explanation}</p>
    //             </div>
    //           )}
    //         </div>
    //       </div>
    //     )}
    //   </div>
    // );

  // const renderProgressScreen = () => (
  //   <div className="p-6 space-y-6">
  //     <div className="text-center">
  //       <h2 className="text-2xl font-bold text-gray-900 mb-2">Progress Tracker</h2>
  //       <p className="text-gray-600">Monitor your learning journey and achievements</p>
  //     </div>

  //     {/* Overall Stats */}
  //     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  //       <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
  //         <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
  //           <Clock className="w-6 h-6 text-blue-600" />
  //         </div>
  //         <p className="text-3xl font-bold text-gray-900">47h</p>
  //         <p className="text-sm text-gray-600">Total Study Time</p>
  //       </div>
  //       <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
  //         <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
  //           <Award className="w-6 h-6 text-green-600" />
  //         </div>
  //         <p className="text-3xl font-bold text-gray-900">12</p>
  //         <p className="text-sm text-gray-600">Badges Earned</p>
  //       </div>
  //       <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
  //         <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
  //           <TrendingUp className="w-6 h-6 text-purple-600" />
  //         </div>
  //         <p className="text-3xl font-bold text-gray-900">85%</p>
  //         <p className="text-sm text-gray-600">Average Score</p>
  //       </div>
  //       <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm text-center">
  //         <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-3">
  //           <Trophy className="w-6 h-6 text-yellow-600" />
  //         </div>
  //         <p className="text-3xl font-bold text-gray-900">7</p>
  //         <p className="text-sm text-gray-600">Day Streak</p>
  //       </div>
  //     </div>

  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       {/* Weekly Progress */}
  //       <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
  //         <h3 className="font-semibold text-gray-900 mb-6">Weekly Activity</h3>
  //         <div className="space-y-4">
  //           {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, index) => (
  //             <div key={day} className="flex items-center gap-4">
  //               <span className="text-sm font-medium text-gray-600 w-20">{day.slice(0, 3)}</span>
  //               <div className="flex-1 bg-gray-200 rounded-full h-3">
  //                 <div 
  //                   className="bg-gradient-to-r from-blue-500 to-teal-500 h-3 rounded-full transition-all duration-300"
  //                   style={{ width: `${Math.random() * 80 + 20}%` }}
  //                 ></div>
  //               </div>
  //               <span className="text-sm text-gray-500 w-8">{Math.floor(Math.random() * 3) + 1}h</span>
  //             </div>
  //           ))}
  //         </div>
  //       </div>

  //       {/* Subject Progress */}
  //       <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
  //         <h3 className="font-semibold text-gray-900 mb-6">Subject Mastery</h3>
  //         <div className="space-y-6">
  //           <div>
  //             <div className="flex justify-between items-center mb-2">
  //               <span className="font-medium text-gray-700">Mathematics</span>
  //               <span className="text-sm text-gray-600">85%</span>
  //             </div>
  //             <div className="w-full bg-gray-200 rounded-full h-3">
  //               <div className="bg-blue-500 h-3 rounded-full w-4/5"></div>
  //             </div>
  //           </div>
  //           <div>
  //             <div className="flex justify-between items-center mb-2">
  //               <span className="font-medium text-gray-700">Biology</span>
  //               <span className="text-sm text-gray-600">72%</span>
  //             </div>
  //             <div className="w-full bg-gray-200 rounded-full h-3">
  //               <div className="bg-green-500 h-3 rounded-full w-3/4"></div>
  //             </div>
  //           </div>
  //           <div>
  //             <div className="flex justify-between items-center mb-2">
  //               <span className="font-medium text-gray-700">Physics</span>
  //               <span className="text-sm text-gray-600">63%</span>
  //             </div>
  //             <div className="w-full bg-gray-200 rounded-full h-3">
  //               <div className="bg-purple-500 h-3 rounded-full w-3/5"></div>
  //             </div>
  //           </div>
  //           <div>
  //             <div className="flex justify-between items-center mb-2">
  //               <span className="font-medium text-gray-700">History</span>
  //               <span className="text-sm text-gray-600">78%</span>
  //             </div>
  //             <div className="w-full bg-gray-200 rounded-full h-3">
  //               <div className="bg-yellow-500 h-3 rounded-full w-4/5"></div>
  //             </div>
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Achievements */}
  //     <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
  //       <h3 className="font-semibold text-gray-900 mb-6">Recent Achievements</h3>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  //         <div className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl">
  //           <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
  //             <Trophy className="w-6 h-6 text-white" />
  //           </div>
  //           <div>
  //             <p className="font-semibold text-gray-900">Study Streak Champion</p>
  //             <p className="text-sm text-gray-600">7 days in a row!</p>
  //           </div>
  //         </div>
  //         <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl">
  //           <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
  //             <Brain className="w-6 h-6 text-white" />
  //           </div>
  //           <div>
  //             <p className="font-semibold text-gray-900">Quiz Master</p>
  //             <p className="text-sm text-gray-600">Perfect score on Math quiz</p>
  //           </div>
  //         </div>
  //         <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
  //           <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
  //             <FileText className="w-6 h-6 text-white" />
  //           </div>
  //           <div>
  //             <p className="font-semibold text-gray-900">Flashcard Expert</p>
  //             <p className="text-sm text-gray-600">100 cards mastered</p>
  //           </div>
  //         </div>
  //         <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl">
  //           <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
  //             <Target className="w-6 h-6 text-white" />
  //           </div>
  //           <div>
  //             <p className="font-semibold text-gray-900">Goal Achiever</p>
  //             <p className="text-sm text-gray-600">Weekly target reached</p>
  //           </div>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

  // const renderUploadScreen = () => (
  //   <div className="p-6 space-y-6">
  //     <div className="text-center">
  //       <h2 className="text-2xl font-bold text-gray-900 mb-2">Screenshot to Solve</h2>
  //       <p className="text-gray-600">Upload an image and get AI-powered solutions instantly</p>
  //     </div>

  //     {/* Upload Area */}
  //     <div 
  //       className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
  //         dragActive 
  //           ? 'border-blue-500 bg-blue-50' 
  //           : uploadedImage 
  //           ? 'border-green-500 bg-green-50' 
  //           : 'border-gray-300 bg-gray-50 hover:bg-gray-100'
  //       }`}
  //       onDrop={handleDrop}
  //       onDragOver={(e) => e.preventDefault()}
  //       onDragEnter={() => setDragActive(true)}
  //       onDragLeave={() => setDragActive(false)}
  //     >
  //       {uploadedImage ? (
  //         <div className="space-y-6">
  //           <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
  //             <Check className="w-10 h-10 text-green-600" />
  //           </div>
  //           <img 
  //             src={uploadedImage} 
  //             alt="Uploaded" 
  //             className="max-w-full max-h-80 mx-auto rounded-xl shadow-lg"
  //           />
  //           <div className="space-y-3">
  //             <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
  //               Analyze Image
  //             </button>
  //             <button 
  //               onClick={() => setUploadedImage(null)}
  //               className="block mx-auto text-sm text-gray-500 hover:text-gray-700 transition-colors"
  //             >
  //               Upload different image
  //             </button>
  //           </div>
  //         </div>
  //       ) : (
  //         <div className="space-y-6">
  //           <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
  //             <ImageIcon className="w-10 h-10 text-gray-400" />
  //           </div>
  //           <div>
  //             <p className="text-xl font-semibold text-gray-700 mb-2">
  //               {dragActive ? 'Drop your image here' : 'Upload your question image'}
  //             </p>
  //             <p className="text-gray-500">
  //               Drag and drop or click to select • Supports JPG, PNG, PDF
  //             </p>
  //           </div>
  //           <input
  //             type="file"
  //             accept="image/*"
  //             onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
  //             className="hidden"
  //             id="image-upload"
  //           />
  //           <label
  //             htmlFor="image-upload"
  //             className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all cursor-pointer"
  //           >
  //             Choose Image
  //           </label>
  //         </div>
  //       )}
  //     </div>

  //     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
  //       {/* How it works */}
  //       <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
  //         <h3 className="font-semibold text-gray-900 mb-6">How it works</h3>
  //         <div className="space-y-4">
  //           <div className="flex items-start gap-4">
  //             <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
  //               <Camera className="w-5 h-5 text-blue-600" />
  //             </div>
  //             <div>
  //               <p className="font-medium text-gray-900 mb-1">1. Upload</p>
  //               <p className="text-sm text-gray-600">Take a photo or upload an image of your question</p>
  //             </div>
  //           </div>
  //           <div className="flex items-start gap-4">
  //             <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
  //               <Search className="w-5 h-5 text-purple-600" />
  //             </div>
  //             <div>
  //               <p className="font-medium text-gray-900 mb-1">2. Analyze</p>
  //               <p className="text-sm text-gray-600">AI analyzes the image and identifies the problem</p>
  //             </div>
  //           </div>
  //           <div className="flex items-start gap-4">
  //             <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
  //               <Zap className="w-5 h-5 text-green-600" />
  //             </div>
  //             <div>
  //               <p className="font-medium text-gray-900 mb-1">3. Solve</p>
  //               <p className="text-sm text-gray-600">Get step-by-step solutions and explanations</p>
  //             </div>
  //           </div>
  //         </div>
  //       </div>

  //       {/* Recent Uploads */}
  //       <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
  //         <h3 className="font-semibold text-gray-900 mb-6">Recent Uploads</h3>
  //         <div className="space-y-3">
  //           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
  //             <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
  //               <ImageIcon className="w-5 h-5 text-blue-600" />
  //             </div>
  //             <div className="flex-1">
  //               <p className="font-medium text-gray-900">Algebra equation</p>
  //               <p className="text-sm text-gray-500">Solved 2 hours ago</p>
  //             </div>
  //             <ChevronRight className="w-4 h-4 text-gray-400" />
  //           </div>
  //           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
  //             <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
  //               <ImageIcon className="w-5 h-5 text-green-600" />
  //             </div>
  //             <div className="flex-1">
  //               <p className="font-medium text-gray-900">Chemistry formula</p>
  //               <p className="text-sm text-gray-500">Solved yesterday</p>
  //             </div>
  //             <ChevronRight className="w-4 h-4 text-gray-400" />
  //           </div>
  //           <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
  //             <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
  //               <ImageIcon className="w-5 h-5 text-purple-600" />
  //             </div>
  //             <div className="flex-1">
  //               <p className="font-medium text-gray-900">Physics problem</p>
  //               <p className="text-sm text-gray-500">Solved 3 days ago</p>
  //             </div>
  //             <ChevronRight className="w-4 h-4 text-gray-400" />
  //           </div>
  //         </div>
  //       </div>
  //     </div>

  //     {/* Tips */}
  //     <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-6">
  //       <h3 className="font-semibold text-gray-900 mb-4">Tips for better results</h3>
  //       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
  //         <div className="flex items-start gap-2">
  //           <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
  //           <span className="text-gray-700">Ensure text is clear and readable</span>
  //         </div>
  //         <div className="flex items-start gap-2">
  //           <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
  //           <span className="text-gray-700">Include the complete question</span>
  //         </div>
  //         <div className="flex items-start gap-2">
  //           <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
  //           <span className="text-gray-700">Good lighting and focus</span>
  //         </div>
  //         <div className="flex items-start gap-2">
  //           <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
  //           <span className="text-gray-700">Avoid shadows and glare</span>
  //         </div>
  //       </div>
  //     </div>
  //   </div>
  // );

const renderContent = () => {
  switch (activeTab) {
      case 'home': 
        return <HomeScreen setActiveTab={setActiveTab} />;
        case "chat":
              return (
                <ChatScreen
                  chatMessages={chatMessages}
                  chatInput={chatInput}
                  setChatInput={setChatInput}
                  handleSendMessage={handleSendMessage}
                />);
        case "flashcards":
              return (
                <FlashCardsScreen
                  flashCards={flashCards}
                  currentFlashCard={currentFlashCard}
                  showFlashCardBack={showFlashCardBack}
                  setShowFlashCardBack={setShowFlashCardBack}
                  nextFlashCard={nextFlashCard}
                />
              );
    case 'quiz':
      return (
        <QuizScreen
          quizStarted={quizStarted}
          quizQuestions={quizQuestions}
          currentQuestion={currentQuestion}
          selectedAnswer={selectedAnswer}
          startQuiz={startQuiz}
          answerQuizQuestion={answerQuizQuestion}
        />
      );

    case 'courses': 
      return (
        <CoursesScreen
          courseSearchQuery={courseSearchQuery}
          showRecommendations={showRecommendations}
          filteredCourses={filteredCourses}
          externalRecommendations={externalRecommendations}
          setCourseSearchQuery={setCourseSearchQuery}
          setShowRecommendations={setShowRecommendations}
          handleCourseSearch={handleCourseSearch}
        />
      );
    case 'notes': 
      return renderNotesContent();
    case 'progress': 
  return <ProgressScreen />;

    case 'upload':
      return (
        <UploadScreen
          uploadedImage={uploadedImage}
          dragActive={dragActive}
          setDragActive={setDragActive}
          setUploadedImage={setUploadedImage}
          handleDrop={handleDrop}
          handleImageUpload={handleImageUpload}
        />);
    default: 
      // here just return HomeScreen instead of undefined function
      return <HomeScreen setActiveTab={setActiveTab} />;
  }
};
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
  };
  if (!isLoggedIn) {
    return <Login setIsLoggedIn={(val) => {
      setIsLoggedIn(val);
      localStorage.setItem('isLoggedIn', 'true'); // refresh handle panna
    }} />;
  }


  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        navigation={navigation}
      />

      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
      }`}>
        <Header
          sidebarCollapsed={sidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={activeTab}
          onLogout={handleLogout} // Logout button
        />

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;