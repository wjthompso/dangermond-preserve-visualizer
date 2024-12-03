import React from "react";

interface WellSummaryModalProps {
    title: string;
    coordinates: string[];
}

const WellSummaryModal: React.FC<WellSummaryModalProps> = ({
    title,
    coordinates,
}) => {
    return (
        <div
            id="well-summary-modal"
            className="w-[343px] h-[102px] rounded-xl bg-gradient-to-br from-black/70 to-black/50 text-white flex flex-col justify-center backdrop-blur-md shadow-lg border border-white/20 py-6"
        >
            {/* Title */}
            <div
                id="well-summary-title"
                className="text-[1.75rem] font-medium px-6"
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
                className="text-[1.125rem] font-medium text-[#AAAAAA] px-6"
            >
                {coordinates}
            </div>
        </div>
    );
};

export default WellSummaryModal;
