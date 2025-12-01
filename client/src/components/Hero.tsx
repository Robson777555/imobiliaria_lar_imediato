import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, DollarSign, Home } from 'lucide-react';

// Prompt: Modern luxury real estate hero background, minimalist architecture, golden hour sunset, city skyline, warm lighting, 8k resolution, photorealistic, professional photography
const HERO_IMAGE = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600&q=80';

export default function Hero() {
  const [searchFilters, setSearchFilters] = useState({
    location: '',
    priceRange: '',
    type: '',
  });

  const handleSearch = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    console.log('Searching with filters:', searchFilters);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  return (
    <div className="relative w-full h-screen pt-16 overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HERO_IMAGE})`,
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 h-full flex flex-col items-center justify-center px-4"
      >
        {/* Main Heading */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl md:text-6xl font-bold text-white text-center max-w-3xl mb-6"
        >
          Seu novo começo, pronto para morar.
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-lg md:text-xl text-gray-100 text-center max-w-2xl mb-12"
        >
          Encontre o imóvel perfeito com rapidez e segurança
        </motion.p>

        {/* Search Bar */}
        <motion.form
          variants={itemVariants}
          onSubmit={handleSearch}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6 md:p-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Location Filter */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <MapPin className="inline mr-2" size={18} />
                Localização
              </label>
              <input
                type="text"
                placeholder="Bairro ou endereço"
                value={searchFilters.location}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, location: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              />
            </div>

            {/* Price Filter */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <DollarSign className="inline mr-2" size={18} />
                Faixa de Preço
              </label>
              <select
                value={searchFilters.priceRange}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, priceRange: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              >
                <option value="">Selecione</option>
                <option value="0-300000">Até R$ 300 mil</option>
                <option value="300000-600000">R$ 300 mil - R$ 600 mil</option>
                <option value="600000-1000000">R$ 600 mil - R$ 1 milhão</option>
                <option value="1000000+">Acima de R$ 1 milhão</option>
              </select>
            </div>

            {/* Type Filter */}
            <div className="relative">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                <Home className="inline mr-2" size={18} />
                Tipo de Imóvel
              </label>
              <select
                value={searchFilters.type}
                onChange={(e) =>
                  setSearchFilters({ ...searchFilters, type: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
              >
                <option value="">Selecione</option>
                <option value="Apartamento">Apartamento</option>
                <option value="Casa">Casa</option>
                <option value="Sobrado">Sobrado</option>
                <option value="Studio">Studio</option>
              </select>
            </div>
          </div>

          {/* Search Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Search size={20} />
            Buscar Imóveis
          </button>
        </motion.form>
      </motion.div>
    </div>
  );
}
