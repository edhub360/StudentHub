import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
}

const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Read actual logged-in user from localStorage (set during login/register flow)
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Initialize user from localStorage on mount
    const storedUserId = localStorage.getItem('user_id');
    const storedUserName = localStorage.getItem('userName');
    const storedUserEmail = localStorage.getItem('userEmail');

    if (storedUserId && storedUserEmail) {
      setUser({
        id: storedUserId,
        name: storedUserName || 'User',
        email: storedUserEmail,
      });
    }

    // Listen for storage changes (e.g., logout from another tab)
    const handleStorageChange = () => {
      const userId = localStorage.getItem('user_id');
      const userName = localStorage.getItem('userName');
      const userEmail = localStorage.getItem('userEmail');

      if (userId && userEmail) {
        setUser({
          id: userId,
          name: userName || 'User',
          email: userEmail,
        });
      } else {
        setUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};