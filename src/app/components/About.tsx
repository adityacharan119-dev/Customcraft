import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { motion } from 'motion/react';
import { ArrowLeft, Palette, Heart, Users, Star } from 'lucide-react';

interface AboutProps {
  onBack: () => void;
}

export function About({ onBack }: AboutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onBack} className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              About MyCraft
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Palette className="h-8 w-8 text-purple-600" />
                  <CardTitle>Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  At MyCraft India, we believe everyone deserves to express their unique style.
                  As India's leading customization platform, we empower creators, businesses, and individuals
                  across the nation to bring their ideas to life with high-quality, personalized products
                  made right here in India.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Heart className="h-8 w-8 text-red-500" />
                  <CardTitle>Why Choose Us</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Premium quality materials</li>
                  <li>• Fast and reliable shipping</li>
                  <li>• Easy-to-use customization tools</li>
                  <li>• Competitive pricing</li>
                  <li>• Excellent customer support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-600" />
                  <CardTitle>Our Team</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  We're a passionate team of Indian designers, developers, and customer service
                  professionals based across major cities in India. We're dedicated to making
                  customization accessible and enjoyable for everyone in India.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Star className="h-8 w-8 text-yellow-500" />
                  <CardTitle>Our Promise</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Every product is crafted with care, ensuring that what you design is
                  exactly what you receive. Your satisfaction is our top priority.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Get Started Today</CardTitle>
              <CardDescription>
                Join thousands of satisfied customers who have brought their creative visions to life.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={onBack}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
                >
                  Start Customizing
                </Button>
                <Button variant="outline">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}