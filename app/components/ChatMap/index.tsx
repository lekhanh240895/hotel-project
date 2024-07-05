'use client';

import { useState } from 'react';
import {
  FullscreenControl,
  GeolocateControl,
  LayerProps,
  Map,
  Marker,
  NavigationControl,
  ScaleControl
} from 'react-map-gl';
import { Source, Layer } from 'react-map-gl';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';
import { BotMessage } from '../message';
import ChatSuggestion from '../ChatSuggestion';

const initCoor = {
  longitude: 107.58592685189807,
  latitude: 16.46260559492077
};

const items = [
  {
    type: 'Feature',
    text: 'Hanoi',
    place_name: 'Hanoi, Vietnam',
    center: [105.8544441, 21.0294498],
    geometry: { type: 'Point', coordinates: [105.8544441, 21.0294498] },
    id: 'place.17652',
    place_type: ['region', 'place']
  },
  {
    type: 'Feature',
    text: 'Hoa Lư',
    place_name: 'Hoa Lư, Ninh Bình, Vietnam',
    center: [105.952817, 20.299218],
    geometry: { type: 'Point', coordinates: [105.952817, 20.299218] },
    id: 'place.7432436',
    place_type: ['place']
  },
  {
    type: 'Feature',
    text: 'Haiphong',
    place_name: 'Haiphong, Vietnam',
    center: [106.6749591, 20.858864],
    geometry: { type: 'Point', coordinates: [106.6749591, 20.858864] },
    id: 'place.509172',
    place_type: ['region', 'place']
  },
  {
    type: 'Feature',
    text: 'Da Nang',
    place_name: 'Da Nang, Vietnam',
    center: [108.212, 16.068],
    geometry: { type: 'Point', coordinates: [108.212, 16.068] },
    id: 'place.50420',
    place_type: ['region', 'place']
  },
  {
    type: 'Feature',
    text: 'Quảng Ngãi',
    place_name: 'Quảng Ngãi, Quảng Ngãi, Vietnam',
    center: [108.802335, 15.119295],
    geometry: { type: 'Point', coordinates: [108.802335, 15.119295] },
    id: 'place.4974836',
    place_type: ['place']
  },
  {
    type: 'Feature',
    text: 'Vũng Tàu',
    place_name: 'Vũng Tàu, Bà Rịa-Vũng Tàu, Vietnam',
    center: [107.076476, 10.345796],
    geometry: { type: 'Point', coordinates: [107.076476, 10.345796] },
    id: 'place.5703924',
    place_type: ['place']
  },
  {
    type: 'Feature',
    text: 'Hanoi',
    place_name: 'Hanoi, Vietnam',
    center: [105.8544441, 21.0294498],
    geometry: { type: 'Point', coordinates: [105.8544441, 21.0294498] },
    id: 'place.17652',
    place_type: ['region', 'place']
  }
];

type Props = {
  route: string[];
};

export default function ChatMap({
  route = ['Đà Nẵng, Qui Nhơn, Phú Quốc']
}: Props) {
  const [viewState, setViewState] = useState({
    ...initCoor,
    zoom: 5.5
  });

  const renderRouteMarkers = () => {
    const markers = items.map((location, index) => {
      const isDestination =
        location.text === items[items.length - 1].text &&
        location.text === items[0].text;
      if (isDestination) {
        return (
          <Marker
            key={location.id + index}
            longitude={location.center[0]}
            latitude={location.center[1]}
            anchor="bottom"
          >
            <svg
              className="h-6 w-6 rounded-full bg-red-500 p-1"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 448 512"
              fill="white"
            >
              <path d="M64 32C64 14.3 49.7 0 32 0S0 14.3 0 32V64 368 480c0 17.7 14.3 32 32 32s32-14.3 32-32V352l64.3-16.1c41.1-10.3 84.6-5.5 122.5 13.4c44.2 22.1 95.5 24.8 141.7 7.4l34.7-13c12.5-4.7 20.8-16.6 20.8-30V66.1c0-23-24.2-38-44.8-27.7l-9.6 4.8c-46.3 23.2-100.8 23.2-147.1 0c-35.1-17.6-75.4-22-113.5-12.5L64 48V32z" />
            </svg>
          </Marker>
        );
      } else {
        return (
          <Marker
            key={location.id + index}
            longitude={location.center[0]}
            latitude={location.center[1]}
            anchor="bottom"
          >
            <div className="rounded-full bg-blue-700 p-1">
              <div className="h-2 w-2 rounded-full bg-white"></div>
            </div>
          </Marker>
        );
      }
    });
    return markers;
  };

  const geojson = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: items.map((location) => location.center)
        }
      }
    ]
  };

  const layerStyle: LayerProps = {
    type: 'line',
    source: 'line',
    id: 'line-background',
    paint: {
      'line-color': '#1399EC',
      'line-width': 4,
      'line-opacity': 0.7
    }
  };

  return (
    <div className="container h-full w-full space-y-4 md:w-2/3">
      <BotMessage
        showAvatar={false}
        showAction={false}
        content={`Here's the map of route:\n${route.join(', ')}`}
      />

      <div className="h-[80vh]">
        <Map
          reuseMaps
          {...viewState}
          onMove={(event) => setViewState(event.viewState)}
          style={{
            width: '100%',
            height: '100%'
          }}
          mapStyle="mapbox://styles/mapbox/streets-v9"
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}
        >
          <FullscreenControl />
          <GeolocateControl />
          <NavigationControl />
          <ScaleControl />
          <Source id="line" type="geojson" data={geojson}>
            <Layer {...layerStyle} />
          </Source>
          {renderRouteMarkers()}
        </Map>
      </div>

      <ChatSuggestion />
    </div>
  );
}
