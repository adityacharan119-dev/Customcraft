import React, { useState, useRef, useEffect } from 'react';
import { Product } from '../data/products';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Slider } from './ui/slider';
import { CustomizationData, useCart } from '../contexts/CartContext';
import { ArrowLeft, ShoppingCart, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface PillowCustomizerProps {
  product: Product;
  onBack: () => void;
}

export function PillowCustomizer({ product, onBack }: PillowCustomizerProps) {
  const { addToCart } = useCart();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [customization, setCustomization] = useState<CustomizationData>({
    size: product.customizationOptions.sizes?.[1] || '18x18',
    image: undefined,
    imagePosition: { x: 250, y: 250, scale: 1 },
  });

  const [uploadedImage, setUploadedImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    drawCanvas();
  }, [customization, uploadedImage]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setUploadedImage(img);
        setCustomization({
          ...customization,
          image: event.target?.result as string,
        });
        toast.success('Image uploaded successfully!');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw pillow background (light fabric texture simulation)
    ctx.fillStyle = '#f5f5f5';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw pillow border
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Draw stitching pattern
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(30, 30, canvas.width - 60, canvas.height - 60);
    ctx.setLineDash([]);

    // Draw uploaded image
    if (uploadedImage && customization.imagePosition) {
      const { x, y, scale } = customization.imagePosition;
      const imgWidth = uploadedImage.width * scale * 0.5;
      const imgHeight = uploadedImage.height * scale * 0.5;

      ctx.drawImage(
        uploadedImage,
        x - imgWidth / 2,
        y - imgHeight / 2,
        imgWidth,
        imgHeight
      );
    }

    // Draw placeholder if no image
    if (!uploadedImage) {
      ctx.fillStyle = '#999999';
      ctx.font = '24px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('Upload your image', canvas.width / 2, canvas.height / 2);
    }
  };

  const handleAddToCart = () => {
    if (!customization.image) {
      toast.error('Please upload an image first');
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
              <Label htmlFor="image">Upload Image</Label>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                className="w-full mt-1"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploadedImage ? 'Change Image' : 'Upload Image'}
              </Button>
              <p className="text-sm text-muted-foreground mt-1">
                Recommended: High resolution (at least 1000x1000px)
              </p>
            </div>

            {uploadedImage && (
              <div>
                <Label htmlFor="scale">Image Scale: {customization.imagePosition?.scale.toFixed(2)}</Label>
                <Slider
                  id="scale"
                  min={0.3}
                  max={2}
                  step={0.1}
                  value={[customization.imagePosition?.scale || 1]}
                  onValueChange={(value) =>
                    setCustomization({
                      ...customization,
                      imagePosition: {
                        ...customization.imagePosition!,
                        scale: value[0],
                      },
                    })
                  }
                  className="mt-2"
                />
              </div>
            )}

            <div>
              <Label htmlFor="size">Pillow Size</Label>
              <Select
                value={customization.size}
                onValueChange={(value) =>
                  setCustomization({ ...customization, size: value })
                }
              >
                <SelectTrigger id="size" className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {product.customizationOptions.sizes?.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size} inches
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">Image Guidelines</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use high-resolution images for best quality</li>
                <li>• Square images work best</li>
                <li>• Minimum recommended: 1000x1000px</li>
                <li>• Supported formats: JPG, PNG, WebP</li>
              </ul>
            </div>

            <Button
              onClick={handleAddToCart}
              className="w-full"
              size="lg"
              disabled={!uploadedImage}
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
