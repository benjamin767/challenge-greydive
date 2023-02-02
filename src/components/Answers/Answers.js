import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../DB/db";
import { useParams } from "react-router-dom";

export default function Answers() {
    const { userId } = useParams();
    const [ answer, setAnswer ] = useState({});
    const getAnswers = userId => {
        const docRef = doc(db, "usuarios", userId);
        getDoc(docRef)
        .then(data => {
            if(!data.exists()) throw new Error("Not found.");
            
            setAnswer(data.data());
        }).catch(error => console.log(error));
    };

    useEffect(() => {
        getAnswers(userId);
    }, [userId]);

    return (
        <>
            <h2>{answer.full_name}</h2>
        </>
    );
}