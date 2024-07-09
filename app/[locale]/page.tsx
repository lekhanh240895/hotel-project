import MapBox from '../components/Map';
import 'mapbox-gl/dist/mapbox-gl.css';
import NetworkGraph from '../components/NetworkGraph';

export default async function Homepage() {
  return (
    <div>
      <MapBox />
    </div>
  );
}
