import { useEffect, useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Input } from "../ui/input";
import { Pencil } from "lucide-react";

const OTHER = "__other__";

/**
 * SelectOrType — dropdown that also accepts a custom typed value.
 * value & onChange are strings (either a listed option or the typed text).
 */
export default function SelectOrType({
    value,
    onChange,
    options,
    placeholder = "Select…",
    customPlaceholder = "Type your requirement",
    "data-testid": testId,
    required = false,
}) {
    const isCustom = value && !options.includes(value);
    const [mode, setMode] = useState(isCustom ? OTHER : value || "");
    const [customText, setCustomText] = useState(isCustom ? value : "");

    // Sync when parent value changes (e.g. auto-fill from context)
    useEffect(() => {
        if (!value) {
            setMode("");
            setCustomText("");
        } else if (options.includes(value)) {
            setMode(value);
            setCustomText("");
        } else {
            setMode(OTHER);
            setCustomText(value);
        }
    }, [value, options]);

    const handleSelect = (v) => {
        setMode(v);
        if (v === OTHER) {
            onChange(customText || "");
        } else {
            setCustomText("");
            onChange(v);
        }
    };

    const handleCustom = (e) => {
        const t = e.target.value;
        setCustomText(t);
        onChange(t);
    };

    return (
        <div className="space-y-2">
            <Select value={mode} onValueChange={handleSelect}>
                <SelectTrigger
                    data-testid={testId}
                    className="rounded-none h-11 border-slate-300"
                >
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                    {options.map((o) => (
                        <SelectItem key={o} value={o}>{o}</SelectItem>
                    ))}
                    <SelectItem value={OTHER}>
                        <span className="inline-flex items-center gap-2">
                            <Pencil className="w-3 h-3" /> Other — specify below
                        </span>
                    </SelectItem>
                </SelectContent>
            </Select>
            {mode === OTHER && (
                <Input
                    data-testid={testId ? `${testId}-custom` : undefined}
                    value={customText}
                    onChange={handleCustom}
                    placeholder={customPlaceholder}
                    required={required}
                    className="rounded-none h-11 border-slate-300"
                />
            )}
        </div>
    );
}
