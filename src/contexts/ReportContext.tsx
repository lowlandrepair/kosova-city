import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Report, ReportStatus } from "@/types/report";
import { toast } from "@/hooks/use-toast";

interface ReportContextType {
  reports: Report[];
  addReport: (report: Omit<Report, "id" | "timestamp" | "upvotes">) => Promise<void>;
  updateReport: (id: string, updates: Partial<Report>) => Promise<void>;
  deleteReport: (id: string) => Promise<void>;
  getReportById: (id: string) => Report | undefined;
  upvoteReport: (id: string) => Promise<void>;
  getTotalResolved: () => number;
  isLoading: boolean;
  userUpvotedReports: Set<string>;
}

const ReportContext = createContext<ReportContextType | undefined>(undefined);

export const ReportProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userUpvotedReports, setUserUpvotedReports] = useState<Set<string>>(new Set());
  const { user } = useAuth();

  // Fetch reports from Supabase
  useEffect(() => {
    fetchReports();
  }, []);

  // Fetch user's upvoted reports
  useEffect(() => {
    if (user) {
      fetchUserUpvotes();
    } else {
      setUserUpvotedReports(new Set());
    }
  }, [user]);

  const fetchReports = async () => {
    try {
      const { data, error } = await supabase
        .from("reports")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const formattedReports: Report[] = (data || []).map((report) => ({
        id: report.id,
        title: report.title,
        category: report.category as Report["category"],
        description: report.description,
        status: report.status as Report["status"],
        priority: report.priority as Report["priority"],
        coordinates: { lat: report.lat, lng: report.lng },
        timestamp: report.created_at,
        upvotes: report.upvotes,
        imageUrl: report.image_url || "",
        userId: report.user_id,
      }));

      setReports(formattedReports);
    } catch (error: any) {
      console.error("Error fetching reports:", error);
      toast({
        title: "Error loading reports",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserUpvotes = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from("report_upvotes")
        .select("report_id")
        .eq("user_id", user.id);

      if (error) throw error;

      const upvotedIds = new Set(data?.map((item) => item.report_id) || []);
      setUserUpvotedReports(upvotedIds);
    } catch (error: any) {
      console.error("Error fetching user upvotes:", error);
    }
  };

  const addReport = async (report: Omit<Report, "id" | "timestamp" | "upvotes">) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a report",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data, error } = await supabase
        .from("reports")
        .insert({
          user_id: user.id,
          title: report.title,
          category: report.category,
          description: report.description,
          status: report.status,
          priority: report.priority,
          lat: report.coordinates.lat,
          lng: report.coordinates.lng,
          image_url: report.imageUrl,
        })
        .select()
        .single();

      if (error) throw error;

      const newReport: Report = {
        id: data.id,
        title: data.title,
        category: data.category as Report["category"],
        description: data.description,
        status: data.status as Report["status"],
        priority: data.priority as Report["priority"],
        coordinates: { lat: data.lat, lng: data.lng },
        timestamp: data.created_at,
        upvotes: data.upvotes,
        imageUrl: data.image_url || "",
        userId: data.user_id,
      };

      setReports((prev) => [newReport, ...prev]);
    } catch (error: any) {
      console.error("Error adding report:", error);
      toast({
        title: "Error submitting report",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateReport = async (id: string, updates: Partial<Report>) => {
    try {
      const updateData: any = {};
      
      if (updates.title !== undefined) updateData.title = updates.title;
      if (updates.category !== undefined) updateData.category = updates.category;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;
      if (updates.priority !== undefined) updateData.priority = updates.priority;
      if (updates.coordinates !== undefined) {
        updateData.lat = updates.coordinates.lat;
        updateData.lng = updates.coordinates.lng;
      }
      if (updates.upvotes !== undefined) updateData.upvotes = updates.upvotes;
      if (updates.imageUrl !== undefined) updateData.image_url = updates.imageUrl;

      const { error } = await supabase
        .from("reports")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;

      setReports((prev) =>
        prev.map((report) =>
          report.id === id ? { ...report, ...updates } : report
        )
      );
    } catch (error: any) {
      console.error("Error updating report:", error);
      toast({
        title: "Error updating report",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteReport = async (id: string) => {
    try {
      const { error } = await supabase
        .from("reports")
        .delete()
        .eq("id", id);

      if (error) throw error;

      setReports((prev) => prev.filter((report) => report.id !== id));
    } catch (error: any) {
      console.error("Error deleting report:", error);
      toast({
        title: "Error deleting report",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const getReportById = (id: string) => {
    return reports.find((report) => report.id === id);
  };

  const upvoteReport = async (id: string) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to upvote reports",
        variant: "destructive",
      });
      return;
    }

    try {
      // Call the secure database function
      const { error } = await supabase.rpc("upvote_report", {
        report_id: id,
      });

      if (error) throw error;

      // Update local state
      setReports((prev) =>
        prev.map((report) =>
          report.id === id
            ? { ...report, upvotes: report.upvotes + 1 }
            : report
        )
      );

      // Add to user's upvoted reports
      setUserUpvotedReports((prev) => new Set([...prev, id]));

      toast({
        title: "Success",
        description: "Report upvoted!",
      });
    } catch (error: any) {
      console.error("Error upvoting report:", error);
      toast({
        title: "Error",
        description: error.message.includes("already upvoted") 
          ? "You have already upvoted this report" 
          : "Failed to upvote report",
        variant: "destructive",
      });
    }
  };

  const getTotalResolved = () => {
    return reports.filter((r) => r.status === "Resolved").length;
  };

  return (
    <ReportContext.Provider
      value={{
        reports,
        addReport,
        updateReport,
        deleteReport,
        getReportById,
        upvoteReport,
        getTotalResolved,
        isLoading,
        userUpvotedReports,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReports = () => {
  const context = useContext(ReportContext);
  if (!context) {
    throw new Error("useReports must be used within ReportProvider");
  }
  return context;
};
