/**
 * Free Map Component using Leaflet + OpenStreetMap
 * No API key required - completely free and open source
 * 
 * Features:
 * - Interactive map with markers
 * - Click to select location
 * - Search by address
 * - Current location detection
 * - Property/client location display
 */

import { useEffect, useRef, useState, useCallback } from "react";

// Leaflet CSS is loaded dynamically
function loadLeafletCSS() {
  if (document.querySelector('link[href*="leaflet"]')) return;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  link.crossOrigin = "";
  document.head.appendChild(link);
}

// Leaflet JS loaded dynamically
function loadLeafletScript(): Promise<void> {
  return new Promise((resolve) => {
    if ((window as any).L) {
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=";
    script.crossOrigin = "";
    script.onload = () => resolve();
    script.onerror = () => {
      console.error("Failed to load Leaflet");
      resolve();
    };
    document.head.appendChild(script);
  });
}

// Yemen center coordinates
const YEMEN_CENTER = { lat: 15.3694, lng: 44.191 };
const SAANA_CENTER = { lat: 15.3694, lng: 44.191 };

interface MapMarker {
  id: string;
  lat: number;
  lng: number;
  title: string;
  description?: string;
  type?: "property" | "client" | "office" | "other";
}

interface MapViewProps {
  className?: string;
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  markers?: MapMarker[];
  onMarkerClick?: (marker: MapMarker) => void;
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  height?: string;
  showSearch?: boolean;
  showCurrentLocation?: boolean;
  readOnly?: boolean;
}

export function MapView({
  className = "",
  initialCenter = SAANA_CENTER,
  initialZoom = 12,
  markers = [],
  onMarkerClick,
  onLocationSelect,
  height = "400px",
  showSearch = true,
  showCurrentLocation = true,
  readOnly = false,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

  // Initialize map
  useEffect(() => {
    let mounted = true;

    const initMap = async () => {
      loadLeafletCSS();
      await loadLeafletScript();

      if (!mounted || !mapContainer.current || !(window as any).L) return;

      const L = (window as any).L;

      // Create map
      const map = L.map(mapContainer.current, {
        center: [initialCenter.lat, initialCenter.lng],
        zoom: initialZoom,
        zoomControl: true,
        scrollWheelZoom: true,
      });

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map);

      // Custom marker icons based on type
      const createIcon = (type: string) => {
        const colors: Record<string, string> = {
          property: "#F3B71B",
          client: "#102A43",
          office: "#E18B68",
          other: "#6B7C8D",
        };
        const color = colors[type] || colors.other;
        return L.divIcon({
          className: "custom-marker",
          html: `<div style="
            width: 32px; height: 32px; border-radius: 50%;
            background: ${color}; border: 3px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
            display: flex; align-items: center; justify-content: center;
          "><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16],
        });
      };

      // Add click handler for location selection
      if (!readOnly && onLocationSelect) {
        map.on("click", async (e: any) => {
          const { lat, lng } = e.latlng;
          // Reverse geocode using Nominatim (free)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ar`
            );
            const data = await response.json();
            onLocationSelect(lat, lng, data.display_name);
          } catch {
            onLocationSelect(lat, lng);
          }
        });
      }

      // Add existing markers
      markers.forEach((markerData) => {
        const icon = createIcon(markerData.type || "other");
        const marker = L.marker([markerData.lat, markerData.lng], { icon })
          .addTo(map)
          .bindPopup(`
            <div style="text-align: center; padding: 8px; font-family: 'IBM Plex Sans Arabic', sans-serif;">
              <strong style="color: #102A43;">${markerData.title}</strong>
              ${markerData.description ? `<br/><small style="color: #6B7C8D;">${markerData.description}</small>` : ""}
            </div>
          `);
        if (onMarkerClick) {
          marker.on("click", () => onMarkerClick(markerData));
        }
        markersRef.current.push(marker);
      });

      mapRef.current = map;
      setIsLoaded(true);
    };

    initMap();

    return () => {
      mounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // Update markers when they change
  useEffect(() => {
    if (!mapRef.current || !isLoaded) return;
    const L = (window as any).L;
    if (!L) return;

    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    // Add new markers
    markers.forEach((markerData) => {
      const colors: Record<string, string> = {
        property: "#F3B71B",
        client: "#102A43",
        office: "#E18B68",
        other: "#6B7C8D",
      };
      const color = colors[markerData.type || "other"];
      const icon = L.divIcon({
        className: "custom-marker",
        html: `<div style="
          width: 32px; height: 32px; border-radius: 50%;
          background: ${color}; border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
        "><div style="width: 8px; height: 8px; background: white; border-radius: 50%;"></div></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      const marker = L.marker([markerData.lat, markerData.lng], { icon })
        .addTo(mapRef.current)
        .bindPopup(`
          <div style="text-align: center; padding: 8px; font-family: 'IBM Plex Sans Arabic', sans-serif;">
            <strong style="color: #102A43;">${markerData.title}</strong>
            ${markerData.description ? `<br/><small style="color: #6B7C8D;">${markerData.description}</small>` : ""}
          </div>
        `);
      if (onMarkerClick) {
        marker.on("click", () => onMarkerClick(markerData));
      }
      markersRef.current.push(marker);
    });
  }, [markers, isLoaded, onMarkerClick]);

  // Search using Nominatim (free geocoding)
  const handleSearch = useCallback(async () => {
    if (!searchQuery.trim()) return;
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&accept-language=ar&countrycodes=ye&limit=5`
      );
      const results = await response.json();
      setSearchResults(results);
      setShowResults(true);
    } catch {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const selectSearchResult = (result: any) => {
    if (mapRef.current) {
      mapRef.current.setView([parseFloat(result.lat), parseFloat(result.lon)], 15);
    }
    setShowResults(false);
    setSearchQuery(result.display_name);
  };

  // Get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          if (mapRef.current) {
            mapRef.current.setView([latitude, longitude], 15);
          }
        },
        (error) => {
          console.error("Location error:", error);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  };

  return (
    <div className={`relative ${className}`} style={{ height }}>
      {/* Search Bar */}
      {showSearch && (
        <div
          className="absolute top-3 right-3 z-[1000]"
          style={{ width: "calc(100% - 24px)", maxWidth: "400px" }}
        >
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              placeholder="ابحث عن موقع... (مثال: صنعاء، اليمن)"
              style={{
                width: "100%",
                padding: "12px 40px 12px 12px",
                borderRadius: "8px",
                border: "2px solid #E5E7EB",
                fontSize: "14px",
                fontFamily: "'IBM Plex Sans Arabic', sans-serif",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                background: "white",
              }}
            />
            <button
              onClick={handleSearch}
              style={{
                position: "absolute",
                left: "4px",
                top: "50%",
                transform: "translateY(-50%)",
                background: "#F3B71B",
                border: "none",
                borderRadius: "6px",
                padding: "8px",
                cursor: "pointer",
                color: "#102A43",
              }}
            >
              🔍
            </button>
          </div>

          {/* Search Results */}
          {showResults && searchResults.length > 0 && (
            <div
              style={{
                position: "absolute",
                top: "100%",
                right: 0,
                left: 0,
                background: "white",
                borderRadius: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                marginTop: "4px",
                maxHeight: "200px",
                overflow: "auto",
                zIndex: 1001,
              }}
            >
              {searchResults.map((result, index) => (
                <div
                  key={index}
                  onClick={() => selectSearchResult(result)}
                  style={{
                    padding: "10px 12px",
                    borderBottom: "1px solid #E5E7EB",
                    cursor: "pointer",
                    fontSize: "13px",
                    color: "#102A43",
                  }}
                  className="hover:bg-gray-50"
                >
                  {result.display_name}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Location Button */}
      {showCurrentLocation && (
        <button
          onClick={getCurrentLocation}
          style={{
            position: "absolute",
            bottom: "12px",
            right: "12px",
            zIndex: 1000,
            background: "#F3B71B",
            border: "none",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            fontSize: "18px",
          }}
          title="موقعي الحالي"
        >
          📍
        </button>
      )}

      {/* Map Container */}
      <div
        ref={mapContainer}
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          overflow: "hidden",
          border: "2px solid #E5E7EB",
        }}
      />

      {/* Loading Indicator */}
      {!isLoaded && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            color: "#6B7C8D",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🗺️</div>
          <div>جارٍ تحميل الخريطة...</div>
        </div>
      )}
    </div>
  );
}

export default MapView;
