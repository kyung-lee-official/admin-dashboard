import { useEffect, useState } from "react";

interface DecimalInputProps {
    min?: number;
    max?: number;
    value?: number;
    onChange?: (value: number | null) => void;
    placeholder?: string;
}

export const DecimalInput = ({
    min,
    max,
    value,
    onChange,
    placeholder = "Enter a number",
}: DecimalInputProps) => {
    const [inputValue, setInputValue] = useState<string>(
        value?.toString() || ""
    );

    /* sync inputValue state with value prop */
    useEffect(() => {
        setInputValue(value?.toString() || "");
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;

        /* allow empty input */
        if (val === "") {
            setInputValue("");
            return;
        }

        /* allow input of just the negative sign or a single decimal point */
        if (val === "-" || val === "." || val === "-.") {
            setInputValue(val);
            return;
        }

        /* check if the value is a valid decimal number */
        if (/^-?\d*\.?\d*$/.test(val)) {
            const floatValue = parseFloat(val);

            /* validate against min and max */
            if (
                (min !== undefined && floatValue < min) ||
                (max !== undefined && floatValue > max)
            ) {
                return;
            }

            setInputValue(val);
            onChange?.(floatValue);
        }
    };

    const handleBlur = () => {
        /* if input is empty, set value to 0 */
        if (inputValue === "") {
            setInputValue("0");
            onChange?.(0);
            return;
        }

        /* reset to the last valid value if the input is invalid or just "-" or "." */
        if (inputValue === "-" || inputValue === "." || inputValue === "-." || isNaN(Number(inputValue))) {
            setInputValue(value?.toString() || "0");
            onChange?.(value ?? 0);
        }
    };

    return (
        <input
            type="text"
            value={inputValue}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder={placeholder}
            className="border rounded px-2 py-1"
        />
    );
};