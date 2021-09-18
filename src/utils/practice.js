import React, { useContext, createContext, useState } from "react";
import { useWallet } from '../utils/wallet';


//const { providerUrl, providerName, wallet, connected } = useWallet();
//const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

const API_URL = "http://localhost:4000/addExercise?"

function sendNewHistory(pkey) {
    async function History() {
        try {
            const esc = encodeURIComponent;
            const params = { 
                wallet: "Ho5rHkUWSmGv7jodRhxquSyNbwCSKYvEDAphqaAKU5KA",
                exerciseid: "SOLUSDT0101202004001M5H",
                resp: "false"
            };
            const query = Object.keys(params).map(k => `${esc(k)}=${esc(params[k])}`).join('&')
            let resp = await fetch(API_URL + query) 
            console.log("Resp", resp)
        }
        catch (error) {
            console.log(error)
        }
    }
    History()
}

export const PracticeContext = createContext()

let { Provider, Consumer } = PracticeContext


const initial = {
    symbol: "Bitfinex:BTC/USD",
    modality: "scalping",
    skip: false
}

export function PracticeProvider({ children }) {

    const [practice, setPractice] = useState(initial)

    function skip() {
        const skipped = {
            symbol: practice.symbol,
            modality: practice.modality,
            skip: true
        }

        setPractice(skipped)
    }

    function predict(value) {
        const refresh = {
            symbol: practice.symbol,
            modality: practice.modality,
            skip: false
        }

        if (value == true) {
            sendNewHistory("Ho5rHkUWSmGv7jodRhxquSyNbwCSKYvEDAphqaAKU5KA")
        }

        setPractice(refresh)

    }

    return <Provider value={{ practice, setPractice, skip, predict }}> {children}</Provider>;
}

export function usePractice() {
    return useContext(PracticeContext)
}
