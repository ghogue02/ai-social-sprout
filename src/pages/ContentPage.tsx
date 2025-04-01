
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ContentForm from "@/components/content/ContentForm";
import ContentPreview from "@/components/content/ContentPreview";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const ContentPage = () => {
  const [generatedContent, setGeneratedContent] = useState("");

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
          <h1 className="text-3xl font-serif gold-gradient">Content Generator</h1>
          <p className="text-gray-400 mt-1">Create AI-powered marketing content</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContentForm onGenerate={setGeneratedContent} />
        <ContentPreview content={generatedContent} />
      </div>
    </MainLayout>
  );
};

export default ContentPage;
