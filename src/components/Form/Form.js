import React, { useEffect, useState } from "react";
import Select from "../Select/Select";
import { collection, addDoc } from "firebase/firestore";
import swal from 'sweetalert';
import { db } from "../../DB/db";

export function validate(state) {
    let error = { error: false };
    if(!state.full_name) {
        error.full_name = "Nombre completo es requerido.";
        error.error = true;
    }
    if(!state.email) {
        error.email = "Email es requerido.";
        error.error = true;
    }
    if(!state.birth_date) {
        error.birth_date = "Fecha de nacimiento es requerido.";
        error.error = true;
    }
    if(!state.terms_and_conditions){
        error.terms_and_conditions = "Debe aceptar los terminos y condiciones para avanzar.";
        error.error = true;
    }
    return error;
}   

export default function Form() {
    const [items, setItems] = useState([]);
    const [input, setInput] = useState({
        full_name: "",
        email: "",
        birth_date: "",
        country_of_origin: "",
    });
    const [errors, setErrors] = useState({error: true});
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
    const inputs = items.filter(item => item.type !== "submit" && item.type !== "select" && item.type !== "checkbox" && item.type !== "date");
    const [date] = items.filter(item => item.type === "date");
    const [checkbox] = items.filter(item => item.type === "checkbox");
    const [select] = items.filter(item => item.type === "select");
    const [submit] = items.filter(item => item.type === "submit");

    const handleChange = (event) => {
        console.log(event.target.value)
        setInput({
            ...input,
            [event.target.name]: event.target.value
        });
        setErrors(validate({...input, [event.target.name]:event.target.value}));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const docRef = await addDoc(collection(db, "usuarios"), {
            ...input
        })
        .then((res) => {
            swal({
                title: "¡Registro completado!",
                icon: "info",
                buttons:["No", "Ver respuestas"]
            }).then(response => {
                if(response) {
                    window.location = `http://localhost:3000/answer/${docRef.id}`;
                }
                else {
                    window.location = "http://localhost:3000/";
                }
            });
            return res;
        })
        .catch(error => console.log(error));
        console.log("Document written with ID: ", docRef.id);
        setInput({
            full_name: "",
            email: "",
            birth_date: "",
            country_of_origin: "",
        });
    }

    console.log(process.env.REACT_APP_FIREBASE_APP_ID)

    return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-md-auto">
                <form onSubmit={handleSubmit}>
                    {inputs && inputs.map((item,i) => {
                        return <div key={i}>
                            <label className="form-label">{item.label}: </label>    
                            <input 
                                type={item.type}
                                required={item.required}
                                name={item.name}
                                value={input[item.name]}
                                onChange={handleChange}
                                className="form-control w-100 mb-2"
                            />
                            {errors[item.name] && <p className="text-danger">{errors[item.name]}</p>}
                        </div>;
                    })}
                    <div> 
                        {date ? <>
                            <label className="form-label">{date.label}</label>
                            <input 
                                type={date.type}
                                name={date.name} 
                                value={input[date.name]}
                                required={date.required}
                                onChange={handleChange}
                                className="form-control w-100 mb-2"
                            /> 
                            {errors[date.name] && <p className="text-danger">{errors[date.name]}</p>}
                        </> : "Loading..." }
                        
                    </div>
                    <div className="mb-2"> {select ? <>
                        <Select item={select} handler={handleChange}/>
                    </>: "Loading..."} </div>
                    <div className="form-check mb-2"> 
                        {checkbox ? <>
                            <input 
                                className="form-check-input"
                                type={checkbox.type}
                                name={checkbox.name} 
                                required={checkbox.required}
                                onChange={handleChange}
                            /> 
                            <label className="form-check-label">{checkbox.label}</label>
                            {errors[checkbox.name] && <p className="text-danger">{errors[checkbox.name]}</p>}
                        </> : "Loading..." }
                    </div>
                    <div>
                        {submit ? <input 
                            value={submit.label}
                            type={submit.type}
                            className={errors.error?"btn btn-outline-secondary disabled":"btn btn-outline-secondary"}
                        />: "Loading.."}
                    </div>
                </form>
                </div>
            </div>
        </div>
    );
}