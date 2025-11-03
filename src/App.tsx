import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  Share2,
  CreditCard
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
import Register from './Components/Register';
import SubscriptionWrapper from './Components/Screens/Subscriptionpage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;;

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
  file?: {    
    name: string;
    size: number;
    type: string;
  };
}

interface UserStatus {
  has_seen_subscription: boolean;
  has_active_subscription: boolean;
  subscription: any;
}

const App: React.FC = () => {
  // ✅ Authentication & Subscription States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [showRegister, setShowRegister] = useState(false);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('user_id'));
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [isCheckingSubscription, setIsCheckingSubscription] = useState(false);  // ← false dhaan
  const [showSubscriptionPage, setShowSubscriptionPage] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  // ✅ Existing App States (unchanged)
  const [activeTab, setActiveTab] = useState('home');
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
  const [courseSearchQuery, setCourseSearchQuery] = useState('');
  const [showRecommendations, setShowRecommendations] = useState(false);

useEffect(() => {
  if (!isLoggedIn || !userId) return;

  const hasSeenBefore = localStorage.getItem('has_seen_subscription') === 'true';
  
  if (!hasSeenBefore) {
    setShowSubscriptionPage(true);
    setUserStatus({
      has_seen_subscription: false,
      has_active_subscription: false,
      subscription: null
    });
  } else {
    setShowSubscriptionPage(false);
    setUserStatus({
      has_seen_subscription: true,
      has_active_subscription: true,
      subscription: { plan_id: 'trial', status: 'active' }
    });
  }
}, [isLoggedIn, userId]);



// ✅ Handle Login Success - WITH BACKEND SUBSCRIPTION CHECK
const handleLoginSuccess = (token: string, newUserId: string, hasSubscription: boolean) => {
  console.log('✅ Login success:', { userId: newUserId, hasSubscription });
  
  localStorage.setItem('token', token);
  localStorage.setItem('user_id', newUserId);
  localStorage.setItem('isLoggedIn', 'true');
  setIsLoggedIn(true);
  setUserId(newUserId);

  // ✅ CHECK BACKEND RESPONSE
  if (hasSubscription) {
    // Already has subscription → Go to dashboard
    console.log('✅ Has subscription - Going to dashboard');
    setShowSubscriptionPage(false);
    setUserStatus({
      has_seen_subscription: true,
      has_active_subscription: true,
      subscription: { plan_id: 'free', status: 'active' }
    });
  } else {
    // No subscription → Show subscription page
    console.log('📋 No subscription - Showing subscription page');
    setShowSubscriptionPage(true);
    setUserStatus({
      has_seen_subscription: false,
      has_active_subscription: false,
      subscription: null
    });
  }
};


  // ✅ Handle Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.clear();
    setUserStatus(null);
    setShowSubscriptionPage(false);
  };

  // ✅ Handle Subscription Completion
  const handleSubscriptionComplete = () => {
    setShowSubscriptionPage(false);
    // Refresh user status
    if (userId) {
      axios.get(`${API_BASE_URL}/api/subscription/user-status/${userId}`)
        .then(({ data }) => setUserStatus(data))
        .catch(err => console.error("Error refreshing status:", err));
    }
  };

  // ✅ Existing Data & Functions (unchanged)
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

  const notebookSources = [
    { id: '1', name: 'Calculus Textbook Ch. 3-5.pdf', type: 'pdf', size: '2.4 MB' },
    { id: '2', name: 'Derivative Rules Summary.docx', type: 'doc', size: '156 KB' },
    { id: '3', name: 'Khan Academy - Derivatives', type: 'youtube', url: 'youtube.com/watch?v=...' },
    { id: '4', name: 'MIT OpenCourseWare - Calculus', type: 'web', url: 'ocw.mit.edu/...' }
  ];

  const handleCourseSearch = (query: string) => {
    setCourseSearchQuery(query);
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

  const handleSendMessage = async () => {
    if (!chatInput.trim()) return;
  
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      text: chatInput,
      isUser: true,
      timestamp: new Date(),
    };
  
    setChatMessages((prev) => [...prev, userMessage]);
    setChatInput("");
    setIsLoading(true); // 🔑 start loading
  
    try {
      const data = await sendChatMessage(chatInput);
  
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isUser: false,
        timestamp: new Date(),
      };
  
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: "Error fetching response. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // 🔑 stop loading
    }
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

  // ✅ FULL Notebook Render Functions
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

          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Sources</h3>
            
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors mb-6">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Upload Files</h4>
              <p className="text-gray-600 mb-4">Drag and drop files or click to browse</p>
              <p className="text-sm text-gray-500">Supports PDF, DOCX, PPTX, TXT files</p>
              <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Choose Files
              </button>
            </div>

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
      {/* Left Sidebar - Sources */}
      <div className="w-80 bg-gray-50 border-r border-gray-200 flex flex-col">
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

        <div className="p-4 border-b border-gray-200">
          <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" />
            Add Sources
          </button>
        </div>

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

      {/* Right Main Content - Chat/Workspace */}
      <div className="flex-1 flex flex-col">
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

        <div className="flex-1 flex flex-col">
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

              {/* User Question */}
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

              {/* AI Response */}
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
          />
        );
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
          />
        );
      default: 
        return <HomeScreen setActiveTab={setActiveTab} />;
    }
  };

  // ✅ Loading State - While Checking Subscription
  if (isLoggedIn && isCheckingSubscription) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }

  // ✅ Show Subscription Page (First-Time or No Active Subscription)
  if (isLoggedIn && showSubscriptionPage && userId) {
    return (
      <SubscriptionWrapper 
        isFirstTime={!userStatus?.has_seen_subscription}
        userId={userId}
        onComplete={handleSubscriptionComplete}
      />
    );
  }

  // ✅ Show Login/Register (Not Logged In)
  if (!isLoggedIn) {
    if (showRegister) {
      return (
        <Register 
          onSwitchToLogin={() => setShowRegister(false)}
          onRegisterSuccess={handleLoginSuccess}
        />
      );
    }
    return (
      <Login 
        setIsLoggedIn={(val) => {
          setIsLoggedIn(val);
          localStorage.setItem('isLoggedIn', 'true');
        }} 
        onSwitchToRegister={() => setShowRegister(true)}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  // ✅ Main App (Logged In + Has Subscription)
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
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
