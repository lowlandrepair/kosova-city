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

// Generate mock logs for initial setup
export const generateMockLogs = (): void => {
  const existingLogs = getLogs();
  if (existingLogs.length > 0) return; // Don't generate if logs already exist
  
  const mockLogs: AuditLog[] = [];
  const now = new Date();
  
  const actions: Array<{ action: AuditAction; category: AuditCategory; details: string }> = [
    { action: "REPORTED", category: "USER_SUBMISSION", details: "New pothole reported on Main Street" },
    { action: "REPORTED", category: "USER_SUBMISSION", details: "Broken streetlight reported near City Hall" },
    { action: "STATUS_CHANGE", category: "ADMIN_ACTION", details: "Status changed from Pending to In Progress" },
    { action: "EDITED_REPORT", category: "ADMIN_ACTION", details: "Cost updated from $350 to $500" },
    { action: "STATUS_CHANGE", category: "ADMIN_ACTION", details: "Status changed from In Progress to Resolved" },
    { action: "REPORTED", category: "USER_SUBMISSION", details: "Water leak reported on Oak Avenue" },
    { action: "SYSTEM_REPORT", category: "SYSTEM", details: "IoT sensor detected infrastructure issue" },
    { action: "LOGIN", category: "SYSTEM", details: "Admin logged into system" },
    { action: "EDITED_REPORT", category: "ADMIN_ACTION", details: "Priority escalated from Medium to High" },
    { action: "DELETED", category: "SECURITY_ALERT", details: "Duplicate report removed from system" },
    { action: "STATUS_CHANGE", category: "ADMIN_ACTION", details: "Report status updated to Rejected - duplicate entry" },
    { action: "REPORTED", category: "USER_SUBMISSION", details: "Graffiti reported on public building" },
    { action: "EDITED_REPORT", category: "ADMIN_ACTION", details: "Title updated for clarity" },
    { action: "LOGIN", category: "SYSTEM", details: "Admin Beta logged into system" },
    { action: "SYSTEM_REPORT", category: "SYSTEM", details: "Automated priority adjustment based on upvotes" },
    { action: "STATUS_CHANGE", category: "ADMIN_ACTION", details: "Multiple reports assigned to contractor" },
    { action: "REPORTED", category: "USER_SUBMISSION", details: "Tree maintenance required on Elm Street" },
    { action: "EDITED_REPORT", category: "ADMIN_ACTION", details: "Cost estimate refined after site inspection" },
    { action: "LOGOUT", category: "SYSTEM", details: "Admin session ended" },
    { action: "DELETED", category: "SECURITY_ALERT", details: "Spam report removed by admin" },
    { action: "STATUS_CHANGE", category: "ADMIN_ACTION", details: "Emergency priority assigned to water main break" },
    { action: "REPORTED", category: "USER_SUBMISSION", details: "Trash accumulation reported in park" },
    { action: "SYSTEM_REPORT", category: "SYSTEM", details: "Weekly maintenance check completed" },
    { action: "EDITED_REPORT", category: "ADMIN_ACTION", details: "Location coordinates corrected" },
    { action: "STATUS_CHANGE", category: "ADMIN_ACTION", details: "Status changed from Pending to In Progress" },
  ];
  
  const actors = ["Citizen #123", "Citizen #456", "Citizen #789", "Admin Alpha", "Admin Beta", "System API"];
  const reportTitles = [
    "Pothole on Main Street",
    "Broken Streetlight",
    "Water Leak",
    "Graffiti on Building",
    "Tree Maintenance Needed",
    "Trash Accumulation",
    "Damaged Sidewalk",
    "Street Sign Missing",
  ];
  
  for (let i = 0; i < 25; i++) {
    const actionData = actions[i % actions.length];
    const daysAgo = Math.floor(i / 3); // Spread over ~8 days
    const hoursAgo = Math.random() * 24;
    const timestamp = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000) - (hoursAgo * 60 * 60 * 1000));
    
    mockLogs.push({
      logId: crypto.randomUUID(),
      timestamp: timestamp.toISOString(),
      action: actionData.action,
      actor: actors[Math.floor(Math.random() * actors.length)],
      targetId: crypto.randomUUID(),
      targetTitle: reportTitles[Math.floor(Math.random() * reportTitles.length)],
      details: actionData.details,
      category: actionData.category,
    });
  }
  
  // Sort by timestamp descending (newest first)
  mockLogs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  
  saveLogs(mockLogs);
};
