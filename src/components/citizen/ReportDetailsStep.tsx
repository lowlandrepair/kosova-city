import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, Upload, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ReportCategory, ReportPriority } from "@/types/report";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";
import { supabase } from "@/integrations/supabase/client";

interface ReportDetailsStepProps {
  onSubmit: (details: {
    title: string;
    category: ReportCategory;
    description: string;
    priority: ReportPriority;
    imageUrl: string;
  }) => void;
  onBack: () => void;
}

const ReportDetailsStep = ({ onSubmit, onBack }: ReportDetailsStepProps) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<ReportCategory>("Pothole");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<ReportPriority>("Medium");
  const [imagePreview, setImagePreview] = useState<string>("");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIEnhance = async () => {
    if (!description.trim()) {
      toast({
        title: "No description to enhance",
        description: "Please enter a description first",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('enhance-description', {
        body: { description, category }
      });

      if (error) {
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      if (data?.enhancedDescription) {
        setDescription(data.enhancedDescription);
        toast({
          title: "✨ Description enhanced!",
          description: "Your report has been professionally formatted with AI"
        });
      }
    } catch (error: any) {
      console.error("Error enhancing description:", error);
      toast({
        title: "Enhancement failed",
        description: error.message || "Could not enhance description. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !description.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    onSubmit({
      title: title.trim(),
      category,
      description: description.trim(),
      priority,
      imageUrl: imagePreview || "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400"
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="h-[calc(100vh-73px)] overflow-y-auto"
    >
      <div className="mx-auto max-w-2xl space-y-6 p-6">
        {/* Image Upload */}
        <div className="space-y-2">
          <Label>{t("citizen.photoEvidence")}</Label>
          <div className="flex items-center gap-4">
            {imagePreview ? (
              <div className="relative h-32 w-32 overflow-hidden rounded-lg border-2 border-border">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              </div>
            ) : (
              <label className="flex h-32 w-32 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/50 transition-colors hover:bg-muted">
                <ImageIcon className="mb-2 h-8 w-8 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{t("citizen.upload")}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {t("citizen.addPhotoHelp")}
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">{t("citizen.issueTitle")} *</Label>
          <Input
            id="title"
            placeholder={t("citizen.briefSummary")}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">{t("citizen.category")} *</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as ReportCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pothole">{t("report.categories.pothole")}</SelectItem>
              <SelectItem value="Lighting">{t("report.categories.lighting")}</SelectItem>
              <SelectItem value="Trash">{t("report.categories.trash")}</SelectItem>
              <SelectItem value="Graffiti">{t("report.categories.graffiti")}</SelectItem>
              <SelectItem value="Water Leak">{t("report.categories.waterleak")}</SelectItem>
              <SelectItem value="Tree Maintenance">{t("report.categories.treemaintenance")}</SelectItem>
              <SelectItem value="Other">{t("report.categories.other")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">{t("citizen.priorityLevel")}</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as ReportPriority)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">{t("citizen.lowPriority")}</SelectItem>
              <SelectItem value="Medium">{t("citizen.mediumPriority")}</SelectItem>
              <SelectItem value="High">{t("citizen.highPriority")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">{t("citizen.description")} *</Label>
          <Textarea
            id="description"
            placeholder={t("citizen.describeIssue")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handleAIEnhance}
            disabled={isEnhancing}
            className="w-full"
          >
            <Sparkles className="mr-2 h-4 w-4" />
            {isEnhancing ? t("citizen.enhancing") : t("citizen.autoEnhance")}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            {t("citizen.back")}
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {t("citizen.submitReport")}
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportDetailsStep;
