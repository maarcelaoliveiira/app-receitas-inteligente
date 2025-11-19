// 🍳 SaborBR - Sistema de Armazenamento Local

import { Recipe, Cookbook, MealPlan, GroceryList, UserProfile } from './types';

const STORAGE_KEYS = {
  RECIPES: 'saborbr_recipes',
  COOKBOOKS: 'saborbr_cookbooks',
  MEAL_PLANS: 'saborbr_meal_plans',
  GROCERY_LISTS: 'saborbr_grocery_lists',
  USER_PROFILE: 'saborbr_user_profile',
  FAVORITES: 'saborbr_favorites',
} as const;

// ========== RECEITAS ==========
export const saveRecipe = (recipe: Recipe): void => {
  const recipes = getRecipes();
  const index = recipes.findIndex(r => r.id === recipe.id);
  
  if (index >= 0) {
    recipes[index] = recipe;
  } else {
    recipes.push(recipe);
  }
  
  localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
};

export const getRecipes = (): Recipe[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.RECIPES);
  return data ? JSON.parse(data) : [];
};

export const getRecipeById = (id: string): Recipe | null => {
  const recipes = getRecipes();
  return recipes.find(r => r.id === id) || null;
};

export const deleteRecipe = (id: string): void => {
  const recipes = getRecipes().filter(r => r.id !== id);
  localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
};

export const toggleFavorite = (recipeId: string): void => {
  const recipes = getRecipes();
  const recipe = recipes.find(r => r.id === recipeId);
  if (recipe) {
    recipe.isFavorite = !recipe.isFavorite;
    localStorage.setItem(STORAGE_KEYS.RECIPES, JSON.stringify(recipes));
  }
};

export const getFavoriteRecipes = (): Recipe[] => {
  return getRecipes().filter(r => r.isFavorite);
};

// ========== LIVROS DE RECEITAS ==========
export const saveCookbook = (cookbook: Cookbook): void => {
  const cookbooks = getCookbooks();
  const index = cookbooks.findIndex(c => c.id === cookbook.id);
  
  if (index >= 0) {
    cookbooks[index] = cookbook;
  } else {
    cookbooks.push(cookbook);
  }
  
  localStorage.setItem(STORAGE_KEYS.COOKBOOKS, JSON.stringify(cookbooks));
};

export const getCookbooks = (): Cookbook[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.COOKBOOKS);
  return data ? JSON.parse(data) : [];
};

export const deleteCookbook = (id: string): void => {
  const cookbooks = getCookbooks().filter(c => c.id !== id);
  localStorage.setItem(STORAGE_KEYS.COOKBOOKS, JSON.stringify(cookbooks));
};

// ========== PLANEJAMENTO DE REFEIÇÕES ==========
export const saveMealPlan = (mealPlan: MealPlan): void => {
  const plans = getMealPlans();
  const index = plans.findIndex(p => p.id === mealPlan.id);
  
  if (index >= 0) {
    plans[index] = mealPlan;
  } else {
    plans.push(mealPlan);
  }
  
  localStorage.setItem(STORAGE_KEYS.MEAL_PLANS, JSON.stringify(plans));
};

export const getMealPlans = (): MealPlan[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.MEAL_PLANS);
  return data ? JSON.parse(data) : [];
};

export const getCurrentMealPlan = (): MealPlan | null => {
  const plans = getMealPlans();
  const today = new Date();
  const currentWeek = plans.find(p => {
    const weekStart = new Date(p.weekStart);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return today >= weekStart && today < weekEnd;
  });
  return currentWeek || null;
};

// ========== LISTAS DE COMPRAS ==========
export const saveGroceryList = (list: GroceryList): void => {
  const lists = getGroceryLists();
  const index = lists.findIndex(l => l.id === list.id);
  
  if (index >= 0) {
    lists[index] = list;
  } else {
    lists.push(list);
  }
  
  localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(lists));
};

export const getGroceryLists = (): GroceryList[] => {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(STORAGE_KEYS.GROCERY_LISTS);
  return data ? JSON.parse(data) : [];
};

export const deleteGroceryList = (id: string): void => {
  const lists = getGroceryLists().filter(l => l.id !== id);
  localStorage.setItem(STORAGE_KEYS.GROCERY_LISTS, JSON.stringify(lists));
};

// ========== PERFIL DO USUÁRIO ==========
export const saveUserProfile = (profile: UserProfile): void => {
  localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
};

export const getUserProfile = (): UserProfile | null => {
  if (typeof window === 'undefined') return null;
  const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
  return data ? JSON.parse(data) : null;
};

