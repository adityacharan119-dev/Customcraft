import React, { useState } from 'react';
import { CartProvider } from './contexts/CartContext';
import { Header } from './components/Header';
import { ProductCatalog } from './components/ProductCatalog';
import { UniversalCustomizer } from './components/UniversalCustomizer';
import { Cart } from './components/Cart';
import { Checkout } from './components/Checkout';
import { Product } from './data/products';
import { Toaster } from './components/ui/sonner';
import { motion } from 'motion/react';
import { Instagram, Facebook, Twitter, Mail, Heart } from 'lucide-react';

type View = 'catalog' | 'customizer' | 'cart' | 'checkout';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('catalog');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('customizer');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCatalog = () => {
    setCurrentView('catalog');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewCart = () => {
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckout = () => {
    setCurrentView('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToCart = () => {
    setCurrentView('cart');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnHome = () => {
    setCurrentView('catalog');
    setSelectedProduct(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-background">
        <Header onViewCart={handleViewCart} onNavigateHome={handleReturnHome} />
        
        <main className="min-h-[calc(100vh-4rem)]">
          {currentView === 'catalog' && (
            <ProductCatalog onSelectProduct={handleSelectProduct} />
          )}

          {currentView === 'customizer' && selectedProduct && (
            <UniversalCustomizer
              product={selectedProduct}
              onBack={handleBackToCatalog}
            />
          )}

          {currentView === 'cart' && (
            <Cart onBack={handleBackToCatalog} onCheckout={handleCheckout} />
          )}

          {currentView === 'checkout' && (
            <Checkout onBack={handleBackToCart} onReturnHome={handleReturnHome} />
          )}
        </main>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="border-t bg-gradient-to-b from-white to-purple-50 mt-12"
        >
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  About CustomCraft
                </h3>
                <p className="text-sm text-muted-foreground">
                  Create personalized products with our premium customization tools.
                  High quality materials, professional printing, and fast shipping.
                </p>
                <div className="flex gap-3 mt-4">
                  <a
                    href="#"
                    className="w-9 h-9 bg-purple-100 hover:bg-purple-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Instagram className="h-4 w-4 text-purple-600" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-blue-100 hover:bg-blue-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Facebook className="h-4 w-4 text-blue-600" />
                  </a>
                  <a
                    href="#"
                    className="w-9 h-9 bg-sky-100 hover:bg-sky-200 rounded-full flex items-center justify-center transition-colors"
                  >
                    <Twitter className="h-4 w-4 text-sky-600" />
                  </a>
                </div>
              </div>

              <div>
                <h3 className="text-lg mb-4">Shop Categories</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Apparel</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Jewelry</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Home Decor</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Pet Accessories</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Drinkware</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg mb-4">Customer Service</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">FAQ</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Shipping & Returns</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Order Tracking</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Size Guide</li>
                  <li className="hover:text-purple-600 cursor-pointer transition-colors">Contact Us</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg mb-4">Newsletter</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  Subscribe for exclusive offers and updates!
                </p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Your email"
                    className="flex-1 px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all">
                    <Mail className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground text-center sm:text-left">
                &copy; 2026 CustomCraft. All rights reserved.
              </p>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <span>Made with</span>
                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                <span>for creators</span>
              </div>
            </div>
          </div>
        </motion.footer>

        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: 'white',
              border: '1px solid #e5e7eb',
            },
          }}
        />
      </div>
    </CartProvider>
  );
}
