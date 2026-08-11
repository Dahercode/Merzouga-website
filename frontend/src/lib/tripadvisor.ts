/* TripAdvisor Content API client.

   Runs at build time only, so the API key never reaches the browser. When the
   credentials are absent (or the API fails) every function returns null and the
   caller falls back to the static copy in src/content/reassurance/*.mdx — the
   build must never break because a third party is down. */

const API_BASE = 'https://api.content.tripadvisor.com/api/v1';
const TIMEOUT_MS = 8000;
const MAX_REVIEWS = 3;

export interface TripAdvisorReview {
  id: string;
  name: string;
  location: string;
  rating: number;
  quote: string;
}

export interface TripAdvisorData {
  rating: string;
  reviewCount: number;
  webUrl: string | null;
  reviews: TripAdvisorReview[];
}

type Locale = 'en' | 'fr' | 'es';

const API_LANGUAGE: Record<Locale, string> = {
  en: 'en',
  fr: 'fr',
  es: 'es',
};

const cache = new Map<Locale, Promise<TripAdvisorData | null>>();

function readCredentials() {
  const env = import.meta.env ?? {};
  const key = env.TRIPADVISOR_API_KEY ?? process.env.TRIPADVISOR_API_KEY;
  const locationId =
    env.TRIPADVISOR_LOCATION_ID ?? process.env.TRIPADVISOR_LOCATION_ID;
  if (!key || !locationId) return null;
  return { key, locationId };
}

async function request(
  path: string,
  params: Record<string, string>
): Promise<any> {
  const url = new URL(`${API_BASE}${path}`);
  for (const [name, value] of Object.entries(params)) {
    url.searchParams.set(name, value);
  }
  const response = await fetch(url, {
    headers: { accept: 'application/json' },
    signal: AbortSignal.timeout(TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(`TripAdvisor ${path} responded ${response.status}`);
  }
  return response.json();
}

function toReview(entry: any): TripAdvisorReview | null {
  const quote = (entry?.text ?? '').trim();
  const name = (entry?.user?.username ?? '').trim();
  if (!quote || !name) return null;
  return {
    id: String(entry.id),
    name,
    location: (entry?.user?.user_location?.name ?? '').trim(),
    rating: Number(entry?.rating) || 5,
    quote,
  };
}

async function load(locale: Locale): Promise<TripAdvisorData | null> {
  const credentials = readCredentials();
  if (!credentials) return null;

  const { key, locationId } = credentials;
  const params = { key, language: API_LANGUAGE[locale] };

  try {
    const [details, reviews] = await Promise.all([
      request(`/location/${locationId}/details`, params),
      request(`/location/${locationId}/reviews`, params),
    ]);

    const parsed: TripAdvisorReview[] = (reviews?.data ?? [])
      .map(toReview)
      .filter((review: TripAdvisorReview | null): review is TripAdvisorReview =>
        Boolean(review)
      )
      .slice(0, MAX_REVIEWS);

    return {
      rating: details?.rating ? Number(details.rating).toFixed(1) : '',
      reviewCount: Number(details?.num_reviews) || 0,
      webUrl: details?.web_url ?? null,
      reviews: parsed,
    };
  } catch (error) {
    console.warn(
      `[tripadvisor] falling back to static content for "${locale}":`,
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export function getTripAdvisorData(
  locale: Locale
): Promise<TripAdvisorData | null> {
  if (!cache.has(locale)) cache.set(locale, load(locale));
  return cache.get(locale)!;
}

export function isTripAdvisorConfigured(): boolean {
  return readCredentials() !== null;
}
