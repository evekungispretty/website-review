'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { MessageCircle, Search, Filter, ChevronDown, Eye, EyeOff } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible';

interface Comment {
  id: string;
  x: number;
  y: number;
  text: string;
  author: string;
  avatar: string;
  timestamp: Date;
  replies: Array<{
    id: string;
    text: string;
    author: string;
    avatar: string;
    timestamp: Date;
  }>;
}

interface CommentSidebarProps {
  comments: Comment[];
  onCommentClick: (commentId: string) => void;
  activeComment: string | null;
  isVisible: boolean;
  onToggleVisibility: () => void;
}

export function CommentSidebar({ 
  comments, 
  onCommentClick, 
  activeComment, 
  isVisible, 
  onToggleVisibility 
}: CommentSidebarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const filteredComments = comments.filter(comment => 
    comment.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comment.replies.some(reply => 
      reply.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reply.author.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  if (!isVisible) {
    return (
      <Button
        onClick={onToggleVisibility}
        className="fixed left-4 top-20 z-30"
        size="sm"
        variant="outline"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        Comments ({comments.length})
      </Button>
    );
  }

  return (
    <div className="fixed left-4 top-20 w-80 bg-white rounded-lg shadow-xl border z-30 max-h-[calc(100vh-120px)] flex flex-col">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4" />
              <h3>Comments</h3>
              <Badge variant="secondary">{comments.length}</Badge>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleVisibility();
                }}
              >
                {isVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent className="flex-1 flex flex-col min-h-0">
          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Comments List */}
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredComments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  {comments.length === 0 ? (
                    <>
                      <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                      <p>No comments yet</p>
                      <p className="text-sm mt-1">Click the Comment button to start reviewing</p>
                    </>
                  ) : (
                    <p>No comments match your search</p>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredComments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        activeComment === comment.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => onCommentClick(comment.id)}
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <img
                          src={comment.avatar}
                          alt={comment.author}
                          className="w-6 h-6 rounded-full"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm truncate">{comment.author}</span>
                            <span className="text-xs text-gray-500">
                              {formatTime(comment.timestamp)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2">
                            {comment.text || 'New comment...'}
                          </p>
                        </div>
                      </div>
                      
                      {comment.replies.length > 0 && (
                        <div className="flex items-center gap-2 text-xs text-gray-500">
                          <MessageCircle className="w-3 h-3" />
                          <span>{comment.replies.length} replies</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}