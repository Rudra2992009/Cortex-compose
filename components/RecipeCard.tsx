import React from 'react';
import { Recipe } from '../types';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 ease-in-out flex flex-col">
      <img className="w-full h-48 object-cover" src={recipe.imageUrl} alt={`A dish of ${recipe.recipeName}`} />
      <div className="p-6 flex-grow">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">{recipe.recipeName}</h3>
        <p className="text-gray-600 mb-4">{recipe.description}</p>

        <div className="mb-4">
          <h4 className="text-lg font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-1 mb-2">Ingredients</h4>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i}>{ingredient}</li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-emerald-700 border-b-2 border-emerald-200 pb-1 mb-2">Instructions</h4>
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            {recipe.instructions.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeCard;