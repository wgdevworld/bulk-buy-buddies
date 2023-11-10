// map.tsx
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { Location } from './locations'; 
import LocationCard from './locationcard';

const containerStyle = {
  width: '100%',
  height: '100%',
};

interface MapComponentProps {
  center: { lat: number; lng: number };
  setCenter: React.Dispatch<React.SetStateAction<{ lat: number; lng: number }>>;
  selectedLocation: Location | null; 
}

function MapComponent({ center, setCenter, selectedLocation }: MapComponentProps) {
  console.log("MapComponent - selectedLocation:", selectedLocation);
  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY || "AIzaSyAc_M-Qxm_gfgUxldg45z9cDJ7uosPP9VA" //string empty for now since using personal API key
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
      {selectedLocation && (
        <>
          <Marker
            position={{ lat: selectedLocation.coordinates[1], lng: selectedLocation.coordinates[0] }}
          />
          <LocationCard selectedLocation={selectedLocation} />
        </>
      )}
    </GoogleMap>
  );
}

export default MapComponent;
