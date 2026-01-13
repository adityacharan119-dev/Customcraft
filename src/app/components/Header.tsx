import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { ShoppingCart, Palette, Menu, Home, Info, Mail, Package } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { motion } from 'motion/react';

interface HeaderProps {
  onViewCart: () => void;
  onNavigateHome: () => void;
}

export function Header({ onViewCart, onNavigateHome }: HeaderProps) {
  const { getCartCount } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cartCount = getCartCount();

  const menuItems = [
    { label: 'Home', icon: Home, action: onNavigateHome },
    { label: 'Products', icon: Package, action: onNavigateHome },
    { label: 'About', icon: Info, action: () => {} },
    { label: 'Contact', icon: Mail, action: () => {} },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/60 shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 md:h-20 items-center justify-between">
          {/* Logo */}
          <button
            onClick={onNavigateHome}
            className="flex items-center gap-2 group transition-all"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg blur-sm opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Palette className="h-5 w-5 md:h-6 md:w-6 text-white" />
              </div>
            </div>
            <span className="text-xl md:text-2xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              CustomCraft
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={item.action}
                className="text-sm font-medium hover:text-purple-600 transition-colors flex items-center gap-2"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </button>
            ))}

            <Button
              variant="outline"
              size="sm"
              className="relative group hover:border-purple-600 hover:text-purple-600 transition-all"
              onClick={onViewCart}
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart
              {cartCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>
          </nav>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="relative"
              onClick={onViewCart}
            >
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-purple-600 to-blue-600"
                >
                  {cartCount}
                </Badge>
              )}
            </Button>

            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col gap-4 mt-8">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                      <Palette className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      Menu
                    </span>
                  </div>

                  {menuItems.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => {
                        item.action();
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 p-4 rounded-lg hover:bg-purple-50 transition-colors text-left"
                    >
                      <item.icon className="h-5 w-5 text-purple-600" />
                      <span className="text-base">{item.label}</span>
                    </button>
                  ))}

                  <Button
                    onClick={() => {
                      onViewCart();
                      setMobileMenuOpen(false);
                    }}
                    className="mt-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    View Cart ({cartCount})
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
