import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../data/products';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { CustomizationData, useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ChainCustomizerProps {
  product: Product;
  onBack: () => void;
}

export function ChainCustomizer({ product, onBack }: ChainCustomizerProps) {
  const { addToCart } = useCart();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const [customization, setCustomization] = useState<CustomizationData>({
    text: 'NAME',
    font: product.customizationOptions.fonts?.[0] || 'Script',
    color: product.customizationOptions.colors?.[0] || '#FFD700',
  });

  useEffect(() => {
    drawCanvas();
  }, [customization]);

  const getFontFamily = (fontName: string) => {
    const fontMap: { [key: string]: string } = {
      'Script': 'cursive',
      'Block': 'Arial Black, sans-serif',
      'Cursive': 'Brush Script MT, cursive',
      'Modern': 'Helvetica, sans-serif',
    };
    return fontMap[fontName] || 'Arial';
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw chain links (simplified representation)
    ctx.strokeStyle = customization.color || '#FFD700';
    ctx.lineWidth = 8;
    ctx.lineCap = 'round';

    // Top chain part
    for (let i = 0; i < 5; i++) {
      const x = 100 + i * 80;
      const y = 150;
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw pendant plate
    ctx.fillStyle = customization.color || '#FFD700';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;
    
    // Rounded rectangle for pendant
    const plateX = 150;
    const plateY = 220;
    const plateWidth = 200;
    const plateHeight = 80;
    const radius = 10;

    ctx.beginPath();
    ctx.moveTo(plateX + radius, plateY);
    ctx.lineTo(plateX + plateWidth - radius, plateY);
    ctx.quadraticCurveTo(plateX + plateWidth, plateY, plateX + plateWidth, plateY + radius);
    ctx.lineTo(plateX + plateWidth, plateY + plateHeight - radius);
    ctx.quadraticCurveTo(
      plateX + plateWidth,
      plateY + plateHeight,
      plateX + plateWidth - radius,
      plateY + plateHeight
    );
    ctx.lineTo(plateX + radius, plateY + plateHeight);
    ctx.quadraticCurveTo(plateX, plateY + plateHeight, plateX, plateY + plateHeight - radius);
    ctx.lineTo(plateX, plateY + radius);
    ctx.quadraticCurveTo(plateX, plateY, plateX + radius, plateY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Add shine effect
    const gradient = ctx.createLinearGradient(plateX, plateY, plateX + plateWidth, plateY + plateHeight);
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    gradient.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.2)');
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw engraved text
    if (customization.text) {
      const fontFamily = getFontFamily(customization.font || 'Script');
      ctx.font = `bold 36px ${fontFamily}`;
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Shadow effect for engraving
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;
      
      ctx.fillText(customization.text.toUpperCase(), 250, 260);
      
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  };

  const handleAddToCart = () => {
    if (!customization.text || customization.text.trim().length === 0) {
      toast.error('Please enter a name to engrave');
      return;
    }

    if (customization.text.length > 15) {
      toast.error('Name is too long (max 15 characters)');
      return;
    }

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
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Products
      </Button>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Preview */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg p-8 flex items-center justify-center">
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="max-w-full h-auto border border-gray-300 rounded shadow-lg"
            />
          </div>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl mb-2">{product.name}</h2>
            <p className="text-2xl text-primary">${product.basePrice.toFixed(2)}</p>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="text">Name to Engrave</Label>
              <Input
                id="text"
                value={customization.text}
                onChange={(e) =>
                  setCustomization({ ...customization, text: e.target.value })
                }
                placeholder="Enter name"
                maxLength={15}
                className="mt-1 uppercase"
              />
              <p className="text-sm text-muted-foreground mt-1">
                Maximum 15 characters
              </p>
            </div>

            <div>
              <Label htmlFor="font">Engraving Font</Label>
              <Select
                value={customization.font}
                onValueChange={(value) =>
                  setCustomization({ ...customization, font: value })
                }
              >
                <SelectTrigger id="font" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.customizationOptions.fonts?.map((font) => (
                    <SelectItem key={font} value={font}>
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="color">Metal Color</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {product.customizationOptions.colors?.map((color) => {
                  const colorNames: { [key: string]: string } = {
                    '#FFD700': 'Gold',
                    '#C0C0C0': 'Silver',
                    '#CD7F32': 'Rose Gold',
                  };
                  return (
                    <button
                      key={color}
                      onClick={() => setCustomization({ ...customization, color })}
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                        customization.color === color
                          ? 'border-primary scale-105'
                          : 'border-gray-300'
                      }`}
                    >
                      <div
                        className="w-12 h-12 rounded-full mb-2"
                        style={{ backgroundColor: color }}
                      />
                      <span className="text-sm">{colorNames[color]}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="font-semibold text-amber-900 mb-2">Engraving Details</h4>
              <ul className="text-sm text-amber-800 space-y-1">
                <li>• Professional laser engraving</li>
                <li>• Permanent and fade-resistant</li>
                <li>• Processing time: 3-5 business days</li>
                <li>• Custom engraved items cannot be returned</li>
              </ul>
            </div>

            <Button onClick={handleAddToCart} className="w-full" size="lg">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
