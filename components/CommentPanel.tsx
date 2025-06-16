'use client';

import { useState } from 'react';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { X, Send, MoreHorizontal, Trash2, Edit } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import { CommentWithAuthor } from '../lib/supabase';

interface CommentPanelProps {
  comment: CommentWithAuthor | null;
  onClose: () => void;
  onReply: (commentId: string, reply: string) => Promise<void>;
  onUpdate: (commentId: string, text: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
}

export function CommentPanel({ comment, onClose, onReply, onUpdate, onDelete }: CommentPanelProps) {
  const [replyText, setReplyText] = useState('');
  const [isEditing, setIsEditing] = useState(!comment?.text);
  const [editText, setEditText] = useState(comment?.text || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, profile } = useAuth();

  if (!comment) return null;

  const handleReply = async () => {
    if (replyText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onReply(comment.id, replyText);
        setReplyText('');
      } catch (error) {
        console.error('Failed to add reply:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleUpdate = async () => {
    if (editText.trim() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        await onUpdate(comment.id, editText);
        setIsEditing(false);
      } catch (error) {
        console.error('Failed to update comment:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = async () => {
    if (!isSubmitting) {
      setIsSubmitting(true);
      try {
        await onDelete(comment.id);
        onClose();
      } catch (error) {
        console.error('Failed to delete comment:', error);
        setIsSubmitting(false);
      }
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
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

  const canEdit = user?.id === comment.author_id;

  return (
    <div className="fixed right-4 top-20 w-80 bg-white rounded-lg shadow-xl border z-30 max-h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h3>Comment Thread</h3>
        <Button variant="ghost" size="sm" onClick={onClose} disabled={isSubmitting}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Main Comment */}
        <div className="p-4 border-b">
          <div className="flex items-start gap-3">
            <img
              src={comment.author.avatar_url}
              alt={comment.author.name}
              className="w-8 h-8 rounded-full"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-muted-foreground">{comment.author.name}</span>
                <span className="text-xs text-muted-foreground">
                  {formatTime(comment.created_at)}
                </span>
                {canEdit && (
                  <DropdownMenu>
                    <DropdownMenuTrigger className="ml-auto" disabled={isSubmitting}>
                      <div className="h-6 w-6 p-0 rounded-md hover:bg-gray-100 flex items-center justify-center">
                        <MoreHorizontal className="w-3 h-3" />
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => setIsEditing(true)}>
                        <Edit className="w-3 h-3 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleDelete} className="text-destructive">
                        <Trash2 className="w-3 h-3 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-2">
                  <Textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    placeholder="Add your comment..."
                    className="min-h-[60px]"
                    autoFocus
                    disabled={isSubmitting}
                  />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={handleUpdate} disabled={isSubmitting || !editText.trim()}>
                      {isSubmitting ? 'Saving...' : 'Save'}
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditing(false);
                        setEditText(comment.text);
                      }}
                      disabled={isSubmitting}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <p className="text-sm">{comment.text || <em className="text-gray-400">Click edit to add text...</em>}</p>
              )}
            </div>
          </div>
        </div>

        {/* Replies */}
        {comment.replies.map((reply) => (
          <div key={reply.id} className="p-4 pl-8 border-b last:border-b-0">
            <div className="flex items-start gap-3">
              <img
                src={reply.author.avatar_url}
                alt={reply.author.name}
                className="w-6 h-6 rounded-full"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm text-muted-foreground">{reply.author.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(reply.created_at)}
                  </span>
                </div>
                <p className="text-sm">{reply.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reply Input */}
      <div className="p-4 border-t">
        <div className="flex items-start gap-3">
          <img
            src={profile?.avatar_url || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=face'}
            alt="You"
            className="w-6 h-6 rounded-full"
          />
          <div className="flex-1 space-y-2">
            <Textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Reply to this comment..."
              className="min-h-[60px] text-sm"
              disabled={isSubmitting}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleReply();
                }
              }}
            />
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">
                Press ⌘ + Enter to send
              </span>
              <Button 
                size="sm" 
                onClick={handleReply}
                disabled={!replyText.trim() || isSubmitting}
              >
                <Send className="w-3 h-3 mr-1" />
                {isSubmitting ? 'Sending...' : 'Reply'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}