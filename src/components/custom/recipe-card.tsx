'use client';

import { Recipe } from '@/lib/types';
import { Heart, Clock, Users, Star } from 'lucide-react';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  onToggleFavorite?: (recipeId: string) => void;
}

export default function RecipeCard({ recipe, onClick, onToggleFavorite }: RecipeCardProps) {
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.(recipe.id);
  };

  return (
    <div
      onClick={onClick}
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer group"
    >
      {/* Imagem */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image}
          alt={recipe.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Botão Favorito */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all ${
            recipe.isFavorite
              ? 'bg-red-500 text-white'
              : 'bg-white/90 text-gray-800 hover:bg-white'
          }`}
        >
          <Heart className={`w-5 h-5 ${recipe.isFavorite ? 'fill-current' : ''}`} />
        </button>

        {/* Badge de Categoria */}
        <div className="absolute top-3 left-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-800 rounded-full text-xs font-semibold">
            {recipe.category}
          </span>
        </div>

        {/* Avaliação */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full">
          <Star className="w-4 h-4 text-yellow-400 fill-current" />
          <span className="text-white text-sm font-semibold">{recipe.rating}</span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
          {recipe.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {recipe.description}
        </p>

        {/* Informações */}
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{recipe.prepTime + recipe.cookTime} min</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4" />
            <span>{recipe.servings} porções</span>
          </div>

          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            recipe.difficulty === 'Fácil'
              ? 'bg-green-100 text-green-700'
              : recipe.difficulty === 'Médio'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {recipe.difficulty}
          </span>
        </div>

        {/* Autor */}
        <div className="mt-4 pt-4 border-t border-gray-100 flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            {recipe.authorName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {recipe.authorName}
            </p>
            <p className="text-xs text-gray-500">
              {recipe.ratingsCount} avaliações
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
