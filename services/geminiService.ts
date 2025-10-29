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

// REVERT: The service is refactored to manage an active API key set by the admin.
class GeminiService {
  private activeApiKey: string | null = null;

  public setApiKey(key: string | null) {
    this.activeApiKey = key;
  }

  private getClient(): GoogleGenAI {
    if (!this.activeApiKey) {
      throw new Error("No active API key set. Please configure an API key in the admin dashboard.");
    }
    return new GoogleGenAI({ apiKey: this.activeApiKey });
  }

  public async generateImage(prompt: string, aspectRatio: AspectRatio): Promise<string> {
    try {
      const ai = this.getClient();
      const promptWithAspectRatio = `${prompt}, aspect ratio ${aspectRatio}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: promptWithAspectRatio }],
        },
        config: {
          responseModalities: [Modality.IMAGE],
        },
      });

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
          return Promise.reject(new Error(`Failed to generate image: The active API key may have exceeded its quota.`));
        }
        if (error.message.includes('API key not valid')) {
          return Promise.reject(new Error(`Failed to generate image: The active API key is not valid. Please check it in the admin dashboard.`));
        }
        throw new Error(`Failed to generate image: ${error.message}`);
      }
      throw new Error("An unknown error occurred during image generation.");
    }
  }

  public async enhancePrompt(basePrompt: string): Promise<string[]> {
    try {
      const ai = this.getClient();
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
          return Promise.reject(new Error(`Failed to enhance prompt: The active API key is not valid. Please check it in the admin dashboard.`));
        }
        throw new Error(`Failed to get prompt suggestions: ${error.message}`);
      }
      throw new Error("An unknown error occurred while enhancing the prompt.");
    }
  }
}

// Export a singleton instance.
export const geminiService = new GeminiService();
