import React, { memo, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { useApp } from "../context/AppContext";

const FOOTER_URLS: Record<string, string> = {
  "Help Centre": "__help__",
  "AirCover": "https://www.airbnb.com/aircover",
  "Anti-discrimination": "https://www.airbnb.com/against-discrimination",
  "Disability support": "https://www.airbnb.com/accessibility",
  "Cancellation options": "https://www.airbnb.com/help/article/2701",
  "Report neighbourhood concern": "https://www.airbnb.com/neighbors",
  "Airbnb your home": "https://www.airbnb.com/host/homes",
  "AirCover for Hosts": "https://www.airbnb.com/aircover-for-hosts",
  "Hosting resources": "https://www.airbnb.com/resources",
  "Community forum": "https://community.withairbnb.com",
  "Hosting responsibly": "https://www.airbnb.com/help/responsible-hosting",
  "Join a free hosting class": "https://www.airbnb.com/ambassadors/joinaclass",
  "Newsroom": "https://news.airbnb.com",
  "New features": "https://www.airbnb.com/release",
  "Careers": "https://careers.airbnb.com",
  "Investors": "https://investors.airbnb.com",
  "Gift cards": "https://www.airbnb.com/giftcards",
  "Airbnb.org emergency stays": "https://www.airbnb.org",
};

const SiteFooter = memo(function SiteFooter() {
  const year = new Date().getFullYear();
  const { showToast, setHelpOpen } = useApp();

  const handleFooterLink = useCallback((label: string, e: React.MouseEvent) => {
    e.preventDefault();
    const url = FOOTER_URLS[label];
    if (url === "__help__") {
      setHelpOpen(true);
    } else if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      showToast(`${label}: Coming soon`);
    }
  }, [showToast, setHelpOpen]);

  const sections = [
    {
      title: "Support",
      links: [
        { label: "Help Centre", url: "#" },
        { label: "AirCover", url: "#" },
        { label: "Anti-discrimination", url: "#" },
        { label: "Disability support", url: "#" },
        { label: "Cancellation options", url: "#" },
        { label: "Report neighbourhood concern", url: "#" }
      ]
    },
    {
      title: "Hosting",
      links: [
        { label: "Airbnb your home", url: "#" },
        { label: "AirCover for Hosts", url: "#" },
        { label: "Hosting resources", url: "#" },
        { label: "Community forum", url: "#" },
        { label: "Hosting responsibly", url: "#" },
        { label: "Join a free hosting class", url: "#" }
      ]
    },
    {
      title: "Airbnb",
      links: [
        { label: "Newsroom", url: "#" },
        { label: "New features", url: "#" },
        { label: "Careers", url: "#" },
        { label: "Investors", url: "#" },
        { label: "Gift cards", url: "#" },
        { label: "Airbnb.org emergency stays", url: "#" }
      ]
    }
  ];

  const bottomLinks = ["Privacy", "Terms", "Sitemap", "Company details"];

  return (
    <footer className="site-footer-rich" aria-label="Site footer">
      <div className="site-footer-container">
        {/* Upper Column Links Grid */}
        <div className="site-footer-grid">
          {sections.map((sec) => (
            <div key={sec.title} className="site-footer-column">
              <h3>{sec.title}</h3>
              <ul>
                {sec.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.url}
                      className="site-footer-link"
                      onClick={(e) => handleFooterLink(link.label, e)}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Lower Row Controls & Socials */}
        <div className="site-footer-bottom">
          <div className="site-footer-bottom-left">
            <span>© {year} Airbnb, Inc.</span>
            <span className="mx-1" aria-hidden="true">·</span>
            <ul className="site-footer-bottom-links">
              {bottomLinks.map((link, i) => (
                <React.Fragment key={link}>
                  {i > 0 && <li className="text-neutral-400" aria-hidden="true">·</li>}
                  <li>
                    <a
                      href="#"
                      className="site-footer-bottom-link"
                      onClick={(e) => { e.preventDefault(); showToast(`${link} page coming soon`); }}
                    >
                      {link}
                    </a>
                  </li>
                </React.Fragment>
              ))}
            </ul>
          </div>

          <div className="site-footer-bottom-right">
            {/* Language & Currency Selector buttons */}
            <div className="site-footer-selectors">
              <button
                type="button"
                className="site-footer-btn"
                onClick={() => showToast("Language: English (IN) — Change language feature coming soon")}
              >
                <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "16px", width: "16px", fill: "currentColor" }}>
                  <path d="m8 0a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm2 2.07c-.4.53-.87 1.28-1.28 2.22h2.72c-.44-.92-.93-1.68-1.44-2.22zm-4 0c-.51.54-1 1.3-1.44 2.22h2.72c-.41-.94-.88-1.69-1.28-2.22zm2 .03c-.45.54-.93 1.35-1.31 2.47h2.62c-.38-1.12-.86-1.93-1.31-2.47zm-5.7 3.32a6.01 6.01 0 0 0 -1.16 3.08h2.82c.07-1.12.28-2.18.57-3.08zm4.39 0c-.3 1-.5 2-.57 3.08h3.76c-.07-1.08-.27-2.08-.57-3.08zm4.99 0c.29.9.5 1.96.57 3.08h2.82a6.01 6.01 0 0 0 -1.16-3.08zm-11.23 4.58a6.01 6.01 0 0 0 1.16 3.08c-.29-.9-.5-1.96-.57-3.08zm4.07 0c.07 1.08.27 2.08.57 3.08c.45-.54.93-1.35 1.31-2.47h-2.62c.07 1.12.27 2 .57 3.08zm4.99 0c.07 1.08.27 2.08.57 3.08c.45-.54.93-1.35 1.31-2.47h-2.62c.07 1.12.27 2 .57 3.08zm4.99 0c-.07 1.08-.28 2.14-.57 3.08a6.01 6.01 0 0 0 1.16-3.08zm-7.63 4.5c.41-.53.88-1.28 1.28-2.22h-2.72c.44.92.93 1.68 1.44 2.22zm4 0c.51-.54 1-1.3 1.44-2.22h-2.72c.41.94.88 1.69 1.28 2.22z" />
                </svg>
                <span>English (IN)</span>
              </button>
              <button
                type="button"
                className="site-footer-btn"
                onClick={() => showToast("Currency: ₹ INR — Change currency feature coming soon")}
              >
                <span>₹ INR</span>
              </button>
              <button
                type="button"
                className="site-footer-btn"
                onClick={() => {
                  window.dispatchEvent(new CustomEvent("replay-airbnb-intro"));
                  showToast("Replaying intro animation...");
                }}
                style={{ color: "var(--primary)", fontWeight: 600 }}
              >
                <Sparkles size={14} style={{ marginRight: "4.5px" }} />
                <span>Replay Intro</span>
              </button>
            </div>

            {/* Social Icons */}
            <div className="site-footer-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="site-footer-social-link" aria-label="Facebook">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "18px", width: "18px", fill: "currentColor" }}>
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v16h6V14h4l1-4h-5V7a1 1 0 0 1 1-1h3V2z" />
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="site-footer-social-link" aria-label="Twitter">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "18px", width: "18px", fill: "currentColor" }}>
                  <path d="M31 6.36a11.83 11.83 0 0 1-3.44.94 6 6 0 0 0 2.63-3.32 12.06 12.06 0 0 1-3.8 1.45 6 6 0 0 0-10.22 5.47A17 17 0 0 1 1.67 4.9a6 6 0 0 0 1.86 8 6 6 0 0 1-2.71-.75v.08a6 6 0 0 0 4.8 5.88 6 6 0 0 1-2.7.1 6 6 0 0 0 5.6 4.17 12 12 0 0 1-7.43 2.56A12.18 12.18 0 0 1 0 24.8a17 17 0 0 0 9.18 2.7c11 0 17-9.12 17-17v-.77A12.22 12.22 0 0 0 31 6.36z" />
                </svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="site-footer-social-link" aria-label="Instagram">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: "block", height: "18px", width: "18px", fill: "currentColor" }}>
                  <path d="M16 8a8 8 0 1 0 0 16 8 8 0 0 0 0-16zm0 13a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm10-13a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM16 2.37c4.44 0 4.97.02 6.72.1a9.21 9.21 0 0 1 3.1.57c1.3.5 2.27 1.17 3.25 2.15a9.21 9.21 0 0 1 2.72 9.82 9.21 9.21 0 0 1-.57 3.1c-.5 1.3-1.17 2.27-2.15 3.25a9.21 9.21 0 0 1-9.82 2.72 9.21 9.21 0 0 1-3.1-.57c-1.3-.5-2.27-1.17-3.25-2.15a9.21 9.21 0 0 1-2.72-9.82c.1-.85.3-1.72.57-3.1.5-1.3 1.17-2.27 2.15-3.25a9.21 9.21 0 0 1 9.82-2.72c.85-.1 1.72-.3 3.1-.57zM16 .01c-4.52 0-5.09.02-6.86.1a11.59 11.59 0 0 0-3.83.74c-1.63.63-3 1.48-4.37 2.85S.85 6.33.22 7.96c-.28 1.14-.52 2.32-.64 3.83A119.5 119.5 0 0 0 0 16c0 4.52.02 5.09.1 6.86a11.59 11.59 0 0 0 .74 3.83c.63 1.63 1.48 3 2.85 4.37s2.63 2.25 4.26 2.88c1.14.28 2.32.52 3.83.64A119.5 119.5 0 0 0 16 32c4.52 0 5.09-.02 6.86-.1a11.59 11.59 0 0 0 3.83-.74c1.63-.63 3-1.48 4.37-2.85s2.25-2.63 2.88-4.26c.28-1.14.52-2.32.64-3.83A119.5 119.5 0 0 0 32 16c0-4.52-.02-5.09-.1-6.86a11.59 11.59 0 0 0-.74-3.83c-.63-1.63-1.48-3-2.85-4.37S26.04.85 24.41.22c-1.14-.28-2.32-.52-3.83-.64A119.5 119.5 0 0 0 16 0z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
});

export default SiteFooter;
