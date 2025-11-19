'use client';

import { useState, useEffect, useCallback } from 'react';
import { Search, TrendingUp, Users } from 'lucide-react';
import RecipeCard from '../recipe-card';
import RecipeDetailModal from '../recipe-detail-modal';
import { Recipe } from '@/lib/types';
import { getRecipes, saveRecipe, toggleFavorite as toggleFavoriteStorage } from '@/lib/storage';
import {
  searchRecipes,
  getSearchSuggestions,
  getRecipesByCategory,
  getPopularRecipes,
  getCommunityRecipes,
} from '@/lib/mock-recipes';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [displayedRecipes, setDisplayedRecipes] = useState<Recipe[]>([]);
  const [popularRecipes, setPopularRecipes] = useState<Recipe[]>([]);
  const [communityRecipes, setCommunityRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [localRecipes, setLocalRecipes] = useState<Recipe[]>([]);

  const categories = [
    { id: 'all', name: 'Todas', icon: '🍽️' },
    { id: 'Brasileira', name: 'Brasileira', icon: '🇧🇷' },
    { id: 'Doces', name: 'Doces', icon: '🍰' },
    { id: 'Salgados', name: 'Salgados', icon: '🥐' },
  ];

  // Carregar receitas locais
  useEffect(() => {
    setLocalRecipes(getRecipes());
  }, []);

  // Carregar receitas populares e da comunidade
  useEffect(() => {
    setPopularRecipes(getPopularRecipes(6));
    setCommunityRecipes(getCommunityRecipes().slice(0, 8));
  }, []);

  // Busca com debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        const suggestions = getSearchSuggestions(searchQuery);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Atualizar receitas exibidas baseado em busca e filtro
  useEffect(() => {
    let recipes: Recipe[] = [];

    if (searchQuery.trim()) {
      // Buscar em receitas externas
      const externalResults = searchRecipes(searchQuery);
      // Buscar em receitas locais
      const localResults = localRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      recipes = [...externalResults, ...localResults];
    } else if (selectedCategory !== 'all') {
      // Filtrar por categoria
      const externalByCategory = getRecipesByCategory(selectedCategory);
      const localByCategory = localRecipes.filter(r => r.category === selectedCategory);
      recipes = [...externalByCategory, ...localByCategory];
    } else {
      // Mostrar receitas populares quando não há busca
      recipes = popularRecipes;
    }

    setDisplayedRecipes(recipes);
  }, [searchQuery, selectedCategory, localRecipes, popularRecipes]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSuggestions(false);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setSearchQuery(suggestion);
    setShowSuggestions(false);
  };

  const handleToggleFavorite = useCallback((recipeId: string) => {
    toggleFavoriteStorage(recipeId);
    setLocalRecipes(getRecipes());
    
    // Atualizar receita selecionada se estiver aberta
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      const updated = getRecipes().find(r => r.id === recipeId);
      if (updated) {
        setSelectedRecipe(updated);
      }
    }
  }, [selectedRecipe]);

  const handleSaveToBook = useCallback((recipe: Recipe) => {
    // Verificar se já existe
    const existing = localRecipes.find(r => r.id === recipe.id);
    if (!existing) {
      saveRecipe(recipe);
      setLocalRecipes(getRecipes());
      alert(`✅ "${recipe.title}" salva nos seus livros!`);
    } else {
      alert(`ℹ️ Esta receita já está salva nos seus livros.`);
    }
  }, [localRecipes]);

  return (
    <div className="pb-24 px-4 pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Descubra Receitas Incríveis 🍳
        </h1>
        <p className="text-gray-600">
          Receitas aprovadas por chefs renomados
        </p>
      </div>

      {/* Barra de Busca com Autocomplete */}
      <div className="relative mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Busque por receita, ingrediente ou chef..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchQuery.length >= 2 && setShowSuggestions(true)}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-orange-500 focus:outline-none transition-all text-gray-900 placeholder-gray-400"
          />
        </div>

        {/* Sugestões de Busca */}
        {showSuggestions && searchSuggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-200 z-10 max-h-80 overflow-y-auto">
            {searchSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full px-4 py-3 text-left hover:bg-orange-50 transition-colors flex items-center gap-3 border-b border-gray-100 last:border-0"
              >
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-gray-900">{suggestion}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filtros de Categoria */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              setSelectedCategory(category.id);
              setSearchQuery('');
            }}
            className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium whitespace-nowrap transition-all ${
              selectedCategory === category.id
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span className="text-xl">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>

      {/* Resultados de Busca ou Filtro */}
      {(searchQuery || selectedCategory !== 'all') && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Search className="w-6 h-6 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-900">
              {searchQuery
                ? `Resultados para "${searchQuery}"`
                : `Receitas ${categories.find(c => c.id === selectedCategory)?.name}`}
            </h2>
            <span className="text-gray-500">({displayedRecipes.length})</span>
          </div>

          {displayedRecipes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                Nenhuma receita encontrada. Tente outro termo de busca.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Receitas Populares */}
      {!searchQuery && selectedCategory === 'all' && (
        <>
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <TrendingUp className="w-7 h-7 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Receitas Populares
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>

          {/* Comunidade */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-7 h-7 text-orange-500" />
              <h2 className="text-2xl font-bold text-gray-900">
                Comunidade
              </h2>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Receitas Compartilhadas
              </span>
            </div>

            <p className="text-gray-600 mb-6">
              Descubra receitas compartilhadas por outros usuários em tempo real
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {communityRecipes.map((recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          </div>
        </>
      )}

      {/* Modal de Detalhes */}
      {selectedRecipe && (
        <RecipeDetailModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onToggleFavorite={handleToggleFavorite}
          onSaveToBook={handleSaveToBook}
        />
      )}
    </div>
  );
}
