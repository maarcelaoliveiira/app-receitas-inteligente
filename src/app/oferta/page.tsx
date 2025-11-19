'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, ChefHat, Sparkles, Star } from 'lucide-react';

export default function OfertaPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('monthly');

  const plans = {
    monthly: {
      price: 'R$ 29,90',
      period: '/mês',
      savings: null,
    },
    yearly: {
      price: 'R$ 299,90',
      period: '/ano',
      savings: 'Economize R$ 58,90',
    },
  };

  const features = [
    'Acesso ilimitado a todas as receitas',
    'Novas receitas toda semana',
    'Planejamento de refeições personalizado',
    'Lista de compras automática',
    'Salve suas receitas favoritas',
    'Crie seus próprios livros de receitas',
    'Suporte prioritário',
    'Sem anúncios',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white p-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-4">
            <div className="bg-white/20 p-3 rounded-2xl">
              <ChefHat className="w-10 h-10" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Oferta Especial!</h1>
          <p className="text-orange-100 text-lg">
            Transforme sua cozinha com milhares de receitas incríveis
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        {/* Seletor de Planos */}
        <div className="flex gap-4 mb-8 justify-center">
          <Button
            variant={selectedPlan === 'monthly' ? 'default' : 'outline'}
            onClick={() => setSelectedPlan('monthly')}
            className="flex-1 max-w-xs"
          >
            Mensal
          </Button>
          <Button
            variant={selectedPlan === 'yearly' ? 'default' : 'outline'}
            onClick={() => setSelectedPlan('yearly')}
            className="flex-1 max-w-xs relative"
          >
            Anual
            <span className="absolute -top-2 -right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
              -16%
            </span>
          </Button>
        </div>

        {/* Card do Plano */}
        <Card className="mb-8 border-2 border-orange-200 shadow-lg">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-2">
              <Star className="w-8 h-8 text-orange-500 fill-orange-500" />
            </div>
            <CardTitle className="text-3xl">
              {plans[selectedPlan].price}
              <span className="text-lg text-gray-600 font-normal">
                {plans[selectedPlan].period}
              </span>
            </CardTitle>
            {plans[selectedPlan].savings && (
              <CardDescription className="text-green-600 font-medium">
                {plans[selectedPlan].savings}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            <Button
              size="lg"
              className="w-full mb-6 bg-gradient-to-r from-orange-500 to-orange-600 text-lg"
              onClick={() => {
                // Aqui você integraria com o sistema de pagamento
                alert('Em breve! Sistema de pagamento será integrado.');
              }}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Assinar Agora
            </Button>

            <div className="space-y-3">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <Check className="w-3 h-3 text-green-600" />
                  </div>
                  <span className="text-gray-700">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Depoimentos */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                "Melhor app de receitas que já usei! As receitas são incríveis e fáceis de seguir."
              </p>
              <p className="text-xs text-gray-500">- Maria Silva</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-1 mb-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-orange-500 fill-orange-500" />
                ))}
              </div>
              <p className="text-sm text-gray-600 mb-2">
                "Economizo muito tempo com o planejamento de refeições. Vale cada centavo!"
              </p>
              <p className="text-xs text-gray-500">- João Santos</p>
            </CardContent>
          </Card>
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Perguntas Frequentes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold mb-1">Posso cancelar a qualquer momento?</h4>
              <p className="text-sm text-gray-600">
                Sim! Você pode cancelar sua assinatura a qualquer momento, sem taxas ou multas.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Quais formas de pagamento são aceitas?</h4>
              <p className="text-sm text-gray-600">
                Aceitamos cartão de crédito, débito e PIX.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-1">Posso usar em vários dispositivos?</h4>
              <p className="text-sm text-gray-600">
                Sim! Sua conta funciona em todos os seus dispositivos.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <Button variant="ghost" onClick={() => router.push('/login')}>
            Já tem uma conta? Faça login
          </Button>
        </div>
      </div>
    </div>
  );
}
