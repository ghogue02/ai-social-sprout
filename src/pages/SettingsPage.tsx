
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const SettingsPage = () => {
  const [restaurantName, setRestaurantName] = useState("Allendale Social");
  const [apiKey, setApiKey] = useState("");
  const [description, setDescription] = useState("Allendale Social is a modern restaurant and bar offering fine dining and craft cocktails in an elegant atmosphere.");
  const { toast } = useToast();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Settings saved!",
      description: "Your preferences have been updated successfully.",
    });
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
          <h1 className="text-3xl font-serif gold-gradient">Settings</h1>
          <p className="text-gray-400 mt-1">Configure your marketing assistant</p>
        </div>
      </div>

      <Card className="border-allendale-gold/20 bg-allendale-black/50">
        <CardHeader>
          <CardTitle className="text-lg text-allendale-gold font-serif">General Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm text-gray-200">Restaurant Name</label>
              <Input 
                value={restaurantName}
                onChange={(e) => setRestaurantName(e.target.value)}
                className="bg-allendale-black border-allendale-gold/30"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-200">Restaurant Description</label>
              <Textarea 
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-allendale-black border-allendale-gold/30 min-h-[100px]"
                placeholder="Describe your restaurant's concept, cuisine, and atmosphere"
              />
              <p className="text-xs text-gray-400">This description will help the AI generate more relevant content</p>
            </div>

            <div className="pt-4 border-t border-allendale-gold/20">
              <h3 className="text-md font-medium text-allendale-gold mb-4">API Connections</h3>
              
              <div className="space-y-2">
                <label className="text-sm text-gray-200">OpenAI API Key</label>
                <Input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="bg-allendale-black border-allendale-gold/30"
                  placeholder="sk-..."
                />
                <p className="text-xs text-gray-400">Required for content generation and image creation</p>
              </div>
            </div>

            <Button 
              type="submit" 
              className="bg-allendale-gold text-black hover:bg-allendale-gold/80"
            >
              <Save className="mr-2 h-4 w-4" />
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </MainLayout>
  );
};

export default SettingsPage;
