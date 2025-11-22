import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

interface ReportLocationStepProps {
  onConfirm: (coords: { lat: number; lng: number }) => void;
  onBack: () => void;
}

const ReportLocationStep = ({ onConfirm, onBack }: ReportLocationStepProps) => {
  const [position, setPosition] = useState({ lat: 42.6026, lng: 20.9030 }); // Kosovo (Pristina) default
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("report-location-map").setView([position.lat, position.lng], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      // Create initial marker
      const marker = L.marker([position.lat, position.lng], {
        draggable: true,
      }).addTo(map);

      // Update position when marker is dragged
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        setPosition({ lat: pos.lat, lng: pos.lng });
      });

      // Add click event to place marker
      map.on("click", (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        setPosition({ lat, lng });
        marker.setLatLng([lat, lng]);
      });

      mapRef.current = map;
      markerRef.current = marker;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex h-[calc(100vh-73px)] flex-col"
    >
      {/* Instructions */}
      <div className="bg-primary/5 p-4 text-center">
        <p className="text-sm font-medium text-foreground">
          Click on the map to set the location or drag the pin to adjust
        </p>
      </div>

      {/* Map Container */}
      <div className="relative flex-1">
        <div id="report-location-map" className="h-full w-full" />

        {/* Coordinates Display */}
        <div className="absolute bottom-4 left-4 z-[1000] rounded-lg bg-card/95 px-4 py-2 shadow-lg backdrop-blur-sm">
          <p className="text-xs text-muted-foreground">Selected Location</p>
          <p className="font-mono text-sm font-medium">
            {position.lat.toFixed(6)}, {position.lng.toFixed(6)}
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="border-t border-border bg-card p-4">
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={() => onConfirm(position)}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportLocationStep;
