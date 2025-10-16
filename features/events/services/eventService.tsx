import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Event } from '../../../types';


export const fetchEvents = async (): Promise<Event[]> => {
	try {

		const events = await AsyncStorage.getItem('events');
		if (!events)
			console.log("Pas d'events")
		return events ? JSON.parse(events) : [];
	} catch (error) {
		console.error("Error fetching events:", error);
		return [];
	}
};

export const createEvent = async (newEvent: Event): Promise<{ success: boolean; message: string }> => {
	try {
		const eventsStr = await AsyncStorage.getItem('events');
		if (!eventsStr) {

			const events: Event[] = Array.isArray(newEvent) ? newEvent : [newEvent];
			AsyncStorage.setItem('events', JSON.stringify(events));
			return {
				success: true,
				message: "Event crée avec succès"
			}

		}

		const parsedData = JSON.parse(eventsStr);
		const events: Event[] = Array.isArray(parsedData) ? parsedData : [parsedData];
		if (events)
			events.push(newEvent);
		AsyncStorage.setItem('events', JSON.stringify(events));
		return {
			success: true,
			message: 'Event crée avec succès'
		}
	}
	catch{
		console.log( 'error returning creating events')
	}
}


export const editEvent = async (event: Event): Promise <{success : boolean, message: string }> =>{
	try{
		const eventsStr = await AsyncStorage.getItem('events');
		if (!eventsStr) {
			return {
				success: false,
				message: 'Aucun événement trouvé'
			};
		}

		const events: Event[] = eventsStr ? JSON.parse(eventsStr) : [];
		const foundEventIndex = events.findIndex((v: Event) => event.id === v.id);

		if (foundEventIndex !== -1) {
			events[foundEventIndex] = event;
			await AsyncStorage.setItem('events', JSON.stringify(events));
			return {
				success: true,
				message: 'Event modifié avec succès'
			};
		}
		return {
			success: false,
			message: 'Event non trouvé'
		};
	}
	catch {
		alert('Error editing event')
	}
}

export const deleteEvent = async (eventId: any): Promise<{ success: boolean; message: string }> => {
	try {
		const eventsStr = await AsyncStorage.getItem('events');
		if (!eventsStr) {
			return {
				success: false,
				message: 'Aucun événement trouvé'
			};
		}

		const parsedData = JSON.parse(eventsStr);
		const events: Event[] = Array.isArray(parsedData) ? parsedData : [parsedData];
		const foundEventIndex = events.findIndex((v: Event) => eventId === v.id);

		if (foundEventIndex !== -1) {
			const updatedEvents = events.filter((v: Event) => v.id !== eventId);
			await AsyncStorage.setItem('events', JSON.stringify(updatedEvents));
			console.log("Event supprimée avec l'id: ", eventId)
			return {
				success: true,
				message: 'Event supprimée avec succès'
			};
		}
		return {
			success: false,
			message: 'Event non trouvé'
		};
	} catch (err) {
		console.error('Error deleting event:', err);
		return {
			success: false,
			message: 'Erreur lors de la suppression'
		};
	}
}




