'use client';

import { useState, useEffect } from 'react';
import { Calendar, Plus, ChevronLeft, ChevronRight, ShoppingCart } from 'lucide-react';
import { getMealPlans, getRecipes, saveMealPlan, saveGroceryList } from '@/lib/storage';
import { MealPlan, Recipe, GroceryList, GroceryItem } from '@/lib/types';

export default function MealPlanPage() {
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [currentPlan, setCurrentPlan] = useState<MealPlan | null>(null);

  useEffect(() => {
    loadData();
  }, [currentWeek]);

  const loadData = () => {
    const plans = getMealPlans();
    setMealPlans(plans);
    setRecipes(getRecipes());
    
    // Encontrar plano da semana atual
    const weekStart = getWeekStart(currentWeek);
    const plan = plans.find(p => p.weekStart === weekStart.toISOString());
    setCurrentPlan(plan || null);
  };

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
  const mealTypes = [
    { key: 'breakfast', label: 'Café da Manhã', icon: '☕' },
    { key: 'lunch', label: 'Almoço', icon: '🍽️' },
    { key: 'dinner', label: 'Jantar', icon: '🌙' },
  ];

  const getWeekStart = (date: Date) => {
    const start = new Date(date);
    start.setDate(date.getDate() - date.getDay());
    start.setHours(0, 0, 0, 0);
    return start;
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = getWeekStart(currentWeek);

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates();

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentWeek);
    newDate.setDate(currentWeek.getDate() + (direction === 'next' ? 7 : -7));
    setCurrentWeek(newDate);
  };

  const generateGroceryList = () => {
    if (!currentPlan) {
      alert('⚠️ Adicione receitas ao planejamento primeiro!');
      return;
    }

    const ingredients: GroceryItem[] = [];
    const recipeIds = new Set<string>();

    // Coletar todos os IDs de receitas do plano
    Object.values(currentPlan.meals).forEach(dayMeals => {
      if (dayMeals.breakfast) recipeIds.add(dayMeals.breakfast);
      if (dayMeals.lunch) recipeIds.add(dayMeals.lunch);
      if (dayMeals.dinner) recipeIds.add(dayMeals.dinner);
      dayMeals.snacks?.forEach(snack => recipeIds.add(snack));
    });

    // Buscar receitas e agregar ingredientes
    const ingredientMap = new Map<string, GroceryItem>();
    
    recipeIds.forEach(recipeId => {
      const recipe = recipes.find(r => r.id === recipeId);
      if (recipe) {
        recipe.ingredients.forEach(ing => {
          const key = `${ing.name}-${ing.unit}`;
          const existing = ingredientMap.get(key);
          
          if (existing) {
            existing.quantity += ing.quantity;
          } else {
            ingredientMap.set(key, {
              id: `grocery-${Date.now()}-${Math.random()}`,
              name: ing.name,
              quantity: ing.quantity,
              unit: ing.unit,
              checked: false,
              category: ing.category || 'Outros',
            });
          }
        });
      }
    });

    const groceryList: GroceryList = {
      id: `list-${Date.now()}`,
      name: `Lista da Semana - ${weekDates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}`,
      items: Array.from(ingredientMap.values()),
      createdAt: new Date().toISOString(),
      completed: false,
    };

    saveGroceryList(groceryList);
    alert(`✅ Lista de compras criada com ${groceryList.items.length} itens!`);
  };

  const addRecipeToDay = (dayIndex: number, mealType: string) => {
    // Simulação - em produção, abriria modal para selecionar receita
    const availableRecipes = recipes.filter(r => {
      if (mealType === 'breakfast') return r.mealType === 'Café da Manhã';
      if (mealType === 'lunch') return r.mealType === 'Almoço';
      if (mealType === 'dinner') return r.mealType === 'Jantar';
      return true;
    });

    if (availableRecipes.length === 0) {
      alert('⚠️ Nenhuma receita disponível para este tipo de refeição');
      return;
    }

    const randomRecipe = availableRecipes[Math.floor(Math.random() * availableRecipes.length)];
    const weekStart = getWeekStart(currentWeek);
    const dayKey = weekDates[dayIndex].toISOString().split('T')[0];

    let plan = currentPlan;
    if (!plan) {
      plan = {
        id: `plan-${Date.now()}`,
        weekStart: weekStart.toISOString(),
        meals: {},
      };
    }

    if (!plan.meals[dayKey]) {
      plan.meals[dayKey] = {};
    }

    plan.meals[dayKey][mealType as keyof typeof plan.meals[typeof dayKey]] = randomRecipe.id;

    saveMealPlan(plan);
    loadData();
  };

  const getRecipeForSlot = (dayIndex: number, mealType: string): Recipe | null => {
    if (!currentPlan) return null;
    
    const dayKey = weekDates[dayIndex].toISOString().split('T')[0];
    const dayMeals = currentPlan.meals[dayKey];
    
    if (!dayMeals) return null;
    
    const recipeId = dayMeals[mealType as keyof typeof dayMeals];
    if (!recipeId || typeof recipeId !== 'string') return null;
    
    return recipes.find(r => r.id === recipeId) || null;
  };

  return (
    <div className="pb-24 px-4 pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Planejamento Semanal 📅
        </h1>
        <p className="text-gray-600">
          Organize suas refeições e gere lista de compras automaticamente
        </p>
      </div>

      {/* Week Navigator */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigateWeek('prev')}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
          
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {weekDates[0].toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
            </h2>
            <p className="text-sm text-gray-500">
              {weekDates[0].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })} -{' '}
              {weekDates[6].toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
            </p>
          </div>
          
          <button
            onClick={() => navigateWeek('next')}
            className="p-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <ChevronRight className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2">
          {weekDates.map((date, index) => {
            const isToday = date.toDateString() === new Date().toDateString();
            return (
              <div
                key={index}
                className={`text-center p-3 rounded-xl transition-all ${
                  isToday
                    ? 'bg-gradient-to-br from-orange-500 to-pink-500 text-white shadow-lg scale-105'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="text-xs font-medium mb-1">{weekDays[index]}</div>
                <div className="text-lg font-bold">{date.getDate()}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Botão Gerar Lista de Compras */}
      <button
        onClick={generateGroceryList}
        className="w-full mb-6 flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-2xl transition-all hover:scale-105"
      >
        <ShoppingCart className="w-6 h-6" />
        <span>Gerar Lista de Compras da Semana</span>
      </button>

      {/* Meal Plan Grid */}
      <div className="space-y-6">
        {mealTypes.map((mealType) => (
          <div key={mealType.key} className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl">{mealType.icon}</span>
              <h3 className="text-xl font-bold text-gray-900">{mealType.label}</h3>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
              {weekDays.map((day, index) => {
                const recipe = getRecipeForSlot(index, mealType.key);
                
                return (
                  <div key={index}>
                    {recipe ? (
                      <div className="relative group">
                        <img
                          src={recipe.image}
                          alt={recipe.title}
                          className="w-full h-32 object-cover rounded-xl"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent rounded-xl flex items-end p-3">
                          <p className="text-white text-sm font-semibold line-clamp-2">
                            {recipe.title}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => addRecipeToDay(index, mealType.key)}
                        className="w-full h-32 border-2 border-dashed border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all flex items-center justify-center group"
                      >
                        <Plus className="w-8 h-8 text-gray-300 group-hover:text-orange-500 transition-colors" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!currentPlan && (
        <div className="text-center py-12 bg-gray-50 rounded-3xl mt-6">
          <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Nenhum planejamento para esta semana
          </h3>
          <p className="text-gray-600 mb-6">
            Comece adicionando receitas aos dias da semana
          </p>
        </div>
      )}
    </div>
  );
}
