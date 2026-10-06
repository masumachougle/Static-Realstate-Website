import type React from "react";
import { useEffect, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  createPropertyMarkerIcon,
  MAP_ATTRIBUTION,
  MAP_TILE_OPTIONS,
  MAP_TILE_URL,
} from "@/lib/mapConfig";

interface MapLocationProps {
  title?: string;
  lat?: number | null;
  lng?: number | null;
  className?: string;
  zoom?: number;
  /** Enables zoom controls, scroll zoom, auto-centered marker, and popup */
  interactive?: boolean;
}

const DUBAI_CENTER = { lat: 25.15, lng: 55.3 };

function MapInvalidateSize() {
  const map = useMap();

  useEffect(() => {
    const timeouts = [0, 150, 500].map((delay) =>
      setTimeout(() => map.invalidateSize(), delay),
    );
    return () => timeouts.forEach(clearTimeout);
  }, [map]);

  return null;
}

function MapCenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();

  useEffect(() => {
    map.setView([lat, lng], zoom, { animate: false });
  }, [map, lat, lng, zoom]);

  return null;
}

function AutoOpenPopup({ markerRef }: { markerRef: React.RefObject<LeafletMarker | null> }) {
  const map = useMap();

  useEffect(() => {
    const timer = setTimeout(() => {
      map.setView(map.getCenter(), map.getZoom(), { animate: false });
      markerRef.current?.openPopup();
    }, 400);
    return () => clearTimeout(timer);
  }, [map, markerRef]);

  return null;
}

const MapLocation: React.FC<MapLocationProps> = ({
  title,
  lat,
  lng,
  className,
  zoom,
  interactive = false,
}) => {
  const mapLat = lat ?? DUBAI_CENTER.lat;
  const mapLng = lng ?? DUBAI_CENTER.lng;
  const mapZoom = zoom ?? (interactive ? 16 : 13);
  const propertyMarkerIcon = createPropertyMarkerIcon();
  const markerRef = useRef<LeafletMarker | null>(null);

  const openGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps?q=${mapLat},${mapLng}`;
    window.open(mapsUrl, "_blank");
  };

  return (
    <MapContainer
      center={[mapLat, mapLng]}
      zoom={mapZoom}
      scrollWheelZoom={interactive}
      dragging={true}
      className={`luxury-map ${interactive ? "luxury-map--interactive" : ""} ${className ?? "h-[30vh] md:h-[55vh] w-full rounded-md"}`}
      attributionControl={false}
      zoomControl={false}
    >
      {interactive && <MapInvalidateSize />}
      {interactive && <MapCenter lat={mapLat} lng={mapLng} zoom={mapZoom} />}
      {interactive && <ZoomControl position="bottomright" />}
      {interactive && <AutoOpenPopup markerRef={markerRef} />}
      <TileLayer
        url={MAP_TILE_URL}
        attribution={MAP_ATTRIBUTION}
        tileSize={MAP_TILE_OPTIONS.tileSize}
        zoomOffset={MAP_TILE_OPTIONS.zoomOffset}
        maxZoom={MAP_TILE_OPTIONS.maxZoom}
      />
      <Marker
        ref={markerRef}
        position={[mapLat, mapLng]}
        icon={propertyMarkerIcon}
        eventHandlers={{ click: openGoogleMaps }}
      >
        {title && (
          <Popup className="luxury-map-popup">
            <div className="map-popup-card">
              <div className="map-popup-body">
                <p className="map-popup-title">{title}</p>
                <span className="map-popup-link">Open in Google Maps</span>
              </div>
            </div>
          </Popup>
        )}
      </Marker>
    </MapContainer>
  );
};

export default MapLocation;
