'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { GoogleMap } from '@react-google-maps/api';
import GoogleMapsProvider, { useGoogleMaps } from './GoogleMapsProvider.jsx';
import { HEADING_UPPER } from '../../helpers/typography.js';
import { MARKETS } from '@/lib/markets';

const MAP_LAYOUT_PRESETS = {
  compact: {
    wrapperClass:
      'mx-auto w-full max-w-[50%] overflow-hidden rounded-2xl border border-amber-200 shadow-md',
    mapHeightPx: 320,
    fitPadding: 40,
    placeholderClass: 'mx-auto h-[320px] max-w-[50%]',
  },
  portrait: {
    wrapperClass:
      'mx-auto w-full max-w-xs overflow-hidden rounded-2xl border border-amber-200 shadow-md sm:max-w-sm md:max-w-md',
    mapHeightPx: 520,
    fitPadding: 36,
    placeholderClass: 'mx-auto h-[min(520px,72vh)] w-full max-w-md',
  },
};

const MAP_POLYGON_STYLE = {
  fillColor: '#f59e0b',
  fillOpacity: 0.35,
  strokeColor: '#d97706',
  strokeWeight: 2,
};

/** Rough Portland metro outline if city-boundary fetch fails. */
const PORTLAND_FALLBACK_POLYGON = [
  { lat: 45.54, lng: -122.62 },
  { lat: 45.52, lng: -122.82 },
  { lat: 45.44, lng: -122.8 },
  { lat: 45.4, lng: -122.68 },
  { lat: 45.38, lng: -122.64 },
  { lat: 45.42, lng: -122.58 },
  { lat: 45.51, lng: -122.54 },
  { lat: 45.54, lng: -122.62 },
];

/**
 * @param {{
 *   mapConfig: NonNullable<import('@/lib/markets').MarketConfig['serviceArea']['map']>;
 *   mapLayout?: 'compact' | 'portrait';
 * }} props
 */
function MapCanvas({ mapConfig, mapLayout = 'compact' }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';
  const { isLoaded, loadError } = useGoogleMaps();
  const { geoJsonUrl, center, initialZoom, cityNames } = mapConfig;
  const useFallbackPolygon = Boolean(cityNames?.length);
  const layout = MAP_LAYOUT_PRESETS[mapLayout] ?? MAP_LAYOUT_PRESETS.compact;
  const mapHeight = `${layout.mapHeightPx}px`;

  const onLoad = useCallback(
    (mapInstance) => {
      const preserveWindowScroll = (fn) => {
        const y = window.scrollY;
        const x = window.scrollX;
        fn();
        requestAnimationFrame(() => {
          window.scrollTo(x, y);
          requestAnimationFrame(() => window.scrollTo(x, y));
        });
      };

      function fitDataLayer(map) {
        map.data.setStyle(MAP_POLYGON_STYLE);
        const bounds = new window.google.maps.LatLngBounds();
        map.data.forEach((feature) => {
          feature.getGeometry().forEachLatLng((latLng) => bounds.extend(latLng));
        });
        preserveWindowScroll(() => map.fitBounds(bounds, layout.fitPadding));
      }

      function drawFallbackPolygon(map) {
        const fallback = new window.google.maps.Polygon({
          paths: PORTLAND_FALLBACK_POLYGON,
          ...MAP_POLYGON_STYLE,
        });
        fallback.setMap(map);
        const bounds = new window.google.maps.LatLngBounds();
        PORTLAND_FALLBACK_POLYGON.forEach((p) => bounds.extend(p));
        preserveWindowScroll(() => map.fitBounds(bounds, layout.fitPadding));
      }

      async function loadBoundaries() {
        try {
          const res = await fetch(geoJsonUrl);
          if (!res.ok) throw new Error('Boundaries fetch failed');
          const json = await res.json();
          let features = json.features || [];
          if (cityNames?.length) {
            features = features.filter((f) =>
              cityNames.includes(f.properties?.CITYNAME),
            );
          }
          if (features.length === 0) throw new Error('No matching features');

          mapInstance.data.addGeoJson({
            type: 'FeatureCollection',
            features,
          });
          fitDataLayer(mapInstance);
        } catch {
          if (useFallbackPolygon) {
            drawFallbackPolygon(mapInstance);
          }
        }
      }

      loadBoundaries();
    },
    [geoJsonUrl, cityNames, useFallbackPolygon, layout.fitPadding],
  );

  const loadingShellClass = `flex items-center justify-center rounded-2xl border border-amber-200 bg-amber-100/50 text-stone-600 ${layout.placeholderClass}`;

  if (loadError) {
    return (
      <div className={loadingShellClass}>
        Unable to load the map. Check your connection.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={loadingShellClass}>
        {apiKey
          ? 'Loading map…'
          : 'Map unavailable. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable.'}
      </div>
    );
  }

  return (
    <div className={layout.wrapperClass}>
      <GoogleMap
        mapContainerStyle={{ width: '100%', height: mapHeight, minHeight: mapHeight }}
        center={center}
        zoom={initialZoom}
        onLoad={onLoad}
        options={{
          scrollwheel: true,
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
          zoomControl: true,
        }}
      />
    </div>
  );
}

/** @param {{ market?: import('@/lib/markets').MarketConfig }} props */
export default function ServiceAreaMap({ market = MARKETS.portland }) {
  const title = market.serviceArea.mapTitle;
  const citiesLine = market.serviceArea.citiesLine;
  const zipCodesLine = market.serviceArea.zipCodesLine;
  const mapConfig = market.serviceArea.map;
  const [shouldLoadMaps, setShouldLoadMaps] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setShouldLoadMaps(true);
      return;
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setShouldLoadMaps(true);
          io.disconnect();
        }
      },
      { rootMargin: '240px 0px', threshold: 0.01 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full bg-amber-50/50"
      aria-label="Service area map"
    >
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-16 lg:py-20">
        <h2
          className={`mb-5 text-center text-xl font-semibold text-stone-800 sm:text-2xl ${HEADING_UPPER}`}
        >
          {title}
        </h2>
        <p className="mb-4 text-center text-sm text-stone-600 sm:text-base">
          {citiesLine}
        </p>
        {zipCodesLine ? (
          <p className="mb-8 text-center text-xs leading-relaxed text-stone-500 sm:text-sm">
            ZIP codes: {zipCodesLine}
          </p>
        ) : (
          <div className="mb-8" aria-hidden />
        )}
        {mapConfig ? (
          shouldLoadMaps ? (
            <GoogleMapsProvider>
              <MapCanvas
                mapConfig={mapConfig}
                mapLayout={market.id === 'phoenix' ? 'portrait' : 'compact'}
              />
            </GoogleMapsProvider>
          ) : (
            <div
              className={`rounded-2xl border border-amber-200 bg-amber-100/40 ${MAP_LAYOUT_PRESETS[market.id === 'phoenix' ? 'portrait' : 'compact'].placeholderClass}`}
              aria-hidden
            />
          )
        ) : null}
      </div>
    </section>
  );
}
