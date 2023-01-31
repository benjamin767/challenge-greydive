import React from "react";

export default function Select({item: { label, name, options }}) {
    return (
        <>
            <label>{label} </label>
            <select name={name}>
                {options && options.map(option => <option value={option.value}>
                    {option.label}
                </option>)}
            </select>
        </>
    );
}