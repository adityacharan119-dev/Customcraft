import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../data/products';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { CustomizationData, useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingCart, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'motion/react';

interface TShirtCustomizerProps {
  product: Product;
  onBack: () => void;
}

export function TShirtCustomizer({ product, onBack }: TShirtCustomizerProps) {
  const { addToCart } = useCart();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [customization, setCustomization] = useState<CustomizationData>({
    color: product.customizationOptions.colors?.[0] || '#FFFFFF',
    size: product.customizationOptions.sizes?.[2] || 'M',
    text: 'Your Text Here',
    font: product.customizationOptions.fonts?.[0] || 'Arial',
    fontSize: 48,
    textPosition: { x: 250, y: 250 },
  });

  useEffect(() => {
    drawCanvas();
  }, [customization]);

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw t-shirt background
    ctx.fillStyle = customization.color || '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw a simple t-shirt outline
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Body
    ctx.moveTo(100, 100);
    ctx.lineTo(100, 400);
    ctx.lineTo(400, 400);
    ctx.lineTo(400, 100);
    // Neck
    ctx.moveTo(200, 100);
    ctx.lineTo(200, 50);
    ctx.lineTo(300, 50);
    ctx.lineTo(300, 100);
    // Sleeves
    ctx.moveTo(100, 100);
    ctx.lineTo(50, 150);
    ctx.lineTo(50, 200);
    ctx.lineTo(100, 200);
    ctx.moveTo(400, 100);
    ctx.lineTo(450, 150);
    ctx.lineTo(450, 200);
    ctx.lineTo(400, 200);
    ctx.stroke();

    // Draw text
    if (customization.text) {
      ctx.font = `${customization.fontSize}px ${customization.font}`;
      ctx.fillStyle = customization.color === '#FFFFFF' ? '#000000' : '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(
        customization.text,
        customization.textPosition?.x || 250,
        customization.textPosition?.y || 250
      );
    }
  };

  const handleAddToCart = () => {
    const canvas = canvasRef.current;
    const thumbnail = canvas?.toDataURL('image/png');
    
    addToCart({
      productId: product.id,
      productName: product.name,
      productType: product.type,
      basePrice: product.basePrice,
      quantity: 1,
      customization,
      thumbnail,
    });

    toast.success('Added to cart!', {
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <Button variant="ghost" onClick={onBack} className="mb-6 hover:bg-purple-100">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Products
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >
            <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-purple-100">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h3 className="font-semibold text-lg">Live Preview</h3>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 md:p-8 flex items-center justify-center">
                <canvas
                  ref={canvasRef}
                  width={500}
                  height={500}
                  className="max-w-full h-auto border-2 border-gray-300 rounded-lg shadow-md"
                />
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100">
              <h2 className="text-2xl md:text-3xl mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                {product.name}
              </h2>
              <p className="text-2xl md:text-3xl text-purple-600 font-bold">
                ${product.basePrice.toFixed(2)}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border-2 border-purple-100 space-y-5">
              {product.customizationOptions.allowText && (
                <div>
                  <Label htmlFor="text" className="text-base font-semibold">Custom Text</Label>
                  <Input
                    id="text"
                    value={customization.text}
                    onChange={(e) =>
                      setCustomization({ ...customization, text: e.target.value })
                    }
                    placeholder="Enter your text"
                    className="mt-2 border-2 focus:border-purple-400"
                  />
                </div>
              )}

              {product.customizationOptions.fonts && product.customizationOptions.allowText && (
                <div>
                  <Label htmlFor="font" className="text-base font-semibold">Font Style</Label>
                  <Select
                    value={customization.font}
                    onValueChange={(value) =>
                      setCustomization({ ...customization, font: value })
                    }
                  >
                    <SelectTrigger id="font" className="mt-2 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.customizationOptions.fonts?.map((font) => (
                        <SelectItem key={font} value={font}>
                          <span style={{ fontFamily: font }}>{font}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {product.customizationOptions.allowText && (
                <div>
                  <Label htmlFor="fontSize" className="text-base font-semibold">
                    Text Size: <span className="text-purple-600">{customization.fontSize}px</span>
                  </Label>
                  <Slider
                    id="fontSize"
                    min={24}
                    max={72}
                    step={4}
                    value={[customization.fontSize || 48]}
                    onValueChange={(value) =>
                      setCustomization({ ...customization, fontSize: value[0] })
                    }
                    className="mt-3"
                  />
                </div>
              )}

              {product.customizationOptions.colors && (
                <div>
                  <Label htmlFor="color" className="text-base font-semibold">
                    {product.type === 'tshirt' || product.type === 'hoodie' ? 'Product Color' : 'Color'}
                  </Label>
                  <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mt-3">
                    {product.customizationOptions.colors?.map((color) => (
                      <button
                        key={color}
                        onClick={() => setCustomization({ ...customization, color })}
                        className={`aspect-square rounded-xl border-3 transition-all hover:scale-110 ${
                          customization.color === color
                            ? 'border-purple-600 scale-110 shadow-lg'
                            : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {product.customizationOptions.sizes && (
                <div>
                  <Label htmlFor="size" className="text-base font-semibold">Size</Label>
                  <Select
                    value={customization.size}
                    onValueChange={(value) =>
                      setCustomization({ ...customization, size: value })
                    }
                  >
                    <SelectTrigger id="size" className="mt-2 border-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {product.customizationOptions.sizes?.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white shadow-lg"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart - ${product.basePrice.toFixed(2)}
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}