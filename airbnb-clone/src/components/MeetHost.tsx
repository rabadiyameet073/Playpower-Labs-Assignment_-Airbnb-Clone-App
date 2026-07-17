import React, { memo, useState, useCallback } from "react";
import { listing, coHosts } from "../data";
import { useApp } from "../context/AppContext";

const MeetHost = memo(function MeetHost() {
  const { host } = listing;
  const { showToast } = useApp();
  const [messageSent, setMessageSent] = useState(false);

  const handleMessageHost = useCallback(() => {
    if (!messageSent) {
      setMessageSent(true);
      showToast(`Message sent to ${host.name}! They typically respond within an hour.`);
    } else {
      showToast(`You've already sent a message to ${host.name}. Check your inbox for their reply.`);
    }
  }, [messageSent, showToast, host.name]);

  return (
    <section className="_AIFnOW" aria-labelledby="meethost-heading">
      <h2 id="meethost-heading" className="_ALTsyF">
        Meet your host
      </h2>

      <div className="_ZTIgnj">
        {/* Left Column Profile Badge Card & Details */}
        <div>
          <div className="_WJiKvs">
            <div className="_CiHGpt">
              <div className="_dYbVNp">
                <img src={host.avatar} alt={host.name} />
                <span className="_vFxzxl">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                    <path d="M16 1a15 15 0 1 1 0 30 15 15 0 0 1 0-30zm0 2a13 13 0 1 0 0 26 13 13 0 0 0 0-26zm7 7.59L24.41 12 13.5 22.91 7.59 17 9 15.59l4.5 4.5z" />
                  </svg>
                </span>
              </div>
              <div className="_XjncJl">{host.name}</div>
              <div className="_cToakA">Host</div>
            </div>

            <div className="_qoxHis">
              <div className="_csfOaJ">
                <div className="_KbAmHH">1,463</div>
                <div className="_mhLNzB">Reviews</div>
              </div>
              <div className="_csfOaJ">
                <div className="_KbAmHH">4.68★</div>
                <div className="_mhLNzB">Rating</div>
              </div>
              <div className="_csfOaJ">
                <div className="_KbAmHH">2</div>
                <div className="_mhLNzB">Years hosting</div>
              </div>
            </div>
          </div>

          <div className="_fWOjkl">
            <div className="_SQxOnW">
              <span className="ico">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                  <path d="M16 0c5.9 0 11 5.28 11 11 0 4.85-3.23 9.27-9.55 13.28l2.2 2.92a1.13 1.13 0 0 1-.9 1.8H17v3h-2v-3h-1.75a1.13 1.13 0 0 1-.9-1.8l2.14-2.86C8.2 20.92 5 16.46 5 11A11 11 0 0 1 16 0zm0 25.67L15 27h2zM16 2a9 9 0 0 0-9 9c0 4.6 2.72 8.43 8.3 11.5l.38.21.28.14.3-.19c5.62-3.53 8.48-7.24 8.72-11.12l.02-.27V11c0-4.64-4.21-9-9-9z" />
                </svg>
              </span>
              Born in the 80s
            </div>
            <div className="_SQxOnW">
              <span className="ico">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                  <path d="m31.47 10.12-15-8a1 1 0 0 0-.94 0l-15 8a1 1 0 0 0 0 1.76L4 13.73V23a1 1 0 0 0 .52.88l11 6a1 1 0 0 0 .96 0l11-6A1 1 0 0 0 28 23v-9.27l2-1.06V23h2V11a1 1 0 0 0-.53-.88zM26 22.4l-10 5.45-10-5.45V14.8l9.53 5.08a1 1 0 0 0 .94 0L26 14.8v7.6zm-10-4.54L3.12 11 16 4.13 28.88 11 16 17.87z" />
                </svg>
              </span>
              Where I went to school: NICMAR GOA
            </div>
          </div>
        </div>

        {/* Right Column Co-Hosts & Contact Details */}
        <div>
          <div className="_CJRduX">Co-Hosts</div>
          <div className="_tUMDNK">
            {coHosts.map((co) => (
              <div key={co.name} className="_BfmZwR">
                {co.avatar ? (
                  <img src={co.avatar} alt={co.name} />
                ) : (
                  <div className="_NOxBfk" style={{ background: co.bg || 'rgb(231,240,253)', color: co.fg || 'rgb(58,110,204)' }}>
                    {co.name[0].toUpperCase()}
                  </div>
                )}
                <span>{co.name}</span>
              </div>
            ))}
          </div>

          <div className="_cNvhFX">Host details</div>
          <div className="_xSFQTJ">
            Response rate: 100%
            <br />
            Responds within an hour
          </div>
          
          <button className="_BwUsIT" type="button" onClick={handleMessageHost}>
            {messageSent ? "Message sent" : "Message host"}
          </button>

          <div className="_SXCeYj">
            <span className="ico">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '100%', width: '100%', fill: 'currentColor' }}>
                <path d="m16 .8.56.37C20.4 3.73 24.2 5 28 5h1v12.5C29 25.57 23.21 31 16 31S3 25.57 3 17.5V5h1c3.8 0 7.6-1.27 11.45-3.83L16 .8zm-1 3a22.2 22.2 0 0 1-9.65 3.15L5 6.97V17.5c0 6.56 4.35 11 10 11.46zm2 0v25.16c5.65-.47 10-4.9 10-11.46V6.97l-.35-.02A22.2 22.2 0 0 1 17 3.8z" />
              </svg>
            </span>
            <span>
              To help protect your payment, always use Airbnb to send money and communicate with hosts.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
});

export default MeetHost;
