import React from 'react';
import { Product } from '../data/products';
import { TShirtCustomizer } from './TShirtCustomizer';
import { PillowCustomizer } from './PillowCustomizer';
import { ChainCustomizer } from './ChainCustomizer';

interface UniversalCustomizerProps {
  product: Product;
  onBack: () => void;
}

export function UniversalCustomizer({ product, onBack }: UniversalCustomizerProps) {
  // Route to appropriate customizer based on product type
  
  // Text + Color + Size based products (use TShirtCustomizer)
  if (
    product.type === 'tshirt' ||
    product.type === 'hoodie' ||
    product.type === 'mug' ||
    product.type === 'cap' ||
    product.type === 'water-bottle' ||
    product.type === 'pet-collar' ||
    product.type === 'pet-bowl'
  ) {
    return <TShirtCustomizer product={product} onBack={onBack} />;
  }
  
  // Image upload based products (use PillowCustomizer)
  if (
    product.type === 'pillow' ||
    product.type === 'phone-case' ||
    product.type === 'blanket' ||
    product.type === 'wall-art' ||
    product.type === 'photo-frame'
  ) {
    return <PillowCustomizer product={product} onBack={onBack} />;
  }
  
  // Engraving based products (use ChainCustomizer)
  if (
    product.type === 'chain' ||
    product.type === 'necklace' ||
    product.type === 'ring'
  ) {
    return <ChainCustomizer product={product} onBack={onBack} />;
  }
  
  // Default fallback
  return <TShirtCustomizer product={product} onBack={onBack} />;
}
