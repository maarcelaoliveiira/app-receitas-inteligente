'use client';

import { Recipe } from '@/lib/types';
import { X, Clock, Users, ChefHat, Heart, Share2, BookmarkPlus, Star } from 'lucide-react';
import { useState } from 'react';

interface RecipeDetailModalProps {
  recipe: Recipe;
  onClose: () => void;
  onToggleFavorite: (recipeId: string) => void;
  onSaveToBook: (recipe: Recipe) => void;
}

export default function RecipeDetailModal({
  recipe,
  onClose,
  onToggleFavorite,
  onSaveToBook,
}: RecipeDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'ingredients' | 'instructions' | 'nutrition'>('ingredients');

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: recipe.title,
        text: recipe.description,
        url: window.location.href,
      });
    } else {
      alert('Compartilhamento não suportado neste navegador');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header com Imagem */}
        <div className="relative h-64 md:h-80">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-full object-cover"
          />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-all shadow-lg"
          >
            <X className="w-6 h-6 text-gray-800" />
          </button>
          
          {/* Ações Rápidas */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => onToggleFavorite(recipe.id)}
              className={`p-3 rounded-full backdrop-blur-sm transition-all shadow-lg ${
                recipe.isFavorite
                  ? 'bg-red-500 text-white'
                  : 'bg-white/90 text-gray-800 hover:bg-white'
              }`}
            >
              <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={() => onSaveToBook(recipe)}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
            >
              <BookmarkPlus className="w-5 h-5 text-gray-800" />
            </button>
            <button
              onClick={handleShare}
              className="bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white transition-all shadow-lg"
            >
              <Share2 className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>

        {/* Conteúdo */}
        <div className="p-6 md:p-8">
          {/* Título e Info */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium">
                {recipe.category}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                {recipe.difficulty}
              </span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
              {recipe.title}
            </h1>
            
            <p className="text-gray-600 text-lg mb-4">
              {recipe.description}
            </p>

            {/* Autor e Avaliação */}
            <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                  {recipe.authorName.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold text-gray-900">{recipe.authorName}</p>
                  <p className="text-sm text-gray-500">Chef Renomado</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500 fill-current" />
                <span className="font-bold text-gray-900">{recipe.rating}</span>
                <span className="text-gray-500">({recipe.ratingsCount} avaliações)</span>
              </div>
            </div>
          </div>

          {/* Informações Rápidas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Clock className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Preparo</p>
                <p className="font-semibold text-gray-900">{recipe.prepTime} min</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <ChefHat className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Cozimento</p>
                <p className="font-semibold text-gray-900">{recipe.cookTime} min</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <Users className="w-6 h-6 text-orange-500" />
              <div>
                <p className="text-sm text-gray-600">Porções</p>
                <p className="font-semibold text-gray-900">{recipe.servings}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm text-gray-600">Calorias</p>
                <p className="font-semibold text-gray-900">{recipe.nutrition.calories} kcal</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab('ingredients')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'ingredients'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Ingredientes
            </button>
            <button
              onClick={() => setActiveTab('instructions')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'instructions'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Modo de Preparo
            </button>
            <button
              onClick={() => setActiveTab('nutrition')}
              className={`px-6 py-3 font-semibold transition-all ${
                activeTab === 'nutrition'
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Nutrição
            </button>
          </div>

          {/* Conteúdo das Tabs */}
          <div className="mb-6">
            {activeTab === 'ingredients' && (
              <div className="space-y-3">
                {recipe.ingredients.map((ingredient) => (
                  <div
                    key={ingredient.id}
                    className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-2 h-2 bg-orange-500 rounded-full" />
                    <span className="font-medium text-gray-900">
                      {ingredient.quantity} {ingredient.unit}
                    </span>
                    <span className="text-gray-600">{ingredient.name}</span>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'instructions' && (
              <div className="space-y-4">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700 leading-relaxed pt-1">{instruction}</p>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl text-center">
                  <p className="text-3xl font-bold text-orange-600 mb-1">
                    {recipe.nutrition.calories}
                  </p>
                  <p className="text-sm text-gray-600">Calorias (kcal)</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl text-center">
                  <p className="text-3xl font-bold text-blue-600 mb-1">
                    {recipe.nutrition.protein}g
                  </p>
                  <p className="text-sm text-gray-600">Proteínas</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl text-center">
                  <p className="text-3xl font-bold text-green-600 mb-1">
                    {recipe.nutrition.carbs}g
                  </p>
                  <p className="text-sm text-gray-600">Carboidratos</p>
                </div>
                
                <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl text-center">
                  <p className="text-3xl font-bold text-purple-600 mb-1">
                    {recipe.nutrition.fat}g
                  </p>
                  <p className="text-sm text-gray-600">Gorduras</p>
                </div>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 pt-6 border-t">
            {recipe.tags.map((tag) => (
              <span
                key={tag}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
