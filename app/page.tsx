'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, File, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [msg, setMsg] = useState('');
  const [uploadUrl, setUploadUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleUpload = async () => {
    if (!file) return;
    
    setIsUploading(true);
    setMsg('');
    setUploadUrl('');
    setStatus('idle');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      
      if (res.ok) {
        setStatus('success');
        setMsg(`Successfully uploaded: ${file.name}`);
        setUploadUrl(data.url);
      } else {
        setStatus('error');
        setMsg(data.error || 'Upload failed. Please try again.');
      }
    } catch (err) {
      setStatus('error');
      setMsg('A connection error occurred.');
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = () => {
    setFile(null);
    setMsg('');
    setUploadUrl('');
    setStatus('idle');
  };

  return (
    <div className="w-full flex flex-col items-center">
      {/* Hero Section - Explicitly Centered */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12 w-full max-w-4xl px-4"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold mb-4 tracking-tight leading-tight">
          Reliable <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">S3 Storage</span>
        </h1>
        <p className="text-foreground/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">
          High-performance file transmission directly to our secure AWS S3 bucket. 
          Encrypted, private, and lightning fast.
        </p>
      </motion.div>

      {/* Upload Card - Centered via Parent Flex */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="glass-morphism rounded-[2rem] p-8 md:p-12 relative overflow-hidden w-full max-w-2xl shadow-2xl border border-white/10"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-accent/10 blur-3xl -z-10" />

        <div className="space-y-8">
          {!file ? (
            <div className="group relative">
              <input 
                type="file" 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="border-2 border-dashed border-border group-hover:border-primary/50 transition-all duration-300 rounded-2xl p-12 text-center flex flex-col items-center gap-4 bg-white/5 group-hover:bg-primary/5">
                <div className="p-4 bg-primary/10 rounded-full group-hover:scale-110 transition-transform duration-300">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <p className="text-lg font-bold mb-1">Click to upload or drag and drop</p>
                  <p className="text-sm text-foreground/40 font-medium">Any file type (max. 10MB)</p>
                </div>
              </div>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between p-6 rounded-2xl bg-white/5 border border-white/10 shadow-lg"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="p-3 bg-primary/20 rounded-xl shrink-0">
                  <File className="w-6 h-6 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="font-bold truncate max-w-[200px] md:max-w-md">{file.name}</p>
                  <p className="text-xs text-foreground/40">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button 
                onClick={removeFile}
                disabled={isUploading}
                className="p-2 hover:bg-white/10 rounded-full transition-colors text-foreground/40 hover:text-foreground shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>
          )}

          <div className="flex flex-col gap-4">
            <button
              onClick={handleUpload}
              disabled={!file || isUploading}
              className={`
                w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300
                ${!file || isUploading 
                  ? 'bg-white/5 text-foreground/20 cursor-not-allowed' 
                  : 'bg-primary text-white hover:bg-primary-hover shadow-lg shadow-primary/25 active:scale-[0.98]'
                }
              `}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Transferring Data...
                </>
              ) : (
                'Confirm Transfer'
              )}
            </button>

            <AnimatePresence>
              {status !== 'idle' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4"
                >
                  <div className={`flex items-start gap-3 p-4 rounded-xl border ${
                    status === 'success' 
                      ? 'bg-green-500/10 border-green-500/20 text-green-400' 
                      : 'bg-red-500/10 border-red-500/20 text-red-400'
                  }`}>
                    {status === 'success' ? (
                      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm font-semibold leading-snug">{msg}</p>
                  </div>

                  {status === 'success' && uploadUrl && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-1.5 pl-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between gap-3"
                    >
                      <span className="text-xs font-mono text-foreground/40 truncate flex-grow">
                        {uploadUrl}
                      </span>
                      <div className="flex items-center gap-1">
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(uploadUrl);
                            alert('Link copied to clipboard!');
                          }}
                          className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-primary hover:text-primary-hover tooltip"
                          title="Copy Link"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-copy"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
                        </button>
                        <a 
                          href={uploadUrl} 
                          target="_blank" 
                          className="p-2.5 hover:bg-white/10 rounded-lg transition-colors text-foreground/40 hover:text-foreground"
                          title="Open in new tab"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-external-link"><path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/></svg>
                        </a>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>

      {/* Feature Grid - Centered & Structured */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 w-full max-w-5xl px-4">
        {[
          { title: 'Secure Transfer', desc: 'Enterprise-grade encryption for every byte transmitted.', icon: '🛡️' },
          { title: 'Global Reach', desc: 'Built for high-speed uploads across AWS global edge locations.', icon: '🌍' },
          { title: 'Privacy First', desc: 'No local storage. Your files move directly from memory to S3.', icon: '💾' },
        ].map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className="p-8 rounded-3xl glass-morphism border border-white/5 hover:border-primary/30 transition-all duration-300 group"
          >
            <div className="text-3xl mb-4 group-hover:scale-110 transition-transform duration-300">{feature.icon}</div>
            <h3 className="font-bold text-lg mb-2 text-foreground/90">{feature.title}</h3>
            <p className="text-foreground/50 text-sm leading-relaxed font-medium">{feature.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}