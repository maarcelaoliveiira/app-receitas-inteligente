import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default openai;

export async function generateRecipeImage(recipeName: string) {
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `A high-quality, realistic photo of ${recipeName}, plated beautifully, professional food photography, appetizing, detailed`,
      size: "1024x1024",
      quality: "standard",
      n: 1,
    });
    return response.data[0].url;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

export async function interpretSearchQuery(query: string) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant that interprets food search queries. Convert user queries into specific recipe names or ingredients. Respond with a JSON object containing 'interpreted_query' and 'keywords'."
        },
        {
          role: "user",
          content: `Interpret this search query for recipes: "${query}"`
        }
      ],
      response_format: { type: "json_object" }
    });
    const result = JSON.parse(response.choices[0].message.content);
    return result;
  } catch (error) {
    console.error('Error interpreting query:', error);
    return { interpreted_query: query, keywords: query.split(' ') };
  }
}