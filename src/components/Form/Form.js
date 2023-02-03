import React, { useEffect, useState } from "react";
import Select from "../Select/Select";
import { collection, addDoc } from "firebase/firestore";
import swal from 'sweetalert';
import { db } from "../../DB/db";

function isOverEighteen(year, month, day) {
    var now = parseInt(new Date().toISOString().slice(0, 10).replace(/-/g, ''));
    var dob = year * 10000 + month * 100 + day * 1; // Coerces strings to integers
  
    return now - dob >= 180000;
}

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
    else {
        try {
            const date = state.birth_date.split('-');
            console.log(date)
            const year = parseInt(date[0]);
            const month = parseInt(date[1]);
            const day = parseInt(date[2]);
            if(!isOverEighteen(year, month, day)) {
                error.birth_date = "Debes ser mayor a 18 años.";
                error.error = true;
            }
        } catch (error) {
            console.log(error);
        }
    }
    if(!state.country_of_origin){
        error.country_of_origin = "Pais de origen es requerido."
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
    const getItems = () => {
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
                text: "¿Desea ver las respuestas?",
                buttons:["No", "Ver respuestas"]
            }).then(response => {
                if(response) {
                    window.location = `https://challenge-greydive-seven.vercel.app/answer/${docRef.id}`;
                    // window.location = `http://localhost:3000/answer/${docRef.id}`;
                }
                else {
                    window.location = "https://challenge-greydive-seven.vercel.app";
                }
            });
            return res;
        })
        .catch(error => console.log(error));
        
        setInput({
            full_name: "",
            email: "",
            birth_date: "",
            country_of_origin: "",
        });
    }

    console.log(process.env.REACT_APP_FIREBASE_APP_ID)

    return (
        <div className="container my-5">
            <div className="row justify-content-md-center">
                <div className="col-md-auto shadow-lg">
                    <div className="my-3">
                        <h3>¡Bienvenido/a!</h3>
                        <p className="text-wrap">
                            ¡Completa el formulario para ser parte de GREYDIVE.!
                        </p>
                        <p>Obligatorio(*).</p>
                    </div>
                    <form onSubmit={handleSubmit} className="my-3" >
                        {inputs && inputs.map((item,i) => {
                            return <div key={i}>
                                <label className="form-label">{item.label}: * </label>    
                                <input 
                                    type={item.type}
                                    required={item.required}
                                    name={item.name}
                                    value={input[item.name]}
                                    onChange={handleChange}
                                    className="form-control w-100 mb-2"
                                />
                                <p className="text-danger fs-6">{errors[item.name] && errors[item.name]}</p>
                            </div>;
                        })}
                        
                        <div className="mb-2"> {select ? <>
                            <Select item={select} handler={handleChange}/>
                            <p className="text-danger fs-6">{errors[select.name] && errors[select.name]}</p>
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
                                <label className="form-check-label">{checkbox.label} *</label>
                                <p className="text-danger fs-6">{errors[checkbox.name] && errors[checkbox.name]} </p>
                            </> : "Loading..." }
                        </div>
                        <div className="d-flex justify-content-center">
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
