import MapBox from '../components/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-geocoder/dist/mapbox-gl-geocoder.css';

export default async function Home() {
  return (
    <main>
      <MapBox />
    </main>
  );
}
