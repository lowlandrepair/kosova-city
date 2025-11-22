import { motion } from "framer-motion";
import { CheckCircle2, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportSuccessStepProps {
  onClose: () => void;
}

const ReportSuccessStep = ({ onClose }: ReportSuccessStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="flex h-[calc(100vh-73px)] items-center justify-center p-6"
    >
      <div className="max-w-md text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 flex justify-center"
        >
          <div className="rounded-full bg-success/10 p-6">
            <CheckCircle2 className="h-16 w-16 text-success" />
          </div>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-4 text-3xl font-bold"
        >
          Report Submitted!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8 text-muted-foreground"
        >
          Thank you for helping make our city better. We've received your report and
          our team will review it shortly. You can track the progress in your activity
          feed.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Button
            onClick={onClose}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
            size="lg"
          >
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ReportSuccessStep;
