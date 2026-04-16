'use client';

import { motion } from 'framer-motion';
import { BookOpen, ShieldCheck, Zap, HardDrive, Share2, Clock } from 'lucide-react';
import Link from 'next/link';

export default function DocsPage() {
  const sections = [
    {
      title: "How it Works",
      desc: "S3 Transmit acts as a secure, memory-only gateway to Amazon S3. When you upload a file, it is streamed immediately to the cloud without being stored on our local disks.",
      icon: <Zap className="w-6 h-6 text-primary" />
    },
    {
      title: "Secure Architecture",
      desc: "We use AES-256 standard encryption and TLS 1.3 for all data transfers. Your connection to S3 Transmit is always encrypted from end-to-end.",
      icon: <ShieldCheck className="w-6 h-6 text-accent" />
    },
    {
      title: "Expiring Links",
      desc: "For maximum privacy, every upload generates a unique 'Pre-signed URL'. This link is valid for exactly 10 minutes, after which the file becomes inaccessible to the public.",
      icon: <Clock className="w-6 h-6 text-primary" />
    },
    {
      title: "Storage Model",
      desc: "Files are stored in highly durable S3 buckets. As an admin-managed service, we provide the infrastructure so you don't need your own AWS account.",
      icon: <HardDrive className="w-6 h-6 text-accent" />
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
          <BookOpen className="w-3 h-3" />
          Documentation
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Technical <span className="text-primary">Overview</span>
        </h1>
        <p className="text-foreground/60 text-lg max-w-2xl mx-auto leading-relaxed">
          Everything you need to know about how S3 Transmit handles your data, ensures privacy, and manages professional file transfers.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        {sections.map((section, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl glass-morphism border border-white/5 hover:border-primary/20 transition-all group"
          >
            <div className="p-3 bg-white/5 rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              {section.icon}
            </div>
            <h3 className="text-xl font-bold mb-3">{section.title}</h3>
            <p className="text-foreground/50 leading-relaxed font-medium">
              {section.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="p-12 rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-accent/5 border border-white/10 text-center"
      >
        <h2 className="text-3xl font-bold mb-4">Ready to transfer?</h2>
        <p className="text-foreground/60 mb-8 max-w-xl mx-auto">
          Start uploading your assets with the confidence of enterprise-grade security and temporary access control.
        </p>
        <Link href="/" className="inline-flex items-center gap-2 px-8 py-4 bg-primary hover:bg-primary-hover text-white rounded-2xl font-bold transition-all shadow-xl shadow-primary/20">
          <Share2 className="w-5 h-5" />
          Go to Dashboard
        </Link>
      </motion.div>
    </div>
  );
}
