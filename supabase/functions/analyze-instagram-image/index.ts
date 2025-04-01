
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

    // Call OpenAI API to analyze the image with improved prompt
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
            content: "You are an assistant that analyzes Instagram post screenshots. Extract the following information: caption/text content, number of likes, number of comments, username of poster, date posted, and hashtags used. Return ONLY valid JSON without code blocks, markdown, or any other text. The JSON must have these fields: caption (string), likes (number), comments (number), username (string), postedDate (string), hashtags (array of strings)."
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this Instagram post screenshot and extract the key information as clean JSON. Don't include any markdown formatting, code blocks, or explanations in your response. Return only the raw JSON object."
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
      const aiResponse = data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error("No response from OpenAI");
      }
      
      console.log("Raw AI response:", aiResponse);
      
      // Clean the response to ensure it's valid JSON
      // Remove any potential markdown code block markers or other text
      const jsonString = aiResponse
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();
      
      // Attempt to parse the JSON from the cleaned AI response
      parsedContent = JSON.parse(jsonString);
      
      // Ensure all fields have appropriate default values
      parsedContent = {
        caption: parsedContent.caption || "",
        likes: parseInt(parsedContent.likes) || 0,
        comments: parseInt(parsedContent.comments) || 0,
        username: parsedContent.username || "",
        postedDate: parsedContent.postedDate || "",
        hashtags: Array.isArray(parsedContent.hashtags) ? parsedContent.hashtags : []
      };
      
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
