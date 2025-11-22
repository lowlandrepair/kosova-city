import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { toast } from "@/hooks/use-toast";

interface OfflineReport {
  id: string;
  title: string;
  category: string;
  description: string;
  priority: string;
  coordinates: { lat: number; lng: number };
  imageUrl: string;
  timestamp: string;
}

interface OfflineContextType {
  isOffline: boolean;
  toggleOffline: () => void;
  offlineQueue: OfflineReport[];
  addToOfflineQueue: (report: Omit<OfflineReport, "id" | "timestamp">) => void;
  syncOfflineReports: () => Promise<OfflineReport[]>;
  isSyncing: boolean;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

const OFFLINE_QUEUE_KEY = "offline_queue";
const OFFLINE_MODE_KEY = "offline_mode";

export const OfflineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOffline, setIsOffline] = useState(() => {
    const stored = localStorage.getItem(OFFLINE_MODE_KEY);
    return stored === "true";
  });
  const [offlineQueue, setOfflineQueue] = useState<OfflineReport[]>(() => {
    const stored = localStorage.getItem(OFFLINE_QUEUE_KEY);
    return stored ? JSON.parse(stored) : [];
  });
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    localStorage.setItem(OFFLINE_MODE_KEY, isOffline.toString());
  }, [isOffline]);

  useEffect(() => {
    localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(offlineQueue));
  }, [offlineQueue]);

  const toggleOffline = () => {
    setIsOffline(prev => !prev);
  };

  const addToOfflineQueue = (report: Omit<OfflineReport, "id" | "timestamp">) => {
    const newReport: OfflineReport = {
      ...report,
      id: `offline-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
    setOfflineQueue(prev => [...prev, newReport]);
  };

  const syncOfflineReports = async (): Promise<OfflineReport[]> => {
    if (offlineQueue.length === 0) return [];
    
    setIsSyncing(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const reportsToSync = [...offlineQueue];
    setOfflineQueue([]);
    localStorage.removeItem(OFFLINE_QUEUE_KEY);
    
    setIsSyncing(false);
    
    toast({
      title: "Connection Restored",
      description: `${reportsToSync.length} Report${reportsToSync.length > 1 ? 's' : ''} Uploaded.`,
      className: "bg-success text-success-foreground",
    });
    
    return reportsToSync;
  };

  return (
    <OfflineContext.Provider
      value={{
        isOffline,
        toggleOffline,
        offlineQueue,
        addToOfflineQueue,
        syncOfflineReports,
        isSyncing,
      }}
    >
      {children}
    </OfflineContext.Provider>
  );
};

export const useOffline = () => {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error("useOffline must be used within OfflineProvider");
  }
  return context;
};
