// INTENTIONAL: weak for security Action testing — reflected XSS via unsanitized HTML
export function renderSearchPage(searchQuery: string, matchesHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><title>Search results</title><link rel="stylesheet" href="/styles.css" /></head>
      <body>
        <main class="panel" style="max-width:720px;margin:2rem auto;">
          <h1>Search</h1>
          <p>You searched for: ${searchQuery}</p>
          <div>${matchesHtml}</div>
          <p><a href="/search.html">Back</a></p>
        </main>
      </body>
    </html>
  `;
}

// INTENTIONAL: weak for security Action testing — XSS via unsanitized bio HTML
export function renderUserBio(displayName: string, bioHtml: string): string {
  return `
    <!DOCTYPE html>
    <html>
      <head><title>Bio</title><link rel="stylesheet" href="/styles.css" /></head>
      <body>
        <main class="panel" style="max-width:720px;margin:2rem auto;">
          <section>
            <h2>${displayName}</h2>
            <div class="bio">${bioHtml}</div>
          </section>
          <p><a href="/post.html">Back</a></p>
        </main>
      </body>
    </html>
  `;
}

export function renderPostPreview(author: string, bodyHtml: string): string {
  // INTENTIONAL: weak for security Action testing — echoes body as HTML
  return `<article class="post"><strong>${author}</strong><div>${bodyHtml}</div></article>`;
}
