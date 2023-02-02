import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../DB/db";
import { useParams } from "react-router-dom";

export default function Answers() {
    const { userId } = useParams();
    const [answer, setAnswer] = useState({});
    const getAnswers = userId => {
        const docRef = doc(db, "usuarios", userId);
        getDoc(docRef)
            .then(data => {
                if (!data.exists()) throw new Error("Not found.");

                setAnswer(data.data());
            }).catch(error => console.log(error));
    };

    useEffect(() => {
        getAnswers(userId);
    }, [userId]);

    return (
        <>
            <div className="container mx-auto my-5 w-75">
                <div className="card w-50 mx-auto">
                    <div className="card-header py-2 bg-secondary bg-gradient"></div>
                    <div className="card-body">
                        <h4 className="card-title">Gracias por rellenar el formulario.</h4>
                        <p className="card-text">Esto es lo que se recibió.</p>
                    </div>
                </div>
                <div className="card w-50 mx-auto my-3">
                    <div className="card-body">
                        <h6 className="card-title">Nombre completo: </h6>
                        <p className="card-text">{answer.full_name}</p>
                    </div>
                </div>
                <div className="card w-50 mx-auto my-3">
                    <div className="card-body">
                        <h6 className="card-title">email: </h6>
                        <p className="card-text">{answer.email}</p>
                    </div>
                </div>
                <div className="card w-50 mx-auto my-3">
                    <div className="card-body">
                        <h6 className="card-title">Fecha de nacimiento: </h6>
                        <p className="card-text">{answer.birth_date}</p>
                    </div>
                </div>
                <div className="card w-50 mx-auto">
                    <div className="card-body">
                        <h6 className="card-title">Pais de origen: </h6>
                        <p className="card-text">{answer.country_of_origin}</p>
                    </div>
                </div>
            </div>
        </>
    );
}