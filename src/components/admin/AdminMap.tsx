import { useReports } from "@/contexts/ReportContext";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import L from "leaflet";
import { useEffect, useRef } from "react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const AdminMap = () => {
  const { reports, updateReport } = useReports();
  const mapRef = useRef<L.Map | null>(null);
  const activeReports = reports.filter(r => r.status !== "Resolved");

  const getMarkerIcon = (priority: string, status: string) => {
    let color = "#3b82f6"; // default blue
    if (priority === "High") color = "#ef4444";
    else if (priority === "Medium") color = "#f59e0b";
    
    if (status === "Resolved") color = "#22c55e";
    
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; border: 4px solid white; box-shadow: 0 3px 10px rgba(0,0,0,0.4);"></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  useEffect(() => {
    // Initialize map
    if (!mapRef.current) {
      const map = L.map('admin-map-view').setView([42.6026, 20.9030], 12); // Kosovo (Pristina)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapRef.current = map;
    }

    // Add markers
    const markers: L.Marker[] = [];
    reports.forEach((report) => {
      const marker = L.marker(
        [report.coordinates.lat, report.coordinates.lng],
        { icon: getMarkerIcon(report.priority, report.status) }
      );
      
      const priorityClass = report.priority === "High" ? "destructive" : report.priority === "Medium" ? "warning" : "primary";
      const statusClass = report.status === "Resolved" ? "success" : report.status === "In Progress" ? "warning" : "muted";
      
      marker.bindPopup(`
        <div style="min-width: 300px; padding: 8px;">
          <div style="margin-bottom: 12px;">
            <h4 style="font-size: 18px; font-weight: 600; margin-bottom: 8px;">${report.title}</h4>
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;">
              <span style="background: ${report.priority === "High" ? "#fef2f2" : report.priority === "Medium" ? "#fffbeb" : "#eff6ff"}; 
                           color: ${report.priority === "High" ? "#dc2626" : report.priority === "Medium" ? "#d97706" : "#2563eb"};
                           padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500;">
                ${report.priority}
              </span>
              <span style="background: #f3f4f6; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500;">
                ${report.category}
              </span>
              <span style="background: ${report.status === "Resolved" ? "#f0fdf4" : report.status === "In Progress" ? "#fffbeb" : "#f3f4f6"};
                           color: ${report.status === "Resolved" ? "#16a34a" : report.status === "In Progress" ? "#d97706" : "#6b7280"};
                           padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 500;">
                ${report.status}
              </span>
            </div>
          </div>
          <p style="font-size: 14px; color: #6b7280; margin-bottom: 12px;">${report.description}</p>
          ${report.imageUrl ? `<img src="${report.imageUrl}" style="width: 100%; height: 128px; object-fit: cover; border-radius: 8px; margin-bottom: 12px;" />` : ''}
          <div style="display: flex; gap: 8px;">
            ${report.status === "Pending" ? `<button onclick="window.updateReportStatus('${report.id}', 'In Progress')" style="flex: 1; padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">Start Work</button>` : ''}
            ${report.status === "In Progress" ? `<button onclick="window.updateReportStatus('${report.id}', 'Resolved')" style="flex: 1; padding: 8px 16px; background: #22c55e; color: white; border: none; border-radius: 6px; cursor: pointer; font-size: 14px;">Mark Resolved</button>` : ''}
          </div>
        </div>
      `);
      
      marker.addTo(mapRef.current!);
      markers.push(marker);
    });

    // Setup global function for popup buttons
    (window as any).updateReportStatus = (id: string, status: string) => {
      updateReport(id, { status: status as any });
    };

    return () => {
      markers.forEach(m => m.remove());
      delete (window as any).updateReportStatus;
    };
  }, [reports, updateReport]);

  return (
    <div className="h-screen">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-3xl font-bold">Live Map View</h1>
        <p className="text-muted-foreground">Interactive city-wide issue tracking</p>
      </div>

      {/* Legend */}
      <div className="absolute right-6 top-28 z-[1000] rounded-lg border border-border bg-card p-4 shadow-lg">
        <h3 className="mb-3 font-semibold">Priority Levels</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-destructive" />
            <span className="text-sm">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-warning" />
            <span className="text-sm">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-primary" />
            <span className="text-sm">Low Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 rounded-full bg-success" />
            <span className="text-sm">Resolved</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[calc(100vh-113px)]">
        <div id="admin-map-view" className="h-full w-full" />
      </div>
    </div>
  );
};

export default AdminMap;
