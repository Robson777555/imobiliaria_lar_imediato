import { useState, FormEvent } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Phone, Mail, MapPin, Send, AlertCircle } from 'lucide-react';

export default function Contato() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Função auxiliar para abrir WhatsApp (mesma abordagem do projeto de carros)
  const openWhatsApp = (phoneNumber: string, message: string) => {
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Tentar abrir o WhatsApp com diferentes métodos
    try {
      const newWindow = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!newWindow || newWindow.closed || typeof newWindow.closed == 'undefined') {
        // Se popup foi bloqueado, redirecionar na mesma aba
        window.location.href = whatsappUrl;
      }
    } catch (error) {
      // Fallback: redirecionar na mesma aba
      window.location.href = whatsappUrl;
    }
  };

  // Validação de email (mesma lógica do projeto de carros)
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Validação de telefone (mesma lógica do projeto de carros)
  const validatePhone = (phone: string) => {
    const phoneValue = phone.replace(/\D/g, '');
    const validDDDs = ['11','12','13','14','15','16','17','18','19','21','22','24','27','28','31','32','33','34','35','37','38','41','42','43','44','45','46','47','48','49','51','53','54','55','61','62','63','64','65','66','67','68','69','71','73','74','75','77','79','81','82','83','84','85','86','87','88','89','91','92','93','94','95','96','97','98','99'];
    
    if (phoneValue.length === 11) {
      // Celular: 9 dígitos após DDD
      const ddd = phoneValue.substring(0, 2);
      const number = phoneValue.substring(2);
      if (validDDDs.includes(ddd) && number.length === 9 && number.startsWith('9')) {
        return true;
      }
    } else if (phoneValue.length === 10) {
      // Fixo: 8 dígitos após DDD
      const ddd = phoneValue.substring(0, 2);
      const number = phoneValue.substring(2);
      if (validDDDs.includes(ddd) && number.length === 8) {
        return true;
      }
    }
    
    return false;
  };

  // Validação completa do formulário (mesma lógica do projeto de carros)
  const validateForm = () => {
    let isValid = true;
    const errors: {[key: string]: string} = {};

    // Validar campos obrigatórios
    if (!formData.name.trim()) {
      errors.name = 'Este campo é obrigatório';
      isValid = false;
    }

    if (!formData.email.trim()) {
      errors.email = 'Este campo é obrigatório';
      isValid = false;
    } else if (!validateEmail(formData.email)) {
      errors.email = 'Por favor, insira um email válido';
      isValid = false;
    }

    if (!formData.phone.trim()) {
      errors.phone = 'Este campo é obrigatório';
      isValid = false;
    } else if (!validatePhone(formData.phone)) {
      errors.phone = 'Por favor, insira um telefone válido (ex: (11) 99999-9999 ou (11) 3333-4444)';
      isValid = false;
    }

    if (!formData.message.trim()) {
      errors.message = 'Este campo é obrigatório';
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Limpar erros anteriores
    setFieldErrors({});
    
    // Validar formulário antes de enviar (mesma lógica do projeto de carros)
    if (!validateForm()) {
      return; // Impede o envio se houver erros
    }

    // Iniciar processo de envio
    setIsSubmitting(true);

    setTimeout(() => {
      const whatsappNumber = "5551996914021"; // Formato: 55 + DDD + número (mesma lógica do projeto de carros)
      const assunto = "Contato Site - Lar Imediato";
      
      // Formata a mensagem para WhatsApp (mesma estrutura do projeto de carros)
      const whatsappMessage = 
        `🏠 *Nova Mensagem de Contato - Site de Lar Imediato*\n\n` +
        `👤 *Nome:* ${formData.name}\n` +
        `📧 *Email:* ${formData.email}\n` +
        `📞 *Telefone:* ${formData.phone}\n` +
        `📝 *Assunto:* ${assunto}\n\n` +
        `💬 *Mensagem:*\n${formData.message}`;
      
      openWhatsApp(whatsappNumber, whatsappMessage);
      
      alert("✅ Redirecionando para WhatsApp! Complete o envio da mensagem lá.");
      
      // Limpa o formulário
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    
    // Limpar erro do campo quando o usuário começar a digitar
    if (fieldErrors[e.target.name]) {
      setFieldErrors({
        ...fieldErrors,
        [e.target.name]: ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Page Header */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Entre em Contato
            </h1>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">
              Estamos aqui para ajudar você a encontrar o imóvel dos seus sonhos
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Envie sua Mensagem
                </h2>
                <p className="text-gray-600 mb-8">
                  Preencha o formulário abaixo e entraremos em contato via WhatsApp
                </p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
                      Nome Completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                        fieldErrors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Seu nome completo"
                    />
                    {fieldErrors.name && (
                      <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                        <AlertCircle size={16} />
                        <span>{fieldErrors.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                        fieldErrors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="seu@email.com"
                    />
                    {fieldErrors.email && (
                      <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                        <AlertCircle size={16} />
                        <span>{fieldErrors.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
                      Telefone *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all ${
                        fieldErrors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="(00) 00000-0000"
                    />
                    {fieldErrors.phone && (
                      <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                        <AlertCircle size={16} />
                        <span>{fieldErrors.phone}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
                      Mensagem *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all resize-none ${
                        fieldErrors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Conte-nos como podemos ajudar..."
                    />
                    {fieldErrors.message && (
                      <div className="flex items-center gap-1 text-red-600 text-sm mt-1">
                        <AlertCircle size={16} />
                        <span>{fieldErrors.message}</span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    {isSubmitting ? 'Enviando...' : 'Enviar via WhatsApp'}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h2 className="text-3xl font-bold text-slate-900 mb-6">
                  Informações de Contato
                </h2>
                <p className="text-gray-600 mb-8">
                  Você também pode nos contatar diretamente através dos canais abaixo:
                </p>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Phone className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Telefone</h3>
                      <a 
                        href="https://wa.me/5551996914021" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        (51) 99691-4021
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Mail className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Email</h3>
                      <a 
                        href="mailto:robsonjobim96@hotmail.com"
                        className="text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        robsonjobim96@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <MapPin className="text-orange-500" size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-1">Localização</h3>
                      <p className="text-gray-600">Cachoeira do Sul, RS</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-linear-to-r from-orange-500 to-orange-600 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">Horário de Atendimento</h3>
                <div className="space-y-2">
                  <p><strong>Segunda a Sexta:</strong> 8h às 18h</p>
                  <p><strong>Sábado:</strong> 9h às 13h</p>
                  <p><strong>Domingo:</strong> Fechado</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

