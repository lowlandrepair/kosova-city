import { useReports } from "@/contexts/ReportContext";
import { useOffline } from "@/contexts/OfflineContext";
import { WifiOff } from "lucide-react";
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

const CitizenMap = () => {
  const { reports } = useReports();
  const { isOffline } = useOffline();
  const mapRef = useRef<L.Map | null>(null);

  const getMarkerIcon = (priority: string, status: string) => {
    let color = "#3b82f6"; // default blue
    if (priority === "High") color = "#ef4444";
    else if (priority === "Medium") color = "#f59e0b";
    
    if (status === "Resolved") color = "#22c55e";
    
    return L.divIcon({
      className: "custom-marker",
      html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3);"></div>`,
      iconSize: [24, 24],
      iconAnchor: [12, 12],
    });
  };

  useEffect(() => {
    if (isOffline || !mapRef.current) return;

    // Initialize map
    if (!mapRef.current) {
      const map = L.map('citizen-map-view').setView([42.6026, 20.9030], 12); // Kosovo (Pristina)
      
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
      
      marker.bindPopup(`
        <div style="min-width: 280px; padding: 8px;">
          <div style="margin-bottom: 12px;">
            <h4 style="font-size: 16px; font-weight: 600; margin-bottom: 8px; color: #111827;">${report.title}</h4>
            <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 8px;">
              <span style="background: ${report.priority === "High" ? "#fef2f2" : report.priority === "Medium" ? "#fffbeb" : "#eff6ff"}; 
                           color: ${report.priority === "High" ? "#dc2626" : report.priority === "Medium" ? "#d97706" : "#2563eb"};
                           padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 500;">
                ${report.priority} Priority
              </span>
              <span style="background: #f3f4f6; color: #3b82f6; padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 500;">
                ${report.category}
              </span>
              <span style="background: ${report.status === "Resolved" ? "#f0fdf4" : report.status === "In Progress" ? "#fffbeb" : "#f3f4f6"};
                           color: ${report.status === "Resolved" ? "#16a34a" : report.status === "In Progress" ? "#d97706" : "#6b7280"};
                           padding: 3px 10px; border-radius: 9999px; font-size: 11px; font-weight: 500;">
                ${report.status}
              </span>
            </div>
          </div>
          <p style="font-size: 13px; color: #6b7280; margin-bottom: 10px; line-height: 1.4;">${report.description}</p>
          ${report.imageUrl ? `<img src="${report.imageUrl}" style="width: 100%; height: 120px; object-fit: cover; border-radius: 6px; margin-bottom: 10px;" />` : ''}
          <div style="display: flex; align-items: center; gap: 8px; padding-top: 8px; border-top: 1px solid #e5e7eb;">
            <div style="display: flex; align-items: center; gap: 4px;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
              </svg>
              <span style="font-size: 12px; font-weight: 600; color: #3b82f6;">${report.upvotes}</span>
              <span style="font-size: 12px; color: #6b7280;">upvotes</span>
            </div>
          </div>
        </div>
      `);
      
      if (mapRef.current) {
        marker.addTo(mapRef.current);
        markers.push(marker);
      }
    });

    return () => {
      markers.forEach(m => m.remove());
    };
  }, [reports, isOffline]);

  useEffect(() => {
    if (!isOffline && !mapRef.current) {
      const map = L.map('citizen-map-view').setView([42.6026, 20.9030], 12);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [isOffline]);

  if (isOffline) {
    return (
      <div className="flex h-[400px] w-full items-center justify-center rounded-xl border border-border bg-muted md:h-[500px]">
        <div className="space-y-4 text-center">
          <WifiOff className="mx-auto h-12 w-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Map Unavailable Offline</h3>
            <p className="text-sm text-muted-foreground">The map will be available when you're back online</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Legend */}
      <div className="absolute right-4 top-4 z-[1000] rounded-lg border border-border bg-card/95 p-3 shadow-lg backdrop-blur-sm">
        <h3 className="mb-2 text-sm font-semibold">Priority Levels</h3>
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-destructive" />
            <span className="text-xs">High Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-warning" />
            <span className="text-xs">Medium Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span className="text-xs">Low Priority</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-success" />
            <span className="text-xs">Resolved</span>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="relative h-[400px] w-full md:h-[500px]">
        <div id="citizen-map-view" className="h-full w-full" />
      </div>
    </div>
  );
};

export default CitizenMap;
