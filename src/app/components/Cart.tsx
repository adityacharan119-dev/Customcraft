import React from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, CreditCard } from 'lucide-react';
import { motion } from 'motion/react';

interface CartProps {
  onBack: () => void;
  onCheckout: () => void;
}

export function Cart({ onBack, onCheckout }: CartProps) {
  const { cartItems, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <Button variant="ghost" onClick={onBack} className="mb-4 hover:bg-purple-100">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 md:py-24"
          >
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="h-12 w-12 md:h-16 md:w-16 text-purple-600" />
            </div>
            <h2 className="text-3xl md:text-4xl mb-3 text-center">Your Cart is Empty</h2>
            <p className="text-muted-foreground mb-8 text-center max-w-md">
              Discover amazing customizable products and make them uniquely yours!
            </p>
            <Button
              onClick={onBack}
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700"
            >
              Browse Products
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-purple-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          Shopping Cart
        </motion.h1>
        <p className="text-muted-foreground mb-8">{getCartCount()} items in your cart</p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-2 hover:border-purple-200 transition-colors">
                  <CardContent className="p-4 md:p-6">
                    <div className="flex gap-4">
                      {/* Thumbnail */}
                      <div className="w-20 h-20 md:w-28 md:h-28 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl overflow-hidden flex-shrink-0 border-2 border-gray-200">
                        {item.thumbnail ? (
                          <img
                            src={item.thumbnail}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <ShoppingBag className="h-8 w-8" />
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1 min-w-0 pr-2">
                            <h3 className="text-base md:text-lg truncate">{item.productName}</h3>
                            <div className="flex gap-2 flex-wrap mt-2">
                              {item.customization.color && (
                                <Badge variant="outline" className="text-xs">
                                  <div
                                    className="w-3 h-3 rounded-full mr-1 border"
                                    style={{ backgroundColor: item.customization.color }}
                                  />
                                  Color
                                </Badge>
                              )}
                              {item.customization.size && (
                                <Badge variant="outline" className="text-xs">
                                  {item.customization.size}
                                </Badge>
                              )}
                              {item.customization.font && (
                                <Badge variant="outline" className="text-xs">
                                  {item.customization.font}
                                </Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        {item.customization.text && (
                          <p className="text-sm text-muted-foreground mb-3 truncate">
                            "{item.customization.text}"
                          </p>
                        )}

                        <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="h-8 w-8 p-0"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                          </div>
                          <p className="text-lg font-semibold text-purple-600">
                            ₹{(item.basePrice * item.quantity).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="sticky top-24 border-2 border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({getCartCount()} items)</span>
                    <span className="font-medium">₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="font-medium text-green-600">₹99</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Estimated Tax</span>
                    <span className="font-medium">${(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-purple-600">
                      ${(getCartTotal() + 9.99 + getCartTotal() * 0.08).toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm">
                    <p className="text-purple-900">
                      🎉 <strong>Free shipping</strong> on orders over $75!
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex-col gap-3">
                  <Button
                    onClick={onCheckout}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                    size="lg"
                  >
                    <CreditCard className="mr-2 h-5 w-5" />
                    Proceed to Checkout
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onBack}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}