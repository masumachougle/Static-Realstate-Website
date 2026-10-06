import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap, ZoomControl } from "react-leaflet";
import type { Marker as LeafletMarker } from "leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Bed, Bath, Maximize } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";
import { getImageUrl } from "@/lib/imageMap";
import { getPropertyCoordinates, DUBAI_CENTER } from "@/lib/locationCoordinates";
import {
  createCommunityLabelIcon,
  createPropertyMarkerIcon,
  DUBAI_COMMUNITIES,
  formatFullPrice,
  MAP_ATTRIBUTION,
  MAP_TILE_OPTIONS,
  MAP_TILE_URL,
} from "@/lib/mapConfig";

interface PropertiesMapProps {
  properties: Property[];
  className?: string;
  showCommunityLabels?: boolean;
  selectedPropertyId?: string | null;
  onPropertySelect?: (property: Property) => void;
}

function FitBounds({ positions }: { positions: [number, number][] }) {
  const map = useMap();
  const positionsKey = positions.map((point) => point.join(",")).join("|");

  useEffect(() => {
    if (positions.length === 0) return;
    if (positions.length === 1) {
      map.setView(positions[0], 13);
      return;
    }
    map.fitBounds(L.latLngBounds(positions), { padding: [80, 80] });
  }, [map, positions, positionsKey]);

  return null;
}

function FlyToSelection({
  position,
  zoom = 14,
}: {
  position: [number, number] | null;
  zoom?: number;
}) {
  const map = useMap();

  useEffect(() => {
    if (!position) return;
    map.flyTo(position, zoom, { duration: 1.2, easeLinearity: 0.25 });
  }, [map, position, zoom]);

  return null;
}

function MapPanControls() {
  const map = useMap();

  useEffect(() => {
    map.dragging.enable();
    const container = map.getContainer();
    container.style.cursor = "grab";

    const onContextMenu = (event: MouseEvent) => event.preventDefault();
    container.addEventListener("contextmenu", onContextMenu);

    let isRightDragging = false;
    let startPoint: L.Point | null = null;
    let startCenter: L.LatLng | null = null;

    const onMouseDown = (event: MouseEvent) => {
      if (event.button !== 2) return;
      event.preventDefault();
      isRightDragging = true;
      startPoint = map.mouseEventToContainerPoint(event);
      startCenter = map.getCenter();
      container.style.cursor = "grabbing";
    };

    const onMouseMove = (event: MouseEvent) => {
      if (!isRightDragging || !startPoint || !startCenter) return;
      const currentPoint = map.mouseEventToContainerPoint(event);
      const delta = currentPoint.subtract(startPoint);
      const centerPoint = map.project(startCenter, map.getZoom()).subtract(delta);
      map.setView(map.unproject(centerPoint, map.getZoom()), map.getZoom(), { animate: false });
    };

    const endRightDrag = () => {
      if (!isRightDragging) return;
      isRightDragging = false;
      startPoint = null;
      startCenter = null;
      container.style.cursor = "grab";
    };

    const onMouseDownLeft = () => {
      container.style.cursor = "grabbing";
    };

    const onMouseUpLeft = () => {
      if (!isRightDragging) {
        container.style.cursor = "grab";
      }
    };

    container.addEventListener("mousedown", onMouseDown);
    container.addEventListener("mousedown", onMouseDownLeft);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", endRightDrag);
    container.addEventListener("mouseup", onMouseUpLeft);

    return () => {
      container.removeEventListener("contextmenu", onContextMenu);
      container.removeEventListener("mousedown", onMouseDown);
      container.removeEventListener("mousedown", onMouseDownLeft);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", endRightDrag);
      container.removeEventListener("mouseup", onMouseUpLeft);
      container.style.cursor = "";
    };
  }, [map]);

  return null;
}

