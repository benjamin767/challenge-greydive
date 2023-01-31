import React, { useEffect, useState } from "react";
import Select from "../Select/Select";
import { collection, addDoc } from "firebase/firestore"; 
import { db } from "../../DB/db";

export default function Form() {
    const [items, setItems] = useState([]);
    const [input, setInput] = useState({
        full_name: "",
        email: "",
        birth_date: "",
        country_of_origin: "",
    });
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

    const handleChange = (event) => {
        setInput({
            ...input,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const docRef = await addDoc(collection(db, "usuarios"), {
            ...input
        })
        .then(() => alert("registro exitoso"))
        .catch(error => console.log(error));
        console.log("Document written with ID: ", docRef.id);
        
        console.log("Lllegueeee")
    }

    return (
        <div>
            <form>
                {inputs && inputs.map((item,i) => {
                    return <div key={i}>
                        <label>{item.label}: </label>    
                        <input 
                            type={item.type}
                            required={item.required}
                            name={item.name}
                            value={input[item.name]}
                            onChange={handleChange}
                        />
                     </div>;
                })}
                <div> {select?<Select item={select} handler={handleChange}/>: "Loading..."} </div>
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
                        onClick={handleSubmit}
                        value={submit.label}
                        type={submit.type}
                    />: "Loading.."}</div>
            </form>
            
        </div>
    );
}