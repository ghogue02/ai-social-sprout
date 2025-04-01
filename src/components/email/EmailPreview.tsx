
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailPreviewProps {
  email: {
    subject: string;
    body: string;
  } | null;
}

const EmailPreview = ({ email }: EmailPreviewProps) => {
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();

  const handleCopyContent = () => {
    if (email) {
      const fullContent = `Subject: ${email.subject}\n\n${email.body}`;
      navigator.clipboard.writeText(fullContent);
      setCopied(true);
      
      toast({
        title: "Copied to clipboard!",
        description: "Email content has been copied to your clipboard.",
      });
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const handleSaveEmail = () => {
    setSaved(true);
    
    toast({
      title: "Email saved!",
      description: "Your email has been saved to your library.",
    });
    
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  const handleSendTest = () => {
    toast({
      title: "Test email sent!",
      description: "A test email has been sent to your account.",
    });
  };

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg text-allendale-gold font-serif">Email Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {email ? (
            <>
              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-sm text-gray-200">Subject</label>
                  <Input 
                    value={email.subject} 
                    readOnly
                    className="bg-allendale-black border-allendale-gold/30 text-gray-200"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-sm text-gray-200">Body</label>
                  <Textarea 
                    value={email.body} 
                    readOnly
                    className="min-h-[250px] bg-allendale-black border-allendale-gold/30 text-gray-200"
                  />
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Button
                  onClick={handleCopyContent}
                  variant="outline"
                  className="border-allendale-gold/30 text-allendale-gold hover:bg-allendale-gold/10"
                >
                  {copied ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleSaveEmail}
                  variant="outline"
                  className="border-allendale-gold/30 text-allendale-gold hover:bg-allendale-gold/10"
                >
                  {saved ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Saved!
                    </>
                  ) : (
                    <>
                      <Share2 className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleSendTest}
                  className="bg-allendale-gold text-black hover:bg-allendale-gold/80"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Test
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] text-center text-gray-400">
              <Mail className="h-16 w-16 text-gray-500 mb-4" />
              <p>Generated email will appear here</p>
              <p className="text-sm mt-2">Use the form to create email content for your campaigns</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreview;
