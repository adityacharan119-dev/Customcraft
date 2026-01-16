export interface Product {
  id: string;
  name: string;
  type: 'tshirt' | 'pillow' | 'chain' | 'mug' | 'hoodie' | 'necklace' | 'photo-frame' | 'pet-bowl' | 'blanket' | 'cap' | 'sticker';
  basePrice: number;
  image: string;
  description: string;
  category: 'apparel' | 'jewelry' | 'home-decor' | 'pet-accessories' | 'drinkware' | 'stickers';
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
    name: 'T Shirt',
    type: 'tshirt',
    category: 'apparel',
    basePrice: 699,
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
    name: 'Hoodie',
    type: 'hoodie',
    category: 'apparel',
    basePrice: 799,
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
    basePrice: 899,
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
    basePrice: 499,
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
    basePrice: 499,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&h=800&fit=crop',
    description: 'Elegant necklace with customizable pendant design and engraving',
    customizationOptions: {
      fonts: ['Script', 'Block', 'Cursive', 'Modern'],
      allowEngraving: true,
      colors: ['#FFD700', '#C0C0C0', '#CD7F32'],
    },
  },

  // Home Decor
  {
    id: 'p1',
    name: 'Custom Photo Pillow',
    type: 'pillow',
    category: 'home-decor',
    basePrice: 799,
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
    basePrice: 699,
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
    basePrice: 799,
    image: 'https://images.unsplash.com/photo-1617906050149-3e6441a55db3?w=800&h=800&fit=crop',
    description: 'Cozy fleece blanket with custom photos, text, or patterns',
    customizationOptions: {
      sizes: ['50x60', '60x80', '80x90'],
      allowImage: true,
      allowText: true,
      fonts: ['Arial', 'Georgia', 'Script'],
    },
  },

  // Pet Accessories
  {
    id: 'pb1',
    name: 'Custom Pet Bowl',
    type: 'pet-bowl',
    category: 'pet-accessories',
    basePrice: 499,
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
    basePrice: 499,
    image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&h=800&fit=crop',
    description: 'Premium ceramic mug with full-color custom designs and text',
    customizationOptions: {
      colors: ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#FFD93D'],
      allowText: true,
      allowImage: true,
      fonts: ['Arial', 'Georgia', 'Impact', 'Comic Sans MS'],
    },
  },

  // Stickers
  {
    id: 's1',
    name: 'Custom Vinyl Stickers',
    type: 'sticker',
    category: 'stickers',
    basePrice: 199,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
    description: 'High-quality vinyl stickers with custom designs, perfect for laptops, water bottles, and more',
    customizationOptions: {
      sizes: ['2x2', '3x3', '4x4', '5x5'],
      allowText: true,
      allowImage: true,
      fonts: ['Arial', 'Impact', 'Georgia', 'Comic Sans MS', 'Script'],
      colors: ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#FFD93D', '#6C5CE7'],
    },
  },
  {
    id: 's2',
    name: 'Die-Cut Stickers',
    type: 'sticker',
    category: 'stickers',
    basePrice: 249,
    image: 'https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=800&fit=crop',
    description: 'Custom shaped die-cut stickers with unique designs and premium vinyl material',
    customizationOptions: {
      sizes: ['2x2', '3x3', '4x4'],
      allowText: true,
      allowImage: true,
      fonts: ['Arial', 'Impact', 'Georgia', 'Script', 'Modern'],
      colors: ['#FFFFFF', '#000000', '#FF6B6B', '#4ECDC4', '#FFD93D'],
    },
  },
  {
    id: 's3',
    name: 'Holographic Stickers',
    type: 'sticker',
    category: 'stickers',
    basePrice: 349,
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
    description: 'Eye-catching holographic stickers that change color with light, perfect for special occasions',
    customizationOptions: {
      sizes: ['2x2', '3x3', '4x4'],
      allowText: true,
      allowImage: true,
      fonts: ['Script', 'Modern', 'Impact'],
      colors: ['Holographic', '#FFFFFF', '#000000'],
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
  { id: 'stickers', name: 'Stickers', icon: '🏷️' },
];
