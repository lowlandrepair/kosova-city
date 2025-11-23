export type AuditAction = 
  | "REPORTED" 
  | "STATUS_CHANGE" 
  | "EDITED_REPORT" 
  | "DELETED" 
  | "LOGIN" 
  | "LOGOUT" 
  | "SYSTEM_REPORT"
  | "SIGNUP";

export type AuditCategory = 
  | "USER_SUBMISSION" 
  | "ADMIN_ACTION" 
  | "SYSTEM" 
  | "SECURITY_ALERT";

export interface AuditLog {
  logId: string;
  timestamp: string;
  action: AuditAction;
  actor: string;
  targetId: string;
  targetTitle: string;
  details: string;
  category: AuditCategory;
}
