import React, { useState, useCallback } from 'react';
import { Recipe } from './types';
import { generateRecipes } from './services/geminiService';
import IngredientInput from './components/IngredientInput';
import RecipeCard from './components/RecipeCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorDisplay from './components/ErrorDisplay';

const App: React.FC = () => {
  const [ingredients, setIngredients] = useState<string>('');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateRecipes = useCallback(async () => {
    if (!ingredients.trim()) {
      setError('Please enter some ingredients.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setRecipes([]);

    try {
      const generatedRecipes = await generateRecipes(ingredients);
      setRecipes(generatedRecipes);
    } catch (err) {
      if (err instanceof Error) {
        setError(`Failed to generate recipes: ${err.message}`);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [ingredients]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight">
            Cortex Compose
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Transform your ingredients into culinary masterpieces, complete with stunning visuals. Enter what you have, and let our AI chef and artist inspire you.
          </p>
        </header>

        <main>
          <IngredientInput
            ingredients={ingredients}
            setIngredients={setIngredients}
            onGenerate={handleGenerateRecipes}
            isLoading={isLoading}
          />

          {isLoading && <LoadingSpinner />}
          {error && <ErrorDisplay message={error} />}

          {recipes.length > 0 && (
            <div className="mt-12">
              <h2 className="text-3xl font-bold text-center mb-8">Your Recipe Suggestions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {recipes.map((recipe, index) => (
                  <RecipeCard key={index} recipe={recipe} />
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default App;