import axios from "axios"
var rp = require('request-promise').defaults({json: true})

const api_root = 'https://min-api.cryptocompare.com'
const history = {}

export default {
	history: history,

    getBars: function(symbolInfo, resolution, from, to, first, limit) {
		var split_symbol = symbolInfo.name.split(/[:/]/)
			const url = resolution === '1D' ? '/data/histoday' : 
			resolution === 'D' ? '/data/histoday' : resolution >= 60 ? '/data/histohour' : '/data/histominute'
			console.log("url",url)
			const qs = {
					e: split_symbol[0],
					fsym: split_symbol[1],
					tsym: split_symbol[2],
					toTs:  to ? to : '',
					limit: limit ? limit : 2000, 
					// aggregate: 1//resolution 
				}
			// console.log({qs})
		console.log(`${api_root}${url}`,qs)		
        return axios.get("http://52.165.40.126:5000/exercise?user_hash=Ho5rHkUWSmGv7jodRhxquSyNbwCSKYvEDAphqaAKU5KA", ).then( ({data}) => {
			
			console.log(data)
			let bars = data.x_training.map(el =>{
				return {
					time: parseInt(el[0]), //TradingView requires bar time in ms
					low: el[3],
					high: el[2],
					open: el[1],
					close: el[4],
					volume: el[5]
				}
			})
			localStorage.exercise_hash = data.exercise_hash
			return bars 
		})
}
}
