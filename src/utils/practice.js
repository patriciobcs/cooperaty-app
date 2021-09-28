import React, { useContext, createContext, useState } from "react";
import { useWallet } from '../utils/wallet';
import { notify } from "./notifications";


//const { providerUrl, providerName, wallet, connected } = useWallet();
//const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

const API_URL = "http://localhost:4000/addExercise?"
const API_URL_GET = "http://localhost:4000/wallet?wallet="

function sendNewHistory(pkey) {
    async function History() {
        try {
            const esc = encodeURIComponent;
            const params = {
                wallet: "Ho5rHkUWSmGv7jodRhxquSyNbwCSKYvEDAphqaAKU5KA",
                exerciseid: "SOLUSDT0101202004001M5H",
                resp: false
            };
            const query = Object.keys(params).map(k => `${esc(k)}=${esc(params[k])}`).join('&')
            let resp = await fetch(API_URL + query)
            console.log("Resp", resp)
        }
        catch (error) {
            notify({
                message: "Error enviando datos a API",
                description: "No se ha podido establecer conexión con API",
                type: "error"
              })
            console.log(error)
        }
    }
    History()
}


export const PracticeContext = createContext()

let { Provider, Consumer } = PracticeContext


const default_practice = {
    symbol: "Bitfinex:BTC/USD",
    modality: "scalping",
    skip: false
}

const history_test = {
    "historial": [

        {
            "date": "2021-07-20T16:34:22.138967",
            "exercise_id": "SOLUSDT0101202004002M5H",
            "pair": "SOL-USD",
            "resp": true
        },
    ],
    "stats": {
        "correct_answers": 3,
        "last_attemp_date": "2021-07-20T16:34:23.137740",
        "performance": 75.0,
        "total_attemps": 4
    }
}

export function PracticeProvider({ children }) {

    const [practice, setPractice] = useState(default_practice)

    const [history, setHistory] = useState(history_test)

    function skip() {
        const skipped = {
            symbol: practice.symbol,
            modality: practice.modality,
            skip: true
        }

        setPractice(skipped)
    }

    function getHistory(pkey) {
        async function History2() {
            try {
                let response = await fetch(API_URL_GET + pkey)
                let resp = await response.json()
                setHistory(resp)
            }
            catch (error) {
                console.log(error)
            }
        }
        History2()
    }
    

    function predict(value) {
        const refresh = {
            symbol: practice.symbol,
            modality: practice.modality,
            skip: false
        }

        if (value == true) {
            sendNewHistory("Ho5rHkUWSmGv7jodRhxquSyNbwCSKYvEDAphqaAKU5KA")
            getHistory("Ho5rHkUWSmGv7jodRhxquSyNbwCSKYvEDAphqaAKU5KA")

            //
        } else if (value == true) {
            sendNewHistory("Ho5rHkUWSmGv7jodRhxquSyNbwCSKYvEDAphqaAKU5KA")
            getHistory("Ho5rHkUWSmGv7jodRhxquSyNbwCSKYvEDAphqaAKU5KA")
        }

        setPractice(refresh)

    }

    return <Provider value={{ practice, setPractice, skip, predict, history, setHistory }}> {children}</Provider>;
}

export function usePractice() {
    return useContext(PracticeContext)
}
