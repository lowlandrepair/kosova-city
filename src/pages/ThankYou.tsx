import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";

const ThankYou = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-100">
          <CheckCircle className="h-16 w-16 text-green-600" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight">
          Thank you!
        </h1>
        
        <p className="text-muted-foreground">
          Your message has been sent successfully. We'll get back to you soon!
        </p>
        
        <div className="pt-6">
          <Button 
            onClick={() => navigate('/')}
            className="px-6 py-3 text-base"
          >
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
