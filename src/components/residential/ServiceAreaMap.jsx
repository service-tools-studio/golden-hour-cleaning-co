'use client';

import { useCallback, useState } from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

// Exact CITYNAME values from Portland Metro City Boundaries (PDX::city-boundaries).
// Bethany and Garden Home are unincorporated and not in this dataset.
const CITY_NAMES = [
  'Portland',
  'Beaverton',
  'Tigard',
  'Lake Oswego',
  'West Linn',
  'Milwaukie',
  'Tualatin',
];

const BOUNDARIES_URL =
  'https://gis-pdx.opendata.arcgis.com/datasets/PDX::city-boundaries.geojson?outSR=4326';

const MAP_CONTAINER_STYLE = {
  width: '100%',
  height: '320px',
};
const DEFAULT_CENTER = { lat: 45.48, lng: -122.68 };

// Fallback single polygon if GeoJSON fetch fails (rough Portland metro outline)
const FALLBACK_SERVICE_AREA = [
  { lat: 45.54, lng: -122.62 },
  { lat: 45.52, lng: -122.82 },
  { lat: 45.44, lng: -122.8 },
  { lat: 45.4, lng: -122.68 },
  { lat: 45.38, lng: -122.64 },
  { lat: 45.42, lng: -122.58 },
  { lat: 45.51, lng: -122.54 },
  { lat: 45.54, lng: -122.62 },
];

export default function ServiceAreaMap() {
  const [map, setMap] = useState(null);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);

    async function loadCityBoundaries() {
      try {
        const res = await fetch(BOUNDARIES_URL);
        if (!res.ok) throw new Error('Boundaries fetch failed');
        const json = await res.json();
        const features = (json.features || []).filter((f) =>
          CITY_NAMES.includes(f.properties?.CITYNAME)
        );
        if (features.length === 0) throw new Error('No matching cities');

        const collection = { type: 'FeatureCollection', features };
        mapInstance.data.addGeoJson(collection);
        mapInstance.data.setStyle({
          fillColor: '#f59e0b',
          fillOpacity: 0.35,
          strokeColor: '#d97706',
          strokeWeight: 2,
        });

        const bounds = new window.google.maps.LatLngBounds();
        mapInstance.data.forEach((feature) => {
          feature.getGeometry().forEachLatLng((latLng) => bounds.extend(latLng));
        });
        mapInstance.fitBounds(bounds, 40);
      } catch {
        const fallback = new window.google.maps.Polygon({
          paths: FALLBACK_SERVICE_AREA,
          fillColor: '#f59e0b',
          fillOpacity: 0.35,
          strokeColor: '#d97706',
          strokeWeight: 2,
        });
        fallback.setMap(mapInstance);
        const b = new window.google.maps.LatLngBounds();
        FALLBACK_SERVICE_AREA.forEach((p) => b.extend(p));
        mapInstance.fitBounds(b, 40);
      }
    }

    loadCityBoundaries();
  }, []);

  const onUnmount = useCallback(() => setMap(null), []);

  if (loadError) {
    return (
      <section className="w-full bg-amber-50/50" aria-label="Service area map">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h2 className="mb-4 text-center font-lora text-xl font-semibold text-stone-800 sm:text-2xl">
            Our service area
          </h2>
          <p className="mb-6 text-center text-sm text-stone-600 sm:text-base">
            Portland • Beaverton • Tigard • Lake Oswego • West Linn • Milwaukie • Tualatin
          </p>
          <div className="flex h-[320px] items-center justify-center rounded-2xl border border-amber-200 bg-amber-100/50 text-stone-600">
            Unable to load the map. Check your connection.
          </div>
        </div>
      </section>
    );
  }

  if (!isLoaded) {
    return (
      <section className="w-full bg-amber-50/50" aria-label="Service area map">
        <div className="mx-auto max-w-7xl px-6 py-8">
          <h2 className="mb-4 text-center font-lora text-xl font-semibold text-stone-800 sm:text-2xl">
            Our service area
          </h2>
          <p className="mb-6 text-center text-sm text-stone-600 sm:text-base">
            Portland • Beaverton • Tigard • Lake Oswego • West Linn • Milwaukie • Tualatin
          </p>
          <div className="flex h-[320px] items-center justify-center rounded-2xl border border-amber-200 bg-amber-100/50 text-stone-600">
            {apiKey ? 'Loading map…' : 'Map unavailable. Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable.'}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-amber-50/50" aria-label="Service area map">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <h2 className="mb-4 text-center font-lora text-xl font-semibold text-stone-800 sm:text-2xl">
          Our service area
        </h2>
        <p className="mb-6 text-center text-sm text-stone-600 sm:text-base">
          Portland • Beaverton • Tigard • Lake Oswego • West Linn • Milwaukie • Tualatin
        </p>
        <div className="overflow-hidden rounded-2xl border border-amber-200 shadow-md">
          <GoogleMap
            mapContainerStyle={{ ...MAP_CONTAINER_STYLE, minHeight: 320 }}
            center={DEFAULT_CENTER}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              scrollwheel: true,
              streetViewControl: false,
              mapTypeControl: true,
              fullscreenControl: true,
              zoomControl: true,
            }}
          >
          </GoogleMap>
        </div>
      </div>
    </section>
  );
}
