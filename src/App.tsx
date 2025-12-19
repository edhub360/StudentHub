import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  FileText, 
  Brain, 
  BarChart3, 
  Upload,
  BookOpen,
  Image as ImageIcon,
  ChevronRight as ChevronRightIcon,
} from 'lucide-react';
import Sidebar from "./Components/Sidebar";
import Header from "./Components/Header";
import Footer from "./Components/Footer";
import ChatScreen from './Components/Screens/ChatScreen';
import UploadScreen from './Components/Screens/UploadScreen';
import QuizScreen from './Components/Screens/QuizScreen';
import Register from './Components/Register';
import SubscriptionWrapper from './Components/Screens/Subscriptionpage';
import LoginScreen from './Components/Screens/LoginScreen';
import ForgotPasswordScreen from './Components/Screens/ForgotPasswordScreen';
import ResetPasswordScreen from './Components/Screens/ResetPasswordScreen';
import PrivacyPolicy from './Components/Screens/PrivacyPolicy';
import TermsOfService from './Components/Screens/TermsOfService';
import { sendChatMessage } from './services/chatapi';
import { FlashcardScreen } from './Components/Screens/FlashcardScreen';
import CourseScreen from './Components/Screens/CourseScreen';
import NotebookScreen from './Components/Screens/NotebookScreen';
import DashboardScreen, {TabId} from './Components/Screens/DashboardScreen';
import StudyPlanScreen from './Components/Screens/StudyPlanScreen';

//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;;

interface NavigationItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<any>;
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
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<TabId>('home');
  // ✅ Authentication & Subscription States
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });
  const [showRegister, setShowRegister] = useState(false);
  const [userId, setUserId] = useState<string | null>(localStorage.getItem('user_id'));
  const [userStatus, setUserStatus] = useState<UserStatus | null>(null);
  const [showSubscriptionPage, setShowSubscriptionPage] = useState(false);
  const [IsLoading, setIsLoading] = useState(false);
  // ✅ Existing App States (unchanged)
  //const [activeTab, setActiveTab] = useState('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

useEffect(() => {
  if (!isLoggedIn || !userId) return;

  const storedUserRaw = localStorage.getItem('user');
  const storedUser = storedUserRaw ? JSON.parse(storedUserRaw) : null;
  const hasSubscription = !!(storedUser && storedUser.subscription_tier);

  if (!hasSubscription) {
    setShowSubscriptionPage(true);
    setUserStatus({
      has_seen_subscription: false,
      has_active_subscription: false,
      subscription: null,
    });
  } else {
    setShowSubscriptionPage(false);
    setUserStatus({
      has_seen_subscription: true,
      has_active_subscription: true,
      subscription: { plan_id: storedUser.subscription_tier, status: 'active' },
    });
  }
}, [isLoggedIn, userId]);

//login integration code

const handleLoginSuccess = (
  token: string,
  newUserId: string,
  hasSubscription: boolean
) => {
  console.log('✅ Login success:', { userId: newUserId, hasSubscription });

  localStorage.setItem('token', token);
  localStorage.setItem('user_id', newUserId);
  localStorage.setItem('isLoggedIn', 'true');
  setIsLoggedIn(true);
  setUserId(newUserId);

  if (hasSubscription) {
    console.log('✅ Has subscription - Going to dashboard');
    setShowSubscriptionPage(false);
    setUserStatus({
      has_seen_subscription: true,
      has_active_subscription: true,
      subscription: { plan_id: 'free', status: 'active' },
    });
  } else {
    console.log('📋 No subscription - Showing subscription page');
    setShowSubscriptionPage(true);
    setUserStatus({
      has_seen_subscription: false,
      has_active_subscription: false,
      subscription: null,
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

  const handleSubscriptionComplete = () => {
    const storedUserRaw = localStorage.getItem('user');
    if (storedUserRaw) {
      const storedUser = JSON.parse(storedUserRaw);
      storedUser.subscription_tier = 'free';
      localStorage.setItem('user', JSON.stringify(storedUser));
      localStorage.setItem('subscription_tier', 'free');
    }

    setShowSubscriptionPage(false);
    setUserStatus({
      has_seen_subscription: true,
      has_active_subscription: true,
      subscription: { plan_id: 'free', status: 'active' },
    });
  };

  // ✅ Existing Data & Functions (unchanged)
  const navigation: NavigationItem[] = [
    { id: 'home', label: 'Dashboard', icon: Home },
    { id: 'chat', label: 'AI Chat', icon: MessageCircle },
    { id: 'flashcards', label: 'Flashcards', icon: FileText },
    { id: 'quiz', label: 'Quiz Mode', icon: Brain },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'study-planner', label: 'Study Planner', icon: BarChart3 },
    { id: 'notes', label: 'Notes', icon: BookOpen },
    { id: 'upload', label: 'Screenshot Solve', icon: Upload },
  ];


  const handleSendMessage = async () => {
    console.log("handleSendMessage triggered; input:", chatInput);
    if (!chatInput.trim()) {
      console.warn("Chat input is empty; not sending.");
      return;
    }
  
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
      console.log("Calling sendChatMessage with input:", chatInput);
      const data = await sendChatMessage(chatInput);
      
      console.log("API responded with:", data);

      if (!data.answer) {
        throw new Error("No answer field in response");
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        text: data.answer,
        isUser: false,
        timestamp: new Date(),
      };
  
      setChatMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error in handleSendMessage:", error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        text: "Error fetching response. Please try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setChatMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // 🔑 stop loading
      console.log("handleSendMessage finished");
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
    
  const renderContent = () => {
    switch (activeTab) {
      case 'home': 
        return <DashboardScreen setActiveTab={setActiveTab} />;
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
        return <FlashcardScreen />;

      case 'quiz':
        return <QuizScreen />;
        
      case 'courses': 
        return <CourseScreen />;

      case 'study-planner':                         // <-- new
      return <StudyPlanScreen />;

      case 'notes': 
        return <NotebookScreen />;
        
      case 'upload':
        return (
          <UploadScreen />
        );
      default: 
        return <DashboardScreen setActiveTab={setActiveTab} />;
    }
  };


  const pathname = location.pathname;

  if (pathname === '/forgot-password') {
    return <ForgotPasswordScreen />;
  }

  if (pathname === '/reset-password') {
    return <ResetPasswordScreen />;
  }

  if (pathname === '/privacy-policy') {
    return <PrivacyPolicy />;
  }

  if (pathname === '/terms-of-service') {
    return <TermsOfService />;
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
      <LoginScreen
        onLoginSuccess={handleLoginSuccess}
        onSwitchToRegister={() => setShowRegister(true)}
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
        <Footer sidebarCollapsed={sidebarCollapsed} />
      </div>
    </div>
  );
};

export default App;
