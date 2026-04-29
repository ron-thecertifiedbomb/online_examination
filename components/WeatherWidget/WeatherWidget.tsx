"use client";

import { useEffect, useState } from "react";
import { extractMunicipality, weatherCodeToLayers } from "./helpers";

type CurrentWeather = {
    temperature: number;
    weathercode: number;
    is_day: number;
};

export function WeatherWidget({
    className = "",
    compact = false,
}: {
    className?: string;
    compact?: boolean;
}) {
    const [current, setCurrent] = useState<CurrentWeather | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [locationName, setLocationName] = useState("Loading...");

    const todayStr = new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });

    const fetchWeather = async (lat: number, lon: number) => {
        setLoading(true);
        setError("");
        try {
            const url = new URL("https://api.open-meteo.com/v1/forecast");
            url.searchParams.set("latitude", String(lat));
            url.searchParams.set("longitude", String(lon));
            url.searchParams.set("current_weather", "true");
            url.searchParams.set("timezone", "auto");

            const res = await fetch(url.toString());
            if (!res.ok) throw new Error("Weather API error");

            const data = await res.json();
            if (data.current_weather) {
                setCurrent({
                    temperature: data.current_weather.temperature,
                    weathercode: data.current_weather.weathercode,
                    is_day: data.current_weather.is_day,
                });
            }
        } catch {
            setError("Weather load failed");
        } finally {
            setLoading(false);
        }
    };

    const fetchMunicipality = async (lat: number, lon: number) => {
        try {
            const res = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
            const data = await res.json();

            if (data?.results?.length > 0) {
                const place = data.results[0];
                const muni = extractMunicipality(place);
                setLocationName(muni);
            } else {
                setLocationName("Unknown");
            }
        } catch {
            setLocationName("Unknown");
        }
    };

    useEffect(() => {
        if (!navigator?.geolocation) {
            setError("Geolocation not supported");
            return;
        }

        let intervalId: NodeJS.Timeout;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude, longitude } = pos.coords;

                fetchWeather(latitude, longitude);
                fetchMunicipality(latitude, longitude);

                intervalId = setInterval(() => {
                    fetchWeather(latitude, longitude);
                }, 5 * 60 * 1000);
            },
            () => setError("Failed to get location"),
            { timeout: 8000 }
        );

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div
            className={`
                rounded-full text-white
                ${compact ? "w-full" : "w-32"}
                ${className}
            `}
            title={error || locationName}
        >
            {/* MOBILE: weather left / date right */}
            <div className={`
                flex items-center
                ${compact ? "justify-between" : "justify-center"}
                
            `}>
                {/* Weather */}
                <div className="flex items-center gap-3">
                    {loading ? (
                        <span>⏳</span>
                    ) : current ? (
                        <>
                            {/* ICON */}
                            <div className={`relative ${compact ? "w-6 h-6" : "w-10 h-10"}`}>
                                {(() => {
                                    const { sun, moon, clouds, precip } =
                                        weatherCodeToLayers(
                                            current.weathercode,
                                            current.is_day
                                        );

                                    return (
                                        <>
                                            {sun && (
                                                <span
                                                    className={`absolute ${compact
                                                            ? "text-xl left-2 top-0"
                                                            : "text-3xl left-3 top-0"
                                                        }`}
                                                >
                                                    {sun}
                                                </span>
                                            )}

                                            {moon && (
                                                <span
                                                    className={`absolute ${compact
                                                            ? "text-xl left-1 top-1"
                                                            : "text-3xl left-2 top-0"
                                                        }`}
                                                >
                                                    {moon}
                                                </span>
                                            )}

                                            {clouds && (
                                                <span
                                                    className={`absolute ${compact
                                                            ? "text-xl left-0 top-2"
                                                            : "text-3xl left-[-4] top-2"
                                                        }`}
                                                >
                                                    {clouds}
                                                </span>
                                            )}

                                            {precip && (
                                                <span
                                                    className={`absolute ${compact
                                                            ? "text-lg left-1 top-3"
                                                            : "text-3xl left-2 top-7"
                                                        }`}
                                                >
                                                    {precip}
                                                </span>
                                            )}
                                        </>
                                    );
                                })()}
                            </div>

                            {/* TEMP */}
                            <span className={compact ? "text-md" : "text-lg"}>
                                {current.temperature.toFixed(0)}°
                            </span>
                        </>
                    ) : (
                        <span>—</span>
                    )}
                </div>

                {/* DATE — only visible on compact (mobile) */}
                {compact && (
                    <span className="text-[80%] sm:text-base md:text-lg">{todayStr}</span>
                )}
            </div>
        </div>
    );
}
