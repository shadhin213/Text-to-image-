/*
  SECURITY WARNING:
  This frontend-only application makes API calls directly from the client-side code.
  This is INSECURE and should NOT be used in a production environment.
  In a real-world application, all API calls should be proxied through a backend server
  that can securely store and manage the API key. This prevents unauthorized access
  and abuse of your API credentials.
*/
import { GoogleGenAI, Modality, Type } from "@google/genai";
import type { AspectRatio } from "../types";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    // This state is handled by the UI, but it's a good safeguard.
    throw new Error("API_KEY environment variable not set. Please select an API key to continue.");
  }
  return new GoogleGenAI({ apiKey });
}

export const generateImage = async (prompt: string, aspectRatio: AspectRatio): Promise<string> => {
  try {
    const ai = getAiClient();
    // Switched to a more cost-effective model to help stay within the free tier.
    // The gemini-2.5-flash-image model does not have a dedicated aspectRatio config,
    // so we include it as a hint in the prompt for the model.
    const promptWithAspectRatio = `${prompt}, aspect ratio ${aspectRatio}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: promptWithAspectRatio },
        ],
      },
      config: {
          responseModalities: [Modality.IMAGE],
      },
    });

    // The response structure for this model requires parsing the parts.
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64ImageBytes: string = part.inlineData.data;
        const mimeType = part.inlineData.mimeType;
        return `data:${mimeType};base64,${base64ImageBytes}`;
      }
    }
    
    throw new Error("No image was generated from the response parts.");

  } catch (error) {
    console.error("Error generating image:", error);
    if (error instanceof Error) {
        if (error.message.includes('quota') || error.message.includes('RESOURCE_EXHAUSTED')) {
          return Promise.reject(new Error(`Failed to generate image: You may have exceeded the free tier quota. Please try using a different API key or check your Google Cloud billing details.`));
        }
         if (error.message.includes('API key not valid')) {
            return Promise.reject(new Error(`Failed to generate image: The selected API key is not valid. Please select a valid key.`));
        }
        throw new Error(`Failed to generate image: ${error.message}`);
    }
    throw new Error("An unknown error occurred during image generation.");
  }
};

export const enhancePrompt = async (basePrompt: string): Promise<string[]> => {
  try {
    const ai = getAiClient();
    const textModel = 'gemini-2.5-flash';
    const systemInstruction = "You are a creative assistant helping users write detailed prompts for an AI image generator. For the user's idea, create 3 distinct, highly descriptive prompts. Focus on composition, lighting, style, and mood. Return the result as a JSON array of strings.";

    const response = await ai.models.generateContent({
      model: textModel,
      contents: `User idea: "${basePrompt}"`,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.STRING,
            description: "A detailed and creative prompt for image generation.",
          },
        },
      },
    });
    
    const jsonStr = response.text.trim();
    const suggestions = JSON.parse(jsonStr);
    return suggestions;
  } catch (error) {
    console.error("Error enhancing prompt:", error);
    if (error instanceof Error) {
        if (error.message.includes('API key not valid')) {
            return Promise.reject(new Error(`Failed to enhance prompt: The selected API key is not valid. Please select a valid key.`));
        }
      throw new Error(`Failed to get prompt suggestions: ${error.message}`);
    }
    throw new Error("An unknown error occurred while enhancing the prompt.");
  }
};
