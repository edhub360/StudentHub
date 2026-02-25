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
import SubscriptionSuccess from './Components/Screens/SubscriptionSuccess';
import SubscriptionCancel from './Components/Screens/SubscriptionCancel';
import { sendChatMessage } from './services/chatapi';
import { FlashcardScreen } from './Components/Screens/FlashcardScreen';
import CourseScreen from './Components/Screens/CourseScreen';
import NotebookScreen from './Components/Screens/NotebookScreen';
import DashboardScreen, { TabId } from './Components/Screens/DashboardScreen';
import StudyPlanScreen from './Components/Screens/StudyPlanScreen';
import SettingsScreen from './Components/Screens/SettingsScreen';
import { FeatureGate } from './Components/common/FeatureGate';
import { clearTokens, getStoredTokens } from './services/TokenManager';
import { logout } from './services/loginApi';
import CSBotScreen from './Components/Screens/CSBotScreen';
import { SubscriptionTier, hasFeatureAccess, type FeatureAccess } from './utils/featureAccess';
//const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;;

interface NavigationItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<any>;
  hasAccess?: boolean; 
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
  const [userTier, setUserTier] = useState<SubscriptionTier>(
    (localStorage.getItem('subscription_tier') || null) as SubscriptionTier
  );
  const [isSubscriptionLoading, setIsSubscriptionLoading] = useState(
    !localStorage.getItem('subscription_tier')  // ✅ only load if not cached
  );
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

    console.log('🔍 Checking subscription status:', {
      pathname: location.pathname,
      hasSubscription,
      subscription_tier: storedUser?.subscription_tier
    });

    if (!hasSubscription) {
      console.log('❌ No subscription - showing subscription page');
      setShowSubscriptionPage(true);
      setUserStatus({
        has_seen_subscription: false,
        has_active_subscription: false,
        subscription: null,
      });
      setUserTier('expired');                          // ✅ logged in but no plan
      localStorage.removeItem('subscription_tier');
      localStorage.removeItem('subscription_status');
    } else {
      console.log('✅ Has subscription - showing dashboard');
      setShowSubscriptionPage(false);
      setUserStatus({
        has_seen_subscription: true,
        has_active_subscription: true,
        subscription: { plan_id: storedUser.subscription_tier, status: 'active' },
      });
      // SET TIER FROM localStorage
      const tierValue: string = storedUser.subscription_tier?.toLowerCase().trim() || 'free';
      const tier = tierValue as SubscriptionTier;

      localStorage.setItem('subscription_tier', tierValue); // ✅ string, no error
      localStorage.setItem('subscription_status', 'active');
      setUserTier(tier);   
    }
    setIsSubscriptionLoading(false); 
      
  }, [isLoggedIn, userId, location.pathname]);

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
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const tierValue: string = storedUser.subscription_tier?.toLowerCase().trim() || 'free';
      const tier = tierValue as SubscriptionTier;

      setUserTier(tier);
      localStorage.setItem('subscription_tier', tierValue);
      localStorage.setItem('subscription_status', 'active');
      setShowSubscriptionPage(false);
      setUserStatus({
        has_seen_subscription: true,
        has_active_subscription: true,
        subscription: { plan_id: tierValue, status: 'active' },
      });
    } else {
      console.log('📋 No subscription - Showing subscription page');
      setUserTier('expired');
      localStorage.removeItem('subscription_tier');
      localStorage.removeItem('subscription_status');
      setShowSubscriptionPage(true);
      setUserStatus({
        has_seen_subscription: false,
        has_active_subscription: false,
        subscription: null,
      });
    }
    setIsSubscriptionLoading(false);
  };

  // ✅ Handle Logout
  const handleLogout = async () => {
    try {
      const { accessToken } = getStoredTokens();
      if (accessToken) {
        await logout(accessToken); // revokes refresh token in DB
      }
    } catch (e) {
      console.error('Logout API error (non-critical):', e);
      // Don't block logout if API fails
    } finally {
      // Clear all token keys (new + legacy)
      clearTokens();

      // Clear all other app state from localStorage
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
      localStorage.removeItem('userName');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('user_id');
      localStorage.removeItem('subscription_tier');
      localStorage.removeItem('subscription_status');

      // Reset app state
      setIsLoggedIn(false);
      setUserStatus(null);
      setUserTier(null);
      setShowSubscriptionPage(false);
      // Dynamic — works on Mac, Windows, Linux
      // Respects basename in dev ('/') and prod ('/StudentHub/')
      // Full reload wipes ALL React state (no stale data)
      window.location.href = `${window.location.origin}${import.meta.env.BASE_URL}`;
    }
  };

  const handleSubscriptionComplete = () => {
    const storedUserRaw = localStorage.getItem('user');
    if (storedUserRaw) {
      const storedUser = JSON.parse(storedUserRaw);
      storedUser.subscription_tier = 'free';
      localStorage.setItem('user', JSON.stringify(storedUser));
      localStorage.setItem('subscription_tier', 'free');
      localStorage.setItem('subscription_status', 'active');
    }
    setUserTier('free');
    setShowSubscriptionPage(false);
    setUserStatus({
      has_seen_subscription: true,
      has_active_subscription: true,
      subscription: { plan_id: 'free', status: 'active' },
    });
  };

  // Feature mapping
  const featureMap: Record<TabId, keyof import('./utils/featureAccess').FeatureAccess> = {
    'home': 'dashboard',
    'chat': 'aiChat',
    'flashcards': 'flashcard',
    'quiz': 'quiz',
    'courses': 'courses',
    'study planner': 'studyPlanner',
    'notes': 'notebook',
    'upload': 'screenshot',
    'settings': 'dashboard',
  };

  // navigation — guard with isSubscriptionLoading
  const navigation: NavigationItem[] = [
    { id: 'home',          label: 'Dashboard',       icon: Home },
    { id: 'chat',          label: 'AI Chat',          icon: MessageCircle },
    { id: 'flashcards',    label: 'Flashcards',       icon: FileText },
    { id: 'quiz',          label: 'Quiz Mode',        icon: Brain },
    { id: 'courses',       label: 'Courses',          icon: BookOpen },
    { id: 'study planner', label: 'Study Planner',    icon: BarChart3 },
    { id: 'notes',         label: 'Notes',            icon: BookOpen },
    { id: 'upload',        label: 'Screenshot Solve', icon: Upload },
  ].map(item => ({
    ...item,
    hasAccess: isSubscriptionLoading          // no lock flash during load
      ? true
      : hasFeatureAccess(userTier, featureMap[item.id as TabId])
  })) as NavigationItem[];


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
        return (
          <FeatureGate feature="dashboard" tier={userTier}>
            <DashboardScreen setActiveTab={setActiveTab} />
          </FeatureGate>
        );
        
      case "chat":
        return (
          <FeatureGate feature="aiChat" tier={userTier}>
            <ChatScreen
              chatMessages={chatMessages}
              chatInput={chatInput}
              setChatInput={setChatInput}
              handleSendMessage={handleSendMessage}
            />
          </FeatureGate>
        );
        
      case "flashcards":
        return (
          <FeatureGate feature="flashcard" tier={userTier}>
            <FlashcardScreen />
          </FeatureGate>
        );

      case 'quiz':
        return (
          <FeatureGate feature="quiz" tier={userTier}>
            <QuizScreen />
          </FeatureGate>
        );

      case 'courses':
        return (
          <FeatureGate feature="courses" tier={userTier}>
            <CourseScreen />
          </FeatureGate>
        );

      case 'study planner':
        return (
          <FeatureGate feature="studyPlanner" tier={userTier}>
            <StudyPlanScreen />
          </FeatureGate>
        );

      case 'notes':
        return (
          <FeatureGate feature="notebook" tier={userTier}>
            <NotebookScreen />
          </FeatureGate>
        );

      case 'upload':
        return (
          <FeatureGate feature="screenshot" tier={userTier}>
            <UploadScreen />
          </FeatureGate>
        );

      case 'settings':
        return <SettingsScreen />;
        
      default:
        return (
          <FeatureGate feature="dashboard" tier={userTier}>
            <DashboardScreen setActiveTab={setActiveTab} />
          </FeatureGate>
        );
    }
  };


  // ✅ For HashRouter, use location.pathname (HashRouter handles this correctly)
  const pathname = location.pathname.replace('/StudentHub', '') || '/';

  // Debug log to see what pathname we're getting
  console.log('🔍 Current pathname:', pathname);

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

  // ✅ Subscription Success Route
  if (pathname === '/success') {
    console.log('✅ Showing SubscriptionSuccess page');
    return <SubscriptionSuccess />;
  }

  // ✅ Subscription Cancel Route
  if (pathname === '/cancel') {
    console.log('✅ Showing SubscriptionCancel page');
    return <SubscriptionCancel />;
  }

  // ✅ ADD THIS: Manual Subscription/Upgrade Route
  if (pathname === '/subscription' && isLoggedIn && userId) {
    console.log('✅ Showing Subscription/Upgrade page');
    return (
      <SubscriptionWrapper
        isFirstTime={false} // Not first time, manual upgrade
        userId={userId}
        onComplete={() => {
          // After completing upgrade, navigate back to settings
          window.location.hash = '/StudentHub/settings';
        }}
      />
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

      <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'lg:ml-16' : 'lg:ml-64'
        }`}>
        <Header
          sidebarCollapsed={sidebarCollapsed}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          activeTab={activeTab}
          onLogout={handleLogout}
          setActiveTab={setActiveTab} 
        />

        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
        <Footer sidebarCollapsed={sidebarCollapsed} />
      </div>

      {/* ✅ CS Bot — fixed bottom-right, only shown when logged in */}
      <CSBotScreen />

    </div>
  );
};

export default App;
