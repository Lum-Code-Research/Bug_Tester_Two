function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await response.text();
  try {
    return { ok: response.ok, data: JSON.parse(text) };
  } catch {
    return { ok: response.ok, data: text };
  }
}

function showResult(elementId, payload) {
  const el = document.getElementById(elementId);
  if (!el) return;
  el.textContent =
    typeof payload === "string" ? payload : JSON.stringify(payload, null, 2);
}

document.addEventListener("DOMContentLoaded", () => {
  const feed = document.getElementById("feed");
  if (feed) {
    fetch("/api/posts?limit=20&offset=0")
      .then((r) => r.json())
      .then((payload) => {
        const posts = payload.items ?? payload;
        feed.innerHTML = posts
          .map(
            (p) =>
              `<article class="post"><strong>${escapeHtml(p.author)}</strong><p>${escapeHtml(p.body)}</p><span class="muted">${escapeHtml(p.createdAt)}</span></article>`,
          )
          .join("");
      })
      .catch((err) => {
        feed.textContent = String(err);
      });
  }

  const postForm = document.getElementById("post-form");
  if (postForm) {
    postForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const author = document.getElementById("author").value;
      const body = document.getElementById("body").value;
      const result = await postJson("/api/posts", { author, body });
      showResult("post-result", result.data);
    });
  }

  const prefsForm = document.getElementById("prefs-form");
  if (prefsForm) {
    prefsForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      let settings = {};
      try {
        settings = JSON.parse(document.getElementById("settings").value);
      } catch (err) {
        showResult("prefs-result", String(err));
        return;
      }
      const result = await postJson("/api/preferences", settings);
      showResult("prefs-result", result.data);
    });
  }

  const formulaForm = document.getElementById("formula-form");
  if (formulaForm) {
    formulaForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const expression = document.getElementById("formula").value;
      const result = await postJson("/api/evaluate", { expression });
      showResult("formula-result", result.data);
    });
  }

  const webhookForm = document.getElementById("webhook-form");
  if (webhookForm) {
    webhookForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const callbackUrl = document.getElementById("callbackUrl").value;
      const result = await postJson("/api/webhook", {
        callbackUrl,
        payload: { ping: true },
      });
      showResult("webhook-result", result.data);
    });
  }
});
