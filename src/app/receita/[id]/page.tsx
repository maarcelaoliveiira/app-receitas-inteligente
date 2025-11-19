'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChefHat, Clock, Users, Loader2, Sparkles } from 'lucide-react';

export default function ReceitaCompartilhadaPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const { data, error } = await supabase
          .from('recipes')
          .select('*')
          .eq('id', params.id)
          .single();

        if (error) throw error;
        setRecipe(data);
      } catch (error) {
        console.error('Erro ao carregar receita:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Receita não encontrada</CardTitle>
            <CardDescription>Esta receita não existe ou foi removida.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => router.push('/oferta')} className="w-full">
              Ver Ofertas
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Banner de Oferta */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-5 h-5" />
          <p className="font-semibold">Gostou desta receita?</p>
        </div>
        <p className="text-sm mb-3">Tenha acesso a milhares de receitas exclusivas!</p>
        <Button
          onClick={() => router.push('/oferta')}
          variant="secondary"
          className="bg-white text-orange-600 hover:bg-orange-50"
        >
          Ver Oferta Especial
        </Button>
      </div>

      {/* Conteúdo da Receita */}
      <div className="max-w-4xl mx-auto p-4 pb-20">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl">{recipe.title}</CardTitle>
            <CardDescription>{recipe.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {recipe.image_url && (
              <img
                src={recipe.image_url}
                alt={recipe.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}

            <div className="flex gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{recipe.prep_time + recipe.cook_time} min</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{recipe.servings} porções</span>
              </div>
              <div className="flex items-center gap-1">
                <ChefHat className="w-4 h-4" />
                <span className="capitalize">{recipe.difficulty}</span>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Ingredientes</h3>
              <ul className="space-y-2">
                {recipe.ingredients.map((ingredient: string, index: number) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-600 mt-1">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-3">Modo de Preparo</h3>
              <ol className="space-y-3">
                {recipe.instructions.map((instruction: string, index: number) => (
                  <li key={index} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-medium">
                      {index + 1}
                    </span>
                    <span className="flex-1">{instruction}</span>
                  </li>
                ))}
              </ol>
            </div>
          </CardContent>
        </Card>

        {/* CTA Final */}
        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Quer mais receitas como esta?</h3>
            <p className="text-gray-600 mb-4">
              Tenha acesso ilimitado a milhares de receitas exclusivas
            </p>
            <Button
              onClick={() => router.push('/oferta')}
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-orange-600"
            >
              Conhecer Planos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
