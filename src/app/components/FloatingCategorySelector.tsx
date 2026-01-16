import React from 'react';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';
import { categories } from '../data/products';
import { motion } from 'motion/react';

interface FloatingCategorySelectorProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function FloatingCategorySelector({ selectedCategory, onCategoryChange }: FloatingCategorySelectorProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="fixed bottom-6 right-6 z-40"
    >
      <div className="bg-white rounded-xl shadow-lg border p-2">
        <Tabs value={selectedCategory} onValueChange={onCategoryChange} className="w-full">
          <TabsList className="grid grid-cols-2 gap-1 bg-transparent h-auto p-1">
            {categories.map((category) => (
              <TabsTrigger
                key={category.id}
                value={category.id}
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white text-xs px-2 py-1 h-auto whitespace-nowrap"
              >
                <span className="mr-1">{category.icon}</span>
                <span className="hidden sm:inline">{category.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    </motion.div>
  );
}