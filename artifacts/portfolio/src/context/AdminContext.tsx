import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { PortfolioData, ContactMessage, initialData } from '../data/initialData';
import { checkCredentials } from '../lib/credentials';

const API = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

async function apiFetch(path: string, options?: RequestInit) {
  const res = await fetch(`${API}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<unknown>;
}

function mongoToPortfolio(doc: Record<string, unknown>): PortfolioData {
  return {
    profile: (doc['profile'] as PortfolioData['profile']) ?? initialData.profile,
    skills: (doc['skills'] as PortfolioData['skills']) ?? initialData.skills,
    experience: (doc['experience'] as PortfolioData['experience']) ?? initialData.experience,
    projects: (doc['projects'] as PortfolioData['projects']) ?? initialData.projects,
    contactLinks: (doc['contactLinks'] as PortfolioData['contactLinks']) ?? initialData.contactLinks,
    messages: [],
  };
}

function mongoToMessages(docs: Record<string, unknown>[]): ContactMessage[] {
  return docs.map(d => ({
    id: (d['_id'] as string) ?? String(d['timestamp']),
    name: d['name'] as string,
    email: d['email'] as string,
    message: d['message'] as string,
    timestamp: d['timestamp'] as number,
    read: d['read'] as boolean,
  }));
}

interface AdminContextType {
  data: PortfolioData;
  loading: boolean;
  updateData: (newData: PortfolioData) => Promise<void>;
  addMessage: (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => Promise<void>;
  deleteMessage: (id: string) => Promise<void>;
  markMessageRead: (id: string) => Promise<void>;
  isAuthenticated: boolean;
  login: (username: string, pass: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioData>(initialData);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [portfolioRaw, messagesRaw] = await Promise.all([
        apiFetch('/portfolio').catch(() => null),
        apiFetch('/messages').catch(() => []),
      ]);

      const portfolio = portfolioRaw
        ? mongoToPortfolio(portfolioRaw as Record<string, unknown>)
        : { ...initialData, messages: [] };

      const messages = mongoToMessages((messagesRaw as Record<string, unknown>[]) ?? []);

      setData({ ...portfolio, messages });
    } catch {
      setData(initialData);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchAll();
    if (sessionStorage.getItem('isAdminAuthenticated') === 'true') {
      setIsAuthenticated(true);
    }
  }, [fetchAll]);

  const updateData = async (newData: PortfolioData) => {
    const { messages: _, ...portfolioOnly } = newData;
    try {
      const saved = await apiFetch('/portfolio', {
        method: 'PUT',
        body: JSON.stringify(portfolioOnly),
      }) as Record<string, unknown>;
      const portfolio = mongoToPortfolio(saved);
      setData(prev => ({ ...portfolio, messages: prev.messages }));
    } catch {
      setData(newData);
    }
  };

  const addMessage = async (msg: Omit<ContactMessage, 'id' | 'timestamp' | 'read'>) => {
    try {
      const saved = await apiFetch('/messages', {
        method: 'POST',
        body: JSON.stringify(msg),
      }) as Record<string, unknown>;
      const newMsg: ContactMessage = {
        id: saved['_id'] as string,
        name: saved['name'] as string,
        email: saved['email'] as string,
        message: saved['message'] as string,
        timestamp: saved['timestamp'] as number,
        read: false,
      };
      setData(prev => ({ ...prev, messages: [newMsg, ...prev.messages] }));
    } catch {
      const fallback: ContactMessage = {
        ...msg,
        id: `msg_${Date.now()}`,
        timestamp: Date.now(),
        read: false,
      };
      setData(prev => ({ ...prev, messages: [fallback, ...prev.messages] }));
    }
  };

  const deleteMessage = async (id: string) => {
    try {
      await apiFetch(`/messages/${id}`, { method: 'DELETE' });
    } catch {}
    setData(prev => ({ ...prev, messages: prev.messages.filter(m => m.id !== id) }));
  };

  const markMessageRead = async (id: string) => {
    try {
      await apiFetch(`/messages/${id}/read`, { method: 'PATCH' });
    } catch {}
    setData(prev => ({
      ...prev,
      messages: prev.messages.map(m => m.id === id ? { ...m, read: true } : m),
    }));
  };

  const login = (username: string, password: string): boolean => {
    if (checkCredentials(username, password)) {
      setIsAuthenticated(true);
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('isAdminAuthenticated');
  };

  return (
    <AdminContext.Provider value={{ data, loading, updateData, addMessage, deleteMessage, markMessageRead, isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) throw new Error('useAdmin must be used within an AdminProvider');
  return context;
};
