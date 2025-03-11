
import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Check, X, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from './auth/AuthModal';

interface FileData {
  id: string;
  name: string;
  size: string;
  status: 'uploading' | 'complete' | 'error';
  progress: number;
  file: File;
}

const FileItem = ({ 
  name, 
  size, 
  status, 
  progress, 
  onRemove 
}: { 
  name: string; 
  size: string; 
  status: 'uploading' | 'complete' | 'error'; 
  progress: number;
  onRemove?: () => void;
}) => {
  return (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg mb-2 bg-white group">
      <div className="flex items-center space-x-3">
        <div className="text-primary">
          <FileText size={20} />
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{size}</p>
          
          {status === 'uploading' && (
            <div className="w-full mt-1">
              <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300 ease-out" 
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="flex items-center space-x-2">
        {status === 'uploading' && (
          <div className="text-muted-foreground text-xs mr-2">{progress}%</div>
        )}
        
        {status === 'complete' && (
          <div className="text-green-600">
            <Check size={18} />
          </div>
        )}
        
        {status === 'error' && (
          <div className="text-red-600">
            <AlertCircle size={18} />
          </div>
        )}
        
        {onRemove && (
          <button 
            onClick={onRemove}
            className="text-gray-400 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Remove file"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

const CaseUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FileData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isAuthenticated } = useAuth();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (!isAuthenticated) {
        setAuthModalOpen(true);
        return;
      }
      
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      if (!isAuthenticated) {
        setAuthModalOpen(true);
        return;
      }
      
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => {
      // Check file type
      const fileType = file.type;
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'text/plain',
        'application/rtf'
      ];
      
      if (!allowedTypes.includes(fileType)) {
        toast.error(`File type not supported: ${file.name}`);
        return null;
      }
      
      // Check file size (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`File too large: ${file.name} (max 50MB)`);
        return null;
      }
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: formatFileSize(file.size),
        status: 'uploading' as const,
        progress: 0,
        file
      };
    }).filter(Boolean) as FileData[];
    
    if (newFiles.length === 0) return;
    
    setFiles(prev => [...prev, ...newFiles]);
    setIsUploading(true);
    
    // Simulate file upload progress
    newFiles.forEach(file => {
      const upload = setInterval(() => {
        setFiles(prev => 
          prev.map(f => 
            f.id === file.id
              ? { 
                  ...f, 
                  progress: Math.min(f.progress + Math.floor(Math.random() * 10), 100),
                  status: f.progress + 10 >= 100 ? 'complete' as const : 'uploading' as const
                }
              : f
          )
        );
        
        // Check if all files are uploaded
        let allComplete = true;
        setFiles(prev => {
          allComplete = prev.every(f => f.status === 'complete');
          return prev;
        });
        
        if (allComplete) {
          setIsUploading(false);
          clearInterval(upload);
          toast.success("All files uploaded successfully!");
        }
      }, 300);
    });
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(file => file.id !== id));
  };
  
  const analyzeDocuments = () => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
      return;
    }
    
    if (files.length === 0) {
      toast.error("Please upload at least one document to analyze");
      return;
    }
    
    if (files.some(f => f.status === 'uploading')) {
      toast.error("Please wait for all files to finish uploading");
      return;
    }
    
    toast.success("Analysis started! You'll be notified when it's complete.");
    
    // Simulate analysis process
    setTimeout(() => {
      toast.success("Document analysis complete!");
    }, 3000);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <section id="upload" className="py-24 px-6 relative bg-gradient-to-b from-white to-secondary/40">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="animate-fade-up order-2 md:order-1">
            <div 
              className={cn(
                "rounded-xl border-2 border-dashed p-10 transition-all duration-300 text-center",
                dragActive ? "border-primary bg-primary/5" : "border-border"
              )}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.txt,.rtf"
              />
              
              <div className="mb-6 w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto text-primary">
                <Upload size={28} />
              </div>
              
              <h3 className="text-lg font-semibold mb-2">Upload your case documents</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Drop your files here or click to browse
              </p>
              
              <label htmlFor="file-upload">
                <Button 
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select Files
                </Button>
              </label>
              
              <p className="text-xs text-muted-foreground mt-4">
                Supports PDF, DOCX, TXT, RTF (max 50MB per file)
              </p>
            </div>
            
            {files.length > 0 && (
              <div className="mt-6 animate-fade-in">
                <h4 className="text-sm font-medium mb-3">Uploaded Files ({files.length})</h4>
                <div className="max-h-[250px] overflow-y-auto pr-2">
                  {files.map((file) => (
                    <FileItem 
                      key={file.id} 
                      name={file.name} 
                      size={file.size} 
                      status={file.status} 
                      progress={file.progress}
                      onRemove={() => removeFile(file.id)}
                    />
                  ))}
                </div>
                {files.some(f => f.status === 'complete') && (
                  <Button 
                    className="mt-4 w-full"
                    onClick={analyzeDocuments}
                    disabled={isUploading}
                  >
                    {isUploading ? 'Uploading...' : 'Analyze Documents'}
                  </Button>
                )}
              </div>
            )}
          </div>
          
          <div className="animate-fade-up [animation-delay:200ms] order-1 md:order-2">
            <div className="inline-flex items-center rounded-full px-3 py-1 text-sm font-medium bg-primary/10 text-primary mb-6">
              Document Analysis
            </div>
            <h2 className="heading-md mb-4 text-balance">
              Upload Your Case Documents for Instant AI Analysis
            </h2>
            <p className="text-muted-foreground mb-6">
              Simply upload your briefs, evidence, transcripts, and other case materials. 
              Our AI will swiftly analyze every document, extracting critical details and 
              uncovering insights you might have missed.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Comprehensive Analysis</h4>
                  <p className="text-sm text-muted-foreground">
                    Extract every critical detail from your documents in seconds
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Strengths & Weaknesses</h4>
                  <p className="text-sm text-muted-foreground">
                    Identify your strongest arguments and potential vulnerabilities
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mt-0.5 flex-shrink-0">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium">Research Recommendations</h4>
                  <p className="text-sm text-muted-foreground">
                    Receive suggestions for additional research and supporting evidence
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={authModalOpen} 
        onClose={() => setAuthModalOpen(false)}
        defaultTab="signin"
      />
    </section>
  );
};

export default CaseUpload;
