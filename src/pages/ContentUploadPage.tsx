
import { useState, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2, Image as ImageIcon, X, FileSearch } from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ContentUploadPage = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [parsedData, setParsedData] = useState<{
    caption: string;
    likes: number;
    comments: number;
    username: string;
    postedDate?: string;
    hashtags: string[];
  } | null>(null);
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
    
    // Automatically start analyzing
    analyzeImage(file);
  };

  const handleRemoveUploadedImage = () => {
    if (uploadedImageUrl) {
      URL.revokeObjectURL(uploadedImageUrl);
    }
    setUploadedFile(null);
    setUploadedImageUrl(null);
    setParsedData(null);
  };

  const analyzeImage = async (file: File) => {
    if (!file) {
      return;
    }

    setIsAnalyzing(true);
    setParsedData(null);
    
    try {
      // Convert the image to base64
      const reader = new FileReader();
      
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = () => {
          const base64 = reader.result?.toString().split(',')[1];
          if (base64) resolve(base64);
        };
      });
      
      reader.readAsDataURL(file);
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
      setParsedData(instagramData);
      
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

  const saveContent = async () => {
    if (!parsedData) {
      toast({
        title: "No data to save",
        description: "Please upload and analyze an Instagram screenshot first.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    
    try {
      let finalImageUrl = "";
      
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
            title: parsedData.caption?.substring(0, 50) + (parsedData.caption?.length > 50 ? '...' : '') || "Instagram Post",
            content: parsedData.caption || "",
            platform: "instagram",
            image_url: finalImageUrl,
            username: parsedData.username || "",
            hashtags: Array.isArray(parsedData.hashtags) ? parsedData.hashtags : [],
            published_at: parsedData.postedDate || new Date().toISOString(),
            engagement: {
              likes: parsedData.likes || 0,
              comments: parsedData.comments || 0
            }
          }
        ]);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Content saved!",
        description: "Your Instagram content has been added to the database.",
      });
      
      // Reset form
      handleRemoveUploadedImage();
      
    } catch (error) {
      console.error("Error saving content:", error);
      toast({
        title: "Save failed",
        description: "There was an error saving your content.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
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
          <h1 className="text-3xl font-serif gold-gradient">Instagram Content Capture</h1>
          <p className="text-gray-400 mt-1">Drop an Instagram screenshot to automatically extract data</p>
        </div>
      </div>

      <Card className="border-allendale-gold/20 bg-allendale-black/50 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="text-lg text-allendale-gold font-serif">Drop Instagram Screenshot</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-md p-8 transition-colors ${
              isDragging 
                ? "border-allendale-gold bg-allendale-gold/10" 
                : "border-allendale-gold/30 hover:border-allendale-gold/50"
            } cursor-pointer min-h-[300px] flex flex-col items-center justify-center`}
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
              <div className="relative w-full">
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <img
                      src={uploadedImageUrl}
                      alt="Preview"
                      className="max-h-96 rounded"
                    />
                    
                    {isAnalyzing && (
                      <div className="mt-4 flex items-center justify-center space-x-2 bg-allendale-black/70 p-3 rounded">
                        <Loader2 className="h-5 w-5 animate-spin text-allendale-gold" />
                        <span className="text-allendale-gold">Analyzing screenshot...</span>
                      </div>
                    )}
                  </div>
                  
                  {parsedData && (
                    <div className="space-y-4 bg-allendale-black/70 p-4 rounded">
                      <h3 className="text-lg font-semibold text-allendale-gold">Extracted Data</h3>
                      
                      <div className="space-y-2">
                        <div>
                          <span className="text-gray-400">Username:</span>
                          <p className="text-white font-medium">{parsedData.username || "Unknown"}</p>
                        </div>
                        
                        <div>
                          <span className="text-gray-400">Caption:</span>
                          <p className="text-white">{parsedData.caption || "No caption"}</p>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-gray-400">Likes:</span>
                            <p className="text-white font-medium">{parsedData.likes || 0}</p>
                          </div>
                          
                          <div>
                            <span className="text-gray-400">Comments:</span>
                            <p className="text-white font-medium">{parsedData.comments || 0}</p>
                          </div>
                        </div>
                        
                        {parsedData.postedDate && (
                          <div>
                            <span className="text-gray-400">Posted Date:</span>
                            <p className="text-white">{parsedData.postedDate}</p>
                          </div>
                        )}
                        
                        {parsedData.hashtags && parsedData.hashtags.length > 0 && (
                          <div>
                            <span className="text-gray-400">Hashtags:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {parsedData.hashtags.map((tag, index) => (
                                <span 
                                  key={index} 
                                  className="bg-allendale-gold/20 text-allendale-gold px-2 py-1 rounded text-xs"
                                >
                                  {tag.startsWith('#') ? tag : `#${tag}`}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveContent();
                        }}
                        className="w-full bg-allendale-gold text-black hover:bg-allendale-gold/80 mt-4"
                        disabled={isSaving}
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          "Save Content"
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImageIcon className="h-20 w-20 mb-4 text-allendale-gold/50" />
                <p className="text-center text-lg">
                  <span className="font-medium">Drop Instagram screenshot here</span> or click to upload
                </p>
                <p className="text-center text-sm mt-2 max-w-md">
                  Simply drop a screenshot of an Instagram post and AI will automatically extract all the content, engagement data, and hashtags
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default ContentUploadPage;
