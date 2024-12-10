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

        // Add navigation controls (optional), but place the controls in the top-left corner
        map.addControl(new maplibreGl.NavigationControl(), "top-left");

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

            // Add click event to update the selected well ID and adjust map view
            markerElement.addEventListener("click", () => {
                setSelectedWellId(well.id);

                // Calculate the new center with an offset to prevent the marker from being obscured by the sidebar
                const offsetX = 100; // Shift left by 100 pixels (I think?)
                const offsetY = 0; // No vertical shift

                // Get the current pixel position of the clicked well
                const targetPoint = map.project(well.coordinates);

                // Apply the offset
                const newPoint = [
                    targetPoint.x + offsetX,
                    targetPoint.y + offsetY,
                ];

                // Convert the new pixel position back to geographic coordinates
                const newCenter = map.unproject(newPoint as [number, number]);

                // Fly to the new center position with the desired zoom level
                map.flyTo({
                    center: newCenter,
                    zoom: 13,
                    essential: true, // This animation is considered essential with respect to prefers-reduced-motion
                });
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
