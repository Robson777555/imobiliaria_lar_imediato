import { motion } from 'framer-motion';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import { getFeaturedProperties } from '@/lib/mockData';
import { Sparkles, ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredProperties = getFeaturedProperties().slice(0, 3); // Mostra apenas 3 imóveis na home

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Hero />

      {/* Featured Properties Preview Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="text-orange-500" size={24} />
              <span className="text-orange-500 font-semibold">Destaques</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Conheça algumas das melhores oportunidades imobiliárias selecionadas especialmente para você
            </p>
          </motion.div>

          {/* Properties Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProperties.map((property) => (
              <motion.div key={property.id} variants={itemVariants}>
                <PropertyCard property={property} />
              </motion.div>
            ))}
          </motion.div>

          {/* View All Button */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/imoveis">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors inline-flex items-center gap-2">
                Ver Todos os Imóveis
                <ArrowRight size={20} />
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Quick About Preview */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Por que escolher a Lar Imediato?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto mb-8">
              Somos especialistas em conectar você ao imóvel dos seus sonhos
            </p>
            <Link href="/sobre">
              <button className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-6 rounded-lg transition-colors inline-flex items-center gap-2">
                Saiba Mais
                <ArrowRight size={18} />
              </button>
            </Link>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                title: 'Rapidez',
                description: 'Encontre o imóvel perfeito em minutos, não em meses',
                icon: '⚡',
              },
              {
                title: 'Segurança',
                description: 'Transações seguras com profissionais certificados',
                icon: '🔒',
              },
              {
                title: 'Tecnologia',
                description: 'Plataforma moderna com busca inteligente e filtros avançados',
                icon: '💻',
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="bg-gray-50 p-8 rounded-xl text-center hover:shadow-lg transition-shadow"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-slate-900 to-slate-800">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Pronto para encontrar seu novo lar?
          </h2>
          <p className="text-gray-300 text-lg mb-8">
            Comece sua busca agora e descubra as melhores oportunidades imobiliárias
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/imoveis">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                Explorar Imóveis
              </button>
            </Link>
            <Link href="/contato">
              <button className="bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors">
                Entre em Contato
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}

