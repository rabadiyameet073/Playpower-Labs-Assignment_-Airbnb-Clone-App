import React, { useState, useRef, useCallback, memo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Search, ChevronRight, ChevronDown, Shield, Home, CreditCard, Key, MessageSquare, AlertCircle, Globe, Heart, Star, HelpCircle, BookOpen, Users } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useBodyScrollLock } from "../hooks/useBodyScrollLock";
import { useFocusTrap } from "../hooks/useFocusTrap";

const HELP_CATEGORIES = [
  {
    icon: Home,
    title: "Getting started",
    description: "Learn how to search, book and manage your stays",
    articles: [
      { q: "How do I search for a place to stay?", a: "Use the search bar at the top of the page. Enter your destination, travel dates, and number of guests to find available listings. You can also use filters to narrow down results by price, property type, amenities, and more." },
      { q: "How do I book a listing?", a: "Once you find a listing you like, click 'Reserve' and follow the prompts. You'll need to confirm your dates, guest count, and payment information. Some listings offer instant booking, while others require host approval." },
      { q: "What is the check-in process?", a: "Check-in details are provided by the host after your booking is confirmed. This may include self check-in via lockbox, key pickup, or meeting the host in person. Details will appear in your itinerary 48 hours before check-in." },
      { q: "How do I contact my host?", a: "You can message your host directly through the Airbnb messaging system. Click 'Message host' on their listing page or go to your inbox after booking." },
    ]
  },
  {
    icon: CreditCard,
    title: "Payments & pricing",
    description: "Understand fees, refunds and payment methods",
    articles: [
      { q: "How does pricing work?", a: "The total price includes the nightly rate set by the host, a cleaning fee, and an Airbnb service fee. Some listings may also include extra guest fees. The total is displayed before you confirm your booking." },
      { q: "When will I be charged?", a: "For most bookings, you'll be charged when your reservation is confirmed. For longer stays (28+ nights), you may be eligible for monthly payments. Airbnb holds your payment and releases it to the host 24 hours after check-in." },
      { q: "What payment methods are accepted?", a: "Airbnb accepts major credit cards (Visa, Mastercard, American Express), debit cards, PayPal, Google Pay, Apple Pay, and in some regions, bank transfers and local payment methods like UPI." },
      { q: "How do refunds work?", a: "Refunds depend on the host's cancellation policy. If eligible, refunds are processed to your original payment method and typically appear within 5-15 business days depending on your bank." },
    ]
  },
  {
    icon: Shield,
    title: "Safety & security",
    description: "Stay safe during your travels",
    articles: [
      { q: "What is AirCover?", a: "AirCover is Airbnb's comprehensive protection for guests. It includes booking protection guarantee, check-in guarantee, get-what-you-booked guarantee, and a 24-hour safety line. It's automatically included in every booking at no extra cost." },
      { q: "How do I report a safety concern?", a: "If you encounter a safety issue, contact Airbnb's emergency support line immediately. You can also report concerns through the app by going to your trip details and selecting 'Get help'. For immediate dangers, always contact local emergency services first." },
      { q: "Are listings verified?", a: "Airbnb verifies host identities and reviews listings for accuracy. However, we recommend reading recent reviews, checking host response rates, and looking for Superhost badges for additional assurance." },
      { q: "What should I do in an emergency?", a: "In case of an emergency, always call local emergency services (police, fire, ambulance) first. Then contact Airbnb's 24/7 safety team through the app or by calling our emergency line listed in your booking confirmation." },
    ]
  },
  {
    icon: Key,
    title: "Your account",
    description: "Manage your profile, settings and preferences",
    articles: [
      { q: "How do I create an account?", a: "Click 'Sign up' in the top navigation. You can register using your email address, phone number, or social accounts (Google, Facebook, Apple). You'll need to verify your identity before making your first booking." },
      { q: "How do I edit my profile?", a: "Go to your profile settings to update your photo, bio, location, and other personal details. A complete profile helps build trust with hosts and increases your chances of booking acceptance." },
      { q: "How do I change my password?", a: "Go to Account Settings > Login & Security. Click 'Update' next to Password. You'll need to enter your current password and then your new password twice to confirm the change." },
      { q: "How do I delete my account?", a: "You can request account deletion from Account Settings > Privacy > Request data deletion. Note that this action is permanent and you'll lose access to all your booking history, messages, and reviews." },
    ]
  },
  {
    icon: MessageSquare,
    title: "Reviews & feedback",
    description: "How reviews work on Airbnb",
    articles: [
      { q: "How do reviews work?", a: "After each stay, both guests and hosts have 14 days to leave a review. Reviews are published simultaneously so neither party can see the other's review before submitting their own. This ensures honest, unbiased feedback." },
      { q: "Can I edit or remove my review?", a: "Reviews can be edited within 48 hours of submission. After that, you can only request removal if the review violates Airbnb's content policy. Contact Airbnb support if you believe a review is unfair or contains inaccurate information." },
      { q: "What is a Guest Favourite?", a: "Guest Favourite listings are among the most loved homes on Airbnb, based on ratings, reviews, and reliability. These listings consistently receive high marks across all categories and have earned the trust of the Airbnb community." },
      { q: "How are ratings calculated?", a: "Overall ratings are calculated from individual category scores: cleanliness, accuracy, check-in, communication, location, and value. Each category is rated on a 1-5 star scale, and the overall rating is the average of these scores." },
    ]
  },
  {
    icon: Globe,
    title: "Hosting",
    description: "Everything about becoming a host",
    articles: [
      { q: "How do I become a host?", a: "Click 'Become a host' in the navigation bar. You'll be guided through listing your space, setting your price, and describing your amenities. Airbnb provides free tools and support to help you get started." },
      { q: "How much can I earn?", a: "Earnings depend on your location, property type, amenities, and local demand. Airbnb provides a pricing tool that suggests competitive rates based on similar listings in your area." },
      { q: "What is Superhost status?", a: "Superhosts are experienced hosts with consistently high ratings, high response rates, and few cancellations. The badge is awarded quarterly and provides additional visibility in search results." },
      { q: "How does host protection work?", a: "AirCover for Hosts includes $3M damage protection, $1M liability insurance, pet damage protection, income loss protection, and a 14-day filing window for damage claims." },
    ]
  },
];

