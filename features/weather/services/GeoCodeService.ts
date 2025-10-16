

export class GeoCodeService {
	static async fetchWeather(town: string) {
		const API_KEY= ''
		const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
		try{
		const response = await fetch(`${BASE_URL}?q=${town}&appid=${API_KEY}&units=metric&lang=fr`)
		const data = response.json()
		return (data);
	}catch(e){
		return (e)
	}
	}
}
