// 🍳 SaborBR - Tipos TypeScript

export interface Recipe {
  id: string;
  title: string;
  description: string;
  image: string;
  category: RecipeCategory;
  mealType: MealType;
  servings: number;
  prepTime: number; // minutos
  cookTime: number; // minutos
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  tags: string[];
  isFavorite: boolean;
  isPublic: boolean;
  authorId: string;
  authorName: string;
  createdAt: string;
  rating: number;
  ratingsCount: number;
  comments: Comment[];
}

export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category?: string;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // gramas
  carbs: number; // gramas
  fat: number; // gramas
  fiber?: number;
  sugar?: number;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  text: string;
  rating: number;
  createdAt: string;
  likes: number;
}

export interface Cookbook {
  id: string;
  name: string;
  description: string;
  cover: string;
  recipes: string[]; // IDs das receitas
  category: RecipeCategory;
  createdAt: string;
  isPublic: boolean;
}

export interface MealPlan {
  id: string;
  weekStart: string; // ISO date
  meals: {
    [day: string]: {
      breakfast?: string; // recipe ID
      lunch?: string;
      dinner?: string;
      snacks?: string[];
    };
  };
}

export interface GroceryList {
  id: string;
  name: string;
  items: GroceryItem[];
  createdAt: string;
  completed: boolean;
}

export interface GroceryItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  category: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio: string;
  isPremium: boolean;
  stats: UserStats;
  achievements: Achievement[];
}

export interface UserStats {
  recipesCreated: number;
  recipesShared: number;
  totalLikes: number;
  totalComments: number;
  followersCount: number;
  followingCount: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string;
  category: 'recipes' | 'social' | 'cooking' | 'special';
}

export type RecipeCategory = 
  | 'Brasileira'
  | 'Italiana'
  | 'Japonesa'
  | 'Mexicana'
  | 'Árabe'
  | 'Vegetariana'
  | 'Vegana'
  | 'Low Carb'
  | 'Fitness'
  | 'Doces'
  | 'Salgados'
  | 'Bebidas'
  | 'Lanches'
  | 'Massas'
  | 'Carnes'
  | 'Peixes'
  | 'Sopas'
  | 'Saladas'
  | 'Outras';

export type MealType = 
  | 'Café da Manhã'
  | 'Almoço'
  | 'Jantar'
  | 'Lanche'
  | 'Sobremesa'
  | 'Bebida';

export type TimeFilter = 'all' | '7days' | '30days' | '90days';

export type SortOption = 'recent' | 'popular' | 'rating' | 'alphabetical';
