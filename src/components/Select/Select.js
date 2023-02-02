import React from "react";

export default function Select({item: { label, name, options }, handler}) {
    return (
        <>
            <label className="form-label">{label} </label>
            <select name={name} onChange={handler} className="form-select w-100">
                <option value={""}>Seleccione un pais</option>
                {options && options.map((option,i) => <option key={i} value={option.value}>
                    {option.label}
                </option>)}
            </select>
        </>
    );
}