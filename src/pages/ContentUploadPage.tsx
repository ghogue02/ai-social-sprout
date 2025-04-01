
import { useState, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Upload, Loader2, Image as ImageIcon, X, FileSearch } from "lucide-react";
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
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [username, setUsername] = useState("");
  const [hashtags, setHashtags] = useState("");
  const { toast } = useToast();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFileUpload(files[0]);
    }
  }, []);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileUpload(e.target.files[0]);
    }
  };

  const handleFileUpload = async (file: File) => {
    if (!file.type.includes('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file.",
        variant: "destructive",
      });
      return;
    }

    setUploadedFile(file);
    // Create a temporary object URL for preview
    setUploadedImageUrl(URL.createObjectURL(file));
  };

  const handleRemoveUploadedImage = () => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedFile(null);
    setUploadedImageUrl(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);
    
    try {
      let finalImageUrl = imageUrl;
      
      // Upload the image to Supabase Storage if there's an uploaded file
      if (uploadedFile) {
        const filename = `${Date.now()}_${uploadedFile.name.replace(/\s+/g, '_')}`;
        
        // First check if the bucket exists, if not create it
        const { data: buckets } = await supabase.storage.listBuckets();
        const contentBucketExists = buckets?.find(bucket => bucket.name === 'content-images');
        
        if (!contentBucketExists) {
          await supabase.storage.createBucket('content-images', {
            public: true,
            fileSizeLimit: 5242880 // 5MB
          });
        }
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('content-images')
          .upload(filename, uploadedFile);
          
        if (uploadError) {
          throw uploadError;
        }
        
        if (uploadData) {
          const { data } = supabase.storage.from('content-images').getPublicUrl(filename);
          finalImageUrl = data.publicUrl;
        }
      }
      
      const { error } = await supabase
        .from('content_items')
        .insert([
          {
            title,
            content,
            platform,
            image_url: finalImageUrl,
            original_post_url: postUrl,
            published_at: new Date().toISOString(),
            engagement: {
              likes: parseInt(likes),
              comments: parseInt(comments)
            }
          }
        ]);
      
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
      setUsername("");
      setHashtags("");
      handleRemoveUploadedImage();
      
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

  const analyzeImage = async () => {
    if (!uploadedFile) {
      toast({
        title: "No image to analyze",
        description: "Please upload an Instagram screenshot first.",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    
    try {
      // Convert the image to base64
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = reader.result?.toString().split(',')[1];
          if (base64) resolve(base64);
        };
      });
      
      reader.readAsDataURL(uploadedFile);
      const imageBase64 = await base64Promise;
      
      // Call the analyze-instagram-image edge function
      const { data, error } = await supabase.functions.invoke("analyze-instagram-image", {
        body: { imageBase64 }
      });
      
      if (error) {
        throw error;
      }

      if (!data.success) {
        throw new Error(data.error || "Failed to analyze image");
      }
      
      const instagramData = data.instagramData;
      
      // Update form fields with extracted data
      if (instagramData.caption) setTitle(instagramData.caption.substring(0, 50) + (instagramData.caption.length > 50 ? '...' : ''));
      if (instagramData.caption) setContent(instagramData.caption);
      if (instagramData.likes) setLikes(String(instagramData.likes));
      if (instagramData.comments) setComments(String(instagramData.comments));
      if (instagramData.username) setUsername(instagramData.username);
      if (instagramData.hashtags && Array.isArray(instagramData.hashtags)) {
        setHashtags(instagramData.hashtags.join(' '));
      }
      
      toast({
        title: "Image analysis complete",
        description: "Information has been extracted from your Instagram screenshot.",
      });
    } catch (error) {
      console.error("Error analyzing image:", error);
      toast({
        title: "Analysis failed",
        description: "Could not extract information from the image.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
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
          <Link to="/content">
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
              <label className="text-sm text-gray-200">Upload Instagram Screenshot</label>
              <div
                className={`border-2 border-dashed rounded-md p-6 transition-colors ${
                  isDragging 
                    ? "border-allendale-gold bg-allendale-gold/10" 
                    : "border-allendale-gold/30 hover:border-allendale-gold/50"
                } cursor-pointer`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => document.getElementById('fileInput')?.click()}
              >
                <input
                  id="fileInput"
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileInput}
                />
                
                {uploadedImageUrl ? (
                  <div className="relative">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute top-1 right-1 bg-black/70 hover:bg-black/90 z-10 h-8 w-8"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveUploadedImage();
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    <img
                      src={uploadedImageUrl}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded"
                    />
                    
                    <div className="mt-4 flex justify-center">
                      <Button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          analyzeImage();
                        }}
                        className="bg-allendale-gold text-black hover:bg-allendale-gold/80"
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : (
                          <>
                            <FileSearch className="mr-2 h-4 w-4" />
                            Extract Info from Screenshot
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-gray-400">
                    <ImageIcon className="h-12 w-12 mb-2" />
                    <p className="text-center">
                      <span className="font-medium">Drop Instagram screenshot here</span> or click to upload
                    </p>
                    <p className="text-xs mt-1">AI will automatically extract post data</p>
                  </div>
                )}
              </div>
              
              {!uploadedImageUrl && (
                <div className="space-y-2 mt-4">
                  <label className="text-sm text-gray-200">Or provide an image URL</label>
                  <Input 
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="bg-allendale-black border-allendale-gold/30"
                    placeholder="URL to the image"
                  />
                </div>
              )}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-gray-200">Username</label>
                <Input 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="bg-allendale-black border-allendale-gold/30"
                  placeholder="Instagram username"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-200">Hashtags</label>
                <Input 
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  className="bg-allendale-black border-allendale-gold/30"
                  placeholder="#food #restaurant"
                />
              </div>
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
