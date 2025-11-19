// 🍳 SaborBR - Utilitários

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Recipe, Ingredient } from './types';

// ========== TAILWIND UTILITIES ==========
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ========== FORMATAÇÃO ==========
export const formatTime = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoje';
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `${diffDays} dias atrás`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} semanas atrás`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} meses atrás`;
  return `${Math.floor(diffDays / 365)} anos atrás`;
};

// ========== CÁLCULOS NUTRICIONAIS ==========
export const calculateNutritionForServings = (
  recipe: Recipe,
  servings: number
): Recipe['nutrition'] => {
  const ratio = servings / recipe.servings;
  return {
    calories: Math.round(recipe.nutrition.calories * ratio),
    protein: Math.round(recipe.nutrition.protein * ratio * 10) / 10,
    carbs: Math.round(recipe.nutrition.carbs * ratio * 10) / 10,
    fat: Math.round(recipe.nutrition.fat * ratio * 10) / 10,
    fiber: recipe.nutrition.fiber
      ? Math.round(recipe.nutrition.fiber * ratio * 10) / 10
      : undefined,
    sugar: recipe.nutrition.sugar
      ? Math.round(recipe.nutrition.sugar * ratio * 10) / 10
      : undefined,
  };
};

export const adjustIngredientsForServings = (
  ingredients: Ingredient[],
  originalServings: number,
  newServings: number
): Ingredient[] => {
  const ratio = newServings / originalServings;
  return ingredients.map((ing) => ({
    ...ing,
    quantity: Math.round(ing.quantity * ratio * 100) / 100,
  }));
};

// ========== BUSCA E FILTROS ==========
export const searchRecipes = (
  recipes: Recipe[],
  query: string
): Recipe[] => {
  const lowerQuery = query.toLowerCase();
  return recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(lowerQuery)) ||
      recipe.ingredients.some((ing) =>
        ing.name.toLowerCase().includes(lowerQuery)
      )
  );
};

export const filterRecipesByIngredient = (
  recipes: Recipe[],
  ingredient: string
): Recipe[] => {
  const lowerIngredient = ingredient.toLowerCase();
  return recipes.filter((recipe) =>
    recipe.ingredients.some((ing) =>
      ing.name.toLowerCase().includes(lowerIngredient)
    )
  );
};

// ========== GERAÇÃO DE IDs ==========
export const generateId = (prefix: string): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// ========== COMPARTILHAMENTO ==========
export const generateShareText = (recipe: Recipe): string => {
  return `🍳 ${recipe.title}\n\n${recipe.description}\n\n⏱️ ${formatTime(
    recipe.prepTime + recipe.cookTime
  )} | 👥 ${recipe.servings} porções | ⭐ ${recipe.rating.toFixed(1)}\n\nFeito com SaborBR 🇧🇷`;
};

export const shareRecipe = async (recipe: Recipe): Promise<void> => {
  const text = generateShareText(recipe);
  const url = `${window.location.origin}/recipe/${recipe.id}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: recipe.title,
        text: text,
        url: url,
      });
    } catch (error) {
      console.error('Erro ao compartilhar:', error);
    }
  } else {
    // Fallback: copiar para clipboard
    await navigator.clipboard.writeText(`${text}\n\n${url}`);
    alert('Link copiado para a área de transferência!');
  }
};

// ========== VALIDAÇÃO ==========
export const validateRecipe = (recipe: Partial<Recipe>): string[] => {
  const errors: string[] = [];

  if (!recipe.title || recipe.title.trim().length === 0) {
    errors.push('Título é obrigatório');
  }

  if (!recipe.description || recipe.description.trim().length === 0) {
    errors.push('Descrição é obrigatória');
  }

  if (!recipe.ingredients || recipe.ingredients.length === 0) {
    errors.push('Adicione pelo menos um ingrediente');
  }

  if (!recipe.instructions || recipe.instructions.length === 0) {
    errors.push('Adicione pelo menos uma instrução');
  }

  if (!recipe.servings || recipe.servings <= 0) {
    errors.push('Número de porções deve ser maior que zero');
  }

  if (!recipe.prepTime || recipe.prepTime < 0) {
    errors.push('Tempo de preparo inválido');
  }

  if (!recipe.cookTime || recipe.cookTime < 0) {
    errors.push('Tempo de cozimento inválido');
  }

  return errors;
};

// ========== IMAGENS ==========
export const getPlaceholderImage = (category: string): string => {
  const placeholders: Record<string, string> = {
    Doces: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=800&h=600&fit=crop',
    Brasileira: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&h=600&fit=crop',
    Italiana: 'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?w=800&h=600&fit=crop',
    Japonesa: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=800&h=600&fit=crop',
    Mexicana: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop',
    Vegetariana: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
    Vegana: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
    'Low Carb': 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&h=600&fit=crop',
    Fitness: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop',
    Salgados: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop',
    Bebidas: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=800&h=600&fit=crop',
    default: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=800&h=600&fit=crop',
  };

  return placeholders[category] || placeholders.default;
};

// ========== DIAS DA SEMANA ==========
export const getDaysOfWeek = (startDate: Date): Date[] => {
  const days: Date[] = [];
  const start = new Date(startDate);
  start.setHours(0, 0, 0, 0);

  for (let i = 0; i < 7; i++) {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    days.push(day);
  }

  return days;
};

export const getDayName = (date: Date): string => {
  const days = [
    'Domingo',
    'Segunda',
    'Terça',
    'Quarta',
    'Quinta',
    'Sexta',
    'Sábado',
  ];
  return days[date.getDay()];
};

export const getShortDayName = (date: Date): string => {
  const days = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  return days[date.getDay()];
};
