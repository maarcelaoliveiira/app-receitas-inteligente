'use client';

import { useState, useEffect } from 'react';
import { User, Heart, ChefHat, Settings, Trophy, Share2, Crown, BookOpen } from 'lucide-react';
import { getUserProfile, getRecipes } from '@/lib/storage';
import { UserProfile, Recipe } from '@/lib/types';

interface ProfilePageProps {
  onNavigate?: (page: string) => void;
}

export default function ProfilePage({ onNavigate }: ProfilePageProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    const userProfile = getUserProfile();
    setProfile(userProfile);
    setRecipes(getRecipes());
  }, []);

  if (!profile) {
    return (
      <div className="pb-24 px-4 pt-6 max-w-7xl mx-auto">
        <div className="text-center py-16">
          <p className="text-gray-500">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const favoriteRecipes = recipes.filter(r => r.isFavorite);
  const myRecipes = recipes.filter(r => r.authorId === profile.id);

  const achievements = [
    { icon: '🎉', title: 'Primeira Receita', unlocked: profile.stats.recipesCreated > 0 },
    { icon: '❤️', title: '10 Curtidas', unlocked: profile.stats.totalLikes >= 10 },
    { icon: '👨‍🍳', title: '5 Receitas', unlocked: profile.stats.recipesCreated >= 5 },
    { icon: '⭐', title: '50 Curtidas', unlocked: profile.stats.totalLikes >= 50 },
    { icon: '🔥', title: '10 Receitas', unlocked: profile.stats.recipesCreated >= 10 },
    { icon: '💎', title: '100 Curtidas', unlocked: profile.stats.totalLikes >= 100 },
  ];

  return (
    <div className="pb-24 px-4 pt-6 max-w-7xl mx-auto">
      {/* Header do Perfil */}
      <div className="bg-gradient-to-br from-orange-500 to-pink-500 rounded-3xl p-8 mb-8 text-white shadow-2xl">
        <div className="flex items-center gap-6 mb-6">
          <div className="relative">
            <img
              src={profile.avatar}
              alt={profile.name}
              className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
            />
            {profile.isPremium && (
              <div className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-2">
                <Crown className="w-5 h-5 text-yellow-900" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{profile.name}</h1>
            <p className="text-white/90 mb-3">{profile.bio}</p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>{profile.stats.followersCount} seguidores</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span>{profile.stats.totalLikes} curtidas</span>
              </div>
            </div>
          </div>

          <button className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all">
            <Settings className="w-6 h-6" />
          </button>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">{profile.stats.recipesCreated}</p>
            <p className="text-white/80 text-sm">Receitas Criadas</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">{profile.stats.recipesShared}</p>
            <p className="text-white/80 text-sm">Compartilhadas</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">{profile.stats.totalComments}</p>
            <p className="text-white/80 text-sm">Comentários</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 text-center">
            <p className="text-3xl font-bold mb-1">{profile.stats.followingCount}</p>
            <p className="text-white/80 text-sm">Seguindo</p>
          </div>
        </div>
      </div>

      {/* Atalhos para Livros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Receitas Favoritas */}
        <button
          onClick={() => onNavigate?.('cookbooks')}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-xl group-hover:scale-110 transition-transform">
                <Heart className="w-6 h-6 text-red-500 fill-current" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Receitas Favoritas</h3>
                <p className="text-gray-600 text-sm">Suas receitas salvas</p>
              </div>
            </div>
            <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900">{favoriteRecipes.length}</span>
            <span className="text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">
              Ver todas →
            </span>
          </div>
        </button>

        {/* Minhas Receitas */}
        <button
          onClick={() => onNavigate?.('cookbooks')}
          className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-orange-100 rounded-xl group-hover:scale-110 transition-transform">
                <ChefHat className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Minhas Receitas</h3>
                <p className="text-gray-600 text-sm">Criadas por você</p>
              </div>
            </div>
            <BookOpen className="w-6 h-6 text-gray-400 group-hover:text-orange-500 transition-colors" />
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-gray-900">{myRecipes.length}</span>
            <span className="text-orange-600 font-semibold group-hover:translate-x-1 transition-transform">
              Ver todas →
            </span>
          </div>
        </button>
      </div>

      {/* Conquistas */}
      <div className="bg-white rounded-2xl p-6 shadow-lg mb-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-7 h-7 text-yellow-500" />
          <h2 className="text-2xl font-bold text-gray-900">Conquistas</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {achievements.map((achievement, index) => (
            <div
              key={index}
              className={`p-4 rounded-xl text-center transition-all ${
                achievement.unlocked
                  ? 'bg-gradient-to-br from-yellow-100 to-orange-100 border-2 border-yellow-400'
                  : 'bg-gray-100 opacity-50'
              }`}
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <p className={`text-xs font-semibold ${
                achievement.unlocked ? 'text-gray-900' : 'text-gray-500'
              }`}>
                {achievement.title}
              </p>
            </div>
          ))}
        </div>

        <button className="mt-6 w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all">
          <Share2 className="w-5 h-5" />
          <span>Compartilhar Conquistas</span>
        </button>
      </div>

      {/* Ações Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button className="p-6 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all text-left group">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-xl group-hover:scale-110 transition-transform">
              <Settings className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 mb-1">Configurações</h3>
              <p className="text-sm text-gray-600">Personalize seu perfil</p>
            </div>
          </div>
        </button>

        <button className="p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg hover:shadow-xl transition-all text-left group text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl group-hover:scale-110 transition-transform">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold mb-1">Seja Premium</h3>
              <p className="text-sm text-white/90">Desbloqueie recursos exclusivos</p>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}
