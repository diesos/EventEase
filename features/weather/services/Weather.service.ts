import type { Weather, WeatherResponse } from "@/types/weather"

export class WeatherService {
	static async fetchWeather(town: string): Promise<WeatherResponse> {
		const API_KEY= 'ad882236b7998e033f9664ea0955a331'
		const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather'
		try{
		const response = await fetch(`${BASE_URL}?q=${town}&appid=${API_KEY}&units=metric&lang=fr`)
		if (!response.ok) {
			throw new Error(`Weather API error: ${response.status}`);
		}
		const data = await response.json()
		return (data);
	}catch(e){
		throw new Error(`Failed to fetch weather: ${e}`);
	}
	}
}
