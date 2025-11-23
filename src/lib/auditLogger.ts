import { AuditLog, AuditAction, AuditCategory } from "@/types/auditLog";

const LOGS_STORAGE_KEY = "citycare_logs";

export const logActivity = (
  action: AuditAction,
  actor: string,
  targetId: string,
  targetTitle: string,
  details: string,
  category: AuditCategory
): void => {
  const logs = getLogs();
  
  const newLog: AuditLog = {
    logId: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    action,
    actor,
    targetId,
    targetTitle,
    details,
    category,
  };
  
  logs.unshift(newLog); // Add to beginning for newest first
  
  // Keep only last 1000 logs to prevent storage bloat
  if (logs.length > 1000) {
    logs.splice(1000);
  }
  
  saveLogs(logs);
};

export const getLogs = (): AuditLog[] => {
  try {
    const stored = localStorage.getItem(LOGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Error reading audit logs:", error);
    return [];
  }
};

export const saveLogs = (logs: AuditLog[]): void => {
  try {
    localStorage.setItem(LOGS_STORAGE_KEY, JSON.stringify(logs));
  } catch (error) {
    console.error("Error saving audit logs:", error);
  }
};

export const clearLogs = (): void => {
  localStorage.removeItem(LOGS_STORAGE_KEY);
};
