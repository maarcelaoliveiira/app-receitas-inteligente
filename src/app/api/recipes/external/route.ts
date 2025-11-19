import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q') || '';

  try {
    // Simulação de busca de receitas externas
    // Em produção, você pode integrar com APIs como Spoonacular, Edamam, etc.
    const externalRecipes = [
      {
        id: 'ext-1',
        title: 'Lasanha à Bolonhesa',
        description: 'Lasanha tradicional italiana com molho bolonhesa caseiro',
        ingredients: [
          '500g de massa para lasanha',
          '500g de carne moída',
          '2 latas de molho de tomate',
          '1 cebola picada',
          '3 dentes de alho',
          '500g de queijo mussarela',
          '200g de queijo parmesão',
          'Manjericão fresco',
          'Azeite, sal e pimenta'
        ],
        instructions: [
          'Refogue a cebola e o alho no azeite',
          'Adicione a carne moída e doure bem',
          'Acrescente o molho de tomate e temperos',
          'Cozinhe por 20 minutos',
          'Monte camadas: molho, massa, queijo',
          'Repita as camadas',
          'Finalize com queijo',
          'Asse a 180°C por 40 minutos'
        ],
        prep_time: 30,
        cook_time: 40,
        servings: 8,
        difficulty: 'medium',
        category: 'Pratos Principais',
        is_external: true,
        external_source: 'Culinária Italiana Tradicional'
      },
      {
        id: 'ext-2',
        title: 'Brigadeiro Gourmet',
        description: 'Brigadeiro cremoso e sofisticado',
        ingredients: [
          '1 lata de leite condensado',
          '3 colheres de chocolate em pó',
          '1 colher de manteiga',
          'Chocolate granulado para decorar'
        ],
        instructions: [
          'Misture todos os ingredientes em uma panela',
          'Cozinhe em fogo baixo mexendo sempre',
          'Cozinhe até desgrudar do fundo',
          'Deixe esfriar',
          'Faça bolinhas com as mãos',
          'Passe no chocolate granulado'
        ],
        prep_time: 10,
        cook_time: 15,
        servings: 20,
        difficulty: 'easy',
        category: 'Sobremesas',
        is_external: true,
        external_source: 'Receitas Brasileiras'
      },
      {
        id: 'ext-3',
        title: 'Salmão Grelhado com Molho de Maracujá',
        description: 'Peixe suculento com molho tropical',
        ingredients: [
          '4 filés de salmão',
          '1 xícara de suco de maracujá',
          '2 colheres de mel',
          '1 colher de manteiga',
          'Sal e pimenta',
          'Limão'
        ],
        instructions: [
          'Tempere o salmão com sal, pimenta e limão',
          'Grelhe por 4 minutos de cada lado',
          'Prepare o molho: reduza o suco com mel',
          'Adicione a manteiga ao molho',
          'Sirva o salmão com o molho por cima'
        ],
        prep_time: 10,
        cook_time: 15,
        servings: 4,
        difficulty: 'medium',
        category: 'Pratos Principais',
        is_external: true,
        external_source: 'Culinária Contemporânea'
      },
      {
        id: 'ext-4',
        title: 'Smoothie Bowl de Açaí',
        description: 'Bowl saudável e energético para o café da manhã',
        ingredients: [
          '200g de polpa de açaí',
          '1 banana congelada',
          '1/2 xícara de leite vegetal',
          'Granola',
          'Frutas frescas',
          'Mel',
          'Coco ralado'
        ],
        instructions: [
          'Bata o açaí com a banana e o leite',
          'Despeje em uma tigela',
          'Decore com granola, frutas e coco',
          'Regue com mel',
          'Sirva imediatamente'
        ],
        prep_time: 10,
        cook_time: 0,
        servings: 1,
        difficulty: 'easy',
        category: 'Café da Manhã',
        is_external: true,
        external_source: 'Receitas Saudáveis'
      },
      {
        id: 'ext-5',
        title: 'Pad Thai',
        description: 'Clássico macarrão tailandês com camarão',
        ingredients: [
          '200g de macarrão de arroz',
          '200g de camarão',
          '2 ovos',
          '100g de broto de feijão',
          '3 colheres de molho de peixe',
          '2 colheres de açúcar',
          'Amendoim torrado',
          'Limão',
          'Cebolinha'
        ],
        instructions: [
          'Cozinhe o macarrão conforme instruções',
          'Refogue o camarão',
          'Adicione os ovos mexidos',
          'Misture o macarrão',
          'Adicione molho de peixe e açúcar',
          'Acrescente broto de feijão',
          'Finalize com amendoim e limão'
        ],
        prep_time: 15,
        cook_time: 15,
        servings: 2,
        difficulty: 'medium',
        category: 'Pratos Principais',
        is_external: true,
        external_source: 'Culinária Asiática'
      }
    ];

    // Filtrar receitas baseado na busca
    const filtered = query
      ? externalRecipes.filter(recipe =>
          recipe.title.toLowerCase().includes(query.toLowerCase()) ||
          recipe.description.toLowerCase().includes(query.toLowerCase()) ||
          recipe.category.toLowerCase().includes(query.toLowerCase())
        )
      : externalRecipes;

    return NextResponse.json({ recipes: filtered });
  } catch (error) {
    console.error('Erro ao buscar receitas:', error);
    return NextResponse.json({ recipes: [] }, { status: 500 });
  }
}
