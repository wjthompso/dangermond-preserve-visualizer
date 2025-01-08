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
            style: "https://api.maptiler.com/maps/hybrid/style.json?key=9NI99sjBP6UPRQHN9Mf7",
            center: [-120.352712, 34.497165], // Initial center
            zoom: 11,
            pitch: 0, // Force map to 2D
            bearing: 0, // No rotation
        });

        // Add navigation controls in the top-left corner (optional)
        map.addControl(new maplibreGl.NavigationControl(), "top-left");

        // Add markers
        wells.forEach((well) => {
            const marker = new maplibreGl.Marker({ color: "#FF0000" })
                .setLngLat(well.coordinates)
                .addTo(map);

            const markerElement = marker.getElement();
            markerElement.style.cursor = "pointer";

            // Hover style
            markerElement.addEventListener("mouseenter", () => {
                markerElement.style.border = "2px solid white";
                markerElement.style.borderRadius = "8px";
            });

            markerElement.addEventListener("mouseleave", () => {
                markerElement.style.border = "";
                markerElement.style.borderRadius = "";
            });

            // Click event
            markerElement.addEventListener("click", () => {
                // 1) Update store with selected well ID
                setSelectedWellId(well.id);

                // 2) Determine if we're in desktop or mobile mode
                const isDesktop = window.innerWidth >= 769;

                // 3) Calculate offsetX (in pixels)
                //    ~384 px is half of the 769 px sidebar,
                //    so that the marker is centered on the left portion.

                const offsetX = isDesktop ? 384 : 0;
                const offsetY = 0;

                // 7) Fly to the new center
                map.flyTo({
                    center: well.coordinates,
                    offset: [-offsetX, offsetY],
                    zoom: 13,
                    essential: true,
                });
            });
        });

        // Cleanup on unmount
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
