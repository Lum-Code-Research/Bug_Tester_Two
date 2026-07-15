export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderSearchPage(searchQuery: string, matchesHtml: string): string {
  const safeQuery = escapeHtml(searchQuery);
  return `
    <!DOCTYPE html>
    <html>
      <head><title>Search results</title><link rel="stylesheet" href="/styles.css" /></head>
      <body>
        <main class="panel" style="max-width:720px;margin:2rem auto;">
          <h1>Search</h1>
          <p>You searched for: ${safeQuery}</p>
          <div>${matchesHtml}</div>
          <p><a href="/search.html">Back</a></p>
        </main>
      </body>
    </html>
  `;
}

export function renderUserBio(displayName: string, bioText: string): string {
  const safeName = escapeHtml(displayName);
  const safeBio = escapeHtml(bioText);
  return `
    <!DOCTYPE html>
    <html>
      <head><title>Bio</title><link rel="stylesheet" href="/styles.css" /></head>
      <body>
        <main class="panel" style="max-width:720px;margin:2rem auto;">
          <section>
            <h2>${safeName}</h2>
            <div class="bio">${safeBio}</div>
          </section>
          <p><a href="/post.html">Back</a></p>
        </main>
      </body>
    </html>
  `;
}

export function renderPostPreview(author: string, body: string): string {
  return `<article class="post"><strong>${escapeHtml(author)}</strong><div>${escapeHtml(body)}</div></article>`;
}
