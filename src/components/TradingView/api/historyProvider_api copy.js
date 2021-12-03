import axios from "axios"
var rp = require('request-promise').defaults({json: true})


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
		

		return axios.get("http://52.165.40.126:5000/exercise").then( ({data}) => {
			
			console.log(data)
			let bars = data.map(el =>{
				return {
					time: parseInt(el[0]), //TradingView requires bar time in ms
					low: el[3],
					high: el[2],
					open: el[1],
					close: el[4],
					volume: el[5]
				}
			})
			return bars 
		})
        return rp({
                url: `${api_root}${url}`,qs
            })
            .then(data => {
                console.log({data})
				if (data.Response && data.Response === 'Error') {
					console.log('CryptoCompare API error:',data.Message)
					return []
				}
				if (data.Data.length) {
					console.log(`Actually returned: ${new Date(data.TimeFrom * 1000).toISOString()} - ${new Date(data.TimeTo * 1000).toISOString()}`)
					var bars = data.Data.map(el => {
						return {
							time: el.time * 1000, //TradingView requires bar time in ms
							low: el.low,
							high: el.high,
							open: el.open,
							close: el.close,
							volume: el.volumefrom 
						}
					})
					//const bars2 = bars
						if (first) {
							var lastBar = bars[bars.length - 1]
							history[symbolInfo.name] = {lastBar: lastBar}
						}
					console.log(bars)	
					return bars
					
				} else {
					return []
				}
			})
}
}
