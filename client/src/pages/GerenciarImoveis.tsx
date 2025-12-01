import { useState } from 'react';
import { motion } from 'framer-motion';
import { Edit, Trash2, Plus, Search, Home, ArrowLeft } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import PropertyCard from '@/components/PropertyCard';

export default function GerenciarImoveis() {
  const [, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyToDelete, setPropertyToDelete] = useState<number | null>(null);

  const { data: allProperties, isLoading, refetch } = trpc.properties.search.useQuery({
    limit: 100,
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

  const allPropertiesList = allProperties || [];
  const filteredProperties = allPropertiesList.filter(p =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.neighborhood?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const MOCK_PROPERTY_TITLES = [
    "Apartamento Moderno no Centro",
    "Casa com Piscina e Jardim",
    "Studio Compacto e Funcional",
    "Apartamento Duplex com Terraço",
    "Sobrado em Condomínio Fechado",
    "Penthouse com Vista Panorâmica"
  ];
  
  const editableProperties = filteredProperties.filter(p => {
    const isMock = MOCK_PROPERTY_TITLES.includes(p.title);
    return !isMock;
  });
  
  const mockProperties = filteredProperties.filter(p => MOCK_PROPERTY_TITLES.includes(p.title));

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
          >
            <Link href="/buscar-imoveis">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-orange-600 mb-4">
                <ArrowLeft size={18} className="mr-2" />
                Voltar para Busca
              </Button>
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  Gerenciar Imóveis
                </h1>
                <p className="text-orange-100 text-lg">
                  Gerencie seus anúncios de imóveis
                </p>
              </div>
              <Link href="/anunciar-imovel">
                <Button className="bg-white text-orange-500 hover:bg-orange-50">
                  <Plus size={18} className="mr-2" />
                  Novo Anúncio
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-b">
        <div className="max-w-7xl mx-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              placeholder="Buscar meus imóveis..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </section>

      {/* Properties List */}
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
          ) : filteredProperties.length > 0 ? (
            <>
              <div className="mb-6 space-y-2">
                {editableProperties.length > 0 && (
                  <p className="text-gray-600">
                    Você tem <span className="font-semibold text-orange-500">{editableProperties.length}</span> imóvel(is) que pode editar/excluir
                  </p>
                )}
                {mockProperties.length > 0 && (
                  <p className="text-sm text-gray-500">
                    {mockProperties.length} imóvel(is) de exemplo (não podem ser editados). Crie um novo anúncio de imóvel para poder excluir ou editar.
                  </p>
                )}
              </div>

              {/* Todos os imóveis em uma única grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {/* Imóveis Editáveis */}
                {editableProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col"
                  >
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
                  </motion.div>
                ))}

                {/* Imóveis Mockados (sem botões) */}
                {mockProperties.map((property) => (
                  <motion.div
                    key={property.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative opacity-75"
                  >
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
                    <div className="absolute top-4 left-4 bg-gray-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Exemplo
                    </div>
                  </motion.div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20">
              <Home size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-2xl font-bold text-gray-700 mb-2">
                {searchTerm ? 'Nenhum imóvel encontrado' : 'Nenhum imóvel anunciado ainda'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchTerm 
                  ? 'Tente ajustar o termo de busca'
                  : 'Comece anunciando seu primeiro imóvel'
                }
              </p>
              {!searchTerm && (
                <Link href="/anunciar-imovel">
                  <Button className="bg-orange-500 hover:bg-orange-600">
                    <Plus size={18} className="mr-2" />
                    Anunciar Primeiro Imóvel
                  </Button>
                </Link>
              )}
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

