import { Map as KakaoMap, MapMarker, useKakaoLoader } from 'react-kakao-maps-sdk';

const STORE_POSITION = {
  lat: 37.563246,
  lng: 126.803162,
};

const StoreMap = () => {
  useKakaoLoader({
    appkey: import.meta.env.VITE_KAKAO_MAP_KEY,
  });

  return (
    <KakaoMap center={STORE_POSITION} style={{ width: '100%', height: '420px' }} level={2}>
      <MapMarker position={STORE_POSITION}></MapMarker>
    </KakaoMap>
  );
};

export default StoreMap;
