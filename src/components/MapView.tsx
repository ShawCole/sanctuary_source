import { useState, useCallback, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Program } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, Heart } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in React Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface MapViewProps {
  programs: Program[];
  onMarkerClick?: (program: Program) => void;
  searchAsMove?: boolean;
  onSearchAsMoveToggle?: () => void;
}

// Custom marker component
const PriceMarker = ({ program, isSelected, onSelect }: { 
  program: Program; 
  isSelected: boolean; 
  onSelect: () => void;
}) => {
  const createCustomIcon = (price: number, selected: boolean) => {
    return L.divIcon({
      html: `
        <div class="price-marker ${selected ? 'selected' : ''}" style="
          background: ${selected ? '#111' : '#374151'};
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          border: 2px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transform: ${selected ? 'scale(1.1)' : 'scale(1)'};
          transition: all 0.2s ease;
          white-space: nowrap;
          text-align: center;
        ">
          $${price.toLocaleString()}
        </div>
      `,
      className: 'custom-price-marker',
      iconSize: [60, 30],
      iconAnchor: [30, 15],
    });
  };

  return (
    <Marker
      position={[program.location.lat, program.location.lng]}
      icon={createCustomIcon(program.priceUSD, isSelected)}
      eventHandlers={{
        click: onSelect,
      }}
    >
      <Popup>
        <Card className="w-64 border-0 shadow-lg">
          <div className="space-y-3">
            <div className="relative">
              <img
                src={program.images[0]}
                alt={program.title}
                className="w-full h-32 object-cover rounded-t-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 rounded-full bg-white/90 hover:bg-white"
              >
                <Heart className="h-3 w-3" />
              </Button>
            </div>
            
            <div className="px-3 pb-3 space-y-2">
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
                with {program.guide.name}
              </p>
              
              <p className="text-xs text-gray-600 line-clamp-2">
                {program.title}
              </p>
              
              <div className="flex items-center justify-between pt-2">
                <p className="text-sm font-semibold text-gray-900">
                  ${program.priceUSD.toLocaleString()} total
                </p>
                <Button 
                  size="sm" 
                  className="bg-gray-900 hover:bg-gray-800 text-white px-3 py-1 text-xs"
                >
                  View
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Popup>
    </Marker>
  );
};

// Map event handler component
const MapEvents = ({ onMoveEnd, searchAsMove }: { onMoveEnd: () => void; searchAsMove: boolean }) => {
  useMapEvents({
    moveend: () => {
      if (searchAsMove) {
        onMoveEnd();
      }
    },
  });
  return null;
};

export const MapView = ({ programs, onMarkerClick, searchAsMove = false, onSearchAsMoveToggle }: MapViewProps) => {
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Calculate map center and bounds
  const { center, bounds } = useMemo(() => {
    if (programs.length === 0) {
      return { center: [40.7128, -74.0060] as [number, number], bounds: null }; // Default to NYC
    }
    
    const lats = programs.map(p => p.location.lat);
    const lngs = programs.map(p => p.location.lng);
    
    const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
    const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
    
    return {
      center: [centerLat, centerLng] as [number, number],
      bounds: [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)]
      ] as [[number, number], [number, number]]
    };
  }, [programs]);

  const handleMarkerClick = useCallback((program: Program) => {
    setSelectedProgram(program);
    onMarkerClick?.(program);
  }, [onMarkerClick]);

  const handleMoveEnd = useCallback(() => {
    if (searchAsMove) {
      console.log('Search with new bounds - implement your search logic here');
    }
  }, [searchAsMove]);

  return (
    <div className="relative h-full min-h-[600px] rounded-xl overflow-hidden">
      <MapContainer
        center={center}
        zoom={6}
        style={{ height: '100%', width: '100%' }}
        bounds={bounds || undefined}
        boundsOptions={{ padding: [20, 20] }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapEvents onMoveEnd={handleMoveEnd} searchAsMove={searchAsMove} />
        
        {programs.map((program) => (
          <PriceMarker
            key={program.id}
            program={program}
            isSelected={selectedProgram?.id === program.id}
            onSelect={() => handleMarkerClick(program)}
          />
        ))}
      </MapContainer>

      {/* Search as I move toggle */}
      {onSearchAsMoveToggle && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000]">
          <Button
            variant={searchAsMove ? "default" : "secondary"}
            onClick={onSearchAsMoveToggle}
            className={`rounded-full text-sm font-medium shadow-lg transition-all ${
              searchAsMove 
                ? 'bg-gray-900 text-white hover:bg-gray-800' 
                : 'bg-white text-gray-900 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            Search as I move the map
          </Button>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          .custom-price-marker {
            background: transparent !important;
            border: none !important;
          }
          .leaflet-popup-content-wrapper {
            padding: 0;
            border-radius: 12px;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
          }
          .leaflet-popup-content {
            margin: 0;
            border-radius: 12px;
          }
          .leaflet-popup-tip {
            background: white;
            border: none;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
        `
      }} />
    </div>
  );
};