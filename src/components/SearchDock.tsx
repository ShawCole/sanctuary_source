import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Search, MapPin, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface SearchDockProps {
  compact?: boolean;
  className?: string;
}

export const SearchDock = ({ compact = false, className = '' }: SearchDockProps) => {
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

  if (compact) {
    return (
      <Card className={`inline-flex items-center h-12 bg-white shadow-lg rounded-full border-0 ${className}`}>
        <div className="flex items-center px-6 py-2">
          <div className="flex items-center gap-4">
            <Input
              placeholder="Search anywhere"
              value={searchParams.keyword}
              onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
              className="border-0 bg-transparent p-0 text-sm font-medium w-32 focus-visible:ring-0"
            />
            <Separator orientation="vertical" className="h-6" />
            <Input
              type="date"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
              className="border-0 bg-transparent p-0 text-sm w-24 focus-visible:ring-0"
              placeholder="Anytime"
            />
            <Separator orientation="vertical" className="h-6" />
            <Input
              placeholder="1 guest"
              value={searchParams.guests}
              onChange={(e) => setSearchParams(prev => ({ ...prev, guests: e.target.value }))}
              className="border-0 bg-transparent p-0 text-sm w-20 focus-visible:ring-0"
            />
          </div>
          <Button 
            onClick={handleSearch}
            size="icon"
            className="ml-4 h-8 w-8 rounded-full bg-brand hover:bg-brand-dark"
          >
            <Search className="h-4 w-4 text-white" />
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`w-full max-w-4xl mx-auto shadow-xl border-0 bg-white rounded-3xl overflow-hidden ${className}`}>
      <div className="p-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-1">
          {/* Where */}
          <div className="flex flex-col p-6 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
            <label className="text-xs font-semibold text-gray-900 mb-1">Where</label>
            <Input
              placeholder="Search destinations"
              value={searchParams.keyword}
              onChange={(e) => setSearchParams(prev => ({ ...prev, keyword: e.target.value }))}
              className="border-0 bg-transparent p-0 text-sm text-gray-600 placeholder:text-gray-400 focus-visible:ring-0"
            />
          </div>

          <Separator orientation="vertical" className="hidden lg:block h-12 self-center" />

          {/* When */}
          <div className="flex flex-col p-6 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
            <label className="text-xs font-semibold text-gray-900 mb-1">When</label>
            <Input
              type="date"
              value={searchParams.startDate}
              onChange={(e) => setSearchParams(prev => ({ ...prev, startDate: e.target.value }))}
              className="border-0 bg-transparent p-0 text-sm text-gray-600 focus-visible:ring-0"
              placeholder="Add dates"
            />
          </div>

          <Separator orientation="vertical" className="hidden lg:block h-12 self-center" />

          {/* Who */}
          <div className="flex items-center justify-between p-6 hover:bg-gray-50 rounded-2xl transition-colors cursor-pointer">
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-gray-900 mb-1">Who</label>
              <Input
                placeholder="Add guests"
                value={searchParams.guests}
                onChange={(e) => setSearchParams(prev => ({ ...prev, guests: e.target.value }))}
                className="border-0 bg-transparent p-0 text-sm text-gray-600 placeholder:text-gray-400 focus-visible:ring-0"
              />
            </div>
            <Button 
              onClick={handleSearch}
              className="ml-4 h-12 w-12 rounded-full bg-brand hover:bg-brand-dark text-white shadow-md"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};