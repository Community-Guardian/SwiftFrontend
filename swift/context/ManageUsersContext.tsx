"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import usersManager from '@/handler/UsersManager';

interface User {
  id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
  last_login: string;
}

interface ManageUsersContextProps {
  users: User[];
  loading: boolean;
  getUsers: () => Promise<void>;
  createUser: (userData: Partial<User>) => Promise<void>;
  updateUser: (id: string, userData: Partial<User>) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
}

const ManageUsersContext = createContext<ManageUsersContextProps | undefined>(undefined);

export const ManageUsersProvider = ({ children }: { children: ReactNode }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const getUsers = async () => {
    setLoading(true);
    try {
      const data = await usersManager.getUsers();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (userData: Partial<User>) => {
    setLoading(true);
    try {
      const newUser = await usersManager.createUser(userData);
      if (newUser) {
        setUsers([...users, newUser]);
      }
    } catch (error) {
      console.error('Failed to create user', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, userData: Partial<User>) => {
    setLoading(true);
    try {
      const updatedUser = await usersManager.updateUser(id, userData);
      if (updatedUser) {
        setUsers(users.map(user => (user.id === id ? updatedUser : user)));
      }
    } catch (error) {
      console.error('Failed to update user', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await usersManager.deleteUser(id);
      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error('Failed to delete user', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <ManageUsersContext.Provider value={{ users, loading, getUsers, createUser, updateUser, deleteUser }}>
      {children}
    </ManageUsersContext.Provider>
  );
};

export const useManageUsers = () => {
  const context = useContext(ManageUsersContext);
  if (context === undefined) {
    throw new Error('useManageUsers must be used within a ManageUsersProvider');
  }
  return context;
};