import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
}

// Default to null
const AuthContext = createContext<AuthContextType>({ user: null });

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  // Mocking a logged-in user for demonstration of analytics
  // In a real app, this would come from your auth provider (e.g., Firebase, Auth0, custom JWT)
  const [user] = useState<User | null>({
    id: "758d445a-c49b-4c0a-ac64-d500c9b8908f", 
    name: "Demo User",
    email: "demo@edhub360.com"
  });

  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};