import type { ReactNode } from "react";
import "./_group.css";
import "./_story-interactions.css";
import "./_story-visual-refinement.css";
import "./_story-immersive-redesign.css";

const sampleMedia = "/__mockup/images/oldtime-story-sample.jpg";

const Icon = ({ children }: { children: ReactNode }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);

export function Current() {
  return (
    <main className="story-preview" aria-label="Current Oldtime Story viewer">
      <section id="storyview" className="storyview on">
        <div className="progress story-progress" role="group" aria-label="Story 1 of 3">
          <span className="progress-segment story-progress-segment is-complete"><b /></span>
          <span className="progress-segment story-progress-segment is-active"><b id="bar" style={{ width: "48%" }} /></span>
          <span className="progress-segment story-progress-segment"><b /></span>
        </div>
        <div className="story-header">
          <button type="button" className="story-creator" aria-label="Open dayana5091 profile">
            <img src="/__mockup/images/oldtime-story-sample.jpg" alt="" />
            <span className="story-creator-copy"><b>dayana5091</b><small>11h ago</small></span>
          </button>
        </div>
        <button type="button" id="sclose" aria-label="Close Story">
          <Icon><path d="m6 6 12 12M18 6 6 18" /></Icon>
        </button>
        <div className="story-stage">
          <img className="story-stage-media" src={sampleMedia} alt="" />
          <div className="story-caption">When your hair is long enough to do cute styles</div>
        </div>
        <div className="story-bar">
          <button type="button" className="story-profile-mini" aria-label="Open Story author's profile">
            <img src={sampleMedia} alt="" />
          </button>
          <form className="story-compose" aria-label="Reply to Story">
            <input className="story-reply-input" placeholder="Reply…" aria-label="Send a reply" readOnly />
            <button type="button" className="story-reaction-open" aria-label="More reactions">
              <Icon><circle cx="10" cy="12" r="8" /><path d="M6.5 13.5s1.2 2 3.5 2 3.5-2 3.5-2M7.5 9h.01M12.5 9h.01M19 4v6M16 7h6" /></Icon>
            </button>
          </form>
          <div className="story-owner-controls">
            <div className="story-more-wrap">
              <button type="button" className="story-more-open" aria-label="Story activity and options">
                <Icon><path d="M5 6h14M5 12h10M5 18h6" /></Icon>
              </button>
            </div>
          </div>
        </div>
        <div className="story-side-actions">
          <button type="button" className="story-heart" aria-label="Like Story">
            <Icon><path d="M20.5 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.5a8.5 8.5 0 1 1 15.6-5Z" /></Icon>
          </button>
          <button type="button" className="story-share" aria-label="Share Story">
            <Icon><path d="m14 4.5 7 6.8-7 6.8v-4.2c-4.4 0-7.9 1.7-10.5 5.6C4.2 12.8 7.8 9 14 9V4.5Z" /></Icon>
          </button>
        </div>
      </section>
    </main>
  );
}
