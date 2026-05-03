import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioData, ContactMessage, initialData } from '../data/initialData';

interface AdminContextType {
  data: PortfolioData;
  updateData: (newData: PortfolioData) => void;
  addMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => void;
  deleteMessage: (id: string) => void;
  markMessageRead: (id: string) => void;
  isAuthenticated: boolean;
  login: (pass: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedData = localStorage.getItem('portfolioData');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData) as PortfolioData;
        if (!parsed.messages) parsed.messages = [];
        setData(parsed);
      } catch {
        setData(initialData);
      }
    }
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const persist = (d: PortfolioData) => {
    setData(d);
    localStorage.setItem('portfolioData', JSON.stringify(d));
  };

  const updateData = (newData: PortfolioData) => persist(newData);

  const addMessage = (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg_${Date.now()}`,
      timestamp: Date.now(),
      read: false,
    };
    const updated = { ...data, messages: [newMsg, ...(data.messages || [])] };
    persist(updated);
  };

  const deleteMessage = (id: string) => {
    const updated = { ...data, messages: (data.messages || []).filter(m => m.id !== id) };
    persist(updated);
  };

  const markMessageRead = (id: string) => {
    const updated = {
      ...data,
      messages: (data.messages || []).map(m => m.id === id ? { ...m, read: true } : m),
    };
    persist(updated);
  };

  const login = (_pass: string) => false;

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
  };

  return (
    <AdminContext.Provider value={{ data, updateData, addMessage, deleteMessage, markMessageRead, isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
