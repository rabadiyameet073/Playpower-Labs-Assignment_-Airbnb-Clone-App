import React, { lazy, Suspense } from "react";
import { MotionConfig } from "framer-motion";

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

// Lazy load the photo tour modal — only needed on interaction
const PhotoTour = lazy(() => import("./components/PhotoTour"));

export default function App() {
  return (
    <AppProvider>
      <MotionConfig reducedMotion="user">
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
      </MotionConfig>
    </AppProvider>
  );
}
