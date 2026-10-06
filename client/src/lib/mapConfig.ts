import L from "leaflet";

const MAPBOX_ACCESS_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN ?? "";

export const MAPBOX_STYLE = "mapbox/streets-v12";

export const MAP_ATTRIBUTION =
  '&copy; <a href="https://www.mapbox.com/about/maps/">Mapbox</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

export const MAP_TILE_URL = `https://api.mapbox.com/styles/v1/${MAPBOX_STYLE}/tiles/{z}/{x}/{y}?access_token=${MAPBOX_ACCESS_TOKEN}`;

export const MAP_TILE_OPTIONS = {
  tileSize: 512,
  zoomOffset: -1,
  maxZoom: 22,
} as const;

export const DUBAI_COMMUNITIES = [
  { title: "Palm Jumeirah", lat: 25.1122, lng: 55.1383 },
  { title: "Dubai Marina", lat: 25.08, lng: 55.14 },
  { title: "JLT", lat: 25.0746, lng: 55.1389 },
  { title: "Downtown", lat: 25.1956, lng: 55.2753 },
  { title: "Business Bay", lat: 25.1851, lng: 55.2719 },
  { title: "JBR", lat: 25.0772, lng: 55.1336 },
  { title: "Dubai Hills", lat: 25.1031, lng: 55.2456 },
  { title: "Arabian Ranches", lat: 25.0553, lng: 55.2203 },
] as const;

export function formatFullPrice(price: string) {
  const value = parseFloat(price);
  if (value >= 1_000_000) {
    return `AED ${(value / 1_000_000).toFixed(1)}M`;
  }
  return `AED ${value.toLocaleString()}`;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export function createCommunityLabelIcon(title: string): L.DivIcon {
  return L.divIcon({
    className: "community-label-icon",
    html: `
      <span class="community-label">
        <span class="community-label-bg"></span>
        <span class="community-label-text">${escapeHtml(title)}</span>
      </span>
    `,
    iconSize: [0, 0],
    iconAnchor: [0, 0],
  });
}

export function createPropertyMarkerIcon(
  options: { isSelected?: boolean; isFeatured?: boolean } = {},
): L.DivIcon {
  const { isSelected = false, isFeatured = false } = options;
  const classes = [
    "property-marker",
    isSelected ? "property-marker--selected" : "",
    isFeatured ? "property-marker--featured" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return L.divIcon({
    className: "property-marker-icon",
    html: `
      <div class="${classes}">
        <span class="property-marker-pulse"></span>
        <span class="property-marker-pin"></span>
      </div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
}
