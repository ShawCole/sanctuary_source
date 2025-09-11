import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import L from "leaflet";
import { Program } from "@/types";
import { Button } from "@/components/ui/button";
import "leaflet/dist/leaflet.css";

// Fix for default markers in Leaflet bundles (safe even if not used)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapViewProps {
  programs: Program[];
  onMarkerClick?: (program: Program) => void;
  searchAsMove?: boolean;
  onSearchAsMoveToggle?: () => void;
}

export const MapView = ({
  programs,
  onMarkerClick,
  searchAsMove = false,
  onSearchAsMoveToggle,
}: MapViewProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);

  // Calculate center and bounds from programs
  const { center, bounds } = useMemo(() => {
    if (!programs?.length) {
      return { center: [40.7128, -74.006] as [number, number], bounds: null as null | [[number, number], [number, number]] };
    }
    const lats = programs.map((p) => p.location.lat);
    const lngs = programs.map((p) => p.location.lng);
    const centerLat = (Math.max(...lats) + Math.min(...lats)) / 2;
    const centerLng = (Math.max(...lngs) + Math.min(...lngs)) / 2;
    return {
      center: [centerLat, centerLng] as [number, number],
      bounds: [
        [Math.min(...lats), Math.min(...lngs)],
        [Math.max(...lats), Math.max(...lngs)],
      ] as [[number, number], [number, number]],
    };
  }, [programs]);

  const createPriceIcon = useCallback((price: number, selected: boolean) => {
    const bg = selected ? "#111827" : "#374151"; // gray-900 or gray-700
    return L.divIcon({
      html: `
        <div style="
          background:${bg};color:white;padding:6px 12px;border-radius:20px;
          font-weight:600;font-size:14px;border:2px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.15);
          transform:${selected ? "scale(1.1)" : "scale(1)"};transition:all .2s ease;
          white-space:nowrap;text-align:center;display:inline-block;
          position:relative;left:-50%;top:-50%;">
          $${price.toLocaleString()}
        </div>
      `,
      className: "custom-price-marker",
      iconAnchor: [0, 0],
    });
  }, []);

  const handleMarkerClick = useCallback(
    (program: Program) => {
      setSelectedProgram(program);
      onMarkerClick?.(program);
    },
    [onMarkerClick]
  );

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center,
      zoom: 6,
      zoomControl: true,
      attributionControl: true,
      zoomAnimation: true,
      zoomAnimationThreshold: 4,
      fadeAnimation: true,
      markerZoomAnimation: true,
      wheelPxPerZoomLevel: 60,
      zoomSnap: 0.25,
      zoomDelta: 0.25,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
      updateWhenZooming: true,
      updateWhenIdle: true,
      keepBuffer: 4,
      detectRetina: true,
      crossOrigin: true,
      className: "leaflet-tiles-no-seams",
    }).addTo(map);

    // Optional: search as move
    const onMoveEnd = () => {
      if (searchAsMove) {
        const b = map.getBounds();
        console.debug("Search as move - bounds:", b.toBBoxString());
      }
    };
    map.on("moveend", onMoveEnd);

    mapRef.current = map;

    return () => {
      map.off("moveend", onMoveEnd);
      map.remove();
      mapRef.current = null;
    };
  }, [center, searchAsMove]);

  // Update markers whenever programs or selection changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Clear old markers layer
    if (markersLayerRef.current) {
      markersLayerRef.current.clearLayers();
      map.removeLayer(markersLayerRef.current);
      markersLayerRef.current = null;
    }

    const layer = L.layerGroup();

    programs.forEach((program) => {
      const marker = L.marker([program.location.lat, program.location.lng], {
        icon: createPriceIcon(program.priceUSD, selectedProgram?.id === program.id),
        keyboard: false,
      });
      marker.on("click", () => handleMarkerClick(program));
      marker.addTo(layer);
    });

    layer.addTo(map);
    markersLayerRef.current = layer;

    // Fit to bounds when markers change (only when there are programs)
    if (programs.length && bounds) {
      const latLngBounds = L.latLngBounds(bounds);
      map.fitBounds(latLngBounds, { padding: [20, 20] as any });
    }
  }, [programs, bounds, selectedProgram, createPriceIcon, handleMarkerClick]);

  return (
    <div className="relative h-full min-h-[600px] rounded-xl overflow-hidden">
      <div ref={containerRef} style={{ height: "100%", width: "100%" }} />

      {/* Search as I move toggle */}
      {onSearchAsMoveToggle && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-[1000]">
          <Button
            variant={searchAsMove ? "default" : "secondary"}
            onClick={onSearchAsMoveToggle}
            className={
              searchAsMove
                ? "rounded-full text-sm font-medium shadow-lg"
                : "rounded-full text-sm font-medium shadow-lg"
            }
          >
            Search as I move the map
          </Button>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `
            /* Price markers container styling */
            .custom-price-marker { background: transparent !important; border: none !important; }

            /* Remove visible seams and ensure smooth, interactive map */
            .leaflet-container { outline: none; }
            .leaflet-container .leaflet-tile {
              border: 0 !important;
              box-shadow: none !important;
              image-rendering: auto;
              -ms-interpolation-mode: nearest-neighbor;
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
            .leaflet-container .leaflet-zoom-animated { transform: translate3d(0,0,0); }
            .leaflet-container .leaflet-pane,
            .leaflet-container .leaflet-map-pane,
            .leaflet-container .leaflet-tile-pane,
            .leaflet-container .leaflet-layer,
            .leaflet-container .leaflet-tile-container {
              will-change: transform;
              -webkit-transform: translateZ(0);
                      transform: translateZ(0);
              backface-visibility: hidden;
              -webkit-backface-visibility: hidden;
            }
          `,
        }}
      />
    </div>
  );
};