// ========== INICIALIZAÇÃO COM DADOS DE EXEMPLO ==========
export const initializeSampleData = (): void => {
  if (typeof window === 'undefined') return;
  
  // Verifica se já tem dados
  if (getRecipes().length > 0) return;
  
  // Perfil de exemplo
  const sampleProfile: UserProfile = {
    id: 'user-1',
    name: 'Chef Brasileiro',
    email: 'chef@saborbr.com',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    bio: 'Apaixonado por culinária brasileira 🇧🇷',
    isPremium: false,
    stats: {
      recipesCreated: 5,
      recipesShared: 3,
      totalLikes: 127,
      totalComments: 45,
      followersCount: 234,
      followingCount: 189,
    },
    achievements: [
      {
        id: 'ach-1',
        title: 'Primeira Receita',
        description: 'Criou sua primeira receita',
        icon: '🎉',
        unlockedAt: new Date().toISOString(),
        category: 'recipes',
      },
    ],
  };
  
  saveUserProfile(sampleProfile);
  
  // Receitas de exemplo
  const sampleRecipes: Recipe[] = [
    {
      id: 'recipe-1',
      title: 'Brigadeiro Gourmet',
      description: 'O clássico doce brasileiro com um toque especial',
      image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=600&fit=crop',
      category: 'Doces',
      mealType: 'Sobremesa',
      servings: 20,
      prepTime: 10,
      cookTime: 15,
      difficulty: 'Fácil',
      ingredients: [
        { id: 'ing-1', name: 'Leite condensado', quantity: 1, unit: 'lata' },
        { id: 'ing-2', name: 'Chocolate em pó', quantity: 3, unit: 'colheres de sopa' },
        { id: 'ing-3', name: 'Manteiga', quantity: 1, unit: 'colher de sopa' },
        { id: 'ing-4', name: 'Chocolate granulado', quantity: 100, unit: 'g' },
      ],
      instructions: [
        'Em uma panela, misture o leite condensado, o chocolate em pó e a manteiga',
        'Cozinhe em fogo médio, mexendo sempre até desgrudar do fundo da panela',
        'Despeje em um prato untado e deixe esfriar',
        'Faça bolinhas e passe no chocolate granulado',
        'Coloque em forminhas e sirva',
      ],
      nutrition: {
        calories: 85,
        protein: 1.2,
        carbs: 14.5,
        fat: 2.8,
      },
      tags: ['doce', 'festa', 'brasileiro', 'fácil'],
      isFavorite: true,
      isPublic: true,
      authorId: 'user-1',
      authorName: 'Chef Brasileiro',
      createdAt: new Date().toISOString(),
      rating: 4.8,
      ratingsCount: 156,
      comments: [],
    },
    {
      id: 'recipe-2',
      title: 'Feijoada Completa',
      description: 'A tradicional feijoada brasileira com todos os acompanhamentos',
      image: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?w=800&h=600&fit=crop',
      category: 'Brasileira',
      mealType: 'Almoço',
      servings: 8,
      prepTime: 30,
      cookTime: 180,
      difficulty: 'Médio',
      ingredients: [
        { id: 'ing-5', name: 'Feijão preto', quantity: 500, unit: 'g' },
        { id: 'ing-6', name: 'Linguiça calabresa', quantity: 300, unit: 'g' },
        { id: 'ing-7', name: 'Bacon', quantity: 200, unit: 'g' },
        { id: 'ing-8', name: 'Costela de porco', quantity: 500, unit: 'g' },
        { id: 'ing-9', name: 'Cebola', quantity: 2, unit: 'unidades' },
        { id: 'ing-10', name: 'Alho', quantity: 6, unit: 'dentes' },
      ],
      instructions: [
        'Deixe o feijão de molho na véspera',
        'Cozinhe o feijão em panela de pressão por 40 minutos',
        'Em outra panela, refogue as carnes com alho e cebola',
        'Adicione as carnes ao feijão e cozinhe por mais 1 hora',
        'Ajuste o sal e sirva com arroz, couve e farofa',
      ],
      nutrition: {
        calories: 520,
        protein: 35,
        carbs: 45,
        fat: 22,
      },
      tags: ['brasileiro', 'almoço', 'tradicional', 'família'],
      isFavorite: true,
      isPublic: true,
      authorId: 'user-1',
      authorName: 'Chef Brasileiro',
      createdAt: new Date().toISOString(),
      rating: 4.9,
      ratingsCount: 203,
      comments: [],
    },
    {
      id: 'recipe-3',
      title: 'Pão de Queijo Mineiro',
      description: 'Pão de queijo crocante por fora e macio por dentro',
      image: 'https://images.unsplash.com/photo-1618897996318-5a901fa6ca71?w=800&h=600&fit=crop',
      category: 'Brasileira',
      mealType: 'Café da Manhã',
      servings: 30,
      prepTime: 20,
      cookTime: 25,
      difficulty: 'Fácil',
      ingredients: [
        { id: 'ing-11', name: 'Polvilho azedo', quantity: 500, unit: 'g' },
        { id: 'ing-12', name: 'Queijo minas', quantity: 200, unit: 'g' },
        { id: 'ing-13', name: 'Leite', quantity: 250, unit: 'ml' },
        { id: 'ing-14', name: 'Óleo', quantity: 100, unit: 'ml' },
        { id: 'ing-15', name: 'Ovos', quantity: 2, unit: 'unidades' },
        { id: 'ing-16', name: 'Sal', quantity: 1, unit: 'colher de chá' },
      ],
      instructions: [
        'Ferva o leite com o óleo e o sal',
        'Despeje sobre o polvilho e misture bem',
        'Deixe esfriar e adicione os ovos um a um',
        'Adicione o queijo ralado e misture',
        'Faça bolinhas e asse em forno pré-aquecido a 180°C por 25 minutos',
      ],
      nutrition: {
        calories: 95,
        protein: 3.2,
        carbs: 12,
        fat: 4.5,
      },
      tags: ['brasileiro', 'café da manhã', 'lanche', 'mineiro'],
      isFavorite: false,
      isPublic: true,
      authorId: 'user-1',
      authorName: 'Chef Brasileiro',
      createdAt: new Date().toISOString(),
      rating: 4.7,
      ratingsCount: 189,
      comments: [],
    },
  ];
  
  sampleRecipes.forEach(saveRecipe);
  
  // Cookbook de exemplo
  const sampleCookbook: Cookbook = {
    id: 'cookbook-1',
    name: 'Favoritos Brasileiros',
    description: 'Minhas receitas brasileiras favoritas',
    cover: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    recipes: ['recipe-1', 'recipe-2', 'recipe-3'],
    category: 'Brasileira',
    createdAt: new Date().toISOString(),
    isPublic: false,
  };
  
  saveCookbook(sampleCookbook);
};