const HelpCenter = memo(function HelpCenter() {
  const { helpOpen, setHelpOpen, showToast } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<string | null>(null);

  useBodyScrollLock(helpOpen);
  useFocusTrap(panelRef, helpOpen);

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      showToast(`Showing results for "${searchQuery.trim()}"`);
    }
  }, [searchQuery, showToast]);

  const toggleCategory = useCallback((idx: number) => {
    setExpandedCategory((prev) => (prev === idx ? null : idx));
    setExpandedArticle(null);
  }, []);

  const toggleArticle = useCallback((key: string) => {
    setExpandedArticle((prev) => (prev === key ? null : key));
  }, []);

  // Filter categories by search query
  const filteredCategories = searchQuery.trim()
    ? HELP_CATEGORIES.map((cat) => ({
        ...cat,
        articles: cat.articles.filter(
          (a) =>
            a.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.a.toLowerCase().includes(searchQuery.toLowerCase())
        ),
      })).filter((cat) => cat.articles.length > 0)
    : HELP_CATEGORIES;

  return (
    <Dialog.Root open={helpOpen} onOpenChange={setHelpOpen}>
      <AnimatePresence>
        {helpOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                key="help-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-white"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                key="help-content"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 40 }}
                transition={{ duration: 0.35, ease: [0.2, 0, 0, 1] }}
                ref={panelRef}
                className="fixed inset-0 z-50 flex flex-col bg-white overflow-y-auto"
                aria-describedby={undefined}
              >
                {/* Header */}
                <div className="sticky top-0 z-50 bg-white border-b border-neutral-200">
                  <div className="max-w-[1120px] mx-auto px-6 flex items-center justify-between py-4">
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-neutral-100"
                        aria-label="Close help center"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </Dialog.Close>
                    <Dialog.Title className="text-lg font-semibold text-foreground">
                      Help Centre
                    </Dialog.Title>
                    <div className="w-10" />
                  </div>
                </div>

                {/* Hero Section */}
                <div className="bg-gradient-to-br from-[#FF385C] to-[#E31C5F] text-white">
                  <div className="max-w-[1120px] mx-auto px-6 py-16 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-3">Hi, how can we help?</h2>
                    <p className="text-white/80 text-lg mb-8 max-w-lg mx-auto">
                      Search our help articles or browse topics below
                    </p>

                    {/* Search Bar */}
                    <form onSubmit={handleSearch} className="max-w-xl mx-auto relative">
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
                        <input
                          type="text"
                          placeholder="Search for help..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full h-14 pl-12 pr-4 rounded-full text-foreground bg-white shadow-lg text-base outline-none focus:ring-2 focus:ring-white/50 placeholder:text-neutral-400"
                        />
                      </div>
                    </form>
                  </div>
                </div>

                {/* Quick Actions Row */}
                <div className="max-w-[1120px] mx-auto px-6 w-full">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 -mt-8 mb-12">
                    {[
                      { icon: BookOpen, label: "Booking help", desc: "Manage reservations" },
                      { icon: Shield, label: "AirCover", desc: "Your protection" },
                      { icon: CreditCard, label: "Payments", desc: "Billing & refunds" },
                      { icon: Users, label: "Community", desc: "Guidelines & policies" },
                    ].map((action) => (
                      <button
                        key={action.label}
                        type="button"
                        onClick={() => showToast(`${action.label}: Feature coming soon`)}
                        className="bg-white rounded-2xl p-5 shadow-md border border-neutral-100 text-left transition-all hover:shadow-lg hover:-translate-y-0.5 active:scale-[0.98] group"
                      >
                        <action.icon className="h-7 w-7 text-[#FF385C] mb-3 transition-transform group-hover:scale-110" strokeWidth={1.5} />
                        <div className="text-sm font-semibold text-foreground">{action.label}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{action.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Help Categories */}
                <div className="max-w-[1120px] mx-auto px-6 w-full pb-16">
                  <h3 className="text-xl font-bold text-foreground mb-6">Browse all topics</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredCategories.map((cat, catIdx) => {
                      const isExpanded = expandedCategory === catIdx;
                      const IconComp = cat.icon;
                      return (
                        <div
                          key={cat.title}
                          className={`rounded-2xl border transition-all ${
                            isExpanded
                              ? "border-[#FF385C]/30 bg-[#FFF8F6] col-span-1 md:col-span-2"
                              : "border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm"
                          }`}
                        >
                          {/* Category Header */}
                          <button
                            type="button"
                            onClick={() => toggleCategory(catIdx)}
                            className="w-full flex items-center gap-4 p-5 text-left"
                          >
                            <div className={`flex h-11 w-11 items-center justify-center rounded-xl shrink-0 transition-colors ${isExpanded ? "bg-[#FF385C] text-white" : "bg-neutral-100 text-foreground"}`}>
                              <IconComp className="h-5 w-5" strokeWidth={1.5} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-base font-semibold text-foreground">{cat.title}</div>
                              <div className="text-sm text-muted-foreground mt-0.5 truncate">{cat.description}</div>
                            </div>
                            <ChevronDown
                              className={`h-5 w-5 text-muted-foreground shrink-0 transition-transform duration-200 ${isExpanded ? "rotate-180" : ""}`}
                            />
                          </button>

                          {/* Expanded Articles */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.2, 0, 0, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="px-5 pb-5 space-y-2">
                                  {cat.articles.map((article, aIdx) => {
                                    const articleKey = `${catIdx}-${aIdx}`;
                                    const isArticleOpen = expandedArticle === articleKey;
                                    return (
                                      <div
                                        key={articleKey}
                                        className={`rounded-xl border transition-all ${isArticleOpen ? "border-neutral-200 bg-white shadow-sm" : "border-transparent"}`}
                                      >
                                        <button
                                          type="button"
                                          onClick={() => toggleArticle(articleKey)}
                                          className="w-full flex items-center justify-between p-4 text-left group"
                                        >
                                          <span className="text-sm font-medium text-foreground group-hover:text-[#FF385C] transition-colors pr-4">
                                            {article.q}
                                          </span>
                                          <ChevronRight
                                            className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${isArticleOpen ? "rotate-90" : ""}`}
                                          />
                                        </button>

                                        <AnimatePresence>
                                          {isArticleOpen && (
                                            <motion.div
                                              initial={{ height: 0, opacity: 0 }}
                                              animate={{ height: "auto", opacity: 1 }}
                                              exit={{ height: 0, opacity: 0 }}
                                              transition={{ duration: 0.2 }}
                                              className="overflow-hidden"
                                            >
                                              <p className="px-4 pb-4 text-sm text-muted-foreground leading-relaxed">
                                                {article.a}
                                              </p>
                                            </motion.div>
                                          )}
                                        </AnimatePresence>
                                      </div>
                                    );
                                  })}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom Contact Section */}
                  <div className="mt-16 text-center border-t border-neutral-200 pt-12">
                    <HelpCircle className="h-10 w-10 text-[#FF385C] mx-auto mb-4" strokeWidth={1.5} />
                    <h3 className="text-xl font-bold text-foreground mb-2">Need more help?</h3>
                    <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                      Can't find what you're looking for? Our support team is available 24/7 to assist you.
                    </p>
                    <div className="flex items-center justify-center gap-4 flex-wrap">
                      <button
                        type="button"
                        onClick={() => showToast("Live chat support coming soon!")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#FF385C] text-white font-semibold text-sm transition-all hover:bg-[#E31C5F] active:scale-[0.97]"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Start a live chat
                      </button>
                      <button
                        type="button"
                        onClick={() => showToast("Call support: +1 (844) 234-2500")}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-foreground text-white font-semibold text-sm transition-all hover:bg-neutral-700 active:scale-[0.97]"
                      >
                        <AlertCircle className="h-4 w-4" />
                        Call us
                      </button>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-neutral-50 border-t border-neutral-200 py-8">
                  <div className="max-w-[1120px] mx-auto px-6 text-center text-sm text-muted-foreground">
                    <p>© {new Date().getFullYear()} Airbnb, Inc. · <a href="#" className="underline hover:text-foreground" onClick={(e) => { e.preventDefault(); showToast("Privacy policy page coming soon"); }}>Privacy</a> · <a href="#" className="underline hover:text-foreground" onClick={(e) => { e.preventDefault(); showToast("Terms of service page coming soon"); }}>Terms</a> · <a href="#" className="underline hover:text-foreground" onClick={(e) => { e.preventDefault(); showToast("Sitemap page coming soon"); }}>Sitemap</a></p>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});

export default HelpCenter;
