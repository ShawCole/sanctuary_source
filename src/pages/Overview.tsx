import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { SearchDock } from '@/components/SearchDock';
import { RetreatCarousel } from '@/components/RetreatCarousel';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { mockPrograms } from '@/data/mockData';
import heroImage from '@/assets/hero-tulum.jpg';

export default function Overview() {
  const navigate = useNavigate();
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
    <div className="min-h-screen bg-white">
      <TopBar />
      
      {/* Hero Section */}
      <section className="relative h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Sanctuary.Source Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
        
        <div className="relative z-10 text-center space-y-8 px-6 max-w-4xl mx-auto">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl font-medium text-white leading-tight">
              Find Your Sacred Journey
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto font-light">
              Discover transformative retreats that nourish your soul and expand your consciousness
            </p>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="relative -mt-20 px-6 pb-12 z-20">
        <SearchDock />
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 max-w-7xl space-y-16">
        {/* Tabs */}
        <div className="flex justify-center">
          <div className="flex bg-gray-100 rounded-2xl p-1">
            {tabs.map((tab) => (
              <Button
                key={tab.id}
                variant="ghost"
                className={`rounded-xl px-8 py-3 font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-white shadow-sm text-gray-900' 
                    : 'text-gray-600 hover:text-gray-900'
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
        <section className="space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-medium text-gray-900">Explore by Theme</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Whether you're seeking inner peace, physical wellness, or spiritual growth, 
              find the perfect retreat for your journey.
            </p>
          </div>
          
          <div className="flex flex-wrap justify-center gap-3">
            {popularThemes.map((theme) => (
              <Button 
                key={theme} 
                variant="outline" 
                className="rounded-full px-6 py-3 text-sm border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-colors"
              >
                {theme}
              </Button>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="text-center py-20 bg-gray-50 rounded-3xl mx-6">
          <div className="space-y-8 max-w-2xl mx-auto px-6">
            <h2 className="text-4xl font-medium text-gray-900">Ready to Begin?</h2>
            <p className="text-xl text-gray-600">
              Join thousands who have found transformation, healing, and growth through our curated retreats.
            </p>
            <Button 
              size="lg" 
              className="bg-gray-900 hover:bg-gray-800 text-white px-12 py-4 rounded-2xl text-lg font-medium"
              onClick={() => navigate('/retreats')}
            >
              Explore All Retreats
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}