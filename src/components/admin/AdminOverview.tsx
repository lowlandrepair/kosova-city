import { useReports } from "@/contexts/ReportContext";
import { AlertCircle, Clock, CheckCircle2, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
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

const AdminOverview = () => {
  const { reports } = useReports();
  const mapRef = useRef<L.Map | null>(null);
  
  const activeReports = reports.filter(r => r.status !== "Resolved" && r.status !== "Rejected");
  const pendingCount = reports.filter(r => r.status === "Pending").length;
  const inProgressCount = reports.filter(r => r.status === "In Progress").length;
  const resolvedCount = reports.filter(r => r.status === "Resolved").length;

  // Custom marker icons based on priority
  const getMarkerIcon = (priority: string) => {
    const color = priority === "High" ? "#ef4444" : priority === "Medium" ? "#f59e0b" : "#3b82f6";
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  useEffect(() => {
    // Initialize map when component mounts
    if (!mapRef.current) {
      const map = L.map('admin-overview-map').setView([42.6026, 20.9030], 12); // Kosovo (Pristina)
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapRef.current = map;
    }

    // Add markers for active reports
    const markers: L.Marker[] = [];
    activeReports.forEach((report) => {
      const marker = L.marker(
        [report.coordinates.lat, report.coordinates.lng],
        { icon: getMarkerIcon(report.priority) }
      );
      
      marker.bindPopup(`
        <div style="min-width: 200px;">
          <h4 style="font-weight: 600; margin-bottom: 8px;">${report.title}</h4>
          <div style="font-size: 14px; line-height: 1.5;">
            <p><strong>Category:</strong> ${report.category}</p>
            <p><strong>Priority:</strong> ${report.priority}</p>
            <p><strong>Status:</strong> ${report.status}</p>
            <p style="font-size: 12px; color: #666; margin-top: 4px;">${report.description}</p>
          </div>
        </div>
      `);
      
      marker.addTo(mapRef.current!);
      markers.push(marker);
    });

    // Cleanup markers when reports change
    return () => {
      markers.forEach(m => m.remove());
    };
  }, [activeReports]);

  return (
    <div className="h-screen overflow-hidden">
      {/* Header */}
      <div className="border-b border-border bg-card p-6">
        <h1 className="text-3xl font-bold">Command Center Overview</h1>
        <p className="text-muted-foreground">Real-time monitoring dashboard</p>
      </div>

      <div className="flex h-[calc(100vh-113px)] gap-6 p-6">
        {/* Stats Sidebar */}
        <div className="w-80 space-y-4 overflow-y-auto">
          <Card className="border-l-4 border-l-destructive p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-destructive/10 p-3">
                <AlertCircle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-3xl font-bold">{pendingCount}</p>
                <p className="text-sm text-muted-foreground">Pending Review</p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-warning p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-warning/10 p-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-3xl font-bold">{inProgressCount}</p>
                <p className="text-sm text-muted-foreground">In Progress</p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-success p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-success/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-3xl font-bold">{resolvedCount}</p>
                <p className="text-sm text-muted-foreground">Resolved</p>
              </div>
            </div>
          </Card>

          <Card className="border-l-4 border-l-primary p-6">
            <div className="flex items-center gap-4">
              <div className="rounded-lg bg-primary/10 p-3">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{reports.length}</p>
                <p className="text-sm text-muted-foreground">Total Reports</p>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h3 className="mb-4 font-semibold">Recent Activity</h3>
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <div key={report.id} className="flex items-start gap-3 text-sm">
                  <div className={`mt-1 h-2 w-2 rounded-full ${
                    report.status === "Resolved" ? "bg-success" :
                    report.status === "In Progress" ? "bg-warning" :
                    "bg-destructive"
                  }`} />
                  <div className="flex-1">
                    <p className="font-medium">{report.title}</p>
                    <p className="text-xs text-muted-foreground">{report.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Map */}
        <Card className="flex-1 overflow-hidden">
          <div id="admin-overview-map" className="h-full w-full" />
        </Card>
      </div>
    </div>
  );
};

export default AdminOverview;
