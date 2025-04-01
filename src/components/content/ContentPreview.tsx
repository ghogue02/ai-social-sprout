
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Check, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentPreviewProps {
  content: string;
}

const ContentPreview = ({ content }: ContentPreviewProps) => {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    
    toast({
      title: "Copied to clipboard!",
      description: "Content has been copied to your clipboard.",
    });
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const handleSaveContent = () => {
    toast({
      title: "Content saved!",
      description: "Your content has been saved to your library.",
    });
  };

  return (
    <Card className="border-allendale-gold/20 bg-allendale-black/50 h-full">
      <CardHeader>
        <CardTitle className="text-lg text-allendale-gold font-serif">Content Preview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {content ? (
            <>
              <Textarea 
                value={content} 
                readOnly
                className="min-h-[250px] bg-allendale-black border-allendale-gold/30 text-gray-200"
              />
              
              <div className="flex gap-2">
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
                  onClick={handleSaveContent}
                  variant="outline"
                  className="border-allendale-gold/30 text-allendale-gold hover:bg-allendale-gold/10"
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Save to Library
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-[250px] text-center text-gray-400">
              <p>Generated content will appear here</p>
              <p className="text-sm mt-2">Use the form to create content for your marketing needs</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentPreview;
