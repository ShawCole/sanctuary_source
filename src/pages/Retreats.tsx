import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { SearchDock } from '@/components/SearchDock';
import { RetreatCard } from '@/components/RetreatCard';
import { MapView } from '@/components/MapView';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, Map, X, SlidersHorizontal, ChevronDown, Star } from 'lucide-react';
import { mockPrograms } from '@/data/mockData';
import { Program, SearchParams } from '@/types';

export default function Retreats() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(mockPrograms);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [searchAsMove, setSearchAsMove] = useState(false);
  
  // Filter state
  const [filters, setFilters] = useState<SearchParams>({
    keyword: searchParams.get('q') || '',
    location: searchParams.get('location') || '',
    themes: [],
    venueType: '',
    priceMin: 0,
    priceMax: 3000,
    groupSize: '',
    sort: 'relevance'
  });

  // Available filter options
  const themes = ['Yoga', 'Meditation', 'Wellness', 'Detox', 'Mindfulness', 'Healing', 'Breathwork', 'Nature', 'Silent', 'Corporate'];
  const venueTypes = ['Beachfront', 'Mountain Lodge', 'Eco-Lodge', 'Urban', 'Desert Retreat', 'Villa', 'Ryokan', 'Country House', 'Campground', 'Coastal', 'Jungle'];
  const groupSizes = ['small', 'medium', 'large'];

  // Filter tabs like Airbnb
  const filterTabs = [
    { key: 'type', label: 'Room Type', hasDropdown: true },
    { key: 'price', label: 'Price range', hasDropdown: true },
    { key: 'instant', label: 'Instant Book', hasDropdown: false },
    { key: 'more', label: 'More filters', hasDropdown: true },
  ];

  // Update filters from URL params
  useEffect(() => {
    const newFilters: SearchParams = {
      keyword: searchParams.get('q') || '',
      location: searchParams.get('location') || '',
      themes: searchParams.get('themes')?.split(',').filter(Boolean) || [],
      venueType: searchParams.get('venueType') || '',
      priceMin: parseInt(searchParams.get('priceMin') || '0'),
      priceMax: parseInt(searchParams.get('priceMax') || '3000'),
      groupSize: searchParams.get('groupSize') || '',
      sort: (searchParams.get('sort') as any) || 'relevance'
    };
    setFilters(newFilters);
  }, [searchParams]);

  // Filter programs
  useEffect(() => {
    let filtered = [...mockPrograms];

    // Keyword search
    if (filters.keyword) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(filters.keyword!.toLowerCase()) ||
        p.themes.some(theme => theme.toLowerCase().includes(filters.keyword!.toLowerCase())) ||
        p.location.city.toLowerCase().includes(filters.keyword!.toLowerCase())
      );
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(p => 
        p.location.city.toLowerCase().includes(filters.location!.toLowerCase()) ||
        p.location.country.toLowerCase().includes(filters.location!.toLowerCase())
      );
    }

    // Theme filters
    if (filters.themes && filters.themes.length > 0) {
      filtered = filtered.filter(p => 
        filters.themes!.some(theme => p.themes.includes(theme))
      );
    }

    // Venue type filter
    if (filters.venueType) {
      filtered = filtered.filter(p => p.venueType === filters.venueType);
    }

    // Price filter
    filtered = filtered.filter(p => 
      p.priceUSD >= (filters.priceMin || 0) && 
      p.priceUSD <= (filters.priceMax || 3000)
    );

    // Group size filter
    if (filters.groupSize) {
      filtered = filtered.filter(p => p.groupSize === filters.groupSize);
    }

    // Sort
    switch (filters.sort) {
      case 'price_asc':
        filtered.sort((a, b) => a.priceUSD - b.priceUSD);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.priceUSD - a.priceUSD);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'soonest':
        filtered.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      default:
        // Keep original order for relevance
        break;
    }

    setFilteredPrograms(filtered);
  }, [filters]);

  const updateFilters = (newFilters: Partial<SearchParams>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    
    // Update URL
    const params = new URLSearchParams();
    Object.entries(updated).forEach(([key, value]) => {
      if (value !== undefined && value !== '' && value !== 0) {
        if (Array.isArray(value) && value.length > 0) {
          params.set(key, value.join(','));
        } else if (!Array.isArray(value) && value !== '') {
          params.set(key, value.toString());
        }
      }
    });
    setSearchParams(params);
  };

  const clearFilters = () => {
    setFilters({
      keyword: '',
      location: '',
      themes: [],
      venueType: '',
      priceMin: 0,
      priceMax: 3000,
      groupSize: '',
      sort: 'relevance'
    });
    setSearchParams({});
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.themes?.length) count++;
    if (filters.venueType) count++;
    if (filters.groupSize) count++;
    if (filters.priceMin !== 0 || filters.priceMax !== 3000) count++;
    return count;
  };

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      
      {/* Top search bar */}
      <div className="border-b bg-white">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <SearchDock compact className="max-w-md" />
        </div>
      </div>

      {/* Filter tabs - Airbnb style */}
      <div className="border-b bg-white sticky top-16 z-30">
        <div className="container mx-auto px-6 py-4 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.key}
                  variant="outline"
                  className="rounded-full border-gray-300 text-gray-700 hover:border-gray-900 hover:bg-gray-50"
                >
                  {tab.label}
                  {tab.hasDropdown && <ChevronDown className="ml-2 h-3 w-3" />}
                </Button>
              ))}
            </div>
            
            <div className="flex items-center gap-3">
              {viewMode === 'map' && (
                <Button
                  variant={searchAsMove ? "default" : "outline"}
                  onClick={() => setSearchAsMove(!searchAsMove)}
                  className="rounded-full text-sm"
                >
                  Search as I move the map
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                className="rounded-full border-gray-900 text-gray-900"
              >
                {viewMode === 'grid' ? <Map className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
                {viewMode === 'grid' ? 'Show map' : 'Show list'}
              </Button>
              
              <span className="text-sm text-gray-600">
                {filteredPrograms.length}+ retreats
              </span>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.themes?.length || filters.venueType || filters.groupSize) && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {filters.themes?.map((theme) => (
                <Badge key={theme} variant="secondary" className="gap-1 rounded-full">
                  {theme}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ 
                      themes: filters.themes?.filter(t => t !== theme) 
                    })}
                  />
                </Badge>
              ))}
              {filters.venueType && (
                <Badge variant="secondary" className="gap-1 rounded-full">
                  {filters.venueType}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ venueType: '' })}
                  />
                </Badge>
              )}
              {filters.groupSize && (
                <Badge variant="secondary" className="gap-1 rounded-full">
                  {filters.groupSize} group
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ groupSize: '' })}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters} className="rounded-full">
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6 max-w-7xl">
        {viewMode === 'grid' ? (
          // Grid View
          <div>
            {filteredPrograms.length === 0 ? (
              <Card className="p-12 text-center">
                <div className="space-y-4">
                  <Search className="h-12 w-12 text-muted-foreground mx-auto" />
                  <h3 className="text-lg font-semibold">No retreats found</h3>
                  <p className="text-muted-foreground">
                    Try adjusting your filters or search terms to find what you're looking for.
                  </p>
                  <Button onClick={clearFilters}>Clear all filters</Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPrograms.map((program) => (
                  <RetreatCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </div>
        ) : (
          // Map View - Split Layout
          <div className="grid grid-cols-5 gap-6 h-[calc(100vh-200px)]">
            {/* Left: Results List */}
            <div className="col-span-2 overflow-y-auto pr-4">
              <div className="space-y-4">
                {filteredPrograms.map((program) => (
                  <Card key={program.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                    <div className="flex gap-4">
                      <img
                        src={program.images[0]}
                        alt={program.title}
                        className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-sm">
                            {program.location.city}, {program.location.country}
                          </h3>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-gray-900 text-gray-900" />
                            <span className="text-xs">{program.rating}</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {program.title}
                        </p>
                        <p className="text-xs font-medium">
                          ${program.priceUSD.toLocaleString()} total
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right: Map */}
            <div className="col-span-3">
              <MapView 
                programs={filteredPrograms}
                searchAsMove={searchAsMove}
                onSearchAsMoveToggle={() => setSearchAsMove(!searchAsMove)}
                onMarkerClick={(program) => {
                  // Handle marker click - could open program details
                  console.log('Clicked program:', program.title);
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
