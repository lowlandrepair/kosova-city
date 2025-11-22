export type ReportStatus = "Pending" | "In Progress" | "Resolved" | "Rejected";
export type ReportPriority = "Low" | "Medium" | "High";
export type ReportCategory = "Pothole" | "Lighting" | "Trash" | "Graffiti" | "Water Leak" | "Tree Maintenance" | "Other";

export interface Report {
  id: string;
  title: string;
  category: ReportCategory;
  description: string;
  status: ReportStatus;
  priority: ReportPriority;
  coordinates: {
    lat: number;
    lng: number;
  };
  timestamp: string;
  upvotes: number;
  imageUrl: string;
  userId?: string;
}
