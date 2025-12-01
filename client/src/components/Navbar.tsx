import { useState } from 'react';
import { Link } from 'wouter';
import { Menu, X, Home, Search, Phone, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);
  const logoPath = '/images/logo.jpg';

  const handleNavClick = (href: string) => {
    setIsMenuOpen(false);
  };

  const navLinks = [
    { href: '/', label: 'Início', icon: Home },
    { href: '/imoveis', label: 'Imóveis', icon: Home },
    { href: '/buscar-imoveis', label: 'Buscar', icon: Search },
    { href: '/sobre', label: 'Sobre', icon: Home },
    { href: '/contato', label: 'Contato', icon: Phone },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            {!logoError ? (
              <img 
                src={logoPath} 
                alt="Lar Imediato" 
                className="h-12 md:h-16 w-auto object-contain transition-opacity group-hover:opacity-80"
                onError={() => setLogoError(true)}
              />
            ) : (
              <span className="text-2xl font-bold text-slate-900">
                Lar <span className="text-orange-500">Imediato</span>
              </span>
            )}
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="flex items-center gap-2 text-slate-700 hover:text-orange-500 font-medium transition-colors cursor-pointer"
                >
                  <Icon size={18} />
                  {link.label}
                </Link>
              );
            })}
            <Link href="/gerenciar-imoveis">
              <button className="text-slate-700 hover:text-orange-500 font-medium transition-colors flex items-center gap-2">
                <Settings size={18} />
                Gerenciar
              </button>
            </Link>
            <Link href="/anunciar-imovel">
              <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded-lg transition-colors">
                Anunciar Imóvel
              </button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-orange-500 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-200"
          >
            <div className="px-4 py-4 space-y-4">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="flex items-center gap-3 text-slate-700 hover:text-orange-500 font-medium transition-colors py-2 cursor-pointer"
                  >
                    <Icon size={20} />
                    {link.label}
                  </Link>
                );
              })}
              <Link href="/gerenciar-imoveis" onClick={() => handleNavClick('/gerenciar-imoveis')}>
                <button className="w-full text-slate-700 hover:text-orange-500 font-medium transition-colors py-3 px-6 rounded-lg border border-gray-300 hover:border-orange-500 flex items-center justify-center gap-2">
                  <Settings size={20} />
                  Gerenciar Imóveis
                </button>
              </Link>
              <Link href="/anunciar-imovel" onClick={() => handleNavClick('/anunciar-imovel')}>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors mt-2">
                  Anunciar Imóvel
                </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

