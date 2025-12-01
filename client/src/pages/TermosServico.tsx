import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function TermosServico() {
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
              Termos de Serviço
            </h1>
            <p className="text-xl text-gray-300">
              Condições de uso da plataforma Lar Imediato
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-2xl shadow-lg p-8 md:p-12 space-y-8"
          >
            <motion.div variants={itemVariants}>
              <p className="text-gray-600 mb-6">
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Aceitação dos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Ao acessar e utilizar o site Lar Imediato, você concorda em cumprir e estar vinculado a estes 
                Termos de Serviço. Se você não concordar com qualquer parte destes termos, não deve utilizar 
                nossos serviços.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Descrição do Serviço</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                A Lar Imediato é uma plataforma online que oferece:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Listagem e busca de imóveis para compra, venda e aluguel</li>
                <li>Ferramentas de busca e filtros avançados</li>
                <li>Informações detalhadas sobre propriedades</li>
                <li>Formulários de contato para interessados</li>
                <li>Área para anunciantes publicarem seus imóveis</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Uso da Plataforma</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ao utilizar nossa plataforma, você concorda em:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fornecer informações verdadeiras, precisas e atualizadas</li>
                <li>Manter a segurança de sua conta e senha</li>
                <li>Não utilizar a plataforma para fins ilegais ou não autorizados</li>
                <li>Não publicar conteúdo falso, enganoso ou difamatório</li>
                <li>Respeitar os direitos de propriedade intelectual de terceiros</li>
                <li>Não interferir ou interromper o funcionamento da plataforma</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Anúncios de Imóveis</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Ao publicar um anúncio de imóvel, você declara e garante que:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Possui autorização legal para anunciar o imóvel</li>
                <li>As informações fornecidas são verdadeiras e precisas</li>
                <li>As imagens publicadas são do imóvel anunciado</li>
                <li>O imóvel está disponível para a transação anunciada</li>
                <li>Está em conformidade com todas as leis e regulamentos aplicáveis</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Responsabilidades</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>5.1. Responsabilidade do Usuário:</strong> Você é responsável por todo o conteúdo que 
                publica em nossa plataforma e por todas as ações realizadas através de sua conta.
              </p>
              <p className="text-gray-700 leading-relaxed mb-4">
                <strong>5.2. Responsabilidade da Lar Imediato:</strong> Atuamos como uma plataforma intermediária. 
                Não somos responsáveis pela veracidade das informações fornecidas pelos anunciantes, nem pela 
                qualidade, segurança ou legalidade dos imóveis anunciados.
              </p>
              <p className="text-gray-700 leading-relaxed">
                <strong>5.3. Transações:</strong> A Lar Imediato não participa das negociações ou transações 
                entre compradores e vendedores. Todas as transações são de responsabilidade exclusiva das partes envolvidas.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Propriedade Intelectual</h2>
              <p className="text-gray-700 leading-relaxed">
                Todo o conteúdo do site, incluindo textos, gráficos, logos, ícones, imagens e software, é propriedade 
                da Lar Imediato ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais. 
                Você não pode reproduzir, distribuir ou criar obras derivadas sem autorização prévia por escrito.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Modificações do Serviço</h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de modificar, suspender ou descontinuar qualquer aspecto do serviço a qualquer 
                momento, com ou sem aviso prévio. Não seremos responsáveis perante você ou terceiros por qualquer 
                modificação, suspensão ou descontinuação do serviço.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Limitação de Responsabilidade</h2>
              <p className="text-gray-700 leading-relaxed">
                Na medida máxima permitida por lei, a Lar Imediato não será responsável por danos diretos, indiretos, 
                incidentais, especiais ou consequenciais resultantes do uso ou incapacidade de usar nossos serviços, 
                incluindo, mas não limitado a, perda de lucros, dados ou outras perdas intangíveis.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Rescisão</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos encerrar ou suspender seu acesso à plataforma imediatamente, sem aviso prévio, por qualquer 
                motivo, incluindo violação destes Termos de Serviço. Após a rescisão, seu direito de usar o serviço 
                cessará imediatamente.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Lei Aplicável</h2>
              <p className="text-gray-700 leading-relaxed">
                Estes Termos de Serviço são regidos pelas leis da República Federativa do Brasil. Qualquer disputa 
                relacionada a estes termos será resolvida nos tribunais competentes de Cachoeira do Sul, RS.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Alterações nos Termos</h2>
              <p className="text-gray-700 leading-relaxed">
                Reservamo-nos o direito de modificar estes Termos de Serviço a qualquer momento. As alterações 
                entrarão em vigor imediatamente após a publicação. O uso continuado do serviço após as alterações 
                constitui sua aceitação dos novos termos.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Contato</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você tiver dúvidas sobre estes Termos de Serviço, entre em contato conosco:
              </p>
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700"><strong>Lar Imediato</strong></p>
                <p className="text-gray-700">E-mail: robsonjobim96@hotmail.com</p>
                <p className="text-gray-700">Telefone: (51) 99694-0564</p>
                <p className="text-gray-700">Cachoeira do Sul - RS</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

