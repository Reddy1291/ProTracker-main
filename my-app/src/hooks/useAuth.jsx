import { useState, useEffect, createContext, useContext } from 'react';
import { userAPI, transformUser } from '../services/api';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // Check for stored auth on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('protrackr-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    try {
      const response = await userAPI.login(email, password);
      if (response.success) {
        const transformedUser = transformUser(response.user);
        setUser(transformedUser);
        localStorage.setItem('protrackr-user', JSON.stringify(transformedUser));
        return true;
      }
      throw new Error(response.message || "Invalid credentials");
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.response?.data?.message || "Invalid credentials. Please check your email and password.");
    }
  };

  const signup = async (name, email, password, role, department, year) => {
    try {
      const userData = {
        name,
        email,
        password,
        role,
        department: department || (role === 'student' ? 'Computer Science and Engineering (CSE)' : 'General'),
        year: role === 'student' ? (year || '1st Year') : null,
        avatarURL: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face`,
        bio: `New ${role} on ProTrackr`,
        publicProfile: true,
      };

      const response = await userAPI.signup(userData);
      if (response.success) {
        const transformedUser = transformUser(response.user);
        setUser(transformedUser);
        localStorage.setItem('protrackr-user', JSON.stringify(transformedUser));
        return true;
      }
      throw new Error(response.message || "Account creation failed");
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.response?.data?.message || "Account with this email already exists.");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('protrackr-user');
  };

  const updateProfile = async (updatedData) => {
    try {
      if (!user) return false;
      const updated = await userAPI.update(user.id, updatedData);
      const transformedUser = transformUser(updated);
      setUser(transformedUser);
      localStorage.setItem('protrackr-user', JSON.stringify(transformedUser));
      return true;
    } catch (error) {
      console.error('Update profile error:', error);
      return false;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      signup,
      updateProfile,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}