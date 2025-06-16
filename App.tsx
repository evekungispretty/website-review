'use client';

import { useState, useCallback, useEffect } from 'react';
import { WebsiteViewer } from './components/WebsiteViewer';
import { CommentPanel } from './components/CommentPanel';
import { CommentSidebar } from './components/CommentSidebar';
import { LoginForm } from './components/LoginForm';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useComments } from './hooks/useComments';
import { toast } from 'sonner@2.0.3';
import { Toaster } from './components/ui/sonner';

function AppContent() {
  const [activeComment, setActiveComment] = useState<string | null>(null);
  const [sidebarVisible, setSidebarVisible] = useState(true);
  const [currentWebsiteUrl, setCurrentWebsiteUrl] = useState('');
  const { user, profile, loading: authLoading, isDemoMode } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('🔍 App state:', {
      hasUser: !!user,
      userEmail: user?.email,
      hasProfile: !!profile,
      profileName: profile?.name,
      authLoading,
      isDemoMode,
      currentWebsiteUrl,
    });
  }, [user, profile, authLoading, isDemoMode, currentWebsiteUrl]);

  const {
    comments,
    loading: commentsLoading,
    error: commentsError,
    addComment,
    updateComment,
    deleteComment,
    addReply,
  } = useComments(currentWebsiteUrl);

  // Listen for URL changes from WebsiteViewer
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'URL_CHANGE') {
        console.log('📍 URL changed to:', event.data.url);
        setCurrentWebsiteUrl(event.data.url);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleCommentAdd = useCallback(async (x: number, y: number): Promise<string | undefined> => {
    if (!currentWebsiteUrl) {
      toast.error('Please load a website first');
      return;
    }

    console.log('💬 Adding comment at:', { x, y, url: currentWebsiteUrl });

    try {
      const commentId = await addComment(x, y);
      toast.success('Comment added successfully');
      return commentId;
    } catch (error) {
      console.error('❌ Failed to add comment:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add comment');
      throw error;
    }
  }, [addComment, currentWebsiteUrl]);

  const handleCommentClick = useCallback((commentId: string) => {
    console.log('👆 Comment clicked:', commentId);
    setActiveComment(activeComment === commentId ? null : commentId);
  }, [activeComment]);

  const handleReply = useCallback(async (commentId: string, replyText: string) => {
    try {
      await addReply(commentId, replyText);
      toast.success('Reply added successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to add reply');
      throw error;
    }
  }, [addReply]);

  const handleCommentUpdate = useCallback(async (commentId: string, newText: string) => {
    try {
      await updateComment(commentId, newText);
      toast.success('Comment updated successfully');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update comment');
      throw error;
    }
  }, [updateComment]);

  const handleCommentDelete = useCallback(async (commentId: string) => {
    try {
      await deleteComment(commentId);
      toast.success('Comment deleted successfully');
      setActiveComment(null); // Close the comment panel
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to delete comment');
      throw error;
    }
  }, [deleteComment]);

  // Show loading state while checking authentication
  if (authLoading) {
    console.log('🔄 Showing loading state');
    return (
      <div className="h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Initializing app...</p>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!user) {
    console.log('🔐 Showing login form - no user found');
    return <LoginForm />;
  }

  console.log('✅ Showing main app for user:', user.email);

  const activeCommentData = comments.find(comment => comment.id === activeComment);

  // Show error state for comments
  if (commentsError) {
    console.error('💬 Comments error:', commentsError);
    // Only show toast once per error
    toast.error(`Comments error: ${commentsError}`);
  }

  return (
    <div className="h-screen bg-gray-100 relative">
      <WebsiteViewer
        onCommentAdd={handleCommentAdd}
        comments={comments}
        activeComment={activeComment}
        onCommentClick={handleCommentClick}
        loading={commentsLoading}
      />
      
      <CommentSidebar
        comments={comments}
        onCommentClick={handleCommentClick}
        activeComment={activeComment}
        isVisible={sidebarVisible}
        onToggleVisibility={() => setSidebarVisible(!sidebarVisible)}
      />
      
      {activeCommentData && (
        <CommentPanel
          comment={activeCommentData}
          onClose={() => setActiveComment(null)}
          onReply={handleReply}
          onUpdate={handleCommentUpdate}
          onDelete={handleCommentDelete}
        />
      )}

      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}