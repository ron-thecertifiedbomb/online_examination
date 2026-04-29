"use client";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function DateRangePicker({
    value,
    onChange,
    placeholder,
    className = "input",
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}) {
    const dateValue = value ? new Date(value) : null;

    function formatToMonthDayYear(date: Date) {
        return date.toLocaleDateString("en-US", {
            month: "short", // Nov
            day: "numeric",
            year: "numeric",
        }).replace(/,/g, ""); // remove comma
    }

    return (
        <DatePicker
            selected={dateValue}
            onChange={(date: Date | null) => {
                onChange(date ? formatToMonthDayYear(date) : "");
            }}
            placeholderText={placeholder}
            className={className}
            dateFormat="MMM d yyyy"
            showYearDropdown
            scrollableYearDropdown
        />
    );
}
