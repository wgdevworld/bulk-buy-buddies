import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY
const containerStyle = {
  width: '100%',
  height: '600px'
};


function MapComponent({center, setCenter}: {center: {lat: number, lng: number}, setCenter:React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>> }) {
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyAc_M-Qxm_gfgUxldg45z9cDJ7uosPP9VA"
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading Maps...</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={13}
    >
      {/* Add your markers or other components here if needed */}
    </GoogleMap>
  );
}

export default MapComponent;
