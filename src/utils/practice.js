import React, { useContext, createContext, useState } from "react";
import { useWallet } from '../utils/wallet';
import { notify } from "./notifications";
import axios from "axios"

//const { providerUrl, providerName, wallet, connected } = useWallet();
//const publicKey = (connected && wallet?.publicKey?.toBase58()) || '';

const API_URL = "http://localhost:4000/addExercise?"
const API_URL_GET = "http://localhost:4000/wallet?wallet="

if (!localStorage.streak){
    localStorage.streak = 0
}

function sendNewHistory(pkey, pred, mod) {
    async function History() {
        try {
            const SYMBOLS = ["BNBUSDT", "VET/USDT", "SNC/USDT", "SANDUSDT", "BCHUSDT",
            "BTCUSDT", "ADAUSDT", "TRXUSDT", "ANKRUSDT","MANAUSDT", "SLPUSDT",
            "FIL/USDT", "FTTUSDT", "FTMUSDT", "IDEX/USDT",":OMGUSDT", "DOGEUSDT"]
            const random = Math.floor(Math.random() * 18)
            const symbol = SYMBOLS[random]
            const esc = encodeURIComponent;
            const params = {
                wallet: pkey,
                exerciseid: "COOP-" + localStorage.exercise_hash,
                resp: pred,
                ex_type: mod

            };
            const query = Object.keys(params).map(k => `${esc(k)}=${esc(params[k])}`).join('&')
            let resp = await fetch(API_URL + query)
            //const resp = await axios.get(API_URL + query)
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

const symbols = ["Binance:BNB/USDT", "Binance:VET/USDT", "Binance:SNC/USDT", "Binance:SAND/USDT", "Binance:BCH/USDT",
  "Binance:BTC/USDT", "Binance:ADA/USDT", "Binance:TRX/USDT", "Binance:ANKR/USDT","Binance:MANA/USDT", "Binance:SLP/USDT",
  "Binance:FIL/USDT", "Binance:FTM/USDT", "Binance:FTM/USDT", "Binance:IDEX/USDT","Binance:OMG/USDT", "Binance:DOGE/USDT"]
  const random = Math.floor(Math.random() * 18)
  const symbol = symbols[random]

const default_practice = {
    symbol: symbol,
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

    const [conected_api, setConected_api] = useState("init")
    
    const [streak, setStreak] = useState(Number(localStorage.streak))
    
    console.log("Valor streak", streak )

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
                setConected_api('ok')
            }
            catch (error) {
                console.log(error)
            }
        }
        History2()
    }


    function predict(value, id_wallet, modality) {
        const refresh = {
            symbol: practice.symbol,
            modality: practice.modality,
            skip: false
        }
        let mod = 0
        switch (modality) {
            case "scalping":
                mod = 0
            case "intra":
                mod = 1
            case "swing":
                mod = 2
            case "position":
                mod = 3
        }
        let v_resp;
        
        if (value == true){
            v_resp =  2
        }else{
            v_resp =  0
        }
        let response = {
            user_hash: id_wallet,
            exercise_hash: localStorage.exercise_hash,
            user_trending_response: v_resp
        }
        
        let hit;
        axios.post("http://52.165.40.126:5000/respond", response).then( ({data}) => {
            hit = data.hit

            if (hit == true) {
                console.log("ENTRO TRUE")
                sendNewHistory(id_wallet, 1, mod)
                getHistory(id_wallet)
                localStorage.streak = Number(localStorage.streak) + 1
                setStreak(Number(localStorage.streak))
    
                //
            } else if (hit == false) {
                console.log("ENTRO False")
                sendNewHistory(id_wallet, 0, mod)
                getHistory(id_wallet)
            }
            console.log("hit", data.hit)
        }).catch(function (error) {
            console.log("Error post",error);
          });
			

        

        setPractice(refresh)

    }

    return <Provider value={{ practice, setPractice, skip, predict, history, setHistory, conected_api, setConected_api, streak, setStreak}}>
        {children}</Provider>;
}

export function usePractice() {
    return useContext(PracticeContext)
}
