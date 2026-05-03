import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Mail, Copy, Check, MessageSquare, ExternalLink } from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { GradientText } from '../ui/GradientText';
import { MagneticButton } from '../ui/MagneticButton';

export function Contact() {
  const { data, addMessage } = useAdmin();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; message?: string }>({});
  const [copied, setCopied] = useState(false);

  const emailAddr = data.contactLinks.email;

  const copyEmail = () => {
    navigator.clipboard.writeText(emailAddr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const validate = () => {
    const errs: typeof errors = {};
    if (!name.trim()) errs.name = 'Name is required';
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) errs.email = 'Valid email required';
    if (!message.trim() || message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setErrors({});
    addMessage({ name: name.trim(), email: email.trim(), message: message.trim() });
    setSent(true);
    setName(''); setEmail(''); setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  const inputCls = "w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary/60 focus:bg-black/60 transition-all placeholder:text-white/25 font-mono";

  return (
    <section id="contact" className="py-20 sm:py-32 relative overflow-hidden">
      <div className="absolute -bottom-40 -right-40 w-[500px] h-[500px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-20 -left-20 w-[300px] h-[300px] bg-primary/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">

          {/* Left Side */}
          <div className="w-full lg:w-1/2 space-y-8 sm:space-y-10">
            <div>
              <h2 className="text-sm font-mono text-primary mb-4 uppercase tracking-widest">// Get in touch</h2>
              <GradientText as="h3" className="text-4xl sm:text-5xl md:text-7xl font-display tracking-tight mb-4 sm:mb-6">
                Let's Build Something Amazing.
              </GradientText>
              <p className="text-base sm:text-lg text-muted-foreground font-light leading-relaxed">
                Ready to take your digital presence to the next level? I'm currently available for freelance work and exciting opportunities.
              </p>
            </div>

            {/* Social Links */}
            <div className="grid grid-cols-3 gap-3">
              {data.contactLinks.whatsapp && (
                <a href={data.contactLinks.whatsapp} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border border-green-500/20 bg-green-500/5 hover:bg-green-500/15 hover:border-green-500/40 transition-all group">
                  <span className="text-xl">📱</span>
                  <span className="text-xs font-mono text-green-400 group-hover:text-green-300">WhatsApp</span>
                </a>
              )}
              {data.contactLinks.telegram && (
                <a href={data.contactLinks.telegram} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border border-blue-400/20 bg-blue-400/5 hover:bg-blue-400/15 hover:border-blue-400/40 transition-all group">
                  <span className="text-xl">✈️</span>
                  <span className="text-xs font-mono text-blue-400 group-hover:text-blue-300">Telegram</span>
                </a>
              )}
              {data.contactLinks.linkedin && (
                <a href={data.contactLinks.linkedin} target="_blank" rel="noopener noreferrer"
                  className="flex flex-col items-center gap-2 px-3 py-4 rounded-2xl border border-blue-600/20 bg-blue-600/5 hover:bg-blue-600/15 hover:border-blue-600/40 transition-all group">
                  <span className="text-xl">💼</span>
                  <span className="text-xs font-mono text-blue-300 group-hover:text-blue-200">LinkedIn</span>
                </a>
              )}
            </div>

            {/* Professional Email Card */}
            <div className="glass rounded-2xl border border-white/10 p-5 space-y-3">
              <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5 text-primary" />
                Direct Email
              </div>
              <div className="flex items-center justify-between gap-3">
                <a
                  href={`mailto:${emailAddr}`}
                  className="text-base sm:text-lg font-mono font-medium text-white hover:text-primary transition-colors flex items-center gap-2 min-w-0 group"
                >
                  <span className="truncate">{emailAddr}</span>
                  <ExternalLink className="w-4 h-4 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
                <button
                  onClick={copyEmail}
                  className="shrink-0 flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg border border-white/10 hover:border-primary/40 hover:bg-primary/10 transition-all text-muted-foreground hover:text-primary"
                >
                  {copied ? <><Check className="w-3.5 h-3.5 text-green-400" /><span className="text-green-400">Copied!</span></> : <><Copy className="w-3.5 h-3.5" />Copy</>}
                </button>
              </div>
              <div className="h-px bg-gradient-to-r from-primary/30 via-accent/20 to-transparent" />
              <p className="text-xs text-muted-foreground font-mono">Typically replies within 24 hours</p>
            </div>
          </div>

          {/* Right Side: Working Form */}
          <div className="w-full lg:w-1/2">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="glass p-6 sm:p-10 rounded-3xl border border-white/10 relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-br from-primary/20 to-accent/20 rounded-[1.6rem] blur opacity-20 pointer-events-none" />

              <div className="relative space-y-5">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-4 h-4 text-primary" />
                  <span className="text-sm font-mono text-muted-foreground uppercase tracking-wider">Send a Message</span>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="John Doe"
                        className={`${inputCls} ${errors.name ? 'border-red-500/50' : ''}`}
                      />
                      {errors.name && <p className="text-red-400 text-xs font-mono">{errors.name}</p>}
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Email *</label>
                      <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="john@example.com"
                        className={`${inputCls} ${errors.email ? 'border-red-500/50' : ''}`}
                      />
                      {errors.email && <p className="text-red-400 text-xs font-mono">{errors.email}</p>}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Message *</label>
                    <textarea
                      rows={5}
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Tell me about your project or idea..."
                      className={`${inputCls} resize-none ${errors.message ? 'border-red-500/50' : ''}`}
                    />
                    {errors.message && <p className="text-red-400 text-xs font-mono">{errors.message}</p>}
                    <p className="text-xs text-white/20 font-mono text-right">{message.length} chars</p>
                  </div>

                  {sent ? (
                    <div className="w-full py-4 rounded-xl bg-green-500/10 border border-green-500/30 text-green-400 text-center font-mono text-sm flex items-center justify-center gap-2">
                      <Check className="w-5 h-5" />
                      Message sent! I'll reply soon.
                    </div>
                  ) : (
                    <MagneticButton type="submit" className="w-full py-4 text-base flex items-center justify-center gap-2">
                      Send Message <Send className="w-4 h-4" />
                    </MagneticButton>
                  )}
                </form>

                <p className="text-xs text-center text-muted-foreground font-mono opacity-50">
                  Your message is stored privately and only visible to me.
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
