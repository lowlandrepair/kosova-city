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

  const handleAIEnhance = () => {
    if (!description.trim()) {
      toast({
        title: "No description to enhance",
        description: "Please enter a description first",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    
    // Simulate AI enhancement
    setTimeout(() => {
      const enhanced = `This is a formal complaint regarding ${category.toLowerCase()} issues. ${description}. This matter requires immediate attention from the relevant municipal authorities to ensure public safety and maintain city infrastructure standards. Prompt resolution would be greatly appreciated by the community.`;
      setDescription(enhanced);
      setIsEnhancing(false);
      toast({
        title: "✨ Description enhanced!",
        description: "Your report has been professionally formatted"
      });
    }, 1500);
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
          <Label>Photo Evidence (Optional)</Label>
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
                <span className="text-xs text-muted-foreground">Upload</span>
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
                Add a photo to help us understand the issue better
              </p>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <Label htmlFor="title">Issue Title *</Label>
          <Input
            id="title"
            placeholder="Brief summary of the issue"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category">Category *</Label>
          <Select value={category} onValueChange={(v) => setCategory(v as ReportCategory)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Pothole">Pothole</SelectItem>
              <SelectItem value="Lighting">Lighting</SelectItem>
              <SelectItem value="Trash">Trash</SelectItem>
              <SelectItem value="Graffiti">Graffiti</SelectItem>
              <SelectItem value="Water Leak">Water Leak</SelectItem>
              <SelectItem value="Tree Maintenance">Tree Maintenance</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Priority */}
        <div className="space-y-2">
          <Label htmlFor="priority">Priority Level</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as ReportPriority)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Low">Low - Minor inconvenience</SelectItem>
              <SelectItem value="Medium">Medium - Needs attention</SelectItem>
              <SelectItem value="High">High - Safety concern</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            placeholder="Describe the issue in detail..."
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
            {isEnhancing ? "Enhancing..." : "✨ Auto-Enhance with AI"}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={onBack}
            className="flex-1"
          >
            Back
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Submit Report
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ReportDetailsStep;
