import { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight, Maximize2, Map } from "lucide-react";
import { getImageUrl } from "@/lib/imageMap";
import MapLocation from "@/components/MapLocation";

interface VirtualTourProps {
  propertyType: string;
  location: string;
  title?: string;
  latitude?: number | null;
  longitude?: number | null;
}

interface Hotspot {
  pitch: number;
  yaw: number;
  type: "info" | "scene";
  text: string;
  sceneId?: string;
}

interface TourScene {
  id: string;
  title: string;
  imageId: string;
  type: "interior" | "aerial";
  hotspots: Hotspot[];
}

export default function VirtualTour({ propertyType, location, title, latitude, longitude }: VirtualTourProps) {
  const viewerRef = useRef<HTMLDivElement>(null);
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"360" | "map">("360");

  const scenes: TourScene[] = [
    ...(propertyType.toLowerCase().includes("villa") || location.includes("Palm Jumeirah")
      ? [{
          id: "villa",
          title: "Living Room - 360° View",
          imageId: "villa_panorama",
          type: "interior" as const,
          hotspots: [
            { pitch: -10, yaw: 120, type: "info" as const, text: "Floor-to-ceiling windows with Gulf views" },
            { pitch: 0, yaw: -45, type: "info" as const, text: "Designer furniture and marble flooring" },
            { pitch: -5, yaw: 180, type: "info" as const, text: "Open-plan living area" },
          ]
        }]
      : []),
    ...(propertyType.toLowerCase().includes("penthouse")
      ? [{
          id: "penthouse",
          title: "Master Bedroom - 360° View",
          imageId: "penthouse_panorama",
          type: "interior" as const,
          hotspots: [
            { pitch: -8, yaw: 90, type: "info" as const, text: "Panoramic Dubai Marina views" },
            { pitch: 0, yaw: -90, type: "info" as const, text: "Walk-in closet" },
            { pitch: -5, yaw: 0, type: "info" as const, text: "King-size master suite" },
          ]
        }]
      : []),
    ...(propertyType.toLowerCase().includes("apartment") || location.includes("Beach")
      ? [{
          id: "beachfront",
          title: "Terrace - 360° View",
          imageId: "beachfront_panorama",
          type: "interior" as const,
          hotspots: [
            { pitch: -10, yaw: 0, type: "info" as const, text: "Private beach access" },
            { pitch: -5, yaw: 135, type: "info" as const, text: "Ocean and skyline views" },
            { pitch: 0, yaw: -90, type: "info" as const, text: "Outdoor seating area" },
          ]
        }]
      : []),
    ...(location.includes("Palm Jumeirah")
      ? [{
          id: "aerial",
          title: "Palm Jumeirah - Aerial View",
          imageId: "palm_jumeirah_aerial",
          type: "aerial" as const,
          hotspots: [
            { pitch: -20, yaw: 0, type: "info" as const, text: "Iconic palm-shaped island" },
            { pitch: -15, yaw: 90, type: "info" as const, text: "The Crescent with luxury hotels" },
            { pitch: -25, yaw: -45, type: "info" as const, text: "Private villa fronds" },
          ]
        }]
      : []),
  ];

  const currentScene = scenes[currentSceneIndex] || scenes[0];

  useEffect(() => {
    if (activeTab === "360" && viewerRef.current && currentScene) {
      const pannellum = (window as any).pannellum;
      
      if (!pannellum) {
        console.error("Pannellum library not loaded");
        return;
      }

      viewerRef.current.innerHTML = "";

      const hotspots = (currentScene.hotspots || []).map((hotspot) => ({
        pitch: hotspot.pitch,
        yaw: hotspot.yaw,
        type: hotspot.type,
        text: hotspot.text,
        ...(hotspot.sceneId && { sceneId: hotspot.sceneId }),
      }));

      const viewer = pannellum.viewer(viewerRef.current, {
        type: "equirectangular",
        panorama: getImageUrl(currentScene.imageId),
        autoLoad: true,
        showControls: true,
        showFullscreenCtrl: true,
        showZoomCtrl: true,
        mouseZoom: true,
        autoRotate: -2,
        compass: false,
        hotSpots: hotspots,
      });

      return () => {
        if (viewer && viewer.destroy) {
          viewer.destroy();
        }
      };
    }
  }, [currentScene, activeTab]);

  const handlePrevScene = () => {
    setCurrentSceneIndex((prev) => (prev > 0 ? prev - 1 : scenes.length - 1));
  };

  const handleNextScene = () => {
    setCurrentSceneIndex((prev) => (prev < scenes.length - 1 ? prev + 1 : 0));
  };

  if (scenes.length === 0) {
    return null;
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-heading font-semibold mb-2">Virtual Tour</h2>
        <p className="text-muted-foreground">
          Explore this property with our interactive 360° views and location map
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "360" | "map")} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="360" className="gap-2" data-testid="tab-360-view">
            <Maximize2 className="h-4 w-4" />
            360° Views
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2" data-testid="tab-map-view">
            <Map className="h-4 w-4" />
            Location Map
          </TabsTrigger>
        </TabsList>

        <TabsContent value="360" className="space-y-4">
          <div className="relative bg-muted rounded-md overflow-hidden" style={{ height: "500px" }}>
            <div
              ref={viewerRef}
              className="w-full h-full"
              data-testid="panorama-viewer"
            />
          </div>

          <div className="flex items-center justify-between gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handlePrevScene}
              disabled={scenes.length <= 1}
              data-testid="button-prev-scene"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex-1 text-center">
              <p className="font-medium">{currentScene?.title}</p>
              <p className="text-sm text-muted-foreground">
                {currentSceneIndex + 1} of {scenes.length}
              </p>
            </div>

            <Button
              variant="outline"
              size="icon"
              onClick={handleNextScene}
              disabled={scenes.length <= 1}
              data-testid="button-next-scene"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <div className="relative rounded-md overflow-hidden z-0">
            <MapLocation
              title={title ?? location}
              lat={latitude}
              lng={longitude}
              className="h-[500px] w-full rounded-md"
            />
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Nearby Attractions</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {location.includes("Marina") ? "Dubai Marina Mall" : "The Dubai Mall"}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {location.includes("Downtown") ? "Burj Khalifa" : "Burj Al Arab"}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  {location.includes("Beach") ? "The Walk JBR" : "City Walk"}
                </li>
              </ul>
            </Card>
            
            <Card className="p-4">
              <h4 className="font-semibold mb-3">Transportation</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Metro station nearby
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Easy highway access
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  Taxi & ride-share available
                </li>
              </ul>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
