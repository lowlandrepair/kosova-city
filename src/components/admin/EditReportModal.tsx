import { useState, useEffect } from "react";
import { Report, ReportCategory, ReportPriority, ReportStatus } from "@/types/report";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { COST_ESTIMATES } from "@/constants/costEstimates";
import { motion, AnimatePresence } from "framer-motion";

interface EditReportModalProps {
  report: Report | null;
  open: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<Report>) => void;
}

const categories: ReportCategory[] = ["Pothole", "Lighting", "Trash", "Graffiti", "Water Leak", "Tree Maintenance", "Other"];
const priorities: ReportPriority[] = ["Low", "Medium", "High"];
const statuses: ReportStatus[] = ["Pending", "In Progress", "Resolved", "Rejected"];

export const EditReportModal = ({ report, open, onClose, onSave }: EditReportModalProps) => {
  const [formData, setFormData] = useState<Partial<Report>>({});
  const [prevCost, setPrevCost] = useState<number>(0);

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        category: report.category,
        description: report.description,
        status: report.status,
        priority: report.priority,
        estimatedCost: report.estimatedCost,
      });
      setPrevCost(report.estimatedCost);
    }
  }, [report]);

  const handleCategoryChange = (category: ReportCategory) => {
    const newCost = COST_ESTIMATES[category];
    setPrevCost(formData.estimatedCost || 0);
    setFormData({ ...formData, category, estimatedCost: newCost });
  };

  const handleCostChange = (value: string) => {
    const numValue = parseFloat(value) || 0;
    setFormData({ ...formData, estimatedCost: numValue });
  };

  const handleSave = () => {
    if (report) {
      onSave(report.id, formData);
      onClose();
    }
  };

  if (!report) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Report</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title || ""}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value: ReportStatus) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="priority">Priority</Label>
              <Select value={formData.priority} onValueChange={(value: ReportPriority) => setFormData({ ...formData, priority: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {priorities.map((priority) => (
                    <SelectItem key={priority} value={priority}>
                      {priority}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="cost">Projected Cost</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <AnimatePresence mode="wait">
                <motion.div
                  key={formData.estimatedCost}
                  initial={{ opacity: 0.5, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Input
                    id="cost"
                    type="number"
                    step="0.01"
                    className="pl-7"
                    value={formData.estimatedCost?.toFixed(2) || "0.00"}
                    onChange={(e) => handleCostChange(e.target.value)}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Auto-calculated based on category. You can override this value.
            </p>
          </div>

          {report.imageUrl && (
            <div>
              <Label>Attached Image</Label>
              <img
                src={report.imageUrl}
                alt="Report"
                className="mt-2 h-40 w-full rounded-lg object-cover"
              />
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
