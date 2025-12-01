import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'wouter';
import { X, Cookie, Settings, ChevronDown } from 'lucide-react';
import { useCookies } from '@/hooks/useCookies';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';

export default function CookieBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { hasConsent, preferences, updatePreferences, acceptAll, rejectAll } = useCookies();

  useEffect(() => {
    if (!hasConsent) {
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [hasConsent]);

  const handleAccept = () => {
    acceptAll();
    setShowBanner(false);
  };

  const handleReject = () => {
    rejectAll();
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    setShowBanner(false);
  };

  const handleClose = () => {
    setShowBanner(false);
    setTimeout(() => {
      if (!hasConsent) {
        setShowBanner(true);
      }
    }, 24 * 60 * 60 * 1000);
  };

  const toggleCategory = (category: 'analytics' | 'marketing' | 'preferences') => {
    updatePreferences({
      [category]: !preferences[category],
    });
  };

  if (!showBanner) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-900 border-t-2 border-orange-500 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header */}
          <div className="flex items-start gap-4 mb-4">
            <div className="bg-orange-100 dark:bg-orange-900/30 p-3 rounded-full shrink-0">
              <Cookie className="text-orange-500" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-2">
                Utilizamos Cookies
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Utilizamos cookies para melhorar sua experiência, analisar o tráfego do site e personalizar conteúdo. 
                Ao continuar navegando, você concorda com nossa{' '}
                <Link 
                  href="/politica-privacidade" 
                  className="text-orange-500 hover:text-orange-600 underline font-medium"
                  onClick={() => setShowBanner(false)}
                >
                  Política de Privacidade
                </Link>
                {' '}e{' '}
                <Link 
                  href="/termos-servico" 
                  className="text-orange-500 hover:text-orange-600 underline font-medium"
                  onClick={() => setShowBanner(false)}
                >
                  Termos de Serviço
                </Link>
                .
              </p>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors shrink-0"
              aria-label="Fechar"
            >
              <X size={20} />
            </button>
          </div>

          {/* Detalhes das Categorias */}
          {showDetails && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mb-4"
            >
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="essential">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>Cookies Essenciais</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Sempre ativos</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Estes cookies são necessários para o funcionamento básico do site e não podem ser desativados. 
                      Eles geralmente são definidos apenas em resposta a ações feitas por você, como definir suas 
                      preferências de privacidade, fazer login ou preencher formulários.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="analytics">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>Cookies de Análise</span>
                      <Switch
                        checked={preferences.analytics}
                        onCheckedChange={() => toggleCategory('analytics')}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Estes cookies nos permitem contar visitas e fontes de tráfego para que possamos medir e 
                      melhorar o desempenho do nosso site. Eles nos ajudam a saber quais páginas são mais e menos 
                      populares e ver como os visitantes se movem pelo site.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="marketing">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>Cookies de Marketing</span>
                      <Switch
                        checked={preferences.marketing}
                        onCheckedChange={() => toggleCategory('marketing')}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Estes cookies podem ser definidos através do nosso site por nossos parceiros de publicidade. 
                      Podem ser usados por essas empresas para construir um perfil dos seus interesses e mostrar-lhe 
                      anúncios relevantes em outros sites.
                    </p>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="preferences">
                  <AccordionTrigger className="text-sm font-medium">
                    <div className="flex items-center justify-between w-full pr-4">
                      <span>Cookies de Preferências</span>
                      <Switch
                        checked={preferences.preferences}
                        onCheckedChange={() => toggleCategory('preferences')}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      Estes cookies permitem que o site forneça funcionalidades e personalização aprimoradas. 
                      Podem ser definidos por nós ou por fornecedores terceiros cujos serviços adicionamos às nossas páginas.
                    </p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          )}

          {/* Botão de Detalhes */}
          <div className="flex items-center justify-center mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
              className="text-sm text-gray-600 dark:text-gray-400"
            >
              <Settings size={16} className="mr-2" />
              {showDetails ? 'Ocultar Detalhes' : 'Personalizar Cookies'}
              <ChevronDown 
                size={16} 
                className={`ml-2 transition-transform ${showDetails ? 'rotate-180' : ''}`}
              />
            </Button>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            {showDetails ? (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  className="whitespace-nowrap"
                >
                  Recusar Todos
                </Button>
                <Button
                  onClick={handleSavePreferences}
                  className="bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap"
                >
                  Salvar Preferências
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleReject}
                  className="whitespace-nowrap"
                >
                  Recusar
                </Button>
                <Button
                  onClick={handleAccept}
                  className="bg-orange-500 hover:bg-orange-600 text-white whitespace-nowrap"
                >
                  Aceitar Todos
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

