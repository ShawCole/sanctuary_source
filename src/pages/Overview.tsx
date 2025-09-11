import { useState } from 'react';
import { TopBar } from '@/components/TopBar';
import { SearchDock } from '@/components/SearchDock';
import { RetreatCarousel } from '@/components/RetreatCarousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPrograms } from '@/data/mockData';
import heroImage from '@/assets/hero-tulum.jpg';

export default function Overview() {
  const [activeTab, setActiveTab] = useState('retreats');

  // Sample data organization
  const trendingRetreats = mockPrograms.slice(0, 6);
  const newRetreats = mockPrograms.slice(6, 12);
  const topRated = mockPrograms.filter(p => p.rating >= 4.7).slice(0, 6);

  const popularThemes = [
    'Yoga', 'Meditation', 'Wellness', 'Detox', 'Mindfulness', 
    'Healing', 'Breathwork', 'Nature', 'Silent', 'Corporate'
  ];

  const tabs = [
    { id: 'foryou', label: 'For You' },
    { id: 'retreats', label: 'Retreats' },
    { id: 'guides', label: 'Guides' },
    { id: 'venues', label: 'Venues' }
  ];

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <TopBar />
      
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Sanctuary.Source Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-black/20 to-black/40" />
        </div>
        
        <div className="relative z-10 text-center space-y-8 px-4">
          <div className="space-y-4">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
              Find Your Sacred
              <span className="bg-gradient-to-r from-brand-light to-white bg-clip-text text-transparent">
                {' '}Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto">
              Discover transformative retreats that nourish your soul and expand your consciousness
            </p>
          </div>
          
          <div className="w-full max-w-5xl mx-auto">
            <SearchDock />
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12 max-w-7xl space-y-12">
        {/* Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-muted rounded-xl p-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                className={`rounded-lg px-6 ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-sm text-brand' 
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'retreats' && (
          <div className="space-y-16">
            <RetreatCarousel 
              title="Trending Now" 
              subtitle="Popular retreats seekers are booking this week"
              programs={trendingRetreats} 
            />
            
            <RetreatCarousel 
              title="New & Noteworthy" 
              subtitle="Fresh experiences from trusted guides"
              programs={newRetreats} 
            />
            
            <RetreatCarousel 
              title="Highest Rated" 
              subtitle="Exceptional experiences with outstanding reviews"
              programs={topRated} 
            />
          </div>
        )}

        {activeTab === 'foryou' && (
          <div className="text-center py-16">
            <h3 className="text-2xl font-semibold text-gray-600 mb-4">Welcome to Your Journey</h3>
            <p className="text-muted-foreground">
              Sign in to see personalized recommendations based on your interests and past bookings.
            </p>
          </div>
        )}

        {/* Popular Themes */}
        <section className="space-y-6">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Explore by Theme</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Whether you're seeking inner peace, physical wellness, or spiritual growth, 
              find the perfect retreat for your journey.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {popularThemes.map((theme) => (
              <Badge 
                key={theme} 
                variant="outline" 
                className="px-4 py-2 text-sm cursor-pointer hover:bg-accent transition-colors"
              >
                {theme}
              </Badge>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-16 bg-gradient-to-r from-brand/5 to-brand-light/5 rounded-2xl">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Begin?</h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Join thousands who have found transformation, healing, and growth through our curated retreats.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand text-white px-8 py-3"
            >
              Explore All Retreats
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}