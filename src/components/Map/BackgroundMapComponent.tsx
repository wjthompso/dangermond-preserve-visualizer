import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef } from "react";

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize maplibre map instance
        const map = new maplibreGl.Map({
            container: mapContainerRef.current,
            style: "https://api.maptiler.com/maps/hybrid/style.json?key=9NI99sjBP6UPRQHN9Mf7", // Satellite map style from MapTiler (replace with your API key)
            center: [-120.452712, 34.467165], //
            zoom: 12,
            pitch: 0, // Force the map to always be 2D by setting pitch to 0
            bearing: 0, // Ensure no rotation, keeps the map flat
        });

        // Clean up on unmount
        return () => map.remove();
    }, []);

    return (
        <div
            ref={mapContainerRef}
            style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                right: 0,
            }}
        />
    );
};

export default MapComponent;

// Notes:
// 1. You need to add the `maplibre-gl` and `@types/maplibre-gl` packages to your project dependencies.
//    Run: `npm install maplibre-gl @types/maplibre-gl`.
// 2. Replace `YOUR_MAPTILER_API_KEY` with your actual MapTiler API key for satellite imagery.
// 3. The map style used here is from MapTiler, which provides a hybrid (satellite) view.
// 4. The map has been forced to be 2D by setting `pitch` to 0 and `bearing` to 0.
// 5. This component fills the entire screen with the map view.
