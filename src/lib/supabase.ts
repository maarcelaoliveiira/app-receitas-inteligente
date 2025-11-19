import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Recipe = {
  id: string;
  title: string;
  description: string;
  ingredients: string[];
  instructions: string[];
  prep_time: number;
  cook_time: number;
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  image_url?: string;
  user_id?: string;
  is_external: boolean;
  external_source?: string;
  created_at: string;
};

export type Cookbook = {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  created_at: string;
};

export type CookbookRecipe = {
  id: string;
  cookbook_id: string;
  recipe_id: string;
  created_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
};

export type GroceryItem = {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  checked: boolean;
  created_at: string;
};

export type MealPlan = {
  id: string;
  user_id: string;
  recipe_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  created_at: string;
};

export type UserProfile = {
  id: string;
  email: string;
  full_name?: string;
  avatar_url?: string;
  created_at: string;
};

export type Suggestion = {
  id: string;
  user_id: string;
  type: 'suggestion' | 'feedback' | 'bug';
  message: string;
  created_at: string;
};