function PropertyMapPopup({ property }: { property: Property }) {
  const imageUrl = property.images[0] ? getImageUrl(property.images[0]) : null;

  return (
    <div className="map-popup-card">
      {imageUrl && (
        <div className="map-popup-image">
          <img src={imageUrl} alt={property.title} />
        </div>
      )}
      <div className="map-popup-body">
        <div className="map-popup-heading">
          <div className="map-popup-title">{property.title}</div>
          <div className="map-popup-location">{property.location}</div>
        </div>
        <div className="map-popup-footer">
          <p className="map-popup-price">{formatFullPrice(property.price)}</p>
          <div className="map-popup-meta">
            {property.bedrooms != null && (
              <span>
                <Bed className="h-3 w-3" />
                {property.bedrooms}
              </span>
            )}
            {property.bathrooms != null && (
              <span>
                <Bath className="h-3 w-3" />
                {property.bathrooms}
              </span>
            )}
            {property.size != null && (
              <span>
                <Maximize className="h-3 w-3" />
                {property.size.toLocaleString()}
              </span>
            )}
          </div>
        </div>
        <Link href={`/property/${property.id}`} className="map-popup-cta">
          View Details
        </Link>
      </div>
    </div>
  );
}

function PropertyMarker({
  property,
  lat,
  lng,
  isSelected,
  isFeatured,
  onSelect,
}: {
  property: Property;
  lat: number;
  lng: number;
  isSelected: boolean;
  isFeatured: boolean;
  onSelect?: (property: Property) => void;
}) {
  const markerRef = useRef<LeafletMarker | null>(null);

  useEffect(() => {
    if (isSelected) {
      markerRef.current?.openPopup();
    }
  }, [isSelected]);

  return (
    <Marker
      ref={markerRef}
      position={[lat, lng]}
      icon={createPropertyMarkerIcon({ isSelected, isFeatured })}
      zIndexOffset={isSelected ? 1000 : isFeatured ? 500 : 0}
      eventHandlers={{
        click: () => {
          onSelect?.(property);
          markerRef.current?.openPopup();
        },
      }}
    >
      <Popup className="luxury-map-popup" closeButton>
        <PropertyMapPopup property={property} />
      </Popup>
    </Marker>
  );
}

export default function PropertiesMap({
  properties,
  className,
  showCommunityLabels = true,
  selectedPropertyId = null,
  onPropertySelect,
}: PropertiesMapProps) {
  const markers = useMemo(
    () =>
      properties.map((property) => {
        const { lat, lng } = getPropertyCoordinates(property.location, {
          propertyId: property.id,
        });
        return { property, lat, lng };
      }),
    [properties],
  );

  const positions = markers.map((marker) => [marker.lat, marker.lng] as [number, number]);
  const defaultCenter: [number, number] = positions[0] ?? [DUBAI_CENTER.lat, DUBAI_CENTER.lng];

  const selectedPosition = useMemo(() => {
    const selected = markers.find((marker) => marker.property.id === selectedPropertyId);
    return selected ? ([selected.lat, selected.lng] as [number, number]) : null;
  }, [markers, selectedPropertyId]);

  return (
    <MapContainer
      center={defaultCenter}
      zoom={11}
      scrollWheelZoom={true}
      dragging={true}
      className={`luxury-map ${className ?? "h-[70vh] w-full"}`}
      attributionControl={false}
      zoomControl={false}
    >
      <MapPanControls />
      <ZoomControl position="bottomright" />
      <TileLayer
        url={MAP_TILE_URL}
        attribution={MAP_ATTRIBUTION}
        tileSize={MAP_TILE_OPTIONS.tileSize}
        zoomOffset={MAP_TILE_OPTIONS.zoomOffset}
        maxZoom={MAP_TILE_OPTIONS.maxZoom}
      />
      <FitBounds positions={positions} />
      <FlyToSelection position={selectedPosition} />

      {showCommunityLabels &&
        DUBAI_COMMUNITIES.map((community) => (
          <Marker
            key={community.title}
            position={[community.lat, community.lng]}
            icon={createCommunityLabelIcon(community.title)}
            interactive={false}
            zIndexOffset={-200}
          />
        ))}

      {markers.map(({ property, lat, lng }) => (
        <PropertyMarker
          key={property.id}
          property={property}
          lat={lat}
          lng={lng}
          isSelected={property.id === selectedPropertyId}
          isFeatured={property.featured === "true"}
          onSelect={onPropertySelect}
        />
      ))}
    </MapContainer>
  );
}
