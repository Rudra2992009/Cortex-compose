import React from 'react';

interface IngredientInputProps {
  ingredients: string;
  setIngredients: (value: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const IngredientInput: React.FC<IngredientInputProps> = ({ ingredients, setIngredients, onGenerate, isLoading }) => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <label htmlFor="ingredients" className="block text-lg font-medium text-gray-700 mb-2">
        Your Available Ingredients
      </label>
      <textarea
        id="ingredients"
        rows={6}
        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-shadow"
        placeholder="e.g., chicken breast, tomatoes, rice, onion, garlic..."
        value={ingredients}
        onChange={(e) => setIngredients(e.target.value)}
        disabled={isLoading}
      />
      <button
        onClick={onGenerate}
        disabled={isLoading}
        className="mt-4 w-full flex justify-center items-center bg-emerald-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-all duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating Recipes & Images...
          </>
        ) : (
          'Generate Recipes'
        )}
      </button>
    </div>
  );
};

export default IngredientInput;