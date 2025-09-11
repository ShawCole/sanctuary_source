import { Program } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';
import { useState } from 'react';

interface MapViewProps {
  programs: Program[];
  onMarkerClick?: (program: Program) => void;
  searchAsMove?: boolean;
  onSearchAsMoveToggle?: () => void;
}

export const MapView = ({ programs, onMarkerClick, searchAsMove = false, onSearchAsMoveToggle }: MapViewProps) => {
  const [hoveredProgram, setHoveredProgram] = useState<string | null>(null);

  // Mock map interface for now - in real implementation would use Mapbox/Leaflet
  return (
    <div className="relative h-full min-h-[600px] bg-gray-100 rounded-xl overflow-hidden">
      {/* Map placeholder with markers */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200">
        {/* Mock world map background */}
        <div className="absolute inset-0 opacity-20">
          <svg viewBox="0 0 400 300" className="w-full h-full">
            {/* Simple world map outline */}
            <path
              d="M50 150 Q100 120 150 140 T250 130 Q300 140 350 160 L350 200 Q300 180 250 190 T150 200 Q100 190 50 180 Z"
              fill="currentColor"
              className="text-blue-300"
            />
          </svg>
        </div>

        {/* Price markers */}
        {programs.slice(0, 8).map((program, index) => {
          const x = 20 + (index * 45) % 360;
          const y = 100 + (index * 30) % 200;
          
          return (
            <div
              key={program.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-all duration-200 ${
                hoveredProgram === program.id ? 'z-20 scale-110' : 'z-10'
              }`}
              style={{ left: `${x}px`, top: `${y}px` }}
              onMouseEnter={() => setHoveredProgram(program.id)}
              onMouseLeave={() => setHoveredProgram(null)}
              onClick={() => onMarkerClick?.(program)}
            >
              <Badge 
                className={`px-3 py-1 font-medium text-white shadow-lg transition-all ${
                  hoveredProgram === program.id 
                    ? 'bg-gray-900 scale-110' 
                    : 'bg-gray-800 hover:bg-gray-900'
                }`}
              >
                ${program.priceUSD.toLocaleString()}
              </Badge>

              {/* Hover popup */}
              {hoveredProgram === program.id && (
                <Card className="absolute top-8 left-1/2 transform -translate-x-1/2 w-64 p-3 shadow-xl border-0 bg-white z-30 animate-fade-in">
                  <div className="space-y-2">
                    <img
                      src={program.images[0]}
                      alt={program.title}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-sm text-gray-900 line-clamp-1">
                          {program.location.city}, {program.location.country}
                        </h4>
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 fill-gray-900 text-gray-900" />
                          <span className="text-xs text-gray-900">{program.rating}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 line-clamp-1">
                        {program.title}
                      </p>
                      <p className="text-xs font-medium text-gray-900">
                        ${program.priceUSD.toLocaleString()} total
                      </p>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          );
        })}
      </div>

      {/* Search as I move toggle */}
      {onSearchAsMoveToggle && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
          <Button
            variant={searchAsMove ? "default" : "secondary"}
            onClick={onSearchAsMoveToggle}
            className={`rounded-full text-sm font-medium shadow-lg ${
              searchAsMove 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-white text-gray-900 hover:bg-gray-50'
            }`}
          >
            Search as I move the map
          </Button>
        </div>
      )}

      {/* Map controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2">
        <Button variant="secondary" size="icon" className="rounded-lg shadow-lg bg-white">
          +
        </Button>
        <Button variant="secondary" size="icon" className="rounded-lg shadow-lg bg-white">
          -
        </Button>
      </div>
    </div>
  );
};