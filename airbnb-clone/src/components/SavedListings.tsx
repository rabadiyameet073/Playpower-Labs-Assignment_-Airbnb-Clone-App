import React, { memo, useRef, useCallback } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Heart, Star, Compass } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useFocusTrap } from "../hooks/useFocusTrap";

// Import a cover image for the listing card
import coverImg from "../assets/image1_files/2367476f-11c4-4a14-a7c6-267be62c1d59.jpeg";

const SavedListings = memo(function SavedListings() {
  const { savedOpen, setSavedOpen, savedListings, toggleSaveListing } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);

  useBodyScrollLock(savedOpen);
  useFocusTrap(panelRef, savedOpen);

  const handleClose = useCallback(() => {
    setSavedOpen(false);
  }, [setSavedOpen]);

  // Card Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: "spring", stiffness: 100, damping: 15 } 
    },
    exit: { 
      opacity: 0, 
      scale: 0.9, 
      y: 20, 
      transition: { duration: 0.2 } 
    }
  };

  return (
    <Dialog.Root open={savedOpen} onOpenChange={setSavedOpen}>
      <AnimatePresence>
        {savedOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                key="saved-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                key="saved-content"
                initial={{ opacity: 0, x: "100%" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "100%" }}
                transition={{ type: "spring", stiffness: 260, damping: 28 }}
                className="fixed inset-y-0 right-0 z-50 w-full md:max-w-xl bg-background shadow-modal flex flex-col focus:outline-none"
                ref={panelRef}
              >
                {/* Header */}
                <header className="px-6 py-5 border-b border-border flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Heart className="h-5 w-5 text-rose-500 fill-rose-500" />
                    <h2 className="text-xl font-bold text-foreground">Favorites</h2>
                  </div>
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      onClick={handleClose}
                      aria-label="Close Favorites"
                      className="p-2 rounded-full hover:bg-secondary text-neutral-500 hover:text-foreground transition-all duration-200"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </Dialog.Close>
                </header>

                {/* Main Body */}
                <div className="flex-1 overflow-y-auto px-6 py-8">
                  <AnimatePresence mode="popLayout">
                    {savedListings.length === 0 ? (
                      <motion.div
                        key="empty-state"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-center max-w-sm mx-auto"
                      >
                        <div className="w-16 h-16 rounded-full bg-rose-50 dark:bg-rose-500/10 text-rose-500 flex items-center justify-center mb-6">
                          <Heart className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground mb-2">Create your first wishlist</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                          As you search, click the heart icon on listings you love to save them here for later.
                        </p>
                        <button
                          type="button"
                          onClick={handleClose}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-foreground text-background font-semibold text-sm transition-all hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.97]"
                        >
                          <Compass className="h-4 w-4" />
                          Start exploring
                        </button>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="favorites-list"
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 gap-6"
                      >
                        {savedListings.map((item, index) => (
                          <motion.div
                            key={item.title}
                            variants={cardVariants}
                            layout
                            className="group relative flex flex-col sm:flex-row gap-4 p-3 rounded-2xl border border-black/[0.04] dark:border-white/[0.04] hover:shadow-card hover:bg-neutral-50/50 dark:hover:bg-neutral-800/10 transition-all duration-300 cursor-pointer"
                            onClick={handleClose}
                          >
                            {/* Card Image Container */}
                            <div className="relative aspect-[4/3] sm:w-44 shrink-0 rounded-xl overflow-hidden bg-neutral-100">
                              <img
                                src={coverImg}
                                alt={item.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              />
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSaveListing(item);
                                }}
                                className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-white/90 dark:bg-neutral-900/90 text-rose-500 hover:scale-110 active:scale-95 transition-all shadow-sm"
                                aria-label="Remove from Favorites"
                              >
                                <Heart className="h-4 w-4 fill-rose-500 text-rose-500" />
                              </button>
                            </div>

                            {/* Card Details */}
                            <div className="flex-1 flex flex-col justify-between py-1 min-w-0">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between gap-2">
                                  <span className="text-xs font-semibold text-rose-500 tracking-wide uppercase">
                                    Guest Favourite
                                  </span>
                                  <span className="flex items-center gap-1 text-sm font-semibold">
                                    <Star className="h-3.5 w-3.5 fill-current text-foreground" />
                                    {item.rating || 4.95}
                                  </span>
                                </div>
                                <h4 className="text-base font-bold text-foreground truncate group-hover:text-rose-500 transition-colors">
                                  {item.title}
                                </h4>
                                <p className="text-xs text-muted-foreground truncate">
                                  {item.location || "Candolim, India"} · Entire apartment
                                </p>
                              </div>

                              <div className="flex items-baseline gap-1 mt-3 sm:mt-0">
                                <span className="text-sm font-bold text-foreground">
                                  ₹{item.pricePerNight?.toLocaleString() || "28,499"}
                                </span>
                                <span className="text-xs text-muted-foreground">night</span>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});

export default SavedListings;
