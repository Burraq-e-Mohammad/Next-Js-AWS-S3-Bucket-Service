'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, File, Clock, ShieldCheck, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface FileInfo {
  name: string;
  size: number;
  type: string;
  lastModified: string;
  previewUrl?: string;
}

const formatFileType = (mime: string) => {
  if (!mime) return 'Unknown';
  if (mime.includes('wordprocessing') || mime.includes('msword')) return 'Word Document';
  if (mime.includes('spreadsheet') || mime.includes('excel')) return 'Excel Spreadsheet';
  if (mime.includes('presentation') || mime.includes('powerpoint')) return 'PowerPoint';
  if (mime.includes('pdf')) return 'PDF Document';
  if (mime.includes('zip') || mime.includes('compressed')) return 'ZIP Archive';
  if (mime.startsWith('image/')) return mime.replace('image/', '').toUpperCase() + ' Image';
  if (mime.startsWith('video/')) return mime.replace('video/', '').toUpperCase() + ' Video';
  if (mime.startsWith('audio/')) return mime.replace('audio/', '').toUpperCase() + ' Audio';
  if (mime.startsWith('text/')) return mime.replace('text/', '').toUpperCase() + ' Text';
  return 'Unknown Format';
};

export default function DownloadPage({ params }: { params: Promise<{ key: string[] }> }) {
  const resolvedParams = use(params);
  const fullKey = resolvedParams.key.join('/');
  
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  // Parse upload timestamp from key format: uploads/TIMESTAMP-filename
  const getUploadTime = () => {
    try {
      const parts = fullKey.split('/');
      const filenamePart = parts[parts.length - 1];
      const timestamp = parseInt(filenamePart.split('-')[0]);
      return isNaN(timestamp) ? null : timestamp;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await fetch(`/api/file-info?key=${encodeURIComponent(fullKey)}`);
        const data = await res.json();
        if (res.ok) {
          setFileInfo(data);
        } else {
          setError(data.error || 'File not found');
        }
      } catch {
        setError('Failed to load file information');
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [fullKey]);

  useEffect(() => {
    const uploadTime = getUploadTime();
    if (!uploadTime) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const tenMinutesInMs = 10 * 60 * 1000;
      const expiry = uploadTime + tenMinutesInMs;
      const remaining = Math.max(0, Math.floor((expiry - now) / 1000));
      
      setTimeLeft(remaining);

      if (remaining <= 0) {
        clearInterval(timer);
        setError('Link has expired');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [fullKey]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const res = await fetch('/api/generate-download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: fullKey }),
      });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to generate secure link');
      }
    } catch {
      alert('Network error');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-foreground/40 font-medium animate-pulse">Scanning secure link...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <div className="p-6 rounded-[2rem] glass border border-red-500/20 text-center max-w-md w-full">
          <div className="bg-red-500/10 p-4 rounded-2xl w-fit mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Access Revoked</h2>
          <p className="text-foreground/50 mb-8 font-medium">{error === 'Link has expired' ? 'This secure transfer has expired for your protection.' : 'We could not find the file you are looking for.'}</p>
          <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Go back to homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-4 md:py-8 lg:py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-morphism rounded-3xl p-6 lg:p-10 border border-white/5 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl -z-10" />
        
        <div className="flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-primary/5 rounded-2xl mb-4 relative flex items-center justify-center p-1.5 border border-white/10 shadow-inner">
            {fileInfo?.type?.startsWith('image/') ? (
              <img 
                src={fileInfo.previewUrl} 
                alt={fileInfo.name} 
                className="w-full h-full object-cover rounded-[14px]"
              />
            ) : fileInfo?.type?.startsWith('video/') ? (
              <video 
                src={fileInfo.previewUrl} 
                className="w-full h-full object-cover rounded-[14px]"
                muted
                loop
                autoPlay
                playsInline
              />
            ) : (
              <File className="w-10 h-10 text-primary/40" />
            )}
            
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }} 
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute -top-2 -right-2 z-10 bg-background rounded-full p-1 border border-white/5"
            >
              <CheckCircle2 className="w-6 h-6 text-accent fill-background relative -top-[1px] -left-[1px]" />
            </motion.div>
          </div>

          <h1 className="text-xl md:text-2xl font-extrabold mb-1 tracking-tight">
            File ready for pick-up
          </h1>
          <p className="text-foreground/40 text-sm font-medium mb-5">
            Secured via S3Transmit Cloud
          </p>

          <div className="w-full max-w-md space-y-3 mb-6">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 grid grid-cols-2 gap-3 text-left">
              <div className="col-span-2 border-b border-foreground/10 pb-3">
                <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-1">File Name</p>
                <p className="font-bold truncate text-lg" title={fileInfo?.name}>{fileInfo?.name}</p>
              </div>
              <div className="border-r border-foreground/10 pr-4">
                <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-1">Type</p>
                <p className="font-bold truncate text-sm" title={fileInfo?.type}>{fileInfo?.type ? formatFileType(fileInfo.type) : 'Unknown'}</p>
              </div>
              <div className="pl-2">
                <p className="text-xs text-foreground/40 uppercase tracking-widest font-bold mb-1">Size</p>
                <p className="font-bold text-sm text-foreground/90">{fileInfo ? (fileInfo.size / 1024 / 1024).toFixed(2) : '0'} MB</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <div className="flex-1 p-2.5 rounded-xl bg-accent/5 border border-accent/10 flex items-center gap-2 border-[0.5px]">
                <Clock className="w-4 h-4 text-accent" />
                <span className="text-xs font-bold text-accent/80">
                  Expires in {timeLeft !== null ? formatTime(timeLeft) : '...'}
                </span>
              </div>
              <div className="flex-1 p-2.5 rounded-xl bg-primary/5 border border-primary/10 flex items-center gap-2 border-[0.5px]">
                <ShieldCheck className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold text-primary/80 uppercase tracking-tighter">AES-256</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleDownload}
            disabled={isDownloading}
            className="w-full max-w-md py-4 rounded-xl bg-primary hover:bg-primary-hover text-white font-extrabold text-base transition-all shadow-xl shadow-primary/20 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-6 h-6 animate-spin" />
                Generating Secure Link...
              </>
            ) : (
              <>
                <Download className="w-6 h-6" />
                Download File
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className="mt-6 flex items-center justify-center gap-6 opacity-40">
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
          <ShieldCheck className="w-3 h-3" /> End-to-End Encryption
        </div>
        <div className="w-px h-4 bg-foreground/20" />
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
          <Clock className="w-4 h-4" /> Temporary Link
        </div>
      </div>
    </div>
  );
}

function CheckCircle2(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}
