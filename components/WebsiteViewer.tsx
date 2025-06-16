'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Globe, MessageCircle, Users, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { UserProfile } from './UserProfile';
import { CommentWithAuthor } from '../lib/supabase';

interface WebsiteViewerProps {
  onCommentAdd: (x: number, y: number) => Promise<string | undefined>;
  comments: CommentWithAuthor[];
  activeComment: string | null;
  onCommentClick: (commentId: string) => void;
  loading: boolean;
}

export function WebsiteViewer({ onCommentAdd, comments, activeComment, onCommentClick, loading }: WebsiteViewerProps) {
  const [url, setUrl] = useState('https://example.com');
  const [currentUrl, setCurrentUrl] = useState('');
  const [isCommenting, setIsCommenting] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { profile } = useAuth();

  const handleLoadWebsite = () => {
    if (url) {
      setCurrentUrl(url);
      // Send URL change message to parent
      window.postMessage({ type: 'URL_CHANGE', url }, '*');
    }
  };

  const handleContainerClick = async (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCommenting && containerRef.current && !isAddingComment) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      setIsAddingComment(true);
      try {
        const commentId = await onCommentAdd(x, y);
        if (commentId) {
          onCommentClick(commentId);
        }
      } catch (error) {
        console.error('Failed to add comment:', error);
      } finally {
        setIsAddingComment(false);
        setIsCommenting(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLoadWebsite();
    }
  };

  const toggleCommentMode = () => {
    setIsCommenting(!isCommenting);
  };

  const exitCommentMode = () => {
    setIsCommenting(false);
  };

  // Get unique team members from comments
  const teamMembers = Array.from(
    new Map(
      comments
        .flatMap(comment => [comment.author, ...comment.replies.map(r => r.author)])
        .map(author => [author.id, author])
    ).values()
  ).slice(0, 5); // Show max 5 avatars

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 border-b bg-white">
        <div className="flex items-center gap-2 flex-1">
          <Globe className="w-4 h-4 text-gray-500" />
          <Input
            type="url"
            placeholder="Enter website URL (e.g., https://example.com)"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
            disabled={isCommenting}
          />
          <Button 
            onClick={handleLoadWebsite} 
            variant="default"
            disabled={isCommenting || !url.trim()}
          >
            Load
          </Button>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            variant={isCommenting ? "default" : "outline"}
            size="sm"
            onClick={toggleCommentMode}
            className="flex items-center gap-2"
            disabled={!currentUrl || isAddingComment}
          >
            <MessageCircle className="w-4 h-4" />
            {isAddingComment ? 'Adding...' : isCommenting ? 'Exit Comment' : 'Add Comment'}
          </Button>
          
          {teamMembers.length > 0 && (
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-gray-500" />
              <div className="flex -space-x-1">
                {teamMembers.map((member) => (
                  <img 
                    key={member.id}
                    src={member.avatar_url} 
                    alt={member.name} 
                    className="w-6 h-6 rounded-full border-2 border-white"
                    title={member.name}
                  />
                ))}
                {comments.length > 5 && (
                  <div className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs">
                    +{comments.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}

          <UserProfile />
        </div>
      </div>

      {/* Comment Mode Banner */}
      {isCommenting && (
        <div className="bg-blue-500 text-white px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4" />
            <span>Comment Mode Active - Click anywhere on the website to add a comment</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={exitCommentMode}
            className="text-white hover:bg-blue-600"
          >
            <X className="w-4 h-4" />
            Exit
          </Button>
        </div>
      )}

      {/* Website Display Area */}
      <div 
        ref={containerRef}
        className={`flex-1 relative ${
          isCommenting && !isAddingComment ? 'cursor-crosshair' : 'cursor-default'
        }`}
        onClick={handleContainerClick}
      >
        {currentUrl ? (
          <>
            <iframe
              ref={iframeRef}
              src={currentUrl}
              className="w-full h-full border-0"
              title="Website Preview"
              sandbox="allow-scripts allow-same-origin"
              style={{
                pointerEvents: isCommenting ? 'none' : 'auto'
              }}
            />
            
            {/* Overlay to capture clicks when in comment mode */}
            {isCommenting && (
              <div 
                className="absolute inset-0 bg-transparent cursor-crosshair"
                style={{ zIndex: 5 }}
              />
            )}
            
            {/* Comment Overlays */}
            {comments.map((comment) => (
              <div
                key={comment.id}
                className={`absolute w-8 h-8 rounded-full border-2 cursor-pointer transition-all ${
                  activeComment === comment.id
                    ? 'border-blue-500 bg-blue-500 shadow-lg scale-110 z-20'
                    : 'border-blue-400 bg-blue-400 hover:scale-105 z-10'
                }`}
                style={{
                  left: comment.x_position - 16,
                  top: comment.y_position - 16,
                  zIndex: isCommenting ? 15 : 10,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isCommenting) {
                    onCommentClick(comment.id);
                  }
                }}
                title={`${comment.author.name}: ${comment.text || 'New comment'}`}
              >
                <div className="flex items-center justify-center w-full h-full">
                  <MessageCircle className="w-4 h-4 text-white" />
                </div>
                
                {/* Comment count badge */}
                {comment.replies.length > 0 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center text-xs">
                    {comment.replies.length + 1}
                  </div>
                )}
              </div>
            ))}
          </>
        ) : (
          <div className="flex items-center justify-center h-full bg-gray-50">
            <div className="text-center">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg mb-2">No website loaded</h3>
              <p className="text-gray-500 mb-4">Enter a URL above to start reviewing a website</p>
              <Button onClick={() => setUrl('https://example.com')} variant="outline">
                Try Example.com
              </Button>
            </div>
          </div>
        )}

        {isAddingComment && (
          <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-2 rounded-lg shadow-lg z-30">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Adding comment...
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
            <div className="bg-white px-4 py-2 rounded-lg shadow-lg">
              Loading comments...
            </div>
          </div>
        )}
      </div>
    </div>
  );
}