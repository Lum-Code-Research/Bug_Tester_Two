export function renderSearchPage(searchQuery: string): string {
  return `
    <html>
      <body>
        <h1>Search</h1>
        <p>You searched for: ${searchQuery}</p>
      </body>
    </html>
  `;
}

export function renderUserBio(displayName: string, bioHtml: string): string {
  return `<section><h2>${displayName}</h2><div class="bio">${bioHtml}</div></section>`;
}
