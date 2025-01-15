"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import feedbackManager from '../handler/FeedbackManager';

interface Feedback {
  id: number;
  user: string;
  feedback: string;
  rating: number;
  created_at: string;
  updated_at: string;
}

interface FeedbackContextProps {
  feedbacks: Feedback[];
  loading: boolean; // Track the loading state
  getFeedback: () => Promise<void>;
  createFeedback: (feedbackData: Partial<Feedback>) => Promise<void>;
  updateFeedback: (id: number, feedbackData: Partial<Feedback>) => Promise<void>;
  deleteFeedback: (id: number) => Promise<void>;
}

const FeedbackContext = createContext<FeedbackContextProps | undefined>(undefined);

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(false); // Track loading state for operations

  // Fetch feedback
  const getFeedback = async () => {
    setLoading(true);
    try {
      const data = await feedbackManager.getFeedback();
      setFeedbacks(data);
    } catch (error) {
      console.error('Failed to fetch feedback', error);
    } finally {
      setLoading(false); // Set loading to false after operation completes
    }
  };

  // Create new feedback
  const createFeedback = async (feedbackData: Partial<Feedback>) => {
    setLoading(true);
    try {
      const newFeedback = await feedbackManager.createFeedback(feedbackData);
      if (newFeedback) {
        setFeedbacks([...feedbacks, newFeedback]);
      }
    } catch (error) {
      console.error('Failed to create feedback', error);
    } finally {
      setLoading(false);
    }
  };

  // Update existing feedback
  const updateFeedback = async (id: number, feedbackData: Partial<Feedback>) => {
    setLoading(true);
    try {
      const updatedFeedback = await feedbackManager.updateFeedback(id, feedbackData);
      if (updatedFeedback) {
        setFeedbacks(feedbacks.map(feedback => (feedback.id === id ? updatedFeedback : feedback)));
      }
    } catch (error) {
      console.error('Failed to update feedback', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete feedback
  const deleteFeedback = async (id: number) => {
    setLoading(true);
    try {
      await feedbackManager.deleteFeedback(id);
      setFeedbacks(feedbacks.filter(feedback => feedback.id !== id));
    } catch (error) {
      console.error('Failed to delete feedback', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch feedback on initial render
  useEffect(() => {
    getFeedback();
  }, []);

  return (
    <FeedbackContext.Provider value={{ feedbacks, loading, getFeedback, createFeedback, updateFeedback, deleteFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
};

export const useFeedback = () => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedback must be used within a FeedbackProvider');
  }
  return context;
};
