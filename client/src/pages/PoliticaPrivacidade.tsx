import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function PoliticaPrivacidade() {
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
              Política de Privacidade
            </h1>
            <p className="text-xl text-gray-300">
              Protegendo seus dados pessoais com transparência e segurança
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
              <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Introdução</h2>
              <p className="text-gray-700 leading-relaxed">
                A Lar Imediato ("nós", "nosso" ou "empresa") está comprometida em proteger a privacidade 
                e os dados pessoais de nossos usuários. Esta Política de Privacidade descreve como coletamos, 
                usamos, armazenamos e protegemos suas informações pessoais quando você utiliza nosso site e serviços.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Informações que Coletamos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Coletamos as seguintes informações quando você utiliza nossos serviços:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li><strong>Informações de Contato:</strong> Nome, e-mail, telefone e endereço</li>
                <li><strong>Informações de Navegação:</strong> Endereço IP, tipo de navegador, páginas visitadas</li>
                <li><strong>Informações de Imóveis:</strong> Dados relacionados a imóveis que você anuncia ou busca</li>
                <li><strong>Informações de Comunicação:</strong> Mensagens enviadas através do nosso formulário de contato</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Como Utilizamos suas Informações</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Utilizamos suas informações pessoais para:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Fornecer e melhorar nossos serviços imobiliários</li>
                <li>Processar suas solicitações e responder suas consultas</li>
                <li>Enviar comunicações relacionadas aos nossos serviços</li>
                <li>Personalizar sua experiência em nosso site</li>
                <li>Cumprir obrigações legais e regulatórias</li>
                <li>Prevenir fraudes e garantir a segurança de nossos usuários</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Compartilhamento de Informações</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Não vendemos suas informações pessoais. Podemos compartilhar suas informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Com prestadores de serviços que nos auxiliam na operação do site (sob acordos de confidencialidade)</li>
                <li>Quando exigido por lei ou processo judicial</li>
                <li>Para proteger nossos direitos, propriedade ou segurança</li>
                <li>Com seu consentimento explícito</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Segurança dos Dados</h2>
              <p className="text-gray-700 leading-relaxed">
                Implementamos medidas de segurança técnicas e organizacionais adequadas para proteger suas 
                informações pessoais contra acesso não autorizado, alteração, divulgação ou destruição. 
                No entanto, nenhum método de transmissão pela internet ou armazenamento eletrônico é 100% seguro.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Seus Direitos</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                De acordo com a Lei Geral de Proteção de Dados (LGPD), você tem os seguintes direitos:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
                <li>Acesso aos seus dados pessoais</li>
                <li>Correção de dados incompletos, inexatos ou desatualizados</li>
                <li>Exclusão de dados desnecessários ou tratados em desconformidade</li>
                <li>Portabilidade dos dados</li>
                <li>Revogação do consentimento</li>
                <li>Informação sobre compartilhamento de dados</li>
              </ul>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Cookies</h2>
              <p className="text-gray-700 leading-relaxed">
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso do site 
                e personalizar conteúdo. Você pode gerenciar suas preferências de cookies através das configurações 
                do seu navegador.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Alterações nesta Política</h2>
              <p className="text-gray-700 leading-relaxed">
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos você sobre alterações 
                significativas publicando a nova política nesta página e atualizando a data de "Última atualização".
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Contato</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                Se você tiver dúvidas sobre esta Política de Privacidade ou desejar exercer seus direitos, 
                entre em contato conosco:
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

