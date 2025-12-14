const GOOGLE_OAUTH_ENDPOINT = "/back_to_back/auth/google";

/**
 * Kick off the Google OAuth handshake by redirecting to the backend endpoint.
 * This needs a full page load so the server can set cookies and handle callback.
 */
export function startGoogleOAuth(nextPath = "/dashboard") {
  if (typeof window === "undefined") return;
  const target = nextPath || "/";
  const params = new URLSearchParams({ next: target });
  window.location.href = `${GOOGLE_OAUTH_ENDPOINT}?${params.toString()}`;
}
