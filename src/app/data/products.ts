export interface Product {
  id: string;
  name: string;
  type: 'tshirt' | 'pillow' | 'chain' | 'mug' | 'phone-case' | 'hoodie' | 'ring' | 'necklace' | 'photo-frame' | 'pet-collar' | 'pet-bowl' | 'blanket' | 'wall-art' | 'cap' | 'water-bottle';
  basePrice: number;
  image: string;
  description: string;
  category: 'apparel' | 'jewelry' | 'home-decor' | 'pet-accessories' | 'drinkware';
  customizationOptions: {
    colors?: string[];
    sizes?: string[];
    fonts?: string[];
    allowText?: boolean;
    allowImage?: boolean;
    allowEngraving?: boolean;
  };
}

export const products: Product[] = [
  // Apparel
  {
    id: 't1',
    name: 'Premium Cotton T-Shirt',
    type: 'tshirt',
    category: 'apparel',
    basePrice: 29.99,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&h=800&fit=crop',
    description: 'Soft premium cotton t-shirt with custom designs, perfect for events, branding, or personal style',
    customizationOptions: {
      colors: ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#FFD93D', '#95E1D3', '#6C5CE7', '#FDA7DF'],
      sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      fonts: ['Arial', 'Times New Roman', 'Georgia', 'Courier New', 'Impact', 'Comic Sans MS', 'Helvetica', 'Verdana'],
      allowText: true,
      allowImage: true,
    },
  },
  {
    id: 'h1',
    name: 'Premium Hoodie',
    type: 'hoodie',
    category: 'apparel',
    basePrice: 59.99,
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&h=800&fit=crop',
    description: 'Ultra-soft fleece hoodie with custom printing, ideal for teams, brands, or gifts',
    customizationOptions: {
      colors: ['#000000', '#1a1a1a', '#4A5568', '#2C5282', '#742A2A', '#2F855A', '#6B46C1'],
      sizes: ['S', 'M', 'L', 'XL', 'XXL', '3XL'],
      fonts: ['Arial', 'Impact', 'Georgia', 'Courier New', 'Helvetica', 'Verdana'],
      allowText: true,
      allowImage: true,
    },
  },
  {
    id: 'cap1',
    name: 'Custom Baseball Cap',
    type: 'cap',
    category: 'apparel',
    basePrice: 24.99,
    image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&h=800&fit=crop',
    description: 'Classic baseball cap with embroidered or printed custom designs',
    customizationOptions: {
      colors: ['#000000', '#FFFFFF', '#FF0000', '#0000FF', '#00FF00', '#FFD700', '#FF1493'],
      fonts: ['Arial', 'Impact', 'Georgia', 'Helvetica'],
      allowText: true,
      allowImage: true,
    },
  },

  // Jewelry
  {
    id: 'c1',
    name: 'Engraved Name Chain',
    type: 'chain',
    category: 'jewelry',
    basePrice: 49.99,
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&h=800&fit=crop',
    description: 'Premium chain necklace with personalized name engraving in your choice of metal',
    customizationOptions: {
      fonts: ['Script', 'Block', 'Cursive', 'Modern', 'Gothic'],
      allowEngraving: true,
      colors: ['#FFD700', '#C0C0C0', '#CD7F32', '#E5E4E2'],
    },
  },
  {
    id: 'n1',
    name: 'Custom Pendant Necklace',
    type: 'necklace',
    category: 'jewelry',
    basePrice: 44.99,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
    description: 'Elegant necklace with customizable pendant design and engraving',
    customizationOptions: {
      fonts: ['Script', 'Block', 'Cursive', 'Modern'],
      allowEngraving: true,
      colors: ['#FFD700', '#C0C0C0', '#CD7F32'],
    },
  },
  {
    id: 'r1',
    name: 'Personalized Ring',
    type: 'ring',
    category: 'jewelry',
    basePrice: 39.99,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&h=800&fit=crop',
    description: 'Sterling silver ring with custom engraving inside or outside',
    customizationOptions: {
      fonts: ['Script', 'Block', 'Modern'],
      allowEngraving: true,
      colors: ['#C0C0C0', '#FFD700', '#CD7F32'],
      sizes: ['5', '6', '7', '8', '9', '10', '11', '12'],
    },
  },

  // Home Decor
  {
    id: 'p1',
    name: 'Custom Photo Pillow',
    type: 'pillow',
    category: 'home-decor',
    basePrice: 34.99,
    image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=800&h=800&fit=crop',
    description: 'Soft decorative pillow with your favorite photos or designs',
    customizationOptions: {
      sizes: ['14x14', '16x16', '18x18', '20x20'],
      allowImage: true,
      allowText: true,
      fonts: ['Arial', 'Georgia', 'Impact'],
    },
  },
  {
    id: 'pf1',
    name: 'Engraved Photo Frame',
    type: 'photo-frame',
    category: 'home-decor',
    basePrice: 29.99,
    image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&h=800&fit=crop',
    description: 'Wooden photo frame with custom engraving for special memories',
    customizationOptions: {
      fonts: ['Script', 'Georgia', 'Times New Roman'],
      allowEngraving: true,
      sizes: ['4x6', '5x7', '8x10', '11x14'],
      colors: ['#8B4513', '#000000', '#FFFFFF', '#C0C0C0'],
    },
  },
  {
    id: 'bl1',
    name: 'Personalized Blanket',
    type: 'blanket',
    category: 'home-decor',
    basePrice: 69.99,
    image: 'https://images.unsplash.com/photo-1617906050149-3e6441a55db3?w=800&h=800&fit=crop',
    description: 'Cozy fleece blanket with custom photos, text, or patterns',
    customizationOptions: {
      sizes: ['50x60', '60x80', '80x90'],
      allowImage: true,
      allowText: true,
      fonts: ['Arial', 'Georgia', 'Script'],
    },
  },
  {
    id: 'wa1',
    name: 'Custom Wall Art',
    type: 'wall-art',
    category: 'home-decor',
    basePrice: 79.99,
    image: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800&h=800&fit=crop',
    description: 'Premium canvas wall art with your custom photos or designs',
    customizationOptions: {
      sizes: ['12x16', '16x20', '20x24', '24x36'],
      allowImage: true,
      allowText: true,
      fonts: ['Arial', 'Georgia', 'Impact', 'Script'],
    },
  },

  // Pet Accessories
  {
    id: 'pc1',
    name: 'Personalized Pet Collar',
    type: 'pet-collar',
    category: 'pet-accessories',
    basePrice: 19.99,
    image: 'https://images.unsplash.com/photo-1612536572253-c517edd6f50c?w=800&h=800&fit=crop',
    description: 'Durable pet collar with custom name tag and fun designs',
    customizationOptions: {
      colors: ['#FF6B6B', '#4ECDC4', '#FFD93D', '#FF1493', '#00FF00', '#0000FF'],
      sizes: ['Small', 'Medium', 'Large'],
      fonts: ['Arial', 'Impact', 'Comic Sans MS'],
      allowText: true,
      allowEngraving: true,
    },
  },
  {
    id: 'pb1',
    name: 'Custom Pet Bowl',
    type: 'pet-bowl',
    category: 'pet-accessories',
    basePrice: 24.99,
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800&h=800&fit=crop',
    description: 'Stainless steel pet bowl with personalized name and designs',
    customizationOptions: {
      colors: ['#C0C0C0', '#FFD700', '#FF6B6B', '#4ECDC4'],
      sizes: ['Small', 'Medium', 'Large'],
      fonts: ['Arial', 'Impact', 'Georgia'],
      allowText: true,
    },
  },

  // Drinkware
  {
    id: 'm1',
    name: 'Custom Ceramic Mug',
    type: 'mug',
    category: 'drinkware',
    basePrice: 19.99,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop',
    description: 'Premium ceramic mug with full-color custom designs and text',
    customizationOptions: {
      colors: ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#FFD93D'],
      allowText: true,
      allowImage: true,
      fonts: ['Arial', 'Georgia', 'Impact', 'Comic Sans MS'],
    },
  },
  {
    id: 'wb1',
    name: 'Insulated Water Bottle',
    type: 'water-bottle',
    category: 'drinkware',
    basePrice: 34.99,
    image: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&h=800&fit=crop',
    description: 'Double-walled stainless steel water bottle with custom designs',
    customizationOptions: {
      colors: ['#000000', '#FFFFFF', '#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7'],
      sizes: ['16oz', '24oz', '32oz'],
      allowText: true,
      allowImage: true,
      fonts: ['Arial', 'Impact', 'Georgia'],
    },
  },

  // Other
  {
    id: 'phc1',
    name: 'Premium Phone Case',
    type: 'phone-case',
    category: 'drinkware',
    basePrice: 29.99,
    image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=800&h=800&fit=crop',
    description: 'Durable phone case with high-quality custom photo or design printing',
    customizationOptions: {
      allowImage: true,
      allowText: true,
      fonts: ['Arial', 'Impact', 'Georgia', 'Script'],
    },
  },
];

export const categories = [
  { id: 'all', name: 'All Products', icon: '🎨' },
  { id: 'apparel', name: 'Apparel', icon: '👕' },
  { id: 'jewelry', name: 'Jewelry', icon: '💍' },
  { id: 'home-decor', name: 'Home Decor', icon: '🏠' },
  { id: 'pet-accessories', name: 'Pet Accessories', icon: '🐾' },
  { id: 'drinkware', name: 'Drinkware', icon: '☕' },
];
