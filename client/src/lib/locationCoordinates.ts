export const DUBAI_CENTER = { lat: 25.2048, lng: 55.2708 };

/** ~1.3 km spread around area center so overlapping listings don't stack */
const SCATTER_RADIUS = 0.012;

const DUBAI_AREA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  "palm jumeirah": { lat: 25.1124, lng: 55.1172 },
  "the palm jumeirah": { lat: 25.1124, lng: 55.1172 },
  palm: { lat: 25.1124, lng: 55.1172 },

  "dubai marina": { lat: 25.0805, lng: 55.1387 },
  marina: { lat: 25.0805, lng: 55.1387 },
  "jumeirah beach residence": { lat: 25.078, lng: 55.1344 },
  jbr: { lat: 25.078, lng: 55.1344 },

  "downtown dubai": { lat: 25.1972, lng: 55.2744 },
  downtown: { lat: 25.1972, lng: 55.2744 },
  "business bay": { lat: 25.185, lng: 55.2614 },
  "burj khalifa": { lat: 25.1972, lng: 55.2744 },

  difc: { lat: 25.21, lng: 55.2803 },
  "dubai international financial centre": { lat: 25.21, lng: 55.2803 },
  "trade centre": { lat: 25.23, lng: 55.2803 },
  "world trade centre": { lat: 25.23, lng: 55.2803 },

  jumeirah: { lat: 25.21, lng: 55.23 },
  "jumeirah 1": { lat: 25.215, lng: 55.235 },
  "jumeirah 2": { lat: 25.205, lng: 55.22 },
  "jumeirah 3": { lat: 25.195, lng: 55.21 },
  "umm suqeim": { lat: 25.145, lng: 55.19 },
  "umm suqeim 1": { lat: 25.15, lng: 55.195 },
  "umm suqeim 2": { lat: 25.14, lng: 55.185 },
  "umm suqeim 3": { lat: 25.13, lng: 55.175 },

  "dubai hills": { lat: 25.105, lng: 55.24 },
  "dubai hills estate": { lat: 25.105, lng: 55.24 },
  "al barsha": { lat: 25.11, lng: 55.2 },
  "al barsha 1": { lat: 25.115, lng: 55.205 },
  "al barsha 2": { lat: 25.105, lng: 55.195 },
  "al barsha 3": { lat: 25.095, lng: 55.185 },
  "al barsha south": { lat: 25.095, lng: 55.2 },

  "arabian ranches": { lat: 25.05, lng: 55.27 },
  "arabian ranches 1": { lat: 25.05, lng: 55.27 },
  "arabian ranches 2": { lat: 25.04, lng: 55.29 },
  "arabian ranches 3": { lat: 25.03, lng: 55.31 },

  "emirates hills": { lat: 25.065, lng: 55.165 },
  "emirates living": { lat: 25.055, lng: 55.17 },
  "the springs": { lat: 25.045, lng: 55.155 },
  springs: { lat: 25.045, lng: 55.155 },
  "the meadows": { lat: 25.05, lng: 55.16 },
  meadows: { lat: 25.05, lng: 55.16 },
  "the lakes": { lat: 25.06, lng: 55.17 },
  lakes: { lat: 25.06, lng: 55.17 },

  mirdif: { lat: 25.22, lng: 55.415 },
  "al warqaa": { lat: 25.2, lng: 55.4 },
  "al warqaa 1": { lat: 25.205, lng: 55.395 },
  "al warqaa 2": { lat: 25.195, lng: 55.405 },
  "al warqaa 3": { lat: 25.19, lng: 55.415 },
  "al warqaa 4": { lat: 25.185, lng: 55.425 },

  "dubai silicon oasis": { lat: 25.12, lng: 55.375 },
  "silicon oasis": { lat: 25.12, lng: 55.375 },
  dso: { lat: 25.12, lng: 55.375 },
  "academic city": { lat: 25.11, lng: 55.39 },
  "dubai academic city": { lat: 25.11, lng: 55.39 },

  "dubai sports city": { lat: 25.035, lng: 55.22 },
  "sports city": { lat: 25.035, lng: 55.22 },
  "motor city": { lat: 25.045, lng: 55.235 },
  "dubai motor city": { lat: 25.045, lng: 55.235 },

  "jumeirah village circle": { lat: 25.065, lng: 55.21 },
  jvc: { lat: 25.065, lng: 55.21 },
  "jumeirah village triangle": { lat: 25.055, lng: 55.2 },
  jvt: { lat: 25.055, lng: 55.2 },

  "discovery gardens": { lat: 25.045, lng: 55.135 },
  "al furjan": { lat: 25.035, lng: 55.145 },

  "international city": { lat: 25.165, lng: 55.41 },

  dubailand: { lat: 25.07, lng: 55.31 },
  "dubai land": { lat: 25.07, lng: 55.31 },
  "falcon city": { lat: 25.06, lng: 55.32 },

  "al quoz": { lat: 25.14, lng: 55.23 },
  "al quoz 1": { lat: 25.145, lng: 55.225 },
  "al quoz 2": { lat: 25.135, lng: 55.235 },
  "al quoz 3": { lat: 25.13, lng: 55.24 },
  "al quoz 4": { lat: 25.125, lng: 55.245 },
  "al quoz industrial": { lat: 25.13, lng: 55.23 },

  "nad al sheba": { lat: 25.165, lng: 55.32 },
  "nad al shiba": { lat: 25.165, lng: 55.32 },
  "nad al sheba 1": { lat: 25.17, lng: 55.31 },
  "nad al shiba 1": { lat: 25.17, lng: 55.31 },
  "nad al sheba first": { lat: 25.17, lng: 55.31 },
  "nad al shiba first": { lat: 25.17, lng: 55.31 },
  "nad al sheba 2": { lat: 25.165, lng: 55.32 },
  "nad al shiba 2": { lat: 25.165, lng: 55.32 },
  "nad al sheba second": { lat: 25.165, lng: 55.32 },
  "nad al shiba second": { lat: 25.165, lng: 55.32 },
  "nad al sheba 3": { lat: 25.16, lng: 55.33 },
  "nad al shiba 3": { lat: 25.16, lng: 55.33 },
  "nad al sheba third": { lat: 25.16, lng: 55.33 },
  "nad al shiba third": { lat: 25.16, lng: 55.33 },
  "nad al sheba 4": { lat: 25.155, lng: 55.34 },
  "nad al shiba 4": { lat: 25.155, lng: 55.34 },
  "nad al sheba fourth": { lat: 25.155, lng: 55.34 },
  "nad al shiba fourth": { lat: 25.155, lng: 55.34 },

  "ras al khor": { lat: 25.185, lng: 55.335 },
  "ras al khor industrial": { lat: 25.18, lng: 55.34 },

  "al rashidiya": { lat: 25.235, lng: 55.38 },
  rashidiya: { lat: 25.235, lng: 55.38 },
  "al garhoud": { lat: 25.245, lng: 55.34 },
  garhoud: { lat: 25.245, lng: 55.34 },
  "airport freezone": { lat: 25.255, lng: 55.36 },
  dafza: { lat: 25.255, lng: 55.36 },

  deira: { lat: 25.27, lng: 55.32 },
  "al rigga": { lat: 25.265, lng: 55.315 },
  rigga: { lat: 25.265, lng: 55.315 },
  naif: { lat: 25.275, lng: 55.31 },
  "al murar": { lat: 25.27, lng: 55.305 },
  "port saeed": { lat: 25.26, lng: 55.325 },
  "al mamzar": { lat: 25.29, lng: 55.35 },
  mamzar: { lat: 25.29, lng: 55.35 },

  "bur dubai": { lat: 25.255, lng: 55.295 },
  "al mankhool": { lat: 25.25, lng: 55.29 },
  mankhool: { lat: 25.25, lng: 55.29 },
  "al karama": { lat: 25.245, lng: 55.3 },
  karama: { lat: 25.245, lng: 55.3 },
  "al raffa": { lat: 25.255, lng: 55.285 },
  "al fahidi": { lat: 25.263, lng: 55.295 },
  "al bastakiya": { lat: 25.264, lng: 55.297 },

  satwa: { lat: 25.22, lng: 55.265 },
  "al satwa": { lat: 25.22, lng: 55.265 },
  "al wasl": { lat: 25.215, lng: 55.255 },
  wasl: { lat: 25.215, lng: 55.255 },

  "al safa": { lat: 25.17, lng: 55.235 },
  "al safa 1": { lat: 25.175, lng: 55.23 },
  "al safa 2": { lat: 25.165, lng: 55.24 },
  "al manara": { lat: 25.16, lng: 55.22 },

  zabeel: { lat: 25.225, lng: 55.29 },
  "zabeel 1": { lat: 25.23, lng: 55.285 },
  "zabeel 2": { lat: 25.22, lng: 55.295 },

  "dubai creek harbour": { lat: 25.205, lng: 55.345 },
  "creek harbour": { lat: 25.205, lng: 55.345 },
  "dubai festival city": { lat: 25.22, lng: 55.355 },
  "festival city": { lat: 25.22, lng: 55.355 },

  "city walk": { lat: 25.205, lng: 55.26 },
  "la mer": { lat: 25.23, lng: 55.245 },

  "the greens": { lat: 25.095, lng: 55.17 },
  greens: { lat: 25.095, lng: 55.17 },
  "the views": { lat: 25.09, lng: 55.175 },
  views: { lat: 25.09, lng: 55.175 },

  tecom: { lat: 25.095, lng: 55.17 },
  "dubai internet city": { lat: 25.09, lng: 55.155 },
  "internet city": { lat: 25.09, lng: 55.155 },
  "dubai media city": { lat: 25.085, lng: 55.15 },
  "media city": { lat: 25.085, lng: 55.15 },
  "knowledge village": { lat: 25.08, lng: 55.16 },

  remraam: { lat: 25.02, lng: 55.26 },
  mudon: { lat: 25.015, lng: 55.28 },
  "mudon the arabella": { lat: 25.01, lng: 55.285 },

  "damac hills": { lat: 25.025, lng: 55.23 },
  "damac hills 1": { lat: 25.025, lng: 55.23 },
  "damac hills 2": { lat: 25.01, lng: 55.25 },
  akoya: { lat: 25.01, lng: 55.25 },

  "town square": { lat: 25.005, lng: 55.275 },
  "dubai town square": { lat: 25.005, lng: 55.275 },

  "tilal al ghaf": { lat: 25.01, lng: 55.21 },

  "mohammed bin rashid city": { lat: 25.13, lng: 55.31 },
  "mbr city": { lat: 25.13, lng: 55.31 },
  meydan: { lat: 25.14, lng: 55.3 },
  "meydan city": { lat: 25.14, lng: 55.3 },

  "al khawaneej": { lat: 25.25, lng: 55.45 },
  khawaneej: { lat: 25.25, lng: 55.45 },
  "al khawaneej 1": { lat: 25.255, lng: 55.445 },
  "al khawaneej 2": { lat: 25.245, lng: 55.455 },

  hatta: { lat: 24.8, lng: 56.115 },

  "dubai south": { lat: 24.91, lng: 55.03 },
  "dubai world central": { lat: 24.88, lng: 55.15 },
  dwc: { lat: 24.88, lng: 55.15 },
  "expo city": { lat: 24.95, lng: 55.05 },
  "expo 2020": { lat: 24.95, lng: 55.05 },

  "jebel ali": { lat: 25.01, lng: 55.03 },
  "jebel ali industrial": { lat: 25.0, lng: 55.02 },
  "jebel ali freezone": { lat: 25.02, lng: 55.04 },
  jafza: { lat: 25.02, lng: 55.04 },

  "palm jebel ali": { lat: 25.005, lng: 55.01 },

  "bluewaters island": { lat: 25.08, lng: 55.12 },
  bluewaters: { lat: 25.08, lng: 55.12 },

  "dubai maritime city": { lat: 25.265, lng: 55.275 },
  "maritime city": { lat: 25.265, lng: 55.275 },

  "culture village": { lat: 25.21, lng: 55.33 },
  "dubai culture village": { lat: 25.21, lng: 55.33 },

  "dubai healthcare city": { lat: 25.225, lng: 55.32 },
  "healthcare city": { lat: 25.225, lng: 55.32 },
  dhcc: { lat: 25.225, lng: 55.32 },

  "al jadaf": { lat: 25.215, lng: 55.325 },
  jadaf: { lat: 25.215, lng: 55.325 },

  "oud metha": { lat: 25.235, lng: 55.31 },
  "bur dubai oud metha": { lat: 25.235, lng: 55.31 },

  wafi: { lat: 25.23, lng: 55.315 },
  "wafi city": { lat: 25.23, lng: 55.315 },

  dubai: DUBAI_CENTER,
  unknown: DUBAI_CENTER,
};

