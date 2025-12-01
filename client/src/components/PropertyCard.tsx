import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Bed, Bath, Car, MapPin, Heart } from 'lucide-react';
import { useState } from 'react';
import { Property } from '@/lib/mockData';

export default function PropertyCard({ property }: { property: Property }) {
  const [isFavorite, setIsFavorite] = useState(false);

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <motion.div
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-200">
        {/* Prompt: Modern residential property exterior, contemporary architecture, well-lit, professional real estate photography, 8k resolution, photorealistic */}
        <motion.img
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
          src={property.image}
          alt={property.title}
          className="w-full h-full object-cover"
        />

        {/* Availability Badge */}
        {property.available && (
          <div className="absolute top-4 left-4 bg-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
            Disponibilidade Imediata
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
        >
          <Heart
            size={20}
            className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
          {property.title}
        </h3>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-600 mb-4">
          <MapPin size={16} />
          <span className="text-sm">{property.neighborhood}</span>
        </div>

        {/* Price */}
        <div className="text-2xl font-bold text-orange-500 mb-4">
          {formatPrice(property.price)}
        </div>

        {/* Features */}
        <div className="flex justify-between mb-6 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Bed size={18} className="text-slate-600" />
            <span className="text-sm text-slate-700">{property.bedrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bath size={18} className="text-slate-600" />
            <span className="text-sm text-slate-700">{property.bathrooms}</span>
          </div>
          <div className="flex items-center gap-2">
            <Car size={18} className="text-slate-600" />
            <span className="text-sm text-slate-700">{property.garages}</span>
          </div>
          <div className="text-sm text-slate-700 font-semibold">
            {property.area} m²
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-2">
          {property.description}
        </p>

        {/* View Details Button */}
        <Link href={`/property/${property.id}`}>
          <button className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 rounded-lg transition-colors">
            Ver Detalhes
          </button>
        </Link>
      </div>
    </motion.div>
  );
}
