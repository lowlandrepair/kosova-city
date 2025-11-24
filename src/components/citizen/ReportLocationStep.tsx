import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { WifiOff, Locate } from "lucide-react";
import { useOffline } from "@/contexts/OfflineContext";
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
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(true);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const { isOffline } = useOffline();

  const updateLocation = (newPosition: { lat: number; lng: number }) => {
    setPosition(newPosition);
    if (mapRef.current && markerRef.current) {
      mapRef.current.setView(newPosition, 15);
      markerRef.current.setLatLng(newPosition);
    }
  };

  useEffect(() => {
    // Auto-detect location when component mounts
    if (navigator.geolocation) {
      setIsLocating(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          updateLocation({ lat: latitude, lng: longitude });
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to retrieve your location. Please use the map to select a location.');
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } else {
      setLocationError('Geolocation is not supported by your browser. Please use the map to select a location.');
      setIsLocating(false);
    }
  }, []);

  useEffect(() => {
    if (isOffline || mapRef.current) return;
    
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

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      markerRef.current = null;
    };
  }, [isOffline]);

  const handleLocationClick = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setLocationError(null);
    setIsLocating(true);
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        updateLocation({ lat: latitude, lng: longitude });
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setLocationError('Unable to retrieve your location. Please ensure location services are enabled.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="flex h-[calc(100vh-73px)] flex-col"
    >
      {/* Instructions */}
      <div className="bg-primary/5 p-4 text-center">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {isLocating ? 'Locating you...' : 'Click on the map to adjust the location if needed'}
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLocationClick}
            className="flex items-center gap-1.5"
            disabled={isLocating}
          >
            <Locate className={`h-4 w-4 ${isLocating ? 'animate-pulse' : ''}`} />
            <span>{isLocating ? 'Locating...' : 'Relocate Me'}</span>
          </Button>
        </div>
        {locationError && (
          <p className="mt-2 text-xs text-destructive">{locationError}</p>
        )}
      </div>

      {/* Map Container */}
      <div className="relative flex-1">
        {isOffline ? (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <div className="space-y-4 text-center">
              <WifiOff className="mx-auto h-16 w-16 text-muted-foreground" />
              <div>
                <h3 className="text-lg font-semibold text-foreground">Map Unavailable Offline</h3>
                <p className="text-sm text-muted-foreground">The map will be available when you're back online</p>
              </div>
            </div>
          </div>
        ) : (
          <div id="report-location-map" className="h-full w-full" />
        )}

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
