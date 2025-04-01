
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    
    if (!OPENAI_API_KEY) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not found" }),
        { 
          status: 500, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    const { imageBase64 } = await req.json();
    
    if (!imageBase64) {
      return new Response(
        JSON.stringify({ error: "No image provided" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    // Call OpenAI API to analyze the image
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are an assistant that analyzes screenshots of Instagram posts. Extract the following information in JSON format: 1) caption/text content, 2) number of likes, 3) number of comments, 4) username of poster, 5) date posted (estimate if not exact), 6) hashtags used. Return ONLY valid JSON with these fields: caption, likes, comments, username, postedDate, hashtags (array)."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this Instagram post screenshot and extract the key information as JSON. Only return valid JSON, no other text."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ]
      })
    });

    const data = await response.json();
    
    // Extract the JSON response
    let parsedContent;
    try {
      const aiResponse = data.choices[0].message.content;
      // Attempt to parse the JSON from the AI response
      parsedContent = JSON.parse(aiResponse);
    } catch (e) {
      console.error("Error parsing AI response:", e);
      console.log("Raw AI response:", data.choices[0]?.message?.content);
      return new Response(
        JSON.stringify({ 
          error: "Could not parse Instagram content from image",
          rawResponse: data.choices[0]?.message?.content || "No response" 
        }),
        { 
          status: 422, 
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        instagramData: parsedContent
      }),
      { 
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    console.error("Error in analyze-instagram-image function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
