import React, { useState, useRef } from 'react';
import { useAdmin } from '@/context/AdminContext';
import { GradientText } from '@/components/ui/GradientText';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Save, LogOut, Eye, Upload, Download, Mail, Image as ImageIcon, Bell, Key, User, Lock, ArrowLeft } from 'lucide-react';
import type { PortfolioData, Skill, Experience, Project, ContactMessage } from '@/data/initialData';
import { getCredentials, saveCredentials, checkCredentials, MASTER_RECOVERY_KEY } from '@/lib/credentials';

type LoginView = 'login' | 'forgot-key' | 'forgot-reset';

function LoginPage({ onLogin }: { onLogin: (u: string, p: string) => boolean }) {
  const [view, setView] = useState<LoginView>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const [recoveryKey, setRecoveryKey] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onLogin(username, password)) setError('Invalid username or password');
  };

  const handleRecoveryKey = (e: React.FormEvent) => {
    e.preventDefault();
    if (recoveryKey === MASTER_RECOVERY_KEY) {
      setRecoveryError('');
      setView('forgot-reset');
    } else {
      setRecoveryError('Invalid recovery key');
    }
  };

  const handleReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim()) { setResetError('Username required'); return; }
    if (newPassword.length < 6) { setResetError('Password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setResetError('Passwords do not match'); return; }
    saveCredentials({ username: newUsername.trim(), password: newPassword });
    setResetSuccess(true);
    toast({ title: 'Credentials Updated', description: 'You can now login with your new credentials.' });
    setTimeout(() => { setView('login'); setResetSuccess(false); setNewUsername(''); setNewPassword(''); setConfirmPassword(''); setRecoveryKey(''); }, 2000);
  };

  const inputCls = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors font-mono text-sm placeholder:text-white/25";

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #00d4ff, #7000ff)', top: '-5rem', left: '-5rem' }} />
        <div className="absolute w-96 h-96 rounded-full opacity-10 blur-3xl" style={{ background: 'radial-gradient(circle, #ff006e, #7000ff)', bottom: '-5rem', right: '-5rem' }} />
      </div>

      <div className="glass p-8 rounded-2xl w-full max-w-md relative border border-white/10">
        {view === 'login' && (
          <>
            <div className="text-center mb-8">
              <GradientText as="h1" className="text-3xl mb-2">Admin Panel</GradientText>
              <p className="text-muted-foreground font-mono text-sm">LHY Mashrafe Portfolio</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-2">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" className={inputCls} autoComplete="username" />
              </div>
              <div>
                <label className="block text-xs font-mono text-muted-foreground uppercase mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" className={inputCls} autoComplete="current-password" />
              </div>
              {error && <p className="text-destructive text-sm font-mono">{error}</p>}
              <button type="submit" className="w-full bg-primary text-primary-foreground font-medium py-3 rounded-lg hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all font-mono">
                Access Dashboard
              </button>
              <button type="button" onClick={() => { setView('forgot-key'); setError(''); }} className="w-full text-muted-foreground hover:text-primary text-xs font-mono transition-colors py-1">
                Forgot credentials? Use recovery key
              </button>
            </form>
          </>
        )}

        {view === 'forgot-key' && (
          <>
            <button onClick={() => setView('login')} className="flex items-center gap-2 text-muted-foreground hover:text-white text-sm font-mono mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Login
            </button>
            <div className="text-center mb-8">
              <Key className="w-10 h-10 text-primary mx-auto mb-3" />
              <h2 className="text-2xl font-display text-white mb-1">Recovery</h2>
              <p className="text-muted-foreground font-mono text-xs">Enter your master recovery key</p>
            </div>
            <form onSubmit={handleRecoveryKey} className="space-y-4">
              <input type="password" value={recoveryKey} onChange={e => setRecoveryKey(e.target.value)} placeholder="Enter recovery key..." className={inputCls} autoComplete="off" />
              {recoveryError && <p className="text-destructive text-sm font-mono">{recoveryError}</p>}
              <button type="submit" className="w-full bg-primary text-primary-foreground py-3 rounded-lg hover:bg-primary/90 transition-all font-mono">
                Verify Key
              </button>
            </form>
          </>
        )}

        {view === 'forgot-reset' && (
          <>
            <div className="text-center mb-8">
              <Lock className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <h2 className="text-2xl font-display text-white mb-1">Set New Credentials</h2>
              <p className="text-muted-foreground font-mono text-xs">Create a new username and password</p>
            </div>
            {resetSuccess ? (
              <div className="text-center py-6 text-green-400 font-mono">
                <div className="text-4xl mb-3">✓</div>
                <p>Credentials updated successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleReset} className="space-y-4">
                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-2">New Username</label>
                  <input type="text" value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="Enter new username" className={inputCls} autoComplete="new-password" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-2">New Password</label>
                  <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="Enter new password" className={inputCls} autoComplete="new-password" />
                </div>
                <div>
                  <label className="block text-xs font-mono text-muted-foreground uppercase mb-2">Confirm Password</label>
                  <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" className={inputCls} autoComplete="new-password" />
                </div>
                {resetError && <p className="text-destructive text-sm font-mono">{resetError}</p>}
                <button type="submit" className="w-full bg-green-500/20 border border-green-500/40 text-green-400 py-3 rounded-lg hover:bg-green-500/30 transition-all font-mono">
                  Confirm & Update
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function Admin() {
  const { data, updateData, deleteMessage, markMessageRead, isAuthenticated, logout } = useAdmin();
  const [activeTab, setActiveTab] = useState('profile');
  const { toast } = useToast();
  const [localData, setLocalData] = useState<PortfolioData>(() => JSON.parse(JSON.stringify(data)));
  const unreadCount = (data.messages || []).filter(m => !m.read).length;

  const handleLogin = (username: string, password: string): boolean => {
    if (checkCredentials(username, password)) {
      sessionStorage.setItem('isAdminAuthenticated', 'true');
      window.location.reload();
      return true;
    }
    return false;
  };

  if (!isAuthenticated) return <LoginPage onLogin={handleLogin} />;

  const save = (newData: PortfolioData) => {
    setLocalData(newData);
    updateData(newData);
    toast({ title: 'Saved ✓', description: 'Changes saved successfully.' });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(localData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'portfolio-data.json'; a.click();
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string) as PortfolioData;
        if (!parsed.messages) parsed.messages = [];
        save(parsed);
        setLocalData(parsed);
      } catch { toast({ title: 'Error', description: 'Invalid JSON file.' }); }
    };
    reader.readAsText(file);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'skills', label: 'Skills', icon: '⚡' },
    { id: 'experience', label: 'Experience', icon: '💼' },
    { id: 'projects', label: 'Projects', icon: '🚀' },
    { id: 'contact', label: 'Contact', icon: '📬' },
    { id: 'messages', label: 'Messages', icon: '💬', badge: unreadCount },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row font-sans">
      <aside className="w-full md:w-64 glass border-r border-white/10 p-6 flex flex-col shrink-0">
        <div className="mb-8">
          <GradientText as="div" className="text-xl font-mono font-bold">LHY Admin</GradientText>
          <p className="text-xs text-muted-foreground mt-1 font-mono">Portfolio Manager</p>
        </div>
        <nav className="flex-1 space-y-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-2.5 rounded-lg font-mono text-sm transition-all flex items-center justify-between group ${activeTab === tab.id ? 'bg-primary/20 text-primary border border-primary/30' : 'text-muted-foreground hover:bg-white/5 hover:text-white border border-transparent hover:border-white/10'}`}
            >
              <span className="flex items-center gap-2">
                <span>{tab.icon}</span>
                {tab.label}
              </span>
              {tab.badge && tab.badge > 0 && (
                <span className="text-xs bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center font-bold animate-pulse">{tab.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-6 space-y-2">
          <button onClick={exportData} className="w-full flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg hover:bg-white/5 hover:border-white/20 text-sm font-mono text-muted-foreground transition-all">
            <Download className="w-4 h-4" /> Export JSON
          </button>
          <label className="w-full flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg hover:bg-white/5 hover:border-white/20 text-sm font-mono text-muted-foreground transition-all cursor-pointer">
            <Upload className="w-4 h-4" /> Import JSON
            <input type="file" accept=".json" className="hidden" onChange={importData} />
          </label>
          <a href="/" target="_blank" rel="noopener noreferrer" className="w-full flex items-center gap-2 px-4 py-2.5 border border-white/10 rounded-lg hover:bg-white/5 hover:border-white/20 text-sm font-mono text-muted-foreground transition-all">
            <Eye className="w-4 h-4" /> View Site
          </a>
          <button onClick={logout} className="w-full flex items-center gap-2 px-4 py-2.5 bg-destructive/10 text-destructive rounded-lg hover:bg-destructive/20 text-sm font-mono transition-all border border-destructive/20">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-3xl mx-auto space-y-6">
          {activeTab === 'profile' && <ProfileTab data={localData} onChange={setLocalData} onSave={save} />}
          {activeTab === 'skills' && <SkillsTab data={localData} onChange={setLocalData} onSave={save} />}
          {activeTab === 'experience' && <ExperienceTab data={localData} onChange={setLocalData} onSave={save} />}
          {activeTab === 'projects' && <ProjectsTab data={localData} onChange={setLocalData} onSave={save} />}
          {activeTab === 'contact' && <ContactTab data={localData} onChange={setLocalData} onSave={save} />}
          {activeTab === 'messages' && <MessagesTab messages={data.messages || []} onDelete={deleteMessage} onMarkRead={markMessageRead} />}
          {activeTab === 'settings' && <SettingsTab toast={toast} logout={logout} />}
        </div>
      </main>
    </div>
  );
}

function SectionHeader({ title, onSave }: { title: string; onSave: () => void }) {
  return (
    <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
      <h2 className="text-2xl font-display capitalize">{title}</h2>
      <button onClick={onSave} className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2 rounded-lg hover:bg-primary/90 hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] font-mono text-sm transition-all">
        <Save className="w-4 h-4" /> Save
      </button>
    </div>
  );
}

const inputCls = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors font-mono text-sm placeholder:text-white/25";

function ImageUploadField({ label, value, onChange }: { label: string; value: string; onChange: (val: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('Image too large. Please use an image under 2MB.'); return; }
    const reader = new FileReader();
    reader.onload = ev => onChange(ev.target?.result as string);
    reader.readAsDataURL(file);
  };
  return (
    <div className="space-y-2">
      <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</label>
      <div className="flex gap-2">
        <input className={`${inputCls} flex-1`} value={value} onChange={e => onChange(e.target.value)} placeholder="Paste URL or upload file..." />
        <button type="button" onClick={() => fileRef.current?.click()} className="shrink-0 flex items-center gap-1.5 px-3 py-2 border border-white/10 rounded-lg hover:border-primary/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all text-sm font-mono" title="Upload image from device">
          <ImageIcon className="w-4 h-4" /> Upload
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>
      {value && (
        <div className="mt-2 rounded-lg overflow-hidden border border-white/10 w-20 h-20">
          <img src={value} alt="preview" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  );
}

function ProfileTab({ data, onChange, onSave }: { data: PortfolioData; onChange: (d: PortfolioData) => void; onSave: (d: PortfolioData) => void }) {
  const p = data.profile;
  const set = (key: string, val: string) => onChange({ ...data, profile: { ...p, [key]: val } });
  return (
    <div>
      <SectionHeader title="Profile" onSave={() => onSave(data)} />
      <div className="space-y-4">
        <div className="space-y-2"><label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">Name</label><input className={inputCls} value={p.name} onChange={e => set('name', e.target.value)} /></div>
        <div className="space-y-2"><label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">Title</label><input className={inputCls} value={p.title} onChange={e => set('title', e.target.value)} /></div>
        <div className="space-y-2"><label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">Bio</label><textarea className={inputCls} rows={4} value={p.bio} onChange={e => set('bio', e.target.value)} style={{ resize: 'none' }} /></div>
        <ImageUploadField label="Profile Image" value={p.profileImageUrl} onChange={val => set('profileImageUrl', val)} />
        <div className="space-y-2"><label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">Resume URL</label><input className={inputCls} value={p.resumeUrl} onChange={e => set('resumeUrl', e.target.value)} placeholder="https://..." /></div>
      </div>
    </div>
  );
}

function SkillsTab({ data, onChange, onSave }: { data: PortfolioData; onChange: (d: PortfolioData) => void; onSave: (d: PortfolioData) => void }) {
  const categories = ['Languages', 'Frontend', 'Backend', 'Database', 'DevOps', 'Core Concepts'];
  const addSkill = () => onChange({ ...data, skills: [...data.skills, { id: Date.now().toString(), name: 'New Skill', category: 'Frontend', proficiency: 80 }] });
  const updateSkill = (id: string, key: keyof Skill, value: string | number) => onChange({ ...data, skills: data.skills.map(s => s.id === id ? { ...s, [key]: value } : s) });
  const deleteSkill = (id: string) => onChange({ ...data, skills: data.skills.filter(s => s.id !== id) });
  return (
    <div>
      <SectionHeader title="Skills" onSave={() => onSave(data)} />
      <button onClick={addSkill} className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-mono mb-4 hover:bg-primary/30 transition-all"><Plus className="w-4 h-4" /> Add Skill</button>
      <div className="space-y-3">
        {data.skills.map(skill => (
          <div key={skill.id} className="glass p-4 rounded-xl border border-white/10 hover:border-white/20 flex flex-col sm:flex-row gap-3 items-start sm:items-center transition-all">
            <input className={`${inputCls} flex-1`} value={skill.name} onChange={e => updateSkill(skill.id, 'name', e.target.value)} />
            <select className={`${inputCls} w-full sm:w-44`} value={skill.category} onChange={e => updateSkill(skill.id, 'category', e.target.value)}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <div className="flex items-center gap-2 w-full sm:w-36">
              <input type="range" min={0} max={100} value={skill.proficiency} onChange={e => updateSkill(skill.id, 'proficiency', parseInt(e.target.value))} className="flex-1 accent-primary" />
              <span className="text-primary font-mono text-xs w-8 text-right">{skill.proficiency}%</span>
            </div>
            <button onClick={() => deleteSkill(skill.id)} className="text-destructive hover:text-destructive/80 p-2 shrink-0 hover:bg-destructive/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceTab({ data, onChange, onSave }: { data: PortfolioData; onChange: (d: PortfolioData) => void; onSave: (d: PortfolioData) => void }) {
  const addExp = () => onChange({ ...data, experience: [...data.experience, { id: Date.now().toString(), title: 'New Role', company: 'Company', date: '2024-Present', description: ['Description here'], techStack: [] }] });
  const updateExp = (id: string, key: keyof Experience, value: string | string[]) => onChange({ ...data, experience: data.experience.map(e => e.id === id ? { ...e, [key]: value } : e) });
  const deleteExp = (id: string) => onChange({ ...data, experience: data.experience.filter(e => e.id !== id) });
  return (
    <div>
      <SectionHeader title="Experience" onSave={() => onSave(data)} />
      <button onClick={addExp} className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-mono mb-4 hover:bg-primary/30 transition-all"><Plus className="w-4 h-4" /> Add Experience</button>
      <div className="space-y-4">
        {data.experience.map(exp => (
          <div key={exp.id} className="glass p-6 rounded-xl border border-white/10 hover:border-white/20 space-y-3 transition-all">
            <div className="flex gap-3"><input className={`${inputCls} flex-1`} value={exp.title} onChange={e => updateExp(exp.id, 'title', e.target.value)} /><button onClick={() => deleteExp(exp.id)} className="text-destructive p-2 shrink-0 hover:bg-destructive/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button></div>
            <div className="flex gap-3 flex-wrap"><input className={`${inputCls} flex-1`} value={exp.company} onChange={e => updateExp(exp.id, 'company', e.target.value)} /><input className={`${inputCls} w-36`} value={exp.date} onChange={e => updateExp(exp.id, 'date', e.target.value)} /></div>
            <textarea className={inputCls} rows={3} value={exp.description.join('\n')} onChange={e => updateExp(exp.id, 'description', e.target.value.split('\n'))} placeholder="One bullet per line" style={{ resize: 'none' }} />
            <input className={inputCls} value={exp.techStack.join(', ')} onChange={e => updateExp(exp.id, 'techStack', e.target.value.split(',').map(t => t.trim()))} placeholder="Tech1, Tech2" />
          </div>
        ))}
      </div>
    </div>
  );
}

function ProjectsTab({ data, onChange, onSave }: { data: PortfolioData; onChange: (d: PortfolioData) => void; onSave: (d: PortfolioData) => void }) {
  const addProject = () => onChange({ ...data, projects: [...data.projects, { id: Date.now().toString(), title: 'New Project', category: 'Web App', status: 'In Progress', techStack: [], description: '' }] });
  const updateProject = (id: string, key: keyof Project, value: string | string[]) => onChange({ ...data, projects: data.projects.map(p => p.id === id ? { ...p, [key]: value } : p) });
  const deleteProject = (id: string) => onChange({ ...data, projects: data.projects.filter(p => p.id !== id) });
  return (
    <div>
      <SectionHeader title="Projects" onSave={() => onSave(data)} />
      <button onClick={addProject} className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-mono mb-4 hover:bg-primary/30 transition-all"><Plus className="w-4 h-4" /> Add Project</button>
      <div className="space-y-4">
        {data.projects.map(project => (
          <div key={project.id} className="glass p-6 rounded-xl border border-white/10 hover:border-white/20 space-y-3 transition-all">
            <div className="flex gap-3"><input className={`${inputCls} flex-1`} value={project.title} onChange={e => updateProject(project.id, 'title', e.target.value)} /><button onClick={() => deleteProject(project.id)} className="text-destructive p-2 shrink-0 hover:bg-destructive/10 rounded-lg transition-all"><Trash2 className="w-4 h-4" /></button></div>
            <textarea className={inputCls} rows={2} value={project.description || ''} onChange={e => updateProject(project.id, 'description', e.target.value)} placeholder="Description" style={{ resize: 'none' }} />
            <div className="flex gap-3 flex-wrap">
              <select className={`${inputCls} w-36`} value={project.category} onChange={e => updateProject(project.id, 'category', e.target.value)}>{['Web App', 'Mobile', 'Open Source', 'Design'].map(c => <option key={c}>{c}</option>)}</select>
              <select className={`${inputCls} w-36`} value={project.status} onChange={e => updateProject(project.id, 'status', e.target.value)}>{['Live', 'In Progress', 'Archived'].map(s => <option key={s}>{s}</option>)}</select>
            </div>
            <input className={inputCls} value={project.techStack.join(', ')} onChange={e => updateProject(project.id, 'techStack', e.target.value.split(',').map(t => t.trim()))} placeholder="React, Node.js, ..." />
            <ImageUploadField label="Project Image" value={project.imageUrl || ''} onChange={val => updateProject(project.id, 'imageUrl', val)} />
            <div className="flex gap-3 flex-wrap">
              <input className={`${inputCls} flex-1`} value={project.liveUrl || ''} onChange={e => updateProject(project.id, 'liveUrl', e.target.value)} placeholder="Live URL" />
              <input className={`${inputCls} flex-1`} value={project.sourceUrl || ''} onChange={e => updateProject(project.id, 'sourceUrl', e.target.value)} placeholder="Source URL" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ContactTab({ data, onChange, onSave }: { data: PortfolioData; onChange: (d: PortfolioData) => void; onSave: (d: PortfolioData) => void }) {
  const c = data.contactLinks;
  const set = (key: string, val: string) => onChange({ ...data, contactLinks: { ...c, [key]: val } });
  return (
    <div>
      <SectionHeader title="Contact Links" onSave={() => onSave(data)} />
      <div className="space-y-4">
        {[{ key: 'email', label: 'Email', placeholder: 'you@example.com' }, { key: 'whatsapp', label: 'WhatsApp URL', placeholder: 'https://wa.me/...' }, { key: 'linkedin', label: 'LinkedIn URL', placeholder: 'https://linkedin.com/in/...' }, { key: 'telegram', label: 'Telegram URL', placeholder: 'https://t.me/...' }, { key: 'github', label: 'GitHub URL', placeholder: 'https://github.com/...' }, { key: 'twitter', label: 'Twitter/X URL', placeholder: 'https://twitter.com/...' }].map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2">
            <label className="block text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</label>
            <input className={inputCls} value={(c as unknown as Record<string, string>)[key] || ''} onChange={e => set(key, e.target.value)} placeholder={placeholder} />
          </div>
        ))}
      </div>
    </div>
  );
}

function MessagesTab({ messages, onDelete, onMarkRead }: { messages: ContactMessage[]; onDelete: (id: string) => void; onMarkRead: (id: string) => void }) {
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const handleSelect = (msg: ContactMessage) => { setSelected(msg); if (!msg.read) onMarkRead(msg.id); };
  const formatDate = (ts: number) => new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  return (
    <div>
      <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-display">Messages</h2>
          {messages.filter(m => !m.read).length > 0 && <span className="text-xs bg-red-500 text-white rounded-full px-2 py-0.5 font-mono font-bold animate-pulse">{messages.filter(m => !m.read).length} new</span>}
        </div>
        <Bell className="w-5 h-5 text-muted-foreground" />
      </div>
      {messages.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground"><Mail className="w-12 h-12 mx-auto mb-4 opacity-20" /><p className="font-mono text-sm">No messages yet.</p><p className="font-mono text-xs mt-1 opacity-50">Messages from your contact form will appear here.</p></div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="w-full lg:w-2/5 space-y-2">
            {messages.map(msg => (
              <button key={msg.id} onClick={() => handleSelect(msg)} className={`w-full text-left p-4 rounded-xl border transition-all hover:border-white/20 ${selected?.id === msg.id ? 'border-primary/50 bg-primary/10' : 'border-white/10 glass'} ${!msg.read ? 'border-l-2 border-l-primary' : ''}`}>
                <div className="flex items-start justify-between gap-2"><div className="min-w-0"><p className={`text-sm font-mono truncate ${!msg.read ? 'text-white font-bold' : 'text-white/80'}`}>{msg.name}</p><p className="text-xs text-muted-foreground truncate font-mono">{msg.email}</p></div>{!msg.read && <span className="w-2 h-2 rounded-full bg-primary mt-1 shrink-0" />}</div>
                <p className="text-xs text-muted-foreground truncate mt-2">{msg.message}</p>
                <p className="text-xs text-white/20 mt-1 font-mono">{formatDate(msg.timestamp)}</p>
              </button>
            ))}
          </div>
          <div className="flex-1">
            {selected ? (
              <div className="glass p-6 rounded-xl border border-white/10 space-y-4 h-full">
                <div className="flex justify-between items-start">
                  <div><p className="font-mono font-bold text-white text-lg">{selected.name}</p><a href={`mailto:${selected.email}`} className="text-primary font-mono text-sm hover:underline">{selected.email}</a><p className="text-xs text-white/30 font-mono mt-1">{formatDate(selected.timestamp)}</p></div>
                  <button onClick={() => { onDelete(selected.id); setSelected(null); }} className="text-destructive hover:text-destructive/80 p-2 border border-destructive/20 rounded-lg hover:bg-destructive/10 transition-all"><Trash2 className="w-4 h-4" /></button>
                </div>
                <div className="h-px bg-white/10" />
                <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{selected.message}</p>
                <a href={`mailto:${selected.email}`} className="inline-flex items-center gap-2 text-sm font-mono text-primary hover:text-primary/80 mt-2"><Mail className="w-4 h-4" /> Reply via Email</a>
              </div>
            ) : (
              <div className="glass p-6 rounded-xl border border-white/5 h-full flex items-center justify-center text-muted-foreground"><p className="font-mono text-sm">Select a message to view</p></div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SettingsTab({ toast, logout }: { toast: ReturnType<typeof useToast>['toast']; logout: () => void }) {
  const [currentCreds] = useState(getCredentials());
  const [newUsername, setNewUsername] = useState(currentCreds.username);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const iCls = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:border-primary outline-none transition-colors font-mono text-sm placeholder:text-white/25";

  const saveUsername = () => {
    if (!newUsername.trim()) { setUsernameError('Username cannot be empty'); return; }
    const creds = getCredentials();
    saveCredentials({ ...creds, username: newUsername.trim() });
    setUsernameError('');
    toast({ title: 'Username Updated ✓', description: `New username: ${newUsername.trim()}` });
  };

  const savePassword = () => {
    const creds = getCredentials();
    if (oldPassword !== creds.password) { setPasswordError('Current password is incorrect'); return; }
    if (newPassword.length < 6) { setPasswordError('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { setPasswordError('Passwords do not match'); return; }
    saveCredentials({ ...creds, password: newPassword });
    setPasswordError('');
    setOldPassword(''); setNewPassword(''); setConfirmPassword('');
    toast({ title: 'Password Updated ✓', description: 'Your password has been changed. Please re-login.' });
    setTimeout(() => { logout(); }, 2000);
  };

  return (
    <div>
      <div className="border-b border-white/10 pb-4 mb-6"><h2 className="text-2xl font-display">Settings</h2></div>
      <div className="space-y-6">
        {/* Change Username */}
        <div className="glass p-6 rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2"><User className="w-4 h-4 text-primary" /><h3 className="font-mono text-sm text-white uppercase tracking-wider">Change Username</h3></div>
          <input className={iCls} value={newUsername} onChange={e => setNewUsername(e.target.value)} placeholder="New username" autoComplete="off" />
          {usernameError && <p className="text-destructive text-xs font-mono">{usernameError}</p>}
          <button onClick={saveUsername} className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-mono hover:bg-primary/30 transition-all"><Save className="w-4 h-4" /> Update Username</button>
        </div>

        {/* Change Password */}
        <div className="glass p-6 rounded-xl border border-white/10 space-y-4">
          <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-primary" /><h3 className="font-mono text-sm text-white uppercase tracking-wider">Change Password</h3></div>
          <input type="password" className={iCls} value={oldPassword} onChange={e => setOldPassword(e.target.value)} placeholder="Current password" autoComplete="current-password" />
          <input type="password" className={iCls} value={newPassword} onChange={e => setNewPassword(e.target.value)} placeholder="New password (min 6 chars)" autoComplete="new-password" />
          <input type="password" className={iCls} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Confirm new password" autoComplete="new-password" />
          {passwordError && <p className="text-destructive text-xs font-mono">{passwordError}</p>}
          <button onClick={savePassword} className="flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 px-4 py-2 rounded-lg text-sm font-mono hover:bg-primary/30 transition-all"><Key className="w-4 h-4" /> Update Password</button>
        </div>

        <div className="glass p-4 rounded-xl border border-white/5">
          <p className="text-xs text-muted-foreground font-mono">Portfolio data is persisted to browser localStorage. Use Export JSON to back up your data.</p>
        </div>
      </div>
    </div>
  );
}
