import { useState, type ReactNode } from "react";
import "./_group.css";
import "./_story-interactions.css";
import "./_story-visual-refinement.css";
import "./_story-immersive-redesign.css";
import "./Redesign.css";

const sampleMedia = "/__mockup/images/oldtime-story-sample.jpg";

type IconName = "close" | "reaction" | "heart" | "share" | "menu" | "eye" | "smile" | "laugh" | "surprised";

function Icon({ name, size = 20 }: { name: IconName; size?: number }) {
  const paths: Record<IconName, ReactNode> = {
    close: <path d="m6 6 12 12M18 6 6 18" />,
    reaction: <><circle cx="10" cy="12" r="8" /><path d="M6.5 13.5s1.2 2 3.5 2 3.5-2 3.5-2M7.5 9h.01M12.5 9h.01M19 4v6M16 7h6" /></>,
    heart: <path d="M20.5 11.5a8.5 8.5 0 0 1-8.5 8.5 9 9 0 0 1-4-.9L3 21l1.9-4.5a8.5 8.5 0 1 1 15.6-5Z" />,
    share: <path d="m14 4.5 7 6.8-7 6.8v-4.2c-4.4 0-7.9 1.7-10.5 5.6C4.2 12.8 7.8 9 14 9V4.5Z" />,
    menu: <path d="M5 6h14M5 12h10M5 18h6" />,
    eye: <><path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" /><circle cx="12" cy="12" r="2.4" /></>,
    smile: <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 14s1.2 2 3.5 2 3.5-2 3.5-2M9 9h.01M15 9h.01" /></>,
    laugh: <><circle cx="12" cy="12" r="8.5" /><path d="M8 13.5c.8 2 2.1 3 4 3s3.2-1 4-3M9 9h.01M15 9h.01" /></>,
    surprised: <><circle cx="12" cy="12" r="8.5" /><path d="M9 9h.01M15 9h.01" /><ellipse cx="12" cy="15" rx="1.6" ry="2" /></>,
  };
  return (
    <svg className="navic" viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

export function Redesign() {
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<"views" | "options">("options");
  const [liked, setLiked] = useState(false);
  const [reactionOpen, setReactionOpen] = useState(false);
  const [replySetting, setReplySetting] = useState("on");

  return (
    <main className="story-preview" aria-label="Oldtime Story viewer redesign">
      <section id="storyview" className="storyview on oldtime-redesign">
        <div className="progress story-progress" role="group" aria-label="Story 1 of 3">
          <span className="progress-segment story-progress-segment is-complete"><b /></span>
          <span className="progress-segment story-progress-segment is-active"><b style={{ width: "48%" }} /></span>
          <span className="progress-segment story-progress-segment"><b /></span>
        </div>

        <div className="story-header">
          <button type="button" className="story-creator" aria-label="Open dayana5091 profile">
            <img src={sampleMedia} alt="" />
            <span className="story-creator-copy"><b>dayana5091</b><small>11h ago</small></span>
          </button>
          <div className="story-header-actions">
            <button type="button" className="story-more-open" aria-label="Story activity and options" aria-haspopup="dialog" aria-expanded={panelOpen} onClick={() => { setPanelOpen((value) => !value); setPanelTab("options"); }}>
              <Icon name="menu" size={22} />
            </button>
          </div>
        </div>

        <button type="button" id="sclose" aria-label="Close Story">
          <Icon name="close" />
        </button>

        <div className="story-stage">
          <img className="story-stage-media" src={sampleMedia} alt="" />
          <div className="story-caption">When your hair is long enough to do cute styles</div>
        </div>

        <div className="story-side-actions">
          <button type="button" className={`story-heart${liked ? " is-liked" : ""}`} aria-label={liked ? "Unlike Story" : "Like Story"} aria-pressed={liked} onClick={() => setLiked((value) => !value)}>
            <Icon name="heart" size={25} />
          </button>
          <button type="button" className="story-share" aria-label="Share Story">
            <Icon name="share" size={24} />
          </button>
        </div>

        <div className="story-bar">
          <form className="story-compose" aria-label="Reply to Story" onSubmit={(event) => event.preventDefault()}>
            <input className="story-reply-input" placeholder="Reply…" aria-label="Send a reply" readOnly />
            <button type="button" className="story-reaction-open" aria-label="More reactions" aria-expanded={reactionOpen} onClick={() => setReactionOpen((value) => !value)}>
              <Icon name="reaction" size={22} />
            </button>
          </form>
        </div>

        <div className="story-reaction-picker" role="group" aria-label="Story reactions" hidden={!reactionOpen}>
          {([
            ["heart", "React with a heart"],
            ["smile", "React with a smile"],
            ["laugh", "React with a laugh"],
            ["surprised", "React with surprise"],
          ] as const).map(([name, label]) => (
            <button key={name} type="button" aria-label={label} onClick={() => setReactionOpen(false)}>
              <Icon name={name} size={22} />
            </button>
          ))}
        </div>

        <div className={`story-more-menu${panelOpen ? " is-open" : ""}`} role="dialog" aria-label="Story activity and options" aria-hidden={!panelOpen}>
          <div className="story-panel-handle" aria-hidden="true" />
          <header className="story-panel-head">
            <div className="story-panel-tabs" role="tablist" aria-label="Story controls">
              <button type="button" className="story-panel-tab" role="tab" aria-selected={panelTab === "views"} onClick={() => setPanelTab("views")}>
                <Icon name="eye" size={16} /><span>Views</span>
              </button>
              <button type="button" className="story-panel-tab" role="tab" aria-selected={panelTab === "options"} onClick={() => setPanelTab("options")}>Options</button>
            </div>
            <button type="button" className="story-panel-close" aria-label="Close Story controls" onClick={() => setPanelOpen(false)}>
              <Icon name="close" size={18} />
            </button>
          </header>

          {panelTab === "options" ? (
            <div className="story-panel-options" role="tabpanel" aria-label="Story options">
              <button type="button" className="story-more-item">Save to profile</button>
              <label className="story-reply-setting">
                <span>Who can reply?</span>
                <select aria-label="Who can reply?" value={replySetting} onChange={(event) => setReplySetting(event.target.value)}>
                  <option value="on">Allow replies</option>
                  <option value="off">Don't allow replies</option>
                </select>
              </label>
              <button type="button" className="story-more-item">View replies</button>
              <button type="button" className="story-more-item is-destructive">Delete Story</button>
            </div>
          ) : (
            <section className="story-insights" role="tabpanel" aria-label="Story views">
              <header className="story-insights-head">
                <div><b>Story views</b></div>
                <button type="button" className="story-insights-close" aria-label="Close views" onClick={() => setPanelTab("options")}><Icon name="close" size={17} /></button>
              </header>
              <p className="story-insights-empty">No views yet.</p>
            </section>
          )}
        </div>

      </section>
    </main>
  );
}
