import {
  Ruler,
  Weight,
  Thermometer,
  Clock,
  Zap,
  Database,
  RefreshCw,
} from "lucide-react";

export const CONVERSION_CATEGORIES = [
  {
    id: "time",
    name: "TIME",
    icon: Clock,
    units: ["Hours", "Minutes", "Seconds", "Days", "Weeks", "Years"],
    convert: (v: number, f: string, t: string) => {
      const toSec: Record<string, number> = {
        Hours: 3600,
        Minutes: 60,
        Seconds: 1,
        Days: 86400,
        Weeks: 604800,
        Years: 31556952,
      };
      return (v * toSec[f]) / toSec[t];
    },
  },
  {
    id: "length",
    name: "LENGTH",
    icon: Ruler,
    units: [
      "Meters",
      "Kilometers",
      "Miles",
      "Feet",
      "Inches",
      "Centimeters",
      "Millimeters",
      "Yards",
    ],
    convert: (v: number, f: string, t: string) => {
      const toMeters: Record<string, number> = {
        Meters: 1,
        Kilometers: 1000,
        Miles: 1609.344,
        Feet: 0.3048,
        Inches: 0.0254,
        Centimeters: 0.01,
        Millimeters: 0.001,
        Yards: 0.9144,
      };
      return (v * toMeters[f]) / toMeters[t];
    },
  },
  {
    id: "weight",
    name: "WEIGHT",
    icon: Weight,
    units: [
      "Kilograms",
      "Grams",
      "Pounds",
      "Ounces",
      "Metric Tons",
      "Milligrams",
    ],
    convert: (v: number, f: string, t: string) => {
      const toKg: Record<string, number> = {
        Kilograms: 1,
        Grams: 0.001,
        Pounds: 0.45359237,
        Ounces: 0.028349523,
        "Metric Tons": 1000,
        Milligrams: 0.000001,
      };
      return (v * toKg[f]) / toKg[t];
    },
  },
  {
    id: "speed",
    name: "SPEED",
    icon: Zap,
    units: ["km/h", "mph", "m/s", "knots", "ft/s"],
    convert: (v: number, f: string, t: string) => {
      const toMs: Record<string, number> = {
        "km/h": 1 / 3.6,
        mph: 0.44704,
        "m/s": 1,
        knots: 0.514444,
        "ft/s": 0.3048,
      };
      return (v * toMs[f]) / toMs[t];
    },
  },
  {
    id: "data",
    name: "DATA",
    icon: Database,
    units: ["B", "KB", "MB", "GB", "TB", "PB"],
    convert: (v: number, f: string, t: string) => {
      const units = ["B", "KB", "MB", "GB", "TB", "PB"];
      const fIdx = units.indexOf(f);
      const tIdx = units.indexOf(t);
      return v * Math.pow(1024, fIdx - tIdx);
    },
  },
  {
    id: "energy",
    name: "ENERGY",
    icon: RefreshCw,
    units: [
      "Joules",
      "Calories",
      "Kilocalories",
      "Watt-hours",
      "Kilowatt-hours",
    ],
    convert: (v: number, f: string, t: string) => {
      const toJoules: Record<string, number> = {
        Joules: 1,
        Calories: 4.184,
        Kilocalories: 4184,
        "Watt-hours": 3600,
        "Kilowatt-hours": 3600000,
      };
      return (v * toJoules[f]) / toJoules[t];
    },
  },
  {
    id: "temperature",
    name: "TEMP",
    icon: Thermometer,
    units: ["Celsius", "Fahrenheit", "Kelvin"],
    convert: (v: number, f: string, t: string) => {
      let c: number;
      if (f === "Celsius") c = v;
      else if (f === "Fahrenheit") c = ((v - 32) * 5) / 9;
      else c = v - 273.15;
      if (t === "Celsius") return c;
      if (t === "Fahrenheit") return (c * 9) / 5 + 32;
      return c + 273.15;
    },
  },
];
