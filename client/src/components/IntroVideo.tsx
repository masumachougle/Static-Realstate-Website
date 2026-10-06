import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Play, SkipForward } from "lucide-react";
import introVideoSrc from "@assets/VIDEO-2025-11-05-16-42-31_1762428832506.mp4";

export function IntroVideo() {
  const [showVideo, setShowVideo] = useState(false);
  const [videoStarted, setVideoStarted] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Always show video for now (testing mode)
    setShowVideo(true);
  }, []);

  const handleStart = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setVideoStarted(true);
    }
  };

  const handleSkip = () => {
    localStorage.setItem("ksenza-intro-seen", "true");
    setShowVideo(false);
  };

  const handleVideoEnd = () => {
    localStorage.setItem("ksenza-intro-seen", "true");
    setShowVideo(false);
  };

  if (!showVideo) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black">
      <video
        ref={videoRef}
        className="w-full h-full object-cover"
        onEnded={handleVideoEnd}
        playsInline
        data-testid="intro-video"
      >
        <source src={introVideoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Controls Overlay */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/40" />
        
        {!videoStarted ? (
          <div className="relative z-10 text-center space-y-6">
            <h2 className="text-4xl md:text-5xl font-heading text-white mb-4">
              Welcome to Ksenza Hayat Properties
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Essence Of Life
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="default"
                onClick={handleStart}
                data-testid="button-start-video"
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Experience
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleSkip}
                data-testid="button-skip-video"
                className="bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:text-white"
              >
                <SkipForward className="h-5 w-5 mr-2" />
                Skip to Website
              </Button>
            </div>
          </div>
        ) : (
          <Button
            size="lg"
            variant="outline"
            onClick={handleSkip}
            data-testid="button-skip-playing"
            className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white/20 hover:text-white z-10"
          >
            <SkipForward className="h-5 w-5 mr-2" />
            Skip
          </Button>
        )}
      </div>
    </div>
  );
}
