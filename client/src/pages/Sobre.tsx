import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function Sobre() {
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

  const features = [
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
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-slate-900 to-slate-800">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Sobre a Lar Imediato
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Somos especialistas em conectar você ao imóvel dos seus sonhos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              Por que escolher a Lar Imediato?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Nossa missão é tornar o processo de encontrar e adquirir imóveis mais simples, rápido e seguro
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {features.map((item, index) => (
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

      {/* Mission Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
              Nossa Missão
            </h2>
            <p className="text-gray-600 text-lg leading-relaxed">
              A Lar Imediato nasceu com o objetivo de revolucionar a forma como as pessoas encontram seus imóveis. 
              Utilizamos tecnologia de ponta e uma equipe de profissionais experientes para oferecer uma experiência 
              única, rápida e segura. Acreditamos que encontrar o lar perfeito não precisa ser complicado.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

