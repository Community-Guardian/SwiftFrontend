"use client"

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import logsManager from '../handler/LogsManager';

interface Log {
  id: number;
  user: string;
  log_type: string;
  action: string;
  details: string;
  timestamp: string;
}

interface LogsContextProps {
  logs: Log[];
  loading: boolean; // Track loading state
  getLogs: () => Promise<void>;
  createLog: (logData: Partial<Log>) => Promise<void>;
  updateLog: (id: number, logData: Partial<Log>) => Promise<void>;
  deleteLog: (id: number) => Promise<void>;
}

const LogsContext = createContext<LogsContextProps | undefined>(undefined);

export const LogsProvider = ({ children }: { children: ReactNode }) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(false); // Loading state for operations

  // Fetch logs
  const getLogs = async () => {
    setLoading(true); // Start loading
    try {
      const data = await logsManager.getLogs();
      setLogs(data);
    } catch (error) {
      console.error('Failed to fetch logs', error);
    } finally {
      setLoading(false); // End loading
    }
  };

  // Create a new log
  const createLog = async (logData: Partial<Log>) => {
    setLoading(true);
    try {
      const newLog = await logsManager.createLog(logData);
      if (newLog) {
        setLogs([...logs, newLog]);
      }
    } catch (error) {
      console.error('Failed to create log', error);
    } finally {
      setLoading(false);
    }
  };

  // Update an existing log
  const updateLog = async (id: number, logData: Partial<Log>) => {
    setLoading(true);
    try {
      const updatedLog = await logsManager.updateLog(id, logData);
      if (updatedLog) {
        setLogs(logs.map(log => (log.id === id ? updatedLog : log)));
      }
    } catch (error) {
      console.error('Failed to update log', error);
    } finally {
      setLoading(false);
    }
  };

  // Delete a log
  const deleteLog = async (id: number) => {
    setLoading(true);
    try {
      await logsManager.deleteLog(id);
      setLogs(logs.filter(log => log.id !== id));
    } catch (error) {
      console.error('Failed to delete log', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch logs on initial render
  useEffect(() => {
    getLogs();
  }, []);

  return (
    <LogsContext.Provider value={{ logs, loading, getLogs, createLog, updateLog, deleteLog }}>
      {children}
    </LogsContext.Provider>
  );
};

export const useLogs = () => {
  const context = useContext(LogsContext);
  if (context === undefined) {
    throw new Error('useLogs must be used within a LogsProvider');
  }
  return context;
};
