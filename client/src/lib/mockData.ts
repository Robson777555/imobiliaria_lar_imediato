export interface Property {
  id: number;
  title: string;
  price: number;
  neighborhood: string;
  address: string;
  type: string;
  bedrooms: number;
  bathrooms: number;
  garages: number;
  area: number;
  description: string;
  image: string;
  imagePrompt: string;
  available: boolean;
  featured: boolean;
}

export const properties: Property[] = [
  {
    id: 1,
    title: "Apartamento Moderno no Centro",
    price: 450000,
    neighborhood: "Centro",
    address: "Rua das Flores, 123",
    type: "Apartamento",
    bedrooms: 3,
    bathrooms: 2,
    garages: 1,
    area: 95,
    description: "Apartamento elegante com acabamento premium, localizado em área nobre do centro. Possui vista para a cidade, cozinha integrada e varanda ampla.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
    imagePrompt: "Modern luxury apartment interior with floor-to-ceiling windows, minimalist design, warm lighting, contemporary furniture, 8k resolution, photorealistic",
    available: true,
    featured: true,
  },
  {
    id: 2,
    title: "Casa com Piscina e Jardim",
    price: 750000,
    neighborhood: "Vila Mariana",
    address: "Avenida Paulista, 456",
    type: "Casa",
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    area: 280,
    description: "Casa espaçosa com piscina aquecida, jardim paisagístico e área de lazer completa. Ideal para famílias que buscam conforto e privacidade.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    imagePrompt: "Luxury residential house with swimming pool, manicured garden, modern architecture, golden hour lighting, 8k resolution, photorealistic",
    available: true,
    featured: true,
  },
  {
    id: 3,
    title: "Studio Compacto e Funcional",
    price: 280000,
    neighborhood: "Bom Fim",
    address: "Rua Ramiro Barcelos, 789",
    type: "Studio",
    bedrooms: 1,
    bathrooms: 1,
    garages: 0,
    area: 35,
    description: "Studio bem aproveitado com cozinha integrada, ideal para profissionais ou casais. Localização estratégica próximo a transportes e comércios.",
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80",
    imagePrompt: "Compact modern studio apartment with smart storage solutions, minimalist Scandinavian design, bright natural lighting, 8k resolution, photorealistic",
    available: true,
    featured: false,
  },
  {
    id: 4,
    title: "Apartamento Duplex com Terraço",
    price: 580000,
    neighborhood: "Moinhos de Vento",
    address: "Rua Quintino Bocaiúva, 234",
    type: "Apartamento",
    bedrooms: 3,
    bathrooms: 2,
    garages: 1,
    area: 120,
    description: "Duplex sofisticado com terraço privativo, cozinha gourmet e sala ampla. Condomínio com infraestrutura completa e segurança 24h.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80",
    imagePrompt: "Luxury duplex apartment with private terrace, gourmet kitchen, modern interior design, city view, golden hour, 8k resolution, photorealistic",
    available: true,
    featured: true,
  },
  {
    id: 5,
    title: "Sobrado em Condomínio Fechado",
    price: 650000,
    neighborhood: "Três Figueiras",
    address: "Rua Marquês de Pombal, 567",
    type: "Sobrado",
    bedrooms: 4,
    bathrooms: 3,
    garages: 2,
    area: 200,
    description: "Sobrado moderno em condomínio fechado com segurança, áreas verdes e lazer. Perfeito para quem busca qualidade de vida e segurança.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80",
    imagePrompt: "Modern townhouse in gated community, contemporary architecture, manicured landscape, warm evening light, 8k resolution, photorealistic",
    available: true,
    featured: false,
  },
  {
    id: 6,
    title: "Penthouse com Vista Panorâmica",
    price: 1200000,
    neighborhood: "Bela Vista",
    address: "Avenida Getúlio Vargas, 890",
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 4,
    garages: 2,
    area: 250,
    description: "Penthouse exclusivo com vista 360° da cidade, acabamento de luxo, suíte master com spa privado e varanda panorâmica. Imóvel de alto padrão.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80",
    imagePrompt: "Luxury penthouse with panoramic city views, high-end interior design, floor-to-ceiling windows, sunset lighting, 8k resolution, photorealistic",
    available: true,
    featured: true,
  },
];

export const getPropertyById = (id: string | number): Property | undefined => {
  return properties.find(p => p.id === parseInt(String(id)));
};

export const getFeaturedProperties = (): Property[] => {
  return properties.filter(p => p.featured);
};

export const filterProperties = (filters: { neighborhood?: string; minPrice?: number; maxPrice?: number; type?: string }): Property[] => {
  return properties.filter(p => {
    if (filters.neighborhood && p.neighborhood !== filters.neighborhood) return false;
    if (filters.minPrice && p.price < filters.minPrice) return false;
    if (filters.maxPrice && p.price > filters.maxPrice) return false;
    if (filters.type && p.type !== filters.type) return false;
    return true;
  });
};
