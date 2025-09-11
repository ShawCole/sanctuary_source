import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Calendar, MapPin, Users, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const SearchDock = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    location: '',
    startDate: '',
    guests: ''
  });

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchParams.keyword) params.set('q', searchParams.keyword);
    if (searchParams.location) params.set('location', searchParams.location);
    if (searchParams.startDate) params.set('start', searchParams.startDate);
    if (searchParams.guests) params.set('guests', searchParams.guests);
    
    navigate(`/retreats?${params.toString()}`);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto p-6 shadow-lg border-0 bg-white/95 backdrop-blur">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Keyword */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Search className="h-4 w-4" />
            What are you seeking?
          </label>
          <Input
            placeholder="Yoga, meditation, healing..."
            value={searchParams.keyword}
            onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
            className="border-0 bg-muted/50"
          />
        </div>

        {/* Location */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Where?
          </label>
          <Input
            placeholder="Anywhere"
            value={searchParams.location}
            onChange={(e) => setSearchParams(prev => ({ ...prev, location: e.target.value }))}
            className="border-0 bg-muted/50"
          />
        </div>

        {/* Dates */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            When?
          </label>
          <Input
            type="date"
            value={searchParams.startDate}
            onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
            className="border-0 bg-muted/50"
          />
        </div>

        {/* Guests */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <Users className="h-4 w-4" />
            Guests
          </label>
          <div className="flex items-center gap-2">
            <Input
              type="number"
              placeholder="1"
              min="1"
              value={searchParams.guests}
              onChange={(e) => setSearchParams(prev => ({ ...prev, guests: e.target.value }))}
              className="border-0 bg-muted/50 flex-1"
            />
            <Button 
              onClick={handleSearch}
              className="bg-gradient-to-r from-brand to-brand-dark hover:from-brand-dark hover:to-brand text-white px-8"
            >
              Search
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};