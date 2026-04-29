import { TAILWIND_COLORS } from "../../constants/tailwindColor";
import { toast } from "react-hot-toast";

export function Palette() {
    const handleCopy = (hex: string, name: string) => {
        navigator.clipboard.writeText(hex);
        toast.success(`${name} copied!`);
    };

    return (
        <div className="p-4 overflow-auto">
            <div className="flex flex-wrap gap-6  justify-center">
                {Object.entries(TAILWIND_COLORS).map(([colorName, shades]) => (
                    <div
                        key={colorName}
                        className="flex flex-col gap-2 min-w-[80px] sm:min-w-[90px] md:min-w-[100px] flex-shrink-0"
                    >
                        <h3 className="text-white font-bold mb-2 capitalize text-center text-sm sm:text-base">
                            {colorName}
                        </h3>
                        {Object.entries(shades).map(([shade, hex]) => {
                            const displayName = `${colorName}-${shade}`;
                            return (
                                <div
                                    key={displayName}
                                    className="relative flex flex-col items-center justify-center p-2 rounded cursor-pointer shadow-md transition-transform duration-200 ease-in-out hover:scale-105 active:scale-95"
                                    style={{ backgroundColor: hex }}
                                    onClick={() => handleCopy(hex, displayName)}
                                >
                                    <span
                                        className="font-semibold text-xs sm:text-sm select-none text-center"
                                        style={{ color: getContrastYIQ(hex) }}
                                    >
                                        {shade}
                                    </span>
                                    <span
                                        className="text-[10px] sm:text-xs select-none text-center"
                                        style={{ color: getContrastYIQ(hex) }}
                                    >
                                        {hex}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}

// Helper: return black or white depending on background color contrast
function getContrastYIQ(hex: string) {
    hex = hex.replace("#", "");
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const yiq = (r * 299 + g * 587 + b * 114) / 1000;
    return yiq >= 128 ? "#000000" : "#ffffff";
}
