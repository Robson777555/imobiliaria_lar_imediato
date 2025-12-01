import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, MapPin, DollarSign, Home, Bed, Bath, Car, Edit, Trash2 } from 'lucide-react';
import { Link } from 'wouter';
import Navbar from '@/components/Navbar';
import PropertyCard from '@/components/PropertyCard';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

export default function BuscarImoveis() {
  const [filters, setFilters] = useState({
    search: '',
    neighborhood: '',
    minPrice: '',
    maxPrice: '',
    type: '',
    minBedrooms: '',
    minBathrooms: '',
    available: undefined as boolean | undefined,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);

  const { data: properties, isLoading, refetch } = trpc.properties.search.useQuery({
    search: filters.search || undefined,
    neighborhood: filters.neighborhood || undefined,
    minPrice: filters.minPrice ? Number(filters.minPrice) : undefined,
    maxPrice: filters.maxPrice ? Number(filters.maxPrice) : undefined,
    type: filters.type as any || undefined,
    minBedrooms: filters.minBedrooms ? Number(filters.minBedrooms) : undefined,
    minBathrooms: filters.minBathrooms ? Number(filters.minBathrooms) : undefined,
    available: filters.available,
    limit: 50,
  });

  const deleteProperty = trpc.properties.delete.useMutation({
    onSuccess: () => {
      toast.success('Imóvel excluído com sucesso!');
      refetch();
      setPropertyToDelete(null);
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao excluir imóvel');
      setPropertyToDelete(null);
    },
  });

  const handleDelete = (id: number) => {
    setPropertyToDelete(id);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      deleteProperty.mutate({ id: propertyToDelete });
    }
  };

  const MOCK_PROPERTY_TITLES = [
    "Apartamento Moderno no Centro",
    "Casa com Piscina e Jardim",
    "Studio Compacto e Funcional",
    "Apartamento Duplex com Terraço",
    "Sobrado em Condomínio Fechado",
    "Penthouse com Vista Panorâmica"
  ];

  const handleFilterChange = (key: string, value: string | boolean | undefined) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      neighborhood: '',
      minPrice: '',
      maxPrice: '',
      type: '',
      minBedrooms: '',
      minBathrooms: '',
      available: undefined,
    });
  };

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
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Buscar Imóveis
            </h1>
            <p className="text-orange-100 text-lg max-w-2xl mx-auto">
              Encontre o imóvel perfeito para você com nossa busca avançada
            </p>
          </motion.div>
        </div>
      </section>

      {/* Search and Filters Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          {/* Quick Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                placeholder="Buscar por título, descrição ou endereço..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Filter size={18} />
              Filtros
            </Button>
            {(filters.neighborhood || filters.minPrice || filters.maxPrice || filters.type || filters.minBedrooms || filters.minBathrooms || filters.available !== undefined) && (
              <Button onClick={clearFilters} variant="ghost">
                Limpar Filtros
              </Button>
            )}
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t"
            >
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <MapPin size={16} className="inline mr-1" />
                  Bairro
                </label>
                <Input
                  placeholder="Ex: Centro, Vila Mariana..."
                  value={filters.neighborhood}
                  onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <DollarSign size={16} className="inline mr-1" />
                  Preço Mínimo
                </label>
                <Input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <DollarSign size={16} className="inline mr-1" />
                  Preço Máximo
                </label>
                <Input
                  type="number"
                  placeholder="R$ 0"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <Home size={16} className="inline mr-1" />
                  Tipo
                </label>
                <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os tipos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos os tipos</SelectItem>
                    <SelectItem value="Apartamento">Apartamento</SelectItem>
                    <SelectItem value="Casa">Casa</SelectItem>
                    <SelectItem value="Studio">Studio</SelectItem>
                    <SelectItem value="Sobrado">Sobrado</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Terreno">Terreno</SelectItem>
                    <SelectItem value="Comercial">Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <Bed size={16} className="inline mr-1" />
                  Quartos (mín.)
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.minBedrooms}
                  onChange={(e) => handleFilterChange('minBedrooms', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  <Bath size={16} className="inline mr-1" />
                  Banheiros (mín.)
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="0"
                  value={filters.minBathrooms}
                  onChange={(e) => handleFilterChange('minBathrooms', e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Disponibilidade
                </label>
                <Select
                  value={filters.available === undefined ? '' : filters.available ? 'true' : 'false'}
                  onValueChange={(value) => handleFilterChange('available', value === '' ? undefined : value === 'true')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos</SelectItem>
                    <SelectItem value="true">Disponível</SelectItem>
                    <SelectItem value="false">Indisponível</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <Card key={i}>
                  <Skeleton className="h-64 w-full" />
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-8 w-full mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : properties && properties.length > 0 ? (
            <>
              <div className="mb-6">
                <p className="text-gray-600">
                  Encontrados <span className="font-semibold text-orange-500">{properties.length}</span> imóveis
                </p>
              </div>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {properties.map((property) => {
                  const isEditable = !MOCK_PROPERTY_TITLES.includes(property.title);
                  
                  return (
                    <motion.div key={property.id} variants={itemVariants} className="flex flex-col">
                      <PropertyCard property={{
                        id: property.id,
                        title: property.title,
                        price: property.price,
                        neighborhood: property.neighborhood || '',
                        address: property.address || '',
                        type: property.type,
                        bedrooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        garages: property.garages,
                        area: property.area,
                        description: property.description || '',
                        image: property.image || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
                        imagePrompt: '',
                        available: property.available === 'true',
                        featured: property.featured === 'true',
                      }} />
                      
                      {/* Botões de ação abaixo do card - APENAS para imóveis editáveis */}
                      {isEditable && (
                        <div className="mt-4 flex gap-3 bg-white p-3 rounded-lg shadow-sm border border-gray-200">
                          <Link href={`/editar-imovel/${property.id}`} className="flex-1">
                            <Button
                              variant="outline"
                              className="w-full border-2 border-orange-500 text-orange-500 hover:bg-orange-50 font-semibold"
                              size="default"
                            >
                              <Edit size={18} className="mr-2" />
                              Atualizar Imóvel
                            </Button>
                          </Link>
                          <Button
                            variant="destructive"
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold"
                            size="default"
                            onClick={() => handleDelete(property.id)}
                          >
                            <Trash2 size={18} className="mr-2" />
                            Excluir Imóvel
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </motion.div>
            </>
          ) : (
            <div className="text-center py-20">
              <Home size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                Nenhum imóvel encontrado
              </h3>
              <p className="text-gray-500 mb-6">
                Tente ajustar os filtros de busca para encontrar mais resultados
              </p>
              <Button onClick={clearFilters} variant="outline">
                Limpar Filtros
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={propertyToDelete !== null} onOpenChange={() => setPropertyToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este imóvel? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
}

