
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { File, Trash2, DownloadCloud, Search, Plus, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import AuthModal from '@/components/auth/AuthModal';
import { useNavigate } from 'react-router-dom';

interface CaseFile {
  id: string;
  name: string;
  type: string;
  size: string;
  uploadDate: string;
  status: 'analyzed' | 'pending';
}

const CaseManager = () => {
  const { isAuthenticated, user } = useAuth();
  const [files, setFiles] = useState<CaseFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!isAuthenticated) {
      setAuthModalOpen(true);
    } else {
      // Simulate loading files
      setTimeout(() => {
        // Mock data
        setFiles([
          {
            id: '1',
            name: 'Brief-Smith-v-Johnson.pdf',
            type: 'PDF',
            size: '1.2 MB',
            uploadDate: '2023-06-15',
            status: 'analyzed'
          },
          {
            id: '2',
            name: 'Evidence-Exhibit-A.docx',
            type: 'DOCX',
            size: '3.5 MB',
            uploadDate: '2023-06-14',
            status: 'analyzed'
          },
          {
            id: '3',
            name: 'Witness-Testimony.pdf',
            type: 'PDF',
            size: '2.8 MB',
            uploadDate: '2023-06-10',
            status: 'pending'
          }
        ]);
        setIsLoading(false);
      }, 1500);
    }
  }, [isAuthenticated]);
  
  const handleDeleteFile = (id: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      setFiles(prev => prev.filter(file => file.id !== id));
      toast.success('File deleted successfully');
    }
  };
  
  const handleAnalyzeFile = (id: string) => {
    toast.success('Analysis started! You\'ll be notified when it\'s complete.');
    
    // Simulate analysis process
    setTimeout(() => {
      setFiles(prev => 
        prev.map(file => 
          file.id === id 
            ? { ...file, status: 'analyzed' as const } 
            : file
        )
      );
      toast.success('Document analysis complete!');
    }, 3000);
  };
  
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="h-16 md:h-20"></div> {/* Spacer for navigation */}
        <div className="max-w-7xl mx-auto py-16 px-6 text-center">
          <h1 className="text-3xl font-bold mb-6">Case Manager</h1>
          <p className="text-muted-foreground mb-8">Please sign in to access your case files</p>
          <Button onClick={() => setAuthModalOpen(true)}>Sign In</Button>
          <AuthModal 
            isOpen={authModalOpen} 
            onClose={() => setAuthModalOpen(false)}
            defaultTab="signin"
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background">
      <div className="h-16 md:h-20"></div> {/* Spacer for navigation */}
      
      <div className="max-w-7xl mx-auto py-16 px-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Case Manager</h1>
            <p className="text-muted-foreground">
              Manage and analyze your uploaded case documents
            </p>
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-4">
            <Button 
              variant="outline" 
              className="gap-2"
              onClick={() => navigate('/')}
            >
              <Search className="h-4 w-4" />
              Explore
            </Button>
            <Button 
              className="gap-2"
              onClick={() => navigate('/#upload')}
            >
              <Plus className="h-4 w-4" />
              Upload New Case
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading your case files...</p>
          </div>
        ) : files.length > 0 ? (
          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Size</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Upload Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {files.map((file) => (
                    <tr key={file.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <File className="h-5 w-5 text-primary mr-3" />
                          <span className="font-medium">{file.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {file.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {file.size}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {file.uploadDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          file.status === 'analyzed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {file.status === 'analyzed' ? 'Analyzed' : 'Pending Analysis'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                        <div className="flex justify-end space-x-2">
                          {file.status === 'pending' && (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleAnalyzeFile(file.id)}
                            >
                              Analyze
                            </Button>
                          )}
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => toast.success(`Download started for ${file.name}`)}
                          >
                            <DownloadCloud className="h-4 w-4" />
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteFile(file.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-lg shadow-md">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <File className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No case files yet</h2>
            <p className="text-muted-foreground mb-6">
              Upload your first case documents to get started
            </p>
            <Button 
              onClick={() => navigate('/#upload')}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Upload Documents
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CaseManager;
