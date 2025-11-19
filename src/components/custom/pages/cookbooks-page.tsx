'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Heart, ChefHat, Plus, Lock, Unlock } from 'lucide-react';
import RecipeCard from '../recipe-card';
import RecipeDetailModal from '../recipe-detail-modal';
import { Recipe, Cookbook } from '@/lib/types';
import { getRecipes, getCookbooks, toggleFavorite as toggleFavoriteStorage, saveCookbook } from '@/lib/storage';

export default function CookbooksPage() {
  const [activeTab, setActiveTab] = useState<'favorites' | 'my-recipes' | 'cookbooks'>('favorites');
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [cookbooks, setCookbooks] = useState<Cookbook[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setRecipes(getRecipes());
    setCookbooks(getCookbooks());
  };

  const handleToggleFavorite = (recipeId: string) => {
    toggleFavoriteStorage(recipeId);
    loadData();
    
    // Atualizar receita selecionada se estiver aberta
    if (selectedRecipe && selectedRecipe.id === recipeId) {
      const updated = getRecipes().find(r => r.id === recipeId);
      if (updated) {
        setSelectedRecipe(updated);
      }
    }
  };

  const handleSaveToBook = (recipe: Recipe) => {
    alert(`✅ "${recipe.title}" já está nos seus livros!`);
  };

  const handleToggleCookbookPrivacy = (cookbookId: string) => {
    const cookbook = cookbooks.find(c => c.id === cookbookId);
    if (cookbook) {
      cookbook.isPublic = !cookbook.isPublic;
      saveCookbook(cookbook);
      loadData();
    }
  };

  const favoriteRecipes = recipes.filter(r => r.isFavorite);
  const myRecipes = recipes.filter(r => r.authorId === 'user-1'); // Receitas criadas pelo usuário

  return (
    <div className="pb-24 px-4 pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Meus Livros de Receitas 📚
        </h1>
        <p className="text-gray-600">
          Organize e gerencie suas receitas favoritas
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide border-b-2 border-gray-200">
        <button
          onClick={() => setActiveTab('favorites')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-semibold whitespace-nowrap transition-all ${
            activeTab === 'favorites'
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <Heart className={`w-5 h-5 ${activeTab === 'favorites' ? 'fill-current' : ''}`} />
          <span>Receitas Favoritas</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            activeTab === 'favorites' ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            {favoriteRecipes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('my-recipes')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-semibold whitespace-nowrap transition-all ${
            activeTab === 'my-recipes'
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ChefHat className="w-5 h-5" />
          <span>Minhas Receitas</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            activeTab === 'my-recipes' ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            {myRecipes.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('cookbooks')}
          className={`flex items-center gap-2 px-6 py-3 rounded-t-xl font-semibold whitespace-nowrap transition-all ${
            activeTab === 'cookbooks'
              ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <BookOpen className="w-5 h-5" />
          <span>Livros</span>
          <span className={`px-2 py-1 rounded-full text-xs ${
            activeTab === 'cookbooks' ? 'bg-white/20' : 'bg-gray-200'
          }`}>
            {cookbooks.length}
          </span>
        </button>
      </div>

      {/* Conteúdo das Tabs */}
      <div>
        {/* Receitas Favoritas */}
        {activeTab === 'favorites' && (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Suas Receitas Favoritas ❤️
              </h2>
              <p className="text-gray-600">
                Receitas que você encontrou no app e favoritou
              </p>
            </div>

            {favoriteRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {favoriteRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-3xl">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma receita favorita ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Explore receitas e adicione aos favoritos clicando no ❤️
                </p>
              </div>
            )}
          </div>
        )}

        {/* Minhas Receitas */}
        {activeTab === 'my-recipes' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Minhas Receitas 👨‍🍳
                </h2>
                <p className="text-gray-600">
                  Receitas que você criou ou importou de outros lugares
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                <Plus className="w-5 h-5" />
                <span>Nova Receita</span>
              </button>
            </div>

            {myRecipes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRecipes.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    onClick={() => setSelectedRecipe(recipe)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-3xl">
                <ChefHat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhuma receita criada ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Comece criando sua primeira receita ou importe de outros apps
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  Criar Primeira Receita
                </button>
              </div>
            )}
          </div>
        )}

        {/* Livros de Receitas */}
        {activeTab === 'cookbooks' && (
          <div>
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Seus Livros de Receitas 📖
                </h2>
                <p className="text-gray-600">
                  Organize suas receitas em coleções temáticas
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                <Plus className="w-5 h-5" />
                <span>Novo Livro</span>
              </button>
            </div>

            {cookbooks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cookbooks.map((cookbook) => {
                  const cookbookRecipes = recipes.filter(r => cookbook.recipes.includes(r.id));
                  
                  return (
                    <div
                      key={cookbook.id}
                      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all overflow-hidden cursor-pointer group"
                    >
                      <div className="relative h-48">
                        <img
                          src={cookbook.cover}
                          alt={cookbook.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        {/* Botão Privacidade */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleCookbookPrivacy(cookbook.id);
                          }}
                          className={`absolute top-4 right-4 p-2 rounded-full backdrop-blur-sm transition-all ${
                            cookbook.isPublic
                              ? 'bg-green-500/90 text-white'
                              : 'bg-gray-800/90 text-white'
                          }`}
                        >
                          {cookbook.isPublic ? (
                            <Unlock className="w-5 h-5" />
                          ) : (
                            <Lock className="w-5 h-5" />
                          )}
                        </button>

                        <div className="absolute bottom-4 left-4 right-4">
                          <h3 className="text-xl font-bold text-white mb-1">
                            {cookbook.name}
                          </h3>
                          <p className="text-white/90 text-sm">
                            {cookbook.recipes.length} receitas
                          </p>
                        </div>
                      </div>

                      <div className="p-4">
                        <p className="text-gray-600 text-sm mb-3">
                          {cookbook.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                            {cookbook.category}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            cookbook.isPublic
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {cookbook.isPublic ? 'Público' : 'Privado'}
                          </span>
                        </div>

                        {/* Preview de receitas */}
                        {cookbookRecipes.length > 0 && (
                          <div className="mt-4 flex -space-x-2">
                            {cookbookRecipes.slice(0, 3).map((recipe) => (
                              <img
                                key={recipe.id}
                                src={recipe.image}
                                alt={recipe.title}
                                className="w-10 h-10 rounded-full border-2 border-white object-cover"
                              />
                            ))}
                            {cookbookRecipes.length > 3 && (
                              <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
                                +{cookbookRecipes.length - 3}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-16 bg-gray-50 rounded-3xl">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Nenhum livro criado ainda
                </h3>
                <p className="text-gray-600 mb-6">
                  Crie livros para organizar suas receitas por tema
                </p>
                <button className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
                  Criar Primeiro Livro
                </button>
              </div>
            )}
          </div>
        )}
      </div>

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
