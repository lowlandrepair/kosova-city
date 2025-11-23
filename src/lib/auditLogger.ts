import { AuditLog, AuditAction, AuditCategory } from "@/types/auditLog";
import { supabase } from "@/integrations/supabase/client";

export const logActivity = async (
  action: AuditAction,
  actor: string,
  targetId: string,
  targetTitle: string,
  details: string,
  category: AuditCategory
): Promise<void> => {
  try {
    const newLog: Omit<AuditLog, "logId" | "timestamp"> = {
      action,
      actor,
      targetId,
      targetTitle,
      details,
      category,
    };
    
    await supabase
      .from("audit_logs")
      .insert({
        log_id: crypto.randomUUID(),
        action,
        actor,
        target_id: targetId,
        target_title: targetTitle,
        details,
        category,
      });
  } catch (error) {
    console.error("Error logging activity:", error);
  }
};

export const getLogs = async (): Promise<AuditLog[]> => {
  try {
    const { data, error } = await supabase
      .from("audit_logs")
      .select("*")
      .order("timestamp", { ascending: false })
      .limit(1000);

    if (error) throw error;

    return (data || []).map((log) => ({
      logId: log.log_id,
      timestamp: log.timestamp,
      action: log.action as AuditAction,
      actor: log.actor,
      targetId: log.target_id,
      targetTitle: log.target_title,
      details: log.details,
      category: log.category as AuditCategory,
    }));
  } catch (error) {
    console.error("Error reading audit logs:", error);
    return [];
  }
};

export const clearLogs = async (): Promise<void> => {
  try {
    await supabase.from("audit_logs").delete().neq("id", "00000000-0000-0000-0000-000000000000");
  } catch (error) {
    console.error("Error clearing audit logs:", error);
  }
};
