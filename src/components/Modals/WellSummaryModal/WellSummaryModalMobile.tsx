import React from "react";

interface WellSummaryModalProps {
    title: string;
    coordinates: { latitude: number; longitude: number };
}

const formatCoordinates = (latitude: number, longitude: number) => {
    const toDMS = (degree: number) => {
        const absolute = Math.abs(degree);
        const degrees = Math.floor(absolute);
        const minutesNotTruncated = (absolute - degrees) * 60;
        const minutes = Math.floor(minutesNotTruncated);
        const seconds = ((minutesNotTruncated - minutes) * 60).toFixed(2);
        return `${degrees}°${minutes}'${seconds}"`;
    };

    const latitudeCardinal = latitude >= 0 ? "N" : "S";
    const longitudeCardinal = longitude >= 0 ? "E" : "W";

    return `${toDMS(latitude)} ${latitudeCardinal}, ${toDMS(
        Math.abs(longitude)
    )} ${longitudeCardinal}`;
};

const WellSummaryModal: React.FC<WellSummaryModalProps> = ({
    title,
    coordinates,
}) => {
    return (
        <div
            id="well-summary-modal"
            // className="w-[343px] h-[102px] rounded-xl bg-gradient-to-br from-black/70 to-black/50 text-white flex flex-col justify-center backdrop-blur-md shadow-lg border border-white/20 py-6"
        >
            {/* Title */}
            <div
                id="well-summary-title"
                className="text-[1.75rem] font-medium max-w-[400px] mx-auto px-4 w-full"
            >
                {title}
            </div>

            {/* Divider */}
            <div
                id="well-summary-divider"
                className="my-2 min-h-[0.1px] w-full bg-[#454545]"
            />

            {/* Coordinates */}
            <div
                id="well-summary-coordinates"
                className="text-[1.125rem] font-medium text-[#AAAAAA] max-w-[400px] mx-auto px-4 w-full"
            >
                {formatCoordinates(coordinates.latitude, coordinates.longitude)}
            </div>
        </div>
    );
};

export default WellSummaryModal;
