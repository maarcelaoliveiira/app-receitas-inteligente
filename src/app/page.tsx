'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import HomePage from '@/components/custom/pages/home-page';
import CookbooksPage from '@/components/custom/pages/cookbooks-page';
import MealPlanPage from '@/components/custom/pages/meal-plan-page';
import GroceriesPage from '@/components/custom/pages/groceries-page';
import ProfilePage from '@/components/custom/pages/profile-page';
import BottomNav from '@/components/custom/bottom-nav';
import { Loader2 } from 'lucide-react';

export default function App() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState('home');
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar sessão do usuário
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        router.push('/login');
      } else {
        setUser(session.user);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage user={user} />;
      case 'cookbooks':
        return <CookbooksPage user={user} />;
      case 'meal-plan':
        return <MealPlanPage user={user} />;
      case 'groceries':
        return <GroceriesPage user={user} />;
      case 'profile':
        return <ProfilePage onNavigate={setCurrentPage} user={user} />;
      default:
        return <HomePage user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {renderPage()}
      <BottomNav currentPage={currentPage} onNavigate={setCurrentPage} />
    </div>
  );
}
