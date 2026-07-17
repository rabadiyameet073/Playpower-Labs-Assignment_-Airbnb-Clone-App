import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface GuestConfig {
  adults: number;
  children: number;
  infants: number;
  pets: number;
}

export interface ToastMessage {
  id: number;
  text: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface AppContextType {
  checkIn: string;
  setCheckIn: (date: string) => void;
  checkOut: string;
  setCheckOut: (date: string) => void;
  guests: GuestConfig;
  setGuests: React.Dispatch<React.SetStateAction<GuestConfig>>;
  guestOpen: boolean;
  setGuestOpen: (open: boolean) => void;
  tourOpen: boolean;
  setTourOpen: (open: boolean) => void;
  tourIndex: number;
  setTourIndex: (index: number) => void;
  lightboxOpen: boolean;
  setLightboxOpen: (open: boolean) => void;
  lightboxIndex: number;
  setLightboxIndex: (index: number) => void;
  amenitiesOpen: boolean;
  setAmenitiesOpen: (open: boolean) => void;
  reviewsOpen: boolean;
  setReviewsOpen: (open: boolean) => void;
  helpOpen: boolean;
  setHelpOpen: (open: boolean) => void;
  authModalOpen: boolean;
  authModalMode: "login" | "signup";
  openAuthModal: (mode: "login" | "signup") => void;
  closeAuthModal: () => void;
  user: UserProfile | null;
  login: (user: UserProfile) => void;
  logout: () => void;
  openPhotoTour: (index?: number) => void;
  closePhotoTour: () => void;
  openLightbox: (index: number) => void;
  closeLightbox: () => void;
  toasts: ToastMessage[];
  showToast: (text: string) => void;
  savedOpen: boolean;
  setSavedOpen: (open: boolean) => void;
  savedListings: any[];
  toggleSaveListing: (listing: any) => void;
  isListingSaved: (title: string) => boolean;
  claimedDiscount: boolean;
  setClaimedDiscount: (claimed: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

let toastIdCounter = 0;

export function AppProvider({ children }: { children: ReactNode }) {
  const [checkIn, setCheckIn] = useState<string>("2026-08-10");
  const [checkOut, setCheckOut] = useState<string>("2026-08-15");
  const [guests, setGuests] = useState<GuestConfig>({
    adults: 2,
    children: 0,
    infants: 0,
    pets: 0,
  });
  const [guestOpen, setGuestOpen] = useState(false);
  const [tourOpen, setTourOpen] = useState(false);
  const [tourIndex, setTourIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [amenitiesOpen, setAmenitiesOpen] = useState(false);
  const [reviewsOpen, setReviewsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<"login" | "signup">("login");
  const [user, setUser] = useState<UserProfile | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const [savedOpen, setSavedOpen] = useState(false);
  const [claimedDiscount, setClaimedDiscount] = useState(false);
  const [savedListings, setSavedListings] = useState<any[]>(() => {
    try {
      const stored = localStorage.getItem("savedListings");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const openPhotoTour = (index: number = 0) => {
    setTourIndex(index);
    setTourOpen(true);
  };

  const closePhotoTour = () => {
    setTourOpen(false);
  };

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
  };

  const openAuthModal = useCallback((mode: "login" | "signup") => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setAuthModalOpen(false);
  }, []);

  const login = useCallback((profile: UserProfile) => {
    setUser(profile);
    setAuthModalOpen(false);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const showToast = useCallback((text: string) => {
    const id = ++toastIdCounter;
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const toggleSaveListing = useCallback((listing: any) => {
    const isSaved = savedListings.some((l) => l.title === listing.title);
    const updated = isSaved
      ? savedListings.filter((l) => l.title !== listing.title)
      : [...savedListings, listing];

    setSavedListings(updated);
    localStorage.setItem("savedListings", JSON.stringify(updated));

    if (isSaved) {
      showToast("Removed from Saved");
    } else {
      showToast("Saved successfully!");
    }
  }, [savedListings, showToast]);

  const isListingSaved = useCallback((title: string) => {
    return savedListings.some((l) => l.title === title);
  }, [savedListings]);

  return (
    <AppContext.Provider
      value={{
        checkIn,
        setCheckIn,
        checkOut,
        setCheckOut,
        guests,
        setGuests,
        guestOpen,
        setGuestOpen,
        tourOpen,
        setTourOpen,
        tourIndex,
        setTourIndex,
        lightboxOpen,
        setLightboxOpen,
        lightboxIndex,
        setLightboxIndex,
        amenitiesOpen,
        setAmenitiesOpen,
        reviewsOpen,
        setReviewsOpen,
        helpOpen,
        setHelpOpen,
        authModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        user,
        login,
        logout,
        openPhotoTour,
        closePhotoTour,
        openLightbox,
        closeLightbox,
        toasts,
        showToast,
        savedOpen,
        setSavedOpen,
        savedListings,
        toggleSaveListing,
        isListingSaved,
        claimedDiscount,
        setClaimedDiscount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
