import { Mail, User, MessageSquare, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";

const Contact = () => {
  const { t } = useLanguage();
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
                <form
                  action="https://formspree.io/f/mdkvkwza"
                  method="POST"
                  className="space-y-4"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const formData = new FormData(form);
                    
                    try {
                      const response = await fetch('https://formspree.io/f/mdkvkwza', {
                        method: 'POST',
                        body: formData,
                        headers: {
                          'Accept': 'application/json'
                        }
                      });
                      
                      if (response.ok) {
                        window.location.href = '/thank-you';
                      } else {
                        const error = await response.json();
                        throw new Error(error.message || 'Something went wrong!');
                      }
                    } catch (error) {
                      console.error('Error!', error);
                      alert('There was a problem sending your message. Please try again.');
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("contact.email") || "Your email"}
                      </label>
                      <Input 
                        type="email" 
                        name="email" 
                        placeholder="you@example.com" 
                        required 
                        className="w-full"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {t("contact.message") || "Your message"}
                      </label>
                      <Textarea 
                        name="message" 
                        placeholder="How can we help?" 
                        rows={6} 
                        required
                        className="w-full"
                      />
                    </div>

                    <div className="pt-2">
                      <Button type="submit" className="w-full sm:w-auto">
                        {t("send") || "Send Message"}
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
