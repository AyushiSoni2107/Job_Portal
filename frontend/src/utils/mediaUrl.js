import { BASE_URL } from "./apiPaths";

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

const getBaseOrigin = () => {
  try {
    return new URL(BASE_URL).origin;
  } catch {
    return window.location.origin;
  }
};

export const resolveMediaUrl = (value) => {
  if (!value || typeof value !== "string") return "";

  const raw = value.trim();
  if (!raw) return "";
  if (raw.startsWith("blob:") || raw.startsWith("data:")) return raw;

  const baseOrigin = getBaseOrigin();

  if (ABSOLUTE_URL_REGEX.test(raw)) {
    try {
      const parsed = new URL(raw);

      // If URL points to current frontend origin but media lives on API origin,
      // rewrite it to backend origin to avoid broken proxied-host links.
      if (
        parsed.pathname.startsWith("/uploads/") &&
        parsed.origin === window.location.origin &&
        parsed.origin !== baseOrigin
      ) {
        return `${baseOrigin}${parsed.pathname}${parsed.search}${parsed.hash}`;
      }

      return parsed.href;
    } catch {
      return raw;
    }
  }

  if (raw.startsWith("/")) {
    return `${baseOrigin}${raw}`;
  }

  return `${baseOrigin}/${raw}`;
};
