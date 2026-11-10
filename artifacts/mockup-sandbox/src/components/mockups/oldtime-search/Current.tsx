import "./_group.css";

export function Current() {
  return (
    <main className="oldtime-search-preview">
      <header className="search-app-header">
        <h1>Search</h1>
        <div className="header-actions">
          <button className="search-layout-toggle" type="button">Explore</button>
          <button className="discovery-search-toggle" type="button" aria-label="Search videos">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="10.8" cy="10.8" r="6.6" />
              <path d="m16 16 4.4 4.4" />
            </svg>
          </button>
        </div>
      </header>
      <nav className="search-hub-tabs" aria-label="Search">
        <button type="button" aria-selected="true">Videos</button>
        <button type="button" aria-selected="false">Places</button>
      </nav>
      <nav className="topic-row" aria-label="Discover topics">
        <button type="button">For You</button>
        <button type="button">Interests</button>
        <button type="button">Around the World</button>
        <button type="button">Culture</button>
        <button type="button">Comedy</button>
        <button type="button">Music</button>
      </nav>
      <div className="empty-state">
        No videos to explore yet.
      </div>
      <nav className="bottom-nav" aria-label="Main navigation">
        <span>Home</span><span>Community</span><span>Create</span><span>Messages</span><span>Search</span>
      </nav>
    </main>
  );
}
