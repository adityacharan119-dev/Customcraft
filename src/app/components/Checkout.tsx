import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Separator } from './ui/separator';
import { ArrowLeft, CheckCircle2, CreditCard, Lock, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface CheckoutProps {
  onBack: () => void;
  onReturnHome: () => void;
}

export function Checkout({ onBack, onReturnHome }: CheckoutProps) {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [orderId, setOrderId] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    verificationCode: '',
    enteredCode: '',
  });

  const [showVerification, setShowVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.email || !formData.address) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!showVerification) {
      // Send verification code
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setVerificationCode(code);
      setShowVerification(true);
      
      // In a real app, this would send the code via email
      toast.success(`Verification code sent to ${formData.email}`);
      console.log(`Verification code: ${code}`); // For demo purposes
      return;
    }

    // Verify code
    if (formData.enteredCode !== verificationCode) {
      toast.error('Invalid verification code');
      return;
    }

    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const newOrderId = 'CC-' + Date.now().toString().slice(-8);
      setOrderId(newOrderId);
      setIsProcessing(false);
      setOrderComplete(true);
      clearCart();
      toast.success('Order placed successfully!');
    }, 2500);
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="text-center border-2 border-purple-200 shadow-xl">
                <CardContent className="pt-12 pb-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                  >
                    <CheckCircle2 className="h-12 w-12 md:h-16 md:w-16 text-white" />
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl mb-3 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                    Order Confirmed!
                  </h2>
                  <p className="text-xl text-muted-foreground mb-6">
                    Thank you for your order
                  </p>
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6 border-2 border-purple-200">
                    <p className="text-sm text-muted-foreground mb-2">Order Number</p>
                    <p className="text-2xl md:text-3xl font-bold text-purple-600">{orderId}</p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <Truck className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-blue-900">Estimated Delivery</p>
                        <p className="text-sm text-blue-700">5-7 business days</p>
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    A confirmation email has been sent to
                  </p>
                  <p className="text-sm font-medium text-purple-600 mb-8">{formData.email}</p>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground px-4">
                      Your custom products will be carefully crafted with attention to every detail.
                    </p>
                    <Button
                      onClick={onReturnHome}
                      size="lg"
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                    >
                      Continue Shopping
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-purple-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cart
        </Button>

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
        >
          Secure Checkout
        </motion.h1>
        <p className="text-muted-foreground mb-8 flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Your information is protected with SSL encryption
        </p>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Shipping Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border-2 border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <Truck className="h-5 w-5" />
                      Shipping Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div>
                      <Label htmlFor="name" className="text-base">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="John Doe"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email" className="text-base">Email *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="john@example.com"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone" className="text-base">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="mt-1"
                          placeholder="(555) 123-4567"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="address" className="text-base">Street Address *</Label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        className="mt-1"
                        placeholder="123 Main Street"
                      />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-base">City *</Label>
                        <Input
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="New York"
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-base">State *</Label>
                        <Input
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="NY"
                        />
                      </div>
                      <div>
                        <Label htmlFor="zip" className="text-base">ZIP Code *</Label>
                        <Input
                          id="zip"
                          name="zip"
                          value={formData.zip}
                          onChange={handleInputChange}
                          required
                          className="mt-1"
                          placeholder="10001"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Payment Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-2 border-purple-200">
                  <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5" />
                      Payment Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-6">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-4">
                        Scan the QR code below to complete your payment
                      </p>
                      <div className="bg-white border-2 border-gray-200 rounded-lg p-4 inline-block">
                        {/* QR Code placeholder - in a real app, this would be generated */}
                        <div className="w-48 h-48 bg-gradient-to-br from-purple-100 to-blue-100 rounded flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-32 h-32 bg-white border-2 border-purple-200 rounded-lg mx-auto mb-2 flex items-center justify-center">
                              <span className="text-xs text-purple-600 font-mono">
                                QR CODE<br/>PAYMENT
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">Scan to Pay</p>
                            <p className="text-xs text-gray-500 mt-1">₹{getCartTotal().toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mt-4">
                        Supports UPI, Paytm, Google Pay, PhonePe, and all major payment apps
                      </p>
                    </div>
                    
                    {showVerification && (
                      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <Label htmlFor="enteredCode" className="text-base text-blue-900">Enter Verification Code</Label>
                        <p className="text-sm text-blue-700 mb-2">
                          We've sent a 6-digit code to {formData.email}
                        </p>
                        <Input
                          id="enteredCode"
                          name="enteredCode"
                          value={formData.enteredCode}
                          onChange={handleInputChange}
                          placeholder="Enter 6-digit code"
                          className="mt-1"
                          maxLength={6}
                        />
                      </div>
                    )}
                    
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 text-sm flex items-start gap-2">
                      <Lock className="h-4 w-4 text-purple-600 mt-0.5 flex-shrink-0" />
                      <p className="text-purple-900">
                        Your payment is processed securely through encrypted channels
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-md"
                  size="lg"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                      Processing...
                    </>
                  ) : showVerification ? (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Confirm Order
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-5 w-5" />
                      Send Verification Code
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="sticky top-24 border-2 border-purple-200 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="space-y-3 max-h-[200px] overflow-y-auto">
                    {cartItems.map((item) => (
                      <div key={item.id} className="flex justify-between text-sm gap-2">
                        <span className="truncate">
                          {item.productName} x {item.quantity}
                        </span>
                        <span className="font-medium whitespace-nowrap">
                          ₹{(item.basePrice * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <Separator />
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{getCartTotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span className="text-green-600">₹99</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Tax (8%)</span>
                    <span>₹{(getCartTotal() * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-purple-600">
                      ₹{(getCartTotal() + 99 + getCartTotal() * 0.08).toFixed(2)}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
