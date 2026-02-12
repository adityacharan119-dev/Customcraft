import React from 'react';
import AIBot from './AIBot';
import { CartProvider } from '@/app/contexts/CartContext';

/**
 * Example: How to integrate AIBot into your pages
 * 
 * The AIBot component can be added to any page/component where you want
 * customers to get design suggestions and create custom designs.
 */

// Option 1: Add AIBot as a floating button to all pages
export function AppWithAIBot() {
  return (
    <CartProvider>
      <div>
        {/* Your app content */}
        
        {/* Add AIBot as floating widget */}
        <AIBot 
          productType="tshirt"
          onDesignSuggestion={(design) => {
            console.log('User received design suggestion:', design);
            // You can handle the design suggestion here
            // For example: Pre-fill the customizer with the suggested design
          }}
        />
      </div>
    </CartProvider>
  );
}

// Option 2: Add AIBot to specific product pages
export function ProductPageWithAIBot({ productType }: { productType: string }) {
  const handleDesignSuggestion = (design: any) => {
    // Pre-populate customizer with AI suggestion
    console.log('Design suggestion received:', design);
  };

  return (
    <div>
      {/* Product details and customizer */}
      <AIBot 
        productType={productType}
        onDesignSuggestion={handleDesignSuggestion}
      />
    </div>
  );
}

// Option 3: Add AIBot to checkout page for last-minute design help
export function CheckoutWithAIBot() {
  return (
    <div>
      {/* Checkout form */}
      <AIBot 
        productType="general"
        onDesignSuggestion={(design) => {
          console.log('Customer is reviewing design:', design);
        }}
      />
    </div>
  );
}

// Option 4: Standalone AIBot in a dedicated page
export function DesignAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Design Assistant</h1>
        <p className="text-gray-600 mb-8">
          Get AI-powered design suggestions and create custom designs for your products.
        </p>
        
        <AIBot 
          productType="tshirt"
          onDesignSuggestion={(design) => {
            console.log('Design created:', design);
          }}
        />
      </div>
    </div>
  );
}
