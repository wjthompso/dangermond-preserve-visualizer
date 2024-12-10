// src/components/Map/BackgroundMapComponent.tsx

import maplibreGl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import React, { useEffect, useRef } from "react";
import { useWaterLevelStore } from "../../stores/useWaterLevelStore";

interface Well {
    id: string;
    coordinates: [number, number]; // [longitude, latitude]
}

const wells: Well[] = [
    {
        id: "Escondido_5",
        coordinates: [-120.453132886696, 34.5399037605087],
    },
    {
        id: "Oaks_5",
        coordinates: [-120.352712, 34.497165],
    },
    // Add more wells as needed
];

const MapComponent: React.FC = () => {
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const setSelectedWellId = useWaterLevelStore(
        (state) => state.setSelectedWellId
    );

    useEffect(() => {
        if (!mapContainerRef.current) return;

        // Initialize maplibre map instance
        const map = new maplibreGl.Map({
            container: mapContainerRef.current,
            style: "https://api.maptiler.com/maps/hybrid/style.json?key=9NI99sjBP6UPRQHN9Mf7", // Replace with your API key
            center: [-120.352712, 34.497165], // Initial center
            zoom: 11,
            pitch: 0, // Force the map to always be 2D by setting pitch to 0
            bearing: 0, // Ensure no rotation, keeps the map flat
        });

        // Add markers to the map
        wells.forEach((well) => {
            const marker = new maplibreGl.Marker({ color: "#FF0000" }) // Customize marker appearance
                .setLngLat(well.coordinates)
                .addTo(map);

            // Add hover state to the marker
            const markerElement = marker.getElement();
            markerElement.style.cursor = "pointer";

            markerElement.addEventListener("mouseenter", () => {
                markerElement.style.border = "2px solid white";
                markerElement.style.borderRadius = "8px";
            });

            markerElement.addEventListener("mouseleave", () => {
                markerElement.style.border = "";
                markerElement.style.borderRadius = "";
            });

            // Add click event to update the selected well ID
            markerElement.addEventListener("click", () => {
                setSelectedWellId(well.id);
                // Optionally, you can also center the map on the clicked marker
                map.flyTo({ center: well.coordinates, zoom: 13 });
            });
        });

        // Clean up on unmount
        return () => map.remove();
    }, [setSelectedWellId]);

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
