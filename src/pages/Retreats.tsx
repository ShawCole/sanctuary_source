import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { TopBar } from '@/components/TopBar';
import { RetreatCard } from '@/components/RetreatCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Grid, Map, X, SlidersHorizontal } from 'lucide-react';
import { mockPrograms } from '@/data/mockData';
import { Program, SearchParams } from '@/types';

export default function Retreats() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filteredPrograms, setFilteredPrograms] = useState<Program[]>(mockPrograms);
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  
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
    <div className="min-h-screen bg-background">
      <TopBar />
      
      {/* Results Bar */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b">
        <div className="container mx-auto px-4 py-4 max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            {/* Search inputs */}
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search retreats..."
                  value={filters.keyword || ''}
                  onChange={(e) => updateFilters({ keyword: e.target.value })}
                  className="pl-10"
                />
              </div>
              <Input
                placeholder="Location"
                value={filters.location || ''}
                onChange={(e) => updateFilters({ location: e.target.value })}
                className="max-w-40"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              <Select value={filters.sort} onValueChange={(value) => updateFilters({ sort: value as any })}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Relevance</SelectItem>
                  <SelectItem value="price_asc">Price: Low to High</SelectItem>
                  <SelectItem value="price_desc">Price: High to Low</SelectItem>
                  <SelectItem value="soonest">Soonest</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'grid' ? 'map' : 'grid')}
                className="hidden md:flex"
              >
                {viewMode === 'grid' ? <Map className="h-4 w-4 mr-2" /> : <Grid className="h-4 w-4 mr-2" />}
                {viewMode === 'grid' ? 'Map View' : 'Grid View'}
              </Button>

              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters {getActiveFiltersCount() > 0 && `(${getActiveFiltersCount()})`}
              </Button>

              <span className="text-sm text-muted-foreground">
                {filteredPrograms.length} results
              </span>
            </div>
          </div>

          {/* Active Filters */}
          {(filters.themes?.length || filters.venueType || filters.groupSize) && (
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              {filters.themes?.map((theme) => (
                <Badge key={theme} variant="secondary" className="gap-1">
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
                <Badge variant="secondary" className="gap-1">
                  {filters.venueType}
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ venueType: '' })}
                  />
                </Badge>
              )}
              {filters.groupSize && (
                <Badge variant="secondary" className="gap-1">
                  {filters.groupSize} group
                  <X 
                    className="h-3 w-3 cursor-pointer" 
                    onClick={() => updateFilters({ groupSize: '' })}
                  />
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="grid grid-cols-12 gap-6">
          {/* Filter Sidebar - Desktop */}
          <div className={`col-span-3 space-y-6 ${showFilters ? 'block' : 'hidden'} md:block`}>
            <Card className="p-6 sticky top-32">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </h3>
                  {getActiveFiltersCount() > 0 && (
                    <Button variant="ghost" size="sm" onClick={clearFilters}>
                      Reset
                    </Button>
                  )}
                </div>

                {/* Themes */}
                <div className="space-y-3">
                  <h4 className="font-medium">Themes</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {themes.map((theme) => (
                      <div key={theme} className="flex items-center space-x-2">
                        <Checkbox
                          id={theme}
                          checked={filters.themes?.includes(theme)}
                          onCheckedChange={(checked) => {
                            const newThemes = checked
                              ? [...(filters.themes || []), theme]
                              : filters.themes?.filter(t => t !== theme) || [];
                            updateFilters({ themes: newThemes });
                          }}
                        />
                        <label htmlFor={theme} className="text-sm cursor-pointer">
                          {theme}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Venue Type */}
                <div className="space-y-3">
                  <h4 className="font-medium">Venue Type</h4>
                  <Select value={filters.venueType} onValueChange={(value) => updateFilters({ venueType: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any type</SelectItem>
                      {venueTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Group Size */}
                <div className="space-y-3">
                  <h4 className="font-medium">Group Size</h4>
                  <Select value={filters.groupSize} onValueChange={(value) => updateFilters({ groupSize: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any size" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any size</SelectItem>
                      <SelectItem value="small">Small (4-8)</SelectItem>
                      <SelectItem value="medium">Medium (8-16)</SelectItem>
                      <SelectItem value="large">Large (16+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range */}
                <div className="space-y-3">
                  <h4 className="font-medium">Price Range</h4>
                  <div className="space-y-4">
                    <Slider
                      value={[filters.priceMin || 0, filters.priceMax || 3000]}
                      onValueChange={([min, max]) => updateFilters({ priceMin: min, priceMax: max })}
                      min={0}
                      max={3000}
                      step={50}
                      className="w-full"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${filters.priceMin || 0}</span>
                      <span>${filters.priceMax || 3000}+</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Results Grid */}
          <div className={`${showFilters ? 'col-span-12' : 'col-span-12'} md:col-span-9`}>
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPrograms.map((program) => (
                  <RetreatCard key={program.id} program={program} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
