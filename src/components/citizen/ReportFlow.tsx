import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import confetti from "canvas-confetti";
import { useReports } from "@/contexts/ReportContext";
import { ReportCategory, ReportPriority } from "@/types/report";
import ReportLocationStep from "./ReportLocationStep";
import ReportDetailsStep from "./ReportDetailsStep";
import ReportSuccessStep from "./ReportSuccessStep";

type ReportStep = "location" | "details" | "success";

const ReportFlow = ({ onClose }: { onClose: () => void }) => {
  const [step, setStep] = useState<ReportStep>("location");
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const { addReport } = useReports();

  const handleLocationConfirm = (coords: { lat: number; lng: number }) => {
    setCoordinates(coords);
    setStep("details");
  };

  const handleDetailsSubmit = (details: {
    title: string;
    category: ReportCategory;
    description: string;
    priority: ReportPriority;
    imageUrl: string;
  }) => {
    if (!coordinates) return;

    addReport({
      ...details,
      coordinates,
      status: "Pending"
    });

    // Trigger confetti
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    setStep("success");
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-background"
    >
      {/* Header */}
      <div className="border-b border-border bg-card">
        <div className="flex items-center justify-between p-4">
          <h2 className="text-xl font-bold">
            {step === "location" && "Select Location"}
            {step === "details" && "Report Details"}
            {step === "success" && "Success!"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-muted"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {step === "location" && (
          <ReportLocationStep
            key="location"
            onConfirm={handleLocationConfirm}
            onBack={onClose}
          />
        )}
        {step === "details" && (
          <ReportDetailsStep
            key="details"
            onSubmit={handleDetailsSubmit}
            onBack={() => setStep("location")}
          />
        )}
        {step === "success" && (
          <ReportSuccessStep
            key="success"
            onClose={onClose}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ReportFlow;
