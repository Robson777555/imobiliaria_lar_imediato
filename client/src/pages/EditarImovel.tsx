import { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, CheckCircle2, X, Upload } from 'lucide-react';
import { Link, useRoute, useLocation } from 'wouter';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { trpc } from '@/lib/trpc';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from 'sonner';

const propertySchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(255, 'Título muito longo'),
  price: z.number().min(0, 'Preço deve ser positivo'),
  neighborhood: z.string().optional(),
  address: z.string().optional(),
  type: z.enum(['Apartamento', 'Casa', 'Studio', 'Sobrado', 'Penthouse', 'Terreno', 'Comercial'], {
    message: 'Tipo de imóvel é obrigatório',
  }),
  bedrooms: z.number().min(0),
  bathrooms: z.number().min(0),
  garages: z.number().min(0),
  area: z.number().min(1, 'Área deve ser maior que 0'),
  description: z.string().optional(),
  image: z.string().refine(
    (val) => !val || val === "" || val.startsWith("http") || val.startsWith("data:image"),
    { message: "Imagem deve ser uma URL válida ou uma imagem em base64" }
  ).optional().or(z.literal('')),
  available: z.boolean(),
  featured: z.boolean(),
});

type PropertyFormData = z.infer<typeof propertySchema>;

export default function EditarImovel() {
  const [, params] = useRoute('/editar-imovel/:id');
  const [, setLocation] = useLocation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const propertyId = params?.id ? parseInt(params.id) : 0;

  const { data: property, isLoading } = trpc.properties.getById.useQuery(
    { id: propertyId },
    { enabled: !!propertyId }
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm<PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      bedrooms: 0,
      bathrooms: 0,
      garages: 0,
      available: true,
      featured: false,
    },
  });

  useEffect(() => {
    if (property) {
      const imageValue = property.image || '';
      reset({
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
        image: imageValue,
        available: property.available === 'true',
        featured: property.featured === 'true',
      });
      if (imageValue) {
        setImagePreview(imageValue);
      }
    }
  }, [property, reset]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Por favor, selecione um arquivo de imagem válido');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        toast.error('A imagem deve ter no máximo 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setValue('image', base64String);
        setImagePreview(base64String);
      };
      reader.onerror = () => {
        toast.error('Erro ao ler o arquivo');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setValue('image', '');
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const updateProperty = trpc.properties.update.useMutation({
    onSuccess: () => {
      toast.success('Imóvel atualizado com sucesso!');
      setLocation('/gerenciar-imoveis');
    },
    onError: (error) => {
      toast.error(error.message || 'Erro ao atualizar imóvel');
      setIsSubmitting(false);
    },
  });

  const onSubmit = async (data: PropertyFormData) => {
    setIsSubmitting(true);
    try {
      await updateProperty.mutateAsync({
        id: propertyId,
        ...data,
        image: data.image || undefined,
      });
    } catch (error) {
    } finally {
      setIsSubmitting(false);
    }
  };

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
          <X size={64} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Imóvel não encontrado</h2>
          <Link href="/gerenciar-imoveis">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (property.id <= 6) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <X size={64} className="mx-auto text-orange-500 mb-4" />
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Imóvel não pode ser editado</h2>
          <p className="text-gray-600 mb-4">Imóveis mockados não podem ser editados.</p>
          <Link href="/gerenciar-imoveis">
            <Button variant="outline">Voltar</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-orange-500 to-orange-600">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link href="/gerenciar-imoveis">
              <Button variant="ghost" className="text-white hover:text-white hover:bg-orange-600 mb-4">
                <ArrowLeft size={18} className="mr-2" />
                Voltar para Gerenciar
              </Button>
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Editar Imóvel
            </h1>
            <p className="text-orange-100 text-lg max-w-2xl">
              Atualize as informações do seu imóvel
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Home size={24} />
                Informações do Imóvel
              </CardTitle>
              <CardDescription>
                Atualize os campos que deseja modificar
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit, (errors) => {
                const missingFields: string[] = [];
                if (errors.title) missingFields.push('Título');
                if (errors.type) missingFields.push('Tipo de imóvel');
                if (errors.price) missingFields.push('Preço');
                if (errors.area) missingFields.push('Área');
                
                if (missingFields.length > 0) {
                  toast.error(`Por favor, preencha os campos obrigatórios: ${missingFields.join(', ')}`);
                }
              })} className="space-y-6">
                {Object.keys(errors).length > 0 && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      <strong>Por favor, preencha todos os campos obrigatórios:</strong>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        {errors.title && <li>Título do anúncio</li>}
                        {errors.type && <li>Tipo de imóvel</li>}
                        {errors.price && <li>Preço</li>}
                        {errors.area && <li>Área (m²)</li>}
                      </ul>
                    </AlertDescription>
                  </Alert>
                )}

                <div>
                  <Label htmlFor="title">
                    Título do Anúncio <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register('title')}
                    placeholder="Ex: Apartamento moderno no centro"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="type">
                      Tipo de Imóvel <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={watch('type')}
                      onValueChange={(value) => setValue('type', value as any)}
                    >
                      <SelectTrigger id="type" className={errors.type ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Apartamento">Apartamento</SelectItem>
                        <SelectItem value="Casa">Casa</SelectItem>
                        <SelectItem value="Studio">Studio</SelectItem>
                        <SelectItem value="Sobrado">Sobrado</SelectItem>
                        <SelectItem value="Penthouse">Penthouse</SelectItem>
                        <SelectItem value="Terreno">Terreno</SelectItem>
                        <SelectItem value="Comercial">Comercial</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.type && (
                      <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="price">
                      Preço (R$) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="price"
                      type="number"
                      {...register('price', { valueAsNumber: true })}
                      placeholder="Ex: 450000"
                      className={errors.price ? 'border-red-500' : ''}
                    />
                    {errors.price && (
                      <p className="text-sm text-red-500 mt-1">{errors.price.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Bairro</Label>
                    <Input
                      id="neighborhood"
                      {...register('neighborhood')}
                      placeholder="Ex: Centro, Vila Mariana..."
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Endereço</Label>
                    <Input
                      id="address"
                      {...register('address')}
                      placeholder="Ex: Rua das Flores, 123"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Quartos</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      min="0"
                      {...register('bedrooms', { valueAsNumber: true })}
                      defaultValue={0}
                    />
                  </div>

                  <div>
                    <Label htmlFor="bathrooms">Banheiros</Label>
                    <Input
                      id="bathrooms"
                      type="number"
                      min="0"
                      {...register('bathrooms', { valueAsNumber: true })}
                      defaultValue={0}
                    />
                  </div>

                  <div>
                    <Label htmlFor="garages">Vagas</Label>
                    <Input
                      id="garages"
                      type="number"
                      min="0"
                      {...register('garages', { valueAsNumber: true })}
                      defaultValue={0}
                    />
                  </div>

                  <div>
                    <Label htmlFor="area">
                      Área (m²) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="area"
                      type="number"
                      min="1"
                      {...register('area', { valueAsNumber: true })}
                      placeholder="Ex: 95"
                      className={errors.area ? 'border-red-500' : ''}
                    />
                    {errors.area && (
                      <p className="text-sm text-red-500 mt-1">{errors.area.message}</p>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    {...register('description')}
                    placeholder="Descreva o imóvel, suas características, localização, etc..."
                    rows={5}
                  />
                </div>

                <div>
                  <Label htmlFor="image">Imagem do Imóvel</Label>
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <Input
                        id="image"
                        {...register('image', {
                          onChange: (e) => {
                            const url = e.target.value;
                            if (url && url.startsWith('http')) {
                              setImagePreview(url);
                            } else if (url && url.startsWith('data:image')) {
                              setImagePreview(url);
                            } else if (!url) {
                              setImagePreview(null);
                            }
                          }
                        })}
                        placeholder="https://exemplo.com/imagem.png"
                        type="text"
                        className={errors.image ? 'border-red-500' : ''}
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">ou</span>
                      </div>
                    </div>

                    <div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        id="file-upload"
                      />
                      <label htmlFor="file-upload" className="cursor-pointer">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload size={18} className="mr-2" />
                          Enviar imagem do computador
                        </Button>
                      </label>
                    </div>

                    {imagePreview && (
                      <div className="relative mt-3">
                        <div className="relative inline-block">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="max-w-full h-auto max-h-64 rounded-lg border border-gray-300"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X size={16} />
                          </Button>
                        </div>
                      </div>
                    )}

                    {errors.image && (
                      <p className="text-sm text-red-500 mt-1">{errors.image.message}</p>
                    )}
                    <p className="text-sm text-gray-500 mt-1">
                      Cole a URL de uma imagem ou envie uma imagem do seu computador (máx. 5MB)
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="available">Disponível para venda/aluguel</Label>
                      <p className="text-sm text-gray-500">
                        Marque se o imóvel está disponível
                      </p>
                    </div>
                    <Switch
                      id="available"
                      checked={watch('available')}
                      onCheckedChange={(checked) => setValue('available', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="featured">Destaque</Label>
                      <p className="text-sm text-gray-500">
                        Marque para destacar este imóvel
                      </p>
                    </div>
                    <Switch
                      id="featured"
                      checked={watch('featured')}
                      onCheckedChange={(checked) => setValue('featured', checked)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-orange-500 hover:bg-orange-600"
                    size="lg"
                  >
                    {isSubmitting ? (
                      'Salvando...'
                    ) : (
                      <>
                        <CheckCircle2 size={18} className="mr-2" />
                        Salvar Alterações
                      </>
                    )}
                  </Button>
                  <Link href="/gerenciar-imoveis">
                    <Button type="button" variant="outline" size="lg">
                      Cancelar
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}

