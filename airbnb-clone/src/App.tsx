import React, { lazy, Suspense, useState, useEffect } from "react";
import { MotionConfig, motion, AnimatePresence } from "framer-motion";

import { AppProvider } from "./context/AppContext";
import Navbar from "./components/Navbar";
import StickySubNavbar from "./components/StickySubNavbar";
import TitleRow from "./components/TitleRow";
import PhotoGrid from "./components/PhotoGrid";
import HostSummary from "./components/HostSummary";
import DescriptionSection from "./components/DescriptionSection";
import SleepingSection from "./components/SleepingSection";
import AmenitiesSection from "./components/AmenitiesSection";
import InlineCalendar from "./components/InlineCalendar";
import ReviewsSection from "./components/ReviewsSection";
import MapSection from "./components/MapSection";
import MeetHost from "./components/MeetHost";
import ThingsToKnow from "./components/ThingsToKnow";
import MoreStaysNearby from "./components/MoreStaysNearby";
import BookingCard from "./components/BookingCard";
import SiteFooter from "./components/SiteFooter";
import Toast from "./components/Toast";
import HelpCenter from "./components/HelpCenter";
import AuthModal from "./components/AuthModal";
import SavedListings from "./components/SavedListings";
import IntroAnimation from "./components/IntroAnimation";

// Lazy load the photo tour modal — only needed on interaction
const PhotoTour = lazy(() => import("./components/PhotoTour"));

export default function App() {
  const [introComplete, setIntroComplete] = useState(() => {
    return sessionStorage.getItem("airbnb_intro_played") === "true";
  });

  useEffect(() => {
    const handleReplay = () => {
      sessionStorage.removeItem("airbnb_intro_played");
      setIntroComplete(false);
    };
    window.addEventListener("replay-airbnb-intro", handleReplay);
    return () => window.removeEventListener("replay-airbnb-intro", handleReplay);
  }, []);

  const handleIntroComplete = () => {
    sessionStorage.setItem("airbnb_intro_played", "true");
    setIntroComplete(true);
  };

  return (
    <AppProvider>
      <MotionConfig reducedMotion="user">
        <AnimatePresence mode="wait">
          {!introComplete && (
            <IntroAnimation key="intro" onComplete={handleIntroComplete} />
          )}
        </AnimatePresence>

        <motion.div
          key="main-app-content"
          initial={!introComplete ? { opacity: 0, y: 15 } : { opacity: 1, y: 0 }}
          animate={introComplete ? { opacity: 1, y: 0 } : { opacity: 0, y: 15 }}
          transition={{ duration: 0.65, ease: [0.25, 1, 0.5, 1], delay: 0.1 }}
          style={{ display: introComplete ? "block" : "none" }}
        >
          {/* Navbar */}
          <Navbar />
          <StickySubNavbar />

          {/* Main page content */}
          <main
            className="mx-auto max-w-[1120px] px-6 pb-12"
            id="main-content"
          >
            {/* Title row: h1 + rating + share/save */}
            <TitleRow />

            {/* Hero photo grid */}
            <PhotoGrid />

            {/* Two-column layout: content left, sticky card right */}
            <div className="_UPwKNi mt-8">
              {/* Left column */}
              <div className="_HlYqcO" id="contentLeft">
                <HostSummary />
                <DescriptionSection />
                <SleepingSection />
                <AmenitiesSection />
                <InlineCalendar />
              </div>

              {/* Right column — sticky booking card */}
              <div className="_nuIcYI">
                <div className="_MpaXTl">
                  <BookingCard />
                </div>
              </div>
            </div>

            {/* Wide sections below the two-column grid */}
            <div className="_iJFHPP" id="wideSections">
              <ReviewsSection />
              <MapSection />
              <MeetHost />
              <ThingsToKnow />
            </div>

            {/* More stays nearby section */}
            <MoreStaysNearby />
          </main>

          {/* Footer */}
          <SiteFooter />

          {/* Photo Tour modal (lazy loaded, handles lightbox internally) */}
          <Suspense fallback={null}>
            <PhotoTour />
          </Suspense>

          {/* Help Center modal */}
          <HelpCenter />

          {/* Auth Modal */}
          <AuthModal />

          {/* Saved Listings Modal */}
          <SavedListings />

          {/* Global toast notifications */}
          <Toast />
        </motion.div>
      </MotionConfig>
    </AppProvider>
  );
}
