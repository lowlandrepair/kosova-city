import { Wifi, WifiOff, Loader2 } from "lucide-react";
import { useOffline } from "@/contexts/OfflineContext";
import { motion } from "framer-motion";

export const NetworkToggle = () => {
  const { isOffline, toggleOffline, offlineQueue, isSyncing } = useOffline();

  return (
    <div className="flex items-center gap-2">
      {isSyncing && (
        <Loader2 className="h-3 w-3 animate-spin text-muted-foreground md:h-4 md:w-4" />
      )}
      
      {offlineQueue.length > 0 && (
        <div className="hidden rounded-full bg-warning/10 px-2 py-0.5 text-[10px] font-medium text-warning md:block md:px-3 md:py-1 md:text-xs">
          {offlineQueue.length} offline
        </div>
      )}
      
      <button
        onClick={toggleOffline}
        className={`flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors md:gap-2 md:px-4 md:py-2 md:text-sm ${
          isOffline
            ? "bg-warning/10 text-warning hover:bg-warning/20"
            : "bg-success/10 text-success hover:bg-success/20"
        }`}
      >
        {isOffline ? (
          <>
            <WifiOff className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Offline</span>
          </>
        ) : (
          <>
            <Wifi className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden md:inline">Online</span>
          </>
        )}
      </button>
    </div>
  );
};
