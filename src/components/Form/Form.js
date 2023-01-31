import React, { useEffect, useState } from "react";
import Select from "../Select/Select";

export default function Form() {
    const [items, setItems] = useState([]);
    const getItems= () => {
    fetch('./json/data.json')
      .then(response => response.json())
      .then(response => {
        console.log(response)
        setItems(response.items);
      })
      .catch(error => console.log(error));
    }
    useEffect(() => {
        getItems();
    },[]);
    const inputs = items.filter(item => item.type !== "submit" && item.type !== "select" && item.type !== "checkbox");
    const [checkbox] = items.filter(item => item.type === "checkbox");
    const [select] = items.filter(item => item.type === "select");
    const [submit] = items.filter(item => item.type === "submit");

    return (
        <div>
            <form>
                {inputs && inputs.map((item,i) => {
                    return <div>
                        <label>{item.label}: </label>    
                        <input 
                            type={item.type}
                            required={item.required}
                            name={item.name}
                        />
                     </div>;
                })}
                <div> {select?<Select item={select}/>: "Loading..."} </div>
                <div> 
                    {checkbox ? <><input 
                        type={checkbox.type}
                        name={checkbox.name} 
                        required={checkbox.required}
                    /> 
                    <label>{checkbox.label}</label></> : "Loading..." }
                </div>
                <div>
                    {submit ? <input 
                        type={submit.type}
                        value={submit.label}
                    /> : "Loading.."}</div>
            </form>
        </div>
    );
}