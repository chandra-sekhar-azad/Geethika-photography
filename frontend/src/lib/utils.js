import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import env from "../config/env";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Build a safe full URL for assets coming from the API.
// - If `path` is falsy, returns a local placeholder image.
// - If `path` is an absolute URL (starts with http), returns it unchanged.
// - Otherwise, prefixes with the configured `env.apiUrl` ensuring a single slash.
export function fullUrl(path) {
  const placeholder = '/images/image.png';
  if (!path) return placeholder;
  if (typeof path !== 'string') return placeholder;
  if (path.startsWith('http')) return path;

  const base = env.apiUrl || '';
  const cleanBase = base.endsWith('/') ? base.slice(0, -1) : base;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${cleanBase}${cleanPath}`;
}
