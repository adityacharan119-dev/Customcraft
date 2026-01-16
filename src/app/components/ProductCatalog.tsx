import React from 'react';
import { products, Product, categories } from '../data/products';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Palette, Type, Image, Zap, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

interface ProductCatalogProps {
  onSelectProduct: (product: Product) => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function ProductCatalog({ onSelectProduct, selectedCategory, onCategoryChange }: ProductCatalogProps) {

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const getCustomizationIcons = (product: Product) => {
    const icons = [];
    if (product.customizationOptions.colors) {
      icons.push(
        <div key="color" className="flex items-center gap-1 px-2 py-1 bg-purple-100 text-purple-700 rounded-md text-xs">
          <Palette className="h-3 w-3" />
          <span>Colors</span>
        </div>
      );
    }
    if (product.customizationOptions.allowText) {
      icons.push(
        <div key="text" className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded-md text-xs">
          <Type className="h-3 w-3" />
          <span>Text</span>
        </div>
      );
    }
    if (product.customizationOptions.allowImage) {
      icons.push(
        <div key="image" className="flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 rounded-md text-xs">
          <Image className="h-3 w-3" />
          <span>Image</span>
        </div>
      );
    }
    if (product.customizationOptions.allowEngraving) {
      icons.push(
        <div key="engrave" className="flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 rounded-md text-xs">
          <Zap className="h-3 w-3" />
          <span>Engrave</span>
        </div>
      );
    }
    return icons;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm mb-4">
            <Sparkles className="h-4 w-4" />
            <span>Premium Customization</span>
          </div>
          <h1 className="text-4xl md:text-6xl mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Create Something Unique
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Personalize premium products with our intuitive design tools. From apparel to jewelry, make it yours.
          </p>
        </motion.div>

        {/* Category Filter - Moved to floating component */}
        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="overflow-x-auto pb-2">
              <TabsList className="inline-flex w-auto min-w-full md:w-auto bg-white shadow-sm border">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category.id}
                    value={category.id}
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white whitespace-nowrap"
                  >
                    <span className="mr-2">{category.icon}</span>
                    {category.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
          </Tabs>
        </motion.div> */}

        {/* Products Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 h-full flex flex-col">
                <CardHeader className="p-0 relative overflow-hidden">
                  <div className="aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      loading="lazy"
                    />
                  </div>
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-white/90 backdrop-blur-sm text-purple-700 border-purple-200 shadow-md">
                      ₹{product.basePrice.toFixed(2)}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="p-4 flex-1 flex flex-col">
                  <CardTitle className="text-lg mb-2 line-clamp-1">{product.name}</CardTitle>
                  <CardDescription className="text-sm mb-3 line-clamp-2 flex-1">
                    {product.description}
                  </CardDescription>
                  
                  <div className="flex gap-1.5 flex-wrap">
                    {getCustomizationIcons(product)}
                  </div>

                  {product.customizationOptions.sizes && (
                    <div className="mt-2">
                      <Badge variant="outline" className="text-xs">
                        {product.customizationOptions.sizes.length} sizes
                      </Badge>
                    </div>
                  )}
                </CardContent>
                
                <CardFooter className="p-4 pt-0">
                  <Button
                    onClick={() => onSelectProduct(product)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                  >
                    Customize Now
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🎨</div>
            <h3 className="text-2xl mb-2">No products found</h3>
            <p className="text-muted-foreground">Try selecting a different category</p>
          </div>
        )}

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-16 mb-8"
        >
          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg mb-2">Premium Quality</h3>
              <p className="text-sm text-muted-foreground">
                High-quality materials and professional printing for lasting results
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Palette className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg mb-2">Easy Customization</h3>
              <p className="text-sm text-muted-foreground">
                Intuitive design tools with live preview for perfect results
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-purple-200 transition-colors">
            <CardContent className="pt-6 text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg mb-2">Fast Shipping</h3>
              <p className="text-sm text-muted-foreground">
                Quick production and reliable delivery to your doorstep
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
