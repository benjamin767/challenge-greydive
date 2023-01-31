import React from "react";

export default function Select({item: { label, name, options }, handler}) {
    return (
        <>
            <label>{label} </label>
            <select name={name} onChange={handler}>
                {options && options.map((option,i) => <option key={i} value={option.value}>
                    {option.label}
                </option>)}
            </select>
        </>
    );
}