import { GoogleGenAI, Type } from "@google/genai";
import { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            recipeName: {
                type: Type.STRING,
                description: 'The name of the recipe.',
            },
            description: {
                type: Type.STRING,
                description: 'A brief, enticing description of the dish, around 1-2 sentences.',
            },
            ingredients: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                },
                description: 'A list of all ingredients required for the recipe, including quantities.',
            },
            instructions: {
                type: Type.ARRAY,
                items: {
                    type: Type.STRING,
                },
                description: 'Step-by-step instructions for preparing the recipe.',
            },
        },
        required: ["recipeName", "description", "ingredients", "instructions"],
    },
};

const generateImageForRecipe = async (recipeName: string): Promise<string> => {
    try {
        const prompt = `A high-quality, delicious-looking photograph of a homemade dish: "${recipeName}". Professional food photography, warm lighting, appetizing presentation.`;
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/jpeg',
                aspectRatio: '16:9',
            },
        });
        
        const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
        return `data:image/jpeg;base64,${base64ImageBytes}`;
    } catch (error) {
        console.error(`Error generating image for recipe "${recipeName}":`, error);
        throw new Error(`Failed to generate image for ${recipeName}`);
    }
}

export const generateRecipes = async (ingredients: string): Promise<Recipe[]> => {
    const prompt = `
      Based on the following list of available ingredients, please generate 3 distinct and creative recipes.
      Ensure the recipes primarily use the ingredients provided, but you can assume common pantry staples like salt, pepper, oil, and water are available.
      
      Available Ingredients:
      ${ingredients}
    `;

    try {
        // Step 1: Generate recipe text data
        const recipeDataResponse = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: recipeSchema,
            },
        });
        
        const jsonText = recipeDataResponse.text.trim();
        const recipesWithoutImages: Omit<Recipe, 'imageUrl'>[] = JSON.parse(jsonText);

        if (!recipesWithoutImages || recipesWithoutImages.length === 0) {
            return [];
        }
        
        // Step 2: Generate images for each recipe in parallel
        const recipesWithImages = await Promise.all(
            recipesWithoutImages.map(async (recipe) => {
                const imageUrl = await generateImageForRecipe(recipe.recipeName);
                return { ...recipe, imageUrl };
            })
        );
        
        return recipesWithImages;

    } catch (error) {
        console.error("Error generating recipes with Gemini:", error);
        throw new Error("Could not connect to the recipe generation service. Please check your connection and API key.");
    }
};