'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase, CommentWithAuthor, isDemoMode, mockComments } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function useComments(websiteUrl: string) {
  const [comments, setComments] = useState<CommentWithAuthor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, profile } = useAuth();

  const fetchComments = useCallback(async () => {
    if (!websiteUrl) {
      setComments([]);
      setLoading(false);
      return;
    }

    if (isDemoMode) {
      // In demo mode, filter mock comments by website URL
      const filteredComments = mockComments.filter(comment => comment.website_url === websiteUrl);
      setComments(filteredComments);
      setLoading(false);
      return;
    }

    if (!supabase) {
      setError('Supabase client not configured');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Fetch comments with author information
      const { data: commentsData, error: commentsError } = await supabase
        .from('comments')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('website_url', websiteUrl)
        .order('created_at', { ascending: true });

      if (commentsError) {
        console.error('❌ Error fetching comments:', commentsError);
        throw commentsError;
      }

      // Fetch replies for each comment
      const commentsWithReplies = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: repliesData, error: repliesError } = await supabase
            .from('comment_replies')
            .select(`
              *,
              author:profiles(*)
            `)
            .eq('comment_id', comment.id)
            .order('created_at', { ascending: true });

          if (repliesError) {
            console.error('❌ Error fetching replies:', repliesError);
            throw repliesError;
          }

          return {
            ...comment,
            replies: repliesData || [],
          };
        })
      );

      console.log('✅ Fetched comments:', commentsWithReplies.length);
      setComments(commentsWithReplies as CommentWithAuthor[]);
    } catch (err) {
      console.error('❌ Error in fetchComments:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch comments');
    } finally {
      setLoading(false);
    }
  }, [websiteUrl]);

  const addComment = useCallback(async (x: number, y: number, text: string = '') => {
    if (!user) {
      throw new Error('Must be logged in to add comments');
    }

    if (!profile) {
      throw new Error('Profile not loaded yet. Please wait and try again.');
    }

    console.log('💬 Adding comment:', { x, y, text, userId: user.id, websiteUrl });

    if (isDemoMode) {
      // In demo mode, add comment to local state
      const newComment: CommentWithAuthor = {
        id: Date.now().toString(),
        website_url: websiteUrl,
        x_position: x,
        y_position: y,
        text,
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: profile,
        replies: [],
      };

      setComments(prev => [...prev, newComment]);
      return newComment.id;
    }

    if (!supabase) {
      throw new Error('Supabase client not configured');
    }

    try {
      console.log('📝 Inserting comment into database...');
      
      const { data, error } = await supabase
        .from('comments')
        .insert({
          website_url: websiteUrl,
          x_position: x,
          y_position: y,
          text,
          author_id: user.id,
        })
        .select(`
          *,
          author:profiles(*)
        `)
        .single();

      if (error) {
        console.error('❌ Database error adding comment:', error);
        throw error;
      }

      console.log('✅ Comment added successfully:', data);

      const newComment: CommentWithAuthor = {
        ...data,
        replies: [],
      };

      setComments(prev => [...prev, newComment]);
      return data.id;
    } catch (err) {
      console.error('❌ Error in addComment:', err);
      
      // Provide more specific error messages
      if (err instanceof Error) {
        if (err.message.includes('foreign key')) {
          throw new Error('Profile not found. Please refresh the page and try again.');
        } else if (err.message.includes('null value')) {
          throw new Error('Missing required data. Please ensure you are logged in.');
        } else {
          throw new Error(`Failed to add comment: ${err.message}`);
        }
      }
      
      throw new Error('Failed to add comment');
    }
  }, [user, profile, websiteUrl]);

  const updateComment = useCallback(async (commentId: string, text: string) => {
    if (!user) throw new Error('Must be logged in to update comments');

    if (isDemoMode) {
      // In demo mode, update comment in local state
      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? { ...comment, text, updated_at: new Date().toISOString() } : comment
        )
      );
      return;
    }

    if (!supabase) throw new Error('Supabase client not configured');

    try {
      const { error } = await supabase
        .from('comments')
        .update({ text, updated_at: new Date().toISOString() })
        .eq('id', commentId)
        .eq('author_id', user.id);

      if (error) throw error;

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId ? { ...comment, text } : comment
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to update comment');
    }
  }, [user]);

  const deleteComment = useCallback(async (commentId: string) => {
    if (!user) throw new Error('Must be logged in to delete comments');

    if (isDemoMode) {
      // In demo mode, delete comment from local state
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      return;
    }

    if (!supabase) throw new Error('Supabase client not configured');

    try {
      // Delete replies first
      const { error: repliesError } = await supabase
        .from('comment_replies')
        .delete()
        .eq('comment_id', commentId);

      if (repliesError) throw repliesError;

      // Delete comment
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId)
        .eq('author_id', user.id);

      if (error) throw error;

      setComments(prev => prev.filter(comment => comment.id !== commentId));
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to delete comment');
    }
  }, [user]);

  const addReply = useCallback(async (commentId: string, text: string) => {
    if (!user) throw new Error('Must be logged in to add replies');
    if (!profile) throw new Error('Profile not loaded yet. Please wait and try again.');

    if (isDemoMode) {
      // In demo mode, add reply to local state
      const newReply = {
        id: Date.now().toString(),
        comment_id: commentId,
        text,
        author_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        author: profile,
      };

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, newReply] }
            : comment
        )
      );
      return;
    }

    if (!supabase) throw new Error('Supabase client not configured');

    try {
      const { data, error } = await supabase
        .from('comment_replies')
        .insert({
          comment_id: commentId,
          text,
          author_id: user.id,
        })
        .select(`
          *,
          author:profiles(*)
        `)
        .single();

      if (error) throw error;

      setComments(prev =>
        prev.map(comment =>
          comment.id === commentId
            ? { ...comment, replies: [...comment.replies, data] }
            : comment
        )
      );
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Failed to add reply');
    }
  }, [user, profile]);

  // Set up real-time subscriptions (only in non-demo mode)
  useEffect(() => {
    if (isDemoMode || !supabase || !websiteUrl) return;

    console.log('🔔 Setting up real-time subscriptions for:', websiteUrl);

    const commentsSubscription = supabase
      .channel(`comments:${websiteUrl}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comments',
          filter: `website_url=eq.${websiteUrl}`,
        },
        (payload) => {
          console.log('🔔 Comment change detected:', payload);
          fetchComments();
        }
      )
      .subscribe();

    const repliesSubscription = supabase
      .channel('comment_replies')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'comment_replies',
        },
        (payload) => {
          console.log('🔔 Reply change detected:', payload);
          fetchComments();
        }
      )
      .subscribe();

    return () => {
      console.log('🔕 Cleaning up real-time subscriptions');
      supabase.removeChannel(commentsSubscription);
      supabase.removeChannel(repliesSubscription);
    };
  }, [websiteUrl, fetchComments]);

  // Initial fetch
  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  return {
    comments,
    loading,
    error,
    addComment,
    updateComment,
    deleteComment,
    addReply,
    refetch: fetchComments,
  };
}