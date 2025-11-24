import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, User, MessageSquare, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isValidEmail = (value: string) => /\S+@\S+\.\S+/.test(value);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !email.trim() || !message.trim()) {
      toast({ title: "Please fill all fields", variant: "destructive" });
      return;
    }

    if (!isValidEmail(email)) {
      toast({ title: "Please enter a valid email", variant: "destructive" });
      return;
    }

    setIsSubmitting(true);

    const payload = { name: name.trim(), email: email.trim(), message: message.trim() };

    try {
      // Try Vercel /api contact handler first
      let res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      // If Vercel endpoint is not available, try Netlify function
      if (!res.ok) {
        try {
          res = await fetch("/.netlify/functions/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
        } catch (e) {
          // ignore and fall through
        }
      }

      if (res.ok) {
        toast({ title: "Message sent", description: "We'll get back to you shortly." });
        navigate("/");
        return;
      }

      // If backend returns not found or error, fallback to mailto
      throw new Error("No backend or submit failed");
    } catch (err) {
      // Fallback to mailto if network/backend unavailable
      const subject = encodeURIComponent(`Contact from ${name}`);
      const body = encodeURIComponent(`${message}\n\nFrom: ${name} <${email}>`);
      window.location.href = `mailto:dalmat.repair@gmail.com?subject=${subject}&body=${body}`;
      toast({ title: "Opening mail client", description: "Fallback: opening your email client." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 text-center relative">
          {/* Decorative SVG subtle hero */}
          <svg className="pointer-events-none absolute inset-0 -z-10 h-full w-full" viewBox="0 0 800 200" preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="g1" x1="0" x2="1">
                <stop offset="0%" stopColor="#f0f9ff" />
                <stop offset="100%" stopColor="#eff6ff" />
              </linearGradient>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#g1)" />
            <g opacity="0.6" transform="translate(50,20)">
              <circle cx="60" cy="40" r="80" fill="#eef2ff" />
              <circle cx="220" cy="30" r="50" fill="#f0f9ff" />
              <circle cx="420" cy="60" r="100" fill="#eef2ff" />
            </g>
          </svg>

          <h1 className="text-3xl sm:text-4xl font-bold relative z-10">{t("contact.title") || "Contact Us"}</h1>
          <p className="text-muted-foreground mt-2 max-w-2xl mx-auto relative z-10">{t("contact.subtitle") || "Questions or feedback? We would love to hear from you."}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card className="rounded-2xl border-2">
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 block">{t("contact.name") || "Name"}</label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 block">{t("contact.email") || "Email"}</label>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">{t("contact.message") || "Message"}</label>
                    <Textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="How can we help?" />
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" /> <span>dalmat.repair@gmail.com</span>
                    </div>
                    <div>
                      <Button type="submit" disabled={isSubmitting} className="rounded-md">
                        {isSubmitting ? "Sending..." : t("contact.send") || "Send Message"}
                      </Button>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>

          <aside>
            <Card className="rounded-2xl border-2 bg-card/50">
              <CardContent>
                <h3 className="text-lg font-semibold mb-4">Get in touch</h3>
                <p className="text-sm text-muted-foreground mb-4">Prefer to reach us directly? Use any of the methods below.</p>

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md"><Phone className="h-5 w-5 text-primary" /></div>
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md"><Mail className="h-5 w-5 text-primary" /></div>
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">dalmat.repair@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-md"><MapPin className="h-5 w-5 text-primary" /></div>
                    <div>
                      <p className="font-medium">Office</p>
                      <p className="text-sm text-muted-foreground">Pristina, Kosovo</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Contact;
