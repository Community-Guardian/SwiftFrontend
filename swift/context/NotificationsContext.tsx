"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import notificationsManager from '../handler/NotificationsManager';

interface Notification {
  id: number;
  user: string;
  notification_type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

interface NotificationsContextProps {
  notifications: Notification[];
  loading: boolean; // Track loading state
  getNotifications: () => Promise<void>;
  createNotification: (notificationData: Partial<Notification>) => Promise<void>;
  updateNotification: (id: number, notificationData: Partial<Notification>) => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
}

const NotificationsContext = createContext<NotificationsContextProps | undefined>(undefined);

export const NotificationsProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for operations

  // Fetch notifications
  const getNotifications = async () => {
    setLoading(true); // Start loading
    try {
      const data = await notificationsManager.getNotifications();
      setNotifications(data);
    } catch (error) {
      console.error('Failed to fetch notifications', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Create a new notification
  const createNotification = async (notificationData: Partial<Notification>) => {
    setLoading(true);
    try {
      const newNotification = await notificationsManager.createNotification(notificationData);
      if (newNotification) {
        setNotifications([...notifications, newNotification]);
      }
    } catch (error) {
      console.error('Failed to create notification', error);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing notification
  const updateNotification = async (id: number, notificationData: Partial<Notification>) => {
    setLoading(true);
    try {
      const updatedNotification = await notificationsManager.updateNotification(id, notificationData);
      if (updatedNotification) {
        setNotifications(notifications.map(notification => (notification.id === id ? updatedNotification : notification)));
      }
    } catch (error) {
      console.error('Failed to update notification', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a notification
  const deleteNotification = async (id: number) => {
    setLoading(true);
    try {
      await notificationsManager.deleteNotification(id);
      setNotifications(notifications.filter(notification => notification.id !== id));
    } catch (error) {
      console.error('Failed to delete notification', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch notifications on initial render
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <NotificationsContext.Provider value={{ notifications, loading, getNotifications, createNotification, updateNotification, deleteNotification }}>
      {children}
    </NotificationsContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationsProvider');
  }
  return context;
};
