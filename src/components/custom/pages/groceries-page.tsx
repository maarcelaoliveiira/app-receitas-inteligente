'use client';

import { useState, useEffect } from 'react';
import { ShoppingCart, Plus, Trash2, Check, Calendar, Filter } from 'lucide-react';
import { getGroceryLists, saveGroceryList, deleteGroceryList } from '@/lib/storage';
import { GroceryList, GroceryItem } from '@/lib/types';

export default function GroceriesPage() {
  const [lists, setLists] = useState<GroceryList[]>([]);
  const [selectedList, setSelectedList] = useState<GroceryList | null>(null);
  const [filterPeriod, setFilterPeriod] = useState<'all' | 'daily' | 'weekly' | 'monthly'>('all');

  useEffect(() => {
    loadLists();
  }, []);

  const loadLists = () => {
    setLists(getGroceryLists());
  };

  const filterLists = () => {
    const now = new Date();
    
    return lists.filter(list => {
      if (filterPeriod === 'all') return true;
      
      const listDate = new Date(list.createdAt);
      const diffTime = Math.abs(now.getTime() - listDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (filterPeriod === 'daily') return diffDays <= 1;
      if (filterPeriod === 'weekly') return diffDays <= 7;
      if (filterPeriod === 'monthly') return diffDays <= 30;
      
      return true;
    });
  };

  const toggleItem = (itemId: string) => {
    if (!selectedList) return;
    
    const updatedList = {
      ...selectedList,
      items: selectedList.items.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      ),
    };
    
    saveGroceryList(updatedList);
    setSelectedList(updatedList);
    loadLists();
  };

  const deleteList = (listId: string) => {
    if (confirm('Tem certeza que deseja excluir esta lista?')) {
      deleteGroceryList(listId);
      if (selectedList?.id === listId) {
        setSelectedList(null);
      }
      loadLists();
    }
  };

  const createNewList = () => {
    const newList: GroceryList = {
      id: `list-${Date.now()}`,
      name: `Lista ${new Date().toLocaleDateString('pt-BR')}`,
      items: [],
      createdAt: new Date().toISOString(),
      completed: false,
    };
    
    saveGroceryList(newList);
    setSelectedList(newList);
    loadLists();
  };

  const addItem = () => {
    if (!selectedList) return;
    
    const itemName = prompt('Nome do item:');
    if (!itemName) return;
    
    const quantity = parseFloat(prompt('Quantidade:', '1') || '1');
    const unit = prompt('Unidade (kg, g, un, etc):', 'un') || 'un';
    
    const newItem: GroceryItem = {
      id: `item-${Date.now()}`,
      name: itemName,
      quantity,
      unit,
      checked: false,
      category: 'Outros',
    };
    
    const updatedList = {
      ...selectedList,
      items: [...selectedList.items, newItem],
    };
    
    saveGroceryList(updatedList);
    setSelectedList(updatedList);
    loadLists();
  };

  const removeItem = (itemId: string) => {
    if (!selectedList) return;
    
    const updatedList = {
      ...selectedList,
      items: selectedList.items.filter(item => item.id !== itemId),
    };
    
    saveGroceryList(updatedList);
    setSelectedList(updatedList);
    loadLists();
  };

  const filteredLists = filterLists();
  const completedItems = selectedList?.items.filter(i => i.checked).length || 0;
  const totalItems = selectedList?.items.length || 0;
  const progress = totalItems > 0 ? (completedItems / totalItems) * 100 : 0;

  return (
    <div className="pb-24 px-4 pt-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Lista de Compras 🛒
        </h1>
        <p className="text-gray-600">
          Gerencie suas compras do planejamento semanal
        </p>
      </div>

      {/* Filtros de Período */}
      <div className="mb-6 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <div className="flex items-center gap-2 text-gray-600">
          <Filter className="w-5 h-5" />
          <span className="font-semibold whitespace-nowrap">Filtrar por:</span>
        </div>
        
        {[
          { key: 'all', label: 'Todas', icon: '📋' },
          { key: 'daily', label: 'Hoje', icon: '📅' },
          { key: 'weekly', label: 'Semana', icon: '📆' },
          { key: 'monthly', label: 'Mês', icon: '🗓️' },
        ].map((filter) => (
          <button
            key={filter.key}
            onClick={() => setFilterPeriod(filter.key as typeof filterPeriod)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
              filterPeriod === filter.key
                ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <span>{filter.icon}</span>
            <span>{filter.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Listas */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">Minhas Listas</h2>
              <button
                onClick={createNewList}
                className="p-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {filteredLists.length > 0 ? (
              <div className="space-y-3">
                {filteredLists.map((list) => {
                  const listCompleted = list.items.filter(i => i.checked).length;
                  const listTotal = list.items.length;
                  const listProgress = listTotal > 0 ? (listCompleted / listTotal) * 100 : 0;
                  
                  return (
                    <div
                      key={list.id}
                      onClick={() => setSelectedList(list)}
                      className={`p-4 rounded-xl cursor-pointer transition-all ${
                        selectedList?.id === list.id
                          ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className={`font-semibold ${
                          selectedList?.id === list.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {list.name}
                        </h3>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteList(list.id);
                          }}
                          className={`p-1 rounded-lg transition-colors ${
                            selectedList?.id === list.id
                              ? 'hover:bg-white/20'
                              : 'hover:bg-gray-200'
                          }`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm mb-2">
                        <Calendar className="w-4 h-4" />
                        <span className={selectedList?.id === list.id ? 'text-white/90' : 'text-gray-600'}>
                          {new Date(list.createdAt).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className={selectedList?.id === list.id ? 'text-white/90' : 'text-gray-600'}>
                          {listCompleted}/{listTotal} itens
                        </span>
                        <span className={`font-semibold ${
                          selectedList?.id === list.id ? 'text-white' : 'text-gray-900'
                        }`}>
                          {Math.round(listProgress)}%
                        </span>
                      </div>
                      
                      <div className={`mt-2 h-2 rounded-full overflow-hidden ${
                        selectedList?.id === list.id ? 'bg-white/20' : 'bg-gray-200'
                      }`}>
                        <div
                          className={`h-full transition-all ${
                            selectedList?.id === list.id ? 'bg-white' : 'bg-green-500'
                          }`}
                          style={{ width: `${listProgress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <ShoppingCart className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 text-sm">
                  {filterPeriod === 'all' 
                    ? 'Nenhuma lista criada'
                    : 'Nenhuma lista neste período'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Itens da Lista Selecionada */}
        <div className="lg:col-span-2">
          {selectedList ? (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {selectedList.name}
                  </h2>
                  <p className="text-gray-600 text-sm">
                    {completedItems} de {totalItems} itens marcados
                  </p>
                </div>
                <button
                  onClick={addItem}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  <Plus className="w-5 h-5" />
                  <span>Adicionar</span>
                </button>
              </div>

              {/* Barra de Progresso */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Progresso</span>
                  <span className="text-sm font-bold text-gray-900">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-600 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Lista de Itens */}
              {selectedList.items.length > 0 ? (
                <div className="space-y-2">
                  {selectedList.items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                        item.checked
                          ? 'bg-green-50 border-2 border-green-200'
                          : 'bg-gray-50 hover:bg-gray-100'
                      }`}
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className={`flex-shrink-0 w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${
                          item.checked
                            ? 'bg-green-500 border-green-500'
                            : 'border-gray-300 hover:border-green-500'
                        }`}
                      >
                        {item.checked && <Check className="w-4 h-4 text-white" />}
                      </button>

                      <div className="flex-1">
                        <p className={`font-semibold ${
                          item.checked ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}>
                          {item.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.quantity} {item.unit}
                        </p>
                      </div>

                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 mb-2">Lista vazia</p>
                  <p className="text-sm text-gray-400 mb-6">
                    Adicione itens ou gere uma lista do planejamento
                  </p>
                  <button
                    onClick={addItem}
                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                  >
                    Adicionar Primeiro Item
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <ShoppingCart className="w-20 h-20 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Selecione uma lista
              </h3>
              <p className="text-gray-600 mb-6">
                Escolha uma lista ao lado ou crie uma nova
              </p>
              <button
                onClick={createNewList}
                className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                Criar Nova Lista
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
