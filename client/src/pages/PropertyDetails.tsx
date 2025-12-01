import { useState, useEffect, FormEvent } from 'react';
import { useRoute, Link } from 'wouter';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Bed, Bath, Car, MapPin, Phone, MessageCircle, ChevronLeft, X } from 'lucide-react';

const WHATSAPP_NUMBER = '5151996940564';

export default function PropertyDetails() {
  const [, params] = useRoute('/property/:id');
  const propertyId = params?.id ? parseInt(params.id) : 0;
  
  const { data: property, isLoading } = trpc.properties.getById.useQuery(
    { id: propertyId },
    { enabled: !!propertyId }
  );
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [showContactForm, setShowContactForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Imóvel não encontrado
          </h1>
          <Link href="/buscar-imoveis" className="text-orange-500 hover:text-orange-600">
            Voltar para busca
          </Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleContactSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    const location = property.neighborhood || property.address || 'localização não informada';
    const message = `Olá! Meu nome é ${formData.name}. Estou interessado no imóvel "${property.title}" localizado em ${location}. Gostaria de agendar uma visita. Meu telefone é ${formData.phone} e meu email é ${formData.email}. ${formData.message ? `Mensagem adicional: ${formData.message}` : ''}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`;

    window.open(whatsappUrl, '_blank');
    setSubmitted(true);
    setTimeout(() => {
      setShowContactForm(false);
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 2000);
  };

  const propertyImage = property.image?.trim() || null;
  const hasValidImage = propertyImage && propertyImage.length > 0 && (propertyImage.startsWith('http') || propertyImage.startsWith('data:'));
  
  const galleryImages = hasValidImage
    ? [propertyImage]
    : [
        'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
        'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
        'https://images.unsplash.com/photo-1545324418-cc1a9a6fded0?w=800&q=80',
      ];
  
  useEffect(() => {
    setSelectedImage(0);
  }, [property.id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Back Button */}
      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <Link
          href="/buscar-imoveis"
          className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors font-semibold mb-8"
        >
          <ChevronLeft size={20} />
          Voltar
        </Link>
      </div>

      {/* Main Content */}
      <div className="px-4 sm:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <div className="relative h-96 md:h-[500px] bg-gray-200 rounded-2xl overflow-hidden mb-4">
                {galleryImages[selectedImage] ? (
                  <img
                    src={galleryImages[selectedImage]}
                    alt={property.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <p className="text-gray-500">Imagem não disponível</p>
                  </div>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {galleryImages.length > 0 && (
                <div className="flex gap-4 overflow-x-auto">
                  {galleryImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                        selectedImage === index
                          ? 'border-orange-500'
                          : 'border-gray-300 hover:border-orange-300'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Property Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 mb-8"
            >
              <h1 className="text-4xl font-bold text-slate-900 mb-4">
                {property.title}
              </h1>

              <div className="flex items-center gap-2 text-gray-600 mb-6">
                <MapPin size={20} />
                <span className="text-lg">{property.address || property.neighborhood || 'Endereço não informado'}</span>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 pb-8 border-b border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bed size={20} className="text-orange-500" />
                    <span className="text-2xl font-bold text-slate-900">
                      {property.bedrooms}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Quartos</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Bath size={20} className="text-orange-500" />
                    <span className="text-2xl font-bold text-slate-900">
                      {property.bathrooms}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Banheiros</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Car size={20} className="text-orange-500" />
                    <span className="text-2xl font-bold text-slate-900">
                      {property.garages}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">Garagens</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 mb-2">
                    {property.area}
                  </div>
                  <p className="text-gray-600 text-sm">m²</p>
                </div>
              </div>

              {/* Description */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Sobre o Imóvel
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {property.description || 'Descrição não disponível.'}
                </p>
              </div>

              {/* Map Placeholder */}
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">
                  Localização
                </h2>
                <div className="w-full h-64 bg-gray-300 rounded-xl flex items-center justify-center">
                  <p className="text-gray-600">Mapa interativo</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Contact Card (Sticky) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:sticky lg:top-24 h-fit"
          >
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              {/* Price */}
              <div className="mb-8 pb-8 border-b border-gray-200">
                <p className="text-gray-600 text-sm mb-2">Valor do Imóvel</p>
                <p className="text-4xl font-bold text-orange-500">
                  {formatPrice(property.price)}
                </p>
              </div>

              {/* Contact Buttons */}
              <div className="space-y-4 mb-8">
                <button
                  onClick={() => setShowContactForm(true)}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Agendar Visita
                </button>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=Olá! Tenho interesse no imóvel "${property.title}" localizado em ${property.neighborhood || property.address || 'localização não informada'}.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Phone size={20} />
                  Contato via WhatsApp
                </a>
              </div>

              {/* Availability Badge */}
              {property.available === 'true' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <p className="text-green-700 font-semibold">
                    ✓ Disponibilidade Imediata
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Contact Form Modal */}
      {showContactForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowContactForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>

            <h2 className="text-2xl font-bold text-slate-900 mb-6">
              Agendar Visita
            </h2>

            {submitted ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✓</div>
                <p className="text-green-600 font-semibold text-lg">
                  Mensagem enviada com sucesso!
                </p>
                <p className="text-gray-600 mt-2">
                  Você será redirecionado para o WhatsApp
                </p>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Telefone
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="(51) 9 9999-9999"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Mensagem (Opcional)
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                    placeholder="Conte-nos mais sobre seu interesse..."
                    rows={3}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-lg transition-colors"
                >
                  Enviar via WhatsApp
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}

      <Footer />
    </div>
  );
}
