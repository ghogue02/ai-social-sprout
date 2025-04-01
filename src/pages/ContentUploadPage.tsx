
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ContentUploadPage = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("instagram");
  const [imageUrl, setImageUrl] = useState("");
  const [postUrl, setPostUrl] = useState("");
  const [likes, setLikes] = useState("0");
  const [comments, setComments] = useState("0");
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      const { data, error } = await supabase
        .from('content_items')
        .insert([
          {
            title,
            content,
            platform,
            image_url: imageUrl,
            original_post_url: postUrl,
            published_at: new Date().toISOString(),
            engagement: {
              likes: parseInt(likes),
              comments: parseInt(comments)
            }
          }
        ])
        .select();
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Content uploaded!",
        description: "Your content has been added to the database.",
      });
      
      // Reset form
      setTitle("");
      setContent("");
      setPlatform("instagram");
      setImageUrl("");
      setPostUrl("");
      setLikes("0");
      setComments("0");
      
    } catch (error) {
      console.error("Error uploading content:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your content.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-6 flex items-center">
        <Button 
          variant="ghost" 
          size="icon" 
          asChild
          className="mr-4 text-gray-400 hover:text-white"
        >
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-serif gold-gradient">Upload Content</h1>
          <p className="text-gray-400 mt-1">Manually add content from social media</p>
        </div>
      </div>

      <Card className="border-allendale-gold/20 bg-allendale-black/50">
        <CardHeader>
          <CardTitle className="text-lg text-allendale-gold font-serif">Content Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-200">Platform</label>
              <Select
                value={platform}
                onValueChange={setPlatform}
              >
                <SelectTrigger className="bg-allendale-black border-allendale-gold/30">
                  <SelectValue placeholder="Select platform" />
                </SelectTrigger>
                <SelectContent className="bg-allendale-black border-allendale-gold/30">
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="facebook">Facebook</SelectItem>
                  <SelectItem value="website">Website</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-200">Title</label>
              <Input 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-allendale-black border-allendale-gold/30"
                placeholder="E.g. Weekend Special: Half-price cocktails"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-200">Content</label>
              <Textarea 
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="bg-allendale-black border-allendale-gold/30 min-h-[100px]"
                placeholder="Post content or description"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-200">Image URL</label>
              <Input 
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-allendale-black border-allendale-gold/30"
                placeholder="URL to the image"
              />
              <p className="text-xs text-gray-400">Leave blank if no image</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-200">Original Post URL</label>
              <Input 
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                className="bg-allendale-black border-allendale-gold/30"
                placeholder="URL to the original post"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-200">Likes</label>
                <Input 
                  type="number"
                  min="0"
                  value={likes}
                  onChange={(e) => setLikes(e.target.value)}
                  className="bg-allendale-black border-allendale-gold/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-200">Comments</label>
                <Input 
                  type="number"
                  min="0"
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  className="bg-allendale-black border-allendale-gold/30"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="bg-allendale-gold text-black hover:bg-allendale-gold/80"
              disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Content
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ContentUploadPage;