function hashString(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i++) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }
  return hash;
}

export function getAreaCoordinates(location: string): { lat: number; lng: number } {
  const normalized = location.toLowerCase().trim();

  if (DUBAI_AREA_COORDINATES[normalized]) {
    return DUBAI_AREA_COORDINATES[normalized];
  }

  for (const [key, coords] of Object.entries(DUBAI_AREA_COORDINATES)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return coords;
    }
  }

  const words = normalized.split(/\s+/);
  for (const word of words) {
    if (word.length > 3) {
      for (const [key, coords] of Object.entries(DUBAI_AREA_COORDINATES)) {
        if (key.includes(word)) {
          return coords;
        }
      }
    }
  }

  return DUBAI_CENTER;
}

function scatterAroundCenter(
  center: { lat: number; lng: number },
  seed: string,
): { lat: number; lng: number } {
  const hash = hashString(seed);
  const angle = (hash % 360) * (Math.PI / 180);
  const distance = (((hash >> 9) % 1000) / 1000) * SCATTER_RADIUS;

  return {
    lat: center.lat + Math.sin(angle) * distance,
    lng: center.lng + Math.cos(angle) * distance,
  };
}

export function getPropertyCoordinates(
  location: string,
  options?: { propertyId?: string },
): { lat: number; lng: number } {
  const center = getAreaCoordinates(location);

  if (!options?.propertyId) {
    return center;
  }

  return scatterAroundCenter(center, options.propertyId);
}
