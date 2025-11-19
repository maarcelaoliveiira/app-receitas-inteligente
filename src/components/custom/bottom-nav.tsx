'use client';

import { Home, BookOpen, Calendar, ShoppingCart, User } from 'lucide-react';
import { useState } from 'react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export default function BottomNav({ currentPage, onNavigate }: BottomNavProps) {
  const navItems = [
    { icon: Home, label: 'Início', page: 'home' },
    { icon: BookOpen, label: 'Livros', page: 'cookbooks' },
    { icon: Calendar, label: 'Planejar', page: 'meal-plan' },
    { icon: ShoppingCart, label: 'Compras', page: 'groceries' },
    { icon: User, label: 'Perfil', page: 'profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 shadow-lg">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.page;

            return (
              <button
                key={item.page}
                onClick={() => onNavigate(item.page)}
                className={`flex flex-col items-center justify-center gap-1 px-3 py-2 rounded-xl transition-all ${
                  isActive
                    ? 'text-[#FF6B35]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <div
                  className={`p-2 rounded-xl transition-colors ${
                    isActive ? 'bg-[#FF6B35]/10' : ''
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
