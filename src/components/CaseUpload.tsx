
import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Upload, FileText, Check, X } from 'lucide-react';

const FileItem = ({ name, size, status }: { name: string, size: string, status: 'uploading' | 'complete' | 'error' }) => {
  return (
    <div className="flex items-center justify-between p-3 border border-border rounded-lg mb-2 bg-white">
      <div className="flex items-center space-x-3">
        <div className="text-primary">
          <FileText size={20} />
        </div>
        <div>
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground">{size}</p>
        </div>
      </div>
      <div>
        {status === 'uploading' && (
          <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
        )}
        {status === 'complete' && (
          <div className="text-green-600">
            <Check size={18} />
          </div>
        )}
        {status === 'error' && (
          <div className="text-red-600">
            <X size={18} />
          </div>
        )}
      </div>
    </div>
  );
};

const CaseUpload = () => {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<{ name: string, size: string, status: 'uploading' | 'complete' | 'error' }[]>([]);

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
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).map(file => ({
      name: file.name,
      size: formatFileSize(file.size),
      status: 'uploading' as const
    }));
    
    setFiles([...files, ...newFiles]);
    
    // Simulate file upload completion
    setTimeout(() => {
      setFiles(prev => 
        prev.map((file, i) => 
          i >= prev.length - newFiles.length
            ? { ...file, status: 'complete' as const }
            : file
        )
      );
    }, 2000);
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
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
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
                  {files.map((file, index) => (
                    <FileItem key={index} {...file} />
                  ))}
                </div>
                {files.some(f => f.status === 'complete') && (
                  <Button className="mt-4 w-full">
                    Analyze Documents
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
    </section>
  );
};

export default CaseUpload;
