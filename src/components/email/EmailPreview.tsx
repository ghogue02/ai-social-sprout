
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2, Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EmailPreviewProps {
  email?: { subject: string; body: string };
}

const EmailPreview = ({ email }: EmailPreviewProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyEmail = () => {
    if (!email) return;
    
    const emailText = `Subject: ${email.subject}\n\n${email.body}`;
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard!",
      description: "Email content has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSaveEmail = () => {
    toast({
      title: "Email saved!",
      description: "Your email has been saved to your templates.",
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
              <div className="space-y-4">
                <div className="border-b border-allendale-gold/20 pb-2">
                  <h3 className="font-medium text-white">Subject:</h3>
                  <p className="text-gray-200">{email.subject}</p>
                </div>
                
                <div className="pt-2">
                  <h3 className="font-medium text-white mb-2">Body:</h3>
                  <div className="text-gray-200 whitespace-pre-line">{email.body}</div>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyEmail}
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
                  <Share2 className="mr-2 h-4 w-4" />
                  Save as Template
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[300px] border border-dashed border-allendale-gold/30 rounded-md text-center text-gray-400 p-4">
              <Mail className="h-16 w-16 text-gray-500 mb-4" />
              <p>Generated email will appear here</p>
              <p className="text-sm mt-2">Use the form to create email content for your marketing needs</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EmailPreview;
