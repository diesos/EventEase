import { deleteEvent, editEvent, fetchEvents } from "@/features/events/services";
import { router } from "expo-router";
import { Calendar } from 'react-native-calendars';
import { WeatherService } from '../features/weather/services/Weather.service';

import React, { useEffect, useState } from "react";
import {
	Alert,
	FlatList,
	ImageBackground,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { isLoggedIn } from "../features/auth/services/isLoggedIn";

import CreateEventModal from '../features/events/components/eventCrud';
import NotLoggedInView from '../components/NotLoggedInView';
import { Event, User } from '../types';

export default function UserBoardScreen() {
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [actualUser, setActualUser] = useState<User | null>(null);
	const [eventFetched, setEventFetched] = useState<Event[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [weatherData, setWeatherData] = useState<{ [key: string]: string }>({});
	const [editModalVisible, setEditModalVisible] = useState(false);
	const [eventToEdit, setEventToEdit] = useState<Event | undefined>(undefined);
	const [isSaving, setIsSaving] = useState(false);
	const [createModalVisible, setCreateModalVisible] = useState(false);
	const [calendarVisible, setCalendarVisible] = useState(false);


	useEffect(() => {
		checkLogin();
		eventList();
		setIsLoading(false)
	}, [selectedDate]);

	useEffect(() => {
		if (isDeleting) {
			eventList();
			setIsDeleting(false);
		}
	}, [isDeleting]);

	const checkLogin = async () => {
		const loggedIn = await isLoggedIn();
		if (loggedIn)
			setIsUserLoggedIn(true);
		if (loggedIn && !actualUser) {
			setActualUser(loggedIn);
		}
			else {
				setActualUser(null);
			}
		}

		const fetchWeatherByDay = async (town: string) => {
				try {
				const response = await WeatherService.fetchWeather(town)
				if (response && response.main && response.main.temp !== undefined){
					const rawWeather = response.main.temp.toFixed(0)
					return(rawWeather + '°')
				}
				return 'N/A';
			} catch (error) {
				return 'N/A';
			}
		}
	const eventList = async () =>{
				const events = await fetchEvents();
				if (events){
					// S'assurer que tous les événements ont un array participants
					const eventsWithParticipants = events.map(event => ({
						...event,
						participants: event.participants || []
					}));
					setEventFetched(eventsWithParticipants)
					// Fetch weather for each unique location
					const uniqueLocations = [...new Set(events.map(event => event.location))];
					const weatherPromises = uniqueLocations.map(async location => {
						if (location) {
							const temp = await fetchWeatherByDay(location);
							return { location, temp };
						}
						return null;
					});
					const weatherResults = await Promise.all(weatherPromises);
					const newWeatherData: { [key: string]: string } = {};
					weatherResults.forEach(result => {
						if (result) {
							newWeatherData[result.location] = result.temp;
						}
					});
					setWeatherData(newWeatherData);
				}
				else {
					setEventFetched(null);
				}
			}

	const converDateToFr = (date: any) => {
		date = new Date(date)
		return date.toLocaleString('fr-FR', {
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		})
	}

	 const handleDelete = (event: Event) => {
    Alert.alert(
      "Supprimer l'évenement",
      `Êtes-vous sûr de vouloir supprimer "${event.title}" ? Cette action est irréversible.`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteEvent(event.id);
            } catch (error) {
              Alert.alert('Erreur', 'Impossible de supprimer le marker');
            }
			finally{
				setIsDeleting(true);
			}
          }
        }
      ]
    );
  };

  const handleEdit = (event: Event) => {
    setEventToEdit(event);
    setEditModalVisible(true);
  };

  const handleCloseEditModal = () => {
    setEditModalVisible(false);
    setEventToEdit(undefined);
  };

  const handleStartSaving = () => {
    setIsSaving(true);
  };

  const handleFinishSaving = () => {
    setIsSaving(false);
    setIsDeleting(true); // Pour rafraîchir la liste
  };

  const handleCreateEvent = () => {
    setCreateModalVisible(true);
  };

  const handleCloseCreateModal = () => {
    setCreateModalVisible(false);
  };

  const toggleCalendar = () => {
    setCalendarVisible(!calendarVisible);
  };

  const handleParticipation = async (event: Event) => {
    // Utiliser l'email comme identifiant si pas d'ID
    const userId = actualUser?.id || actualUser?.email;

    if (!userId) {
      return;
    }

    const isParticipating = event.participants?.includes(userId);

    let updatedParticipants: string[];

    if (isParticipating) {
      // Retirer l'utilisateur des participants
      updatedParticipants = event.participants.filter(id => id !== userId);
    } else {
      // Ajouter l'utilisateur aux participants
      updatedParticipants = [...(event.participants || []), userId];
    }

    const updatedEvent = {
      ...event,
      participants: updatedParticipants
    };

    try {
      await editEvent(updatedEvent);
      setIsDeleting(true); // Pour rafraîchir la liste
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  };

  const isUserParticipating = (event: Event): boolean => {
    const userId = actualUser?.id || actualUser?.email;
    return event.participants?.includes(userId || '') || false;
  };



  return (
	<SafeAreaView style={styles.container}>
	{ isUserLoggedIn ? (
<>
	  <StatusBar barStyle="light-content" backgroundColor="#163686" />

	  <ImageBackground
		source={{
		  uri: 'https://i.ibb.co/k2ZCcJqZ/Gemini-Generated-Image-1831281831281831.webp'
		}}
		style={styles.backgroundImage}
		resizeMode="cover"
	  >
		<View style={styles.overlay}>
		  {/* Back Button */}
		  <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
			<Text style={styles.backButtonText}>← Retour</Text>
		  </TouchableOpacity>

		  {/* Header */}
		  <View style={styles.header}>
			<Text style={styles.logo}>🗓️</Text>
			<Text style={styles.title}>Mes Événements</Text>
			<Text style={styles.subtitle}>
			 Bienvenue {actualUser?.firstName}
			</Text>
		  </View>

		  {/* Toggle Calendar Button */}
		  <TouchableOpacity style={styles.toggleButton} onPress={toggleCalendar}>
			<Text style={styles.toggleButtonText}>
			  {calendarVisible ? '📅 Masquer calendrier' : '📅 Afficher calendrier'}
			</Text>
		  </TouchableOpacity>

		  {/* Calendar */}
		  {calendarVisible && (
			<View style={styles.calendarContainer}>
			  <Calendar
				style={styles.calendar}
				theme={{
				  backgroundColor: '#ffffff',
				  calendarBackground: '#ffffff',
				  textSectionTitleColor: '#b6c1cd',
				  selectedDayBackgroundColor: '#00adf5',
				  selectedDayTextColor: '#ffffff',
				  todayTextColor: '#00adf5',
				  dayTextColor: '#2d4150',
				  textDisabledColor: '#dd99ee'
				}}
				current={new Date().toISOString().split('T')[0]}
				onDayPress={day => {
				  setSelectedDate(new Date(day.dateString));
				}}
				markedDates={eventFetched?.reduce((acc, event) => ({
				  ...acc,
				  [new Date(event.date).toISOString().split('T')[0]]: {
					marked: true,
					selectedColor: '#4CAF50'
				  }
				}), {})}
			  />
			</View>
		  )}

		  {/* Add Event Button */}
		  <TouchableOpacity style={styles.addButton} onPress={handleCreateEvent}>
			<Text style={styles.addButtonText}>+ Créer un événement</Text>
		  </TouchableOpacity>

		  {/* Events List */}
		  <View style={styles.eventsContainer}>
			<Text style={styles.eventsTitle}>
			  Événements du {selectedDate.toLocaleDateString('fr-FR')}
			</Text>

			{ eventFetched && !isLoading ?
			  (
				<FlatList
				  data={eventFetched.filter((v) => new Date(v.date).toISOString().split('T')[0] === new Date(selectedDate).toISOString().split('T')[0])}
				  renderItem={({item}) =>
					<View style={styles.eventCard}>
					  <View style={styles.eventHeader}>
						<Text style={styles.eventTitle}>{item.title}</Text>
						<View style={styles.actionButtons}>
						  <TouchableOpacity onPress={() => handleEdit(item)} style={styles.editButton}>
							<Text style={styles.buttonText}>✏️</Text>
						  </TouchableOpacity>
						  <TouchableOpacity onPress={() => handleDelete(item)} style={styles.deleteButton}>
							<Text style={styles.buttonText}>🗑️</Text>
						  </TouchableOpacity>
						</View>
					  </View>

					  <Text style={styles.eventDescription}>{item.description}</Text>

					  {/* Informations de participation */}
					  <View style={styles.participationInfo}>
						<Text style={styles.participantCount}>
						  👥 {(item.participants || []).length} participant{((item.participants || []).length) > 1 ? 's' : ''}
						  {item.maxParticipants && ` / ${item.maxParticipants}`}
						</Text>

						<TouchableOpacity
						  style={[
							styles.participateButton,
							isUserParticipating(item) ? styles.participateButtonActive : styles.participateButtonInactive
						  ]}
						  onPress={() => handleParticipation(item)}
						>
						  <Text style={[
							styles.participateButtonText,
							isUserParticipating(item) ? styles.participateButtonTextActive : styles.participateButtonTextInactive
						  ]}>
							{isUserParticipating(item) ? '✓ Inscrit' : '+ Participer'}
						  </Text>
						</TouchableOpacity>
					  </View>

					  <View style={styles.eventFooter}>
						<Text style={styles.eventTime}>
						  📅 {converDateToFr(item.date)}
						</Text>
						{item.location && (
						  <Text style={styles.eventLocation}>
							📍 {item.location} {weatherData[item.location] && `(${weatherData[item.location]})`}
						  </Text>
						)}
					  </View>
					</View>
				  }
				  keyExtractor={item => item.id}
				  showsVerticalScrollIndicator={false}
				  ListEmptyComponent={
					<View style={styles.emptyContainer}>
					  <Text style={styles.emptyText}>Aucun événement ce jour-là</Text>
					  <Text style={styles.emptySubText}>Créez votre premier événement !</Text>
					</View>
				  }
				/>
			  )
			  :
			  (
				<View style={styles.loadingContainer}>
				  <Text style={styles.loadingText}>Chargement des événements...</Text>
				</View>
			  )
			}
		  </View>
		</View>
	  </ImageBackground>
	</>
	) : (
		<NotLoggedInView 
		  message="Connectez-vous pour accéder à vos événements et découvrir toutes les activités disponibles"
		  buttonText="Se connecter"
		/>
	)}

	{/* Modals */}
	<CreateEventModal
	  visible={editModalVisible}
	  onClose={handleCloseEditModal}
	  editEvent={eventToEdit}
	  isSaving={isSaving}
	  onStartSaving={handleStartSaving}
	  onFinishSaving={handleFinishSaving}
	/>

	<CreateEventModal
	  visible={createModalVisible}
	  onClose={handleCloseCreateModal}
	  isSaving={isSaving}
	  onStartSaving={handleStartSaving}
	  onFinishSaving={handleFinishSaving}
	/>
	</SafeAreaView>
  );}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: '#173786',
  },
  backgroundImage: {
	flex: 1,
	width: '100%',
	height: '100%',
  },
  overlay: {
	flex: 1,
	backgroundColor: 'rgba(21, 55, 143, 0.85)',
	paddingHorizontal: 20,
	paddingTop: 40,
  },
  backButton: {
	alignSelf: 'flex-start',
	backgroundColor: 'rgba(255, 255, 255, 0.2)',
	paddingHorizontal: 15,
	paddingVertical: 8,
	borderRadius: 20,
	marginBottom: 10,
  },
  backButtonText: {
	color: '#ffffff',
	fontSize: 16,
	fontWeight: '600',
  },
  header: {
	alignItems: 'center',
	marginBottom: 15,
  },
  toggleButton: {
	backgroundColor: 'rgba(255, 255, 255, 0.2)',
	paddingVertical: 8,
	paddingHorizontal: 16,
	borderRadius: 20,
	alignItems: 'center',
	marginBottom: 10,
	borderWidth: 1,
	borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  toggleButtonText: {
	color: '#ffffff',
	fontSize: 14,
	fontWeight: '500',
  },
  logo: {
	fontSize: 40,
	marginBottom: 6,
  },
  title: {
	fontSize: 24,
	fontWeight: '800',
	color: '#ffffff',
	textAlign: 'center',
	marginBottom: 2,
	textShadowColor: 'rgba(0, 0, 0, 0.3)',
	textShadowOffset: { width: 0, height: 2 },
	textShadowRadius: 4,
  },
  subtitle: {
	fontSize: 14,
	color: '#e8f5e8',
	textAlign: 'center',
	fontWeight: '300',
	letterSpacing: 0.5,
  },
  calendarContainer: {
	marginBottom: 15,
	borderRadius: 12,
	overflow: 'hidden',
	backgroundColor: '#ffffff',
  },
  calendar: {
	borderRadius: 12,
  },
  addButton: {
	backgroundColor: '#4CAF50',
	paddingVertical: 10,
	paddingHorizontal: 20,
	borderRadius: 25,
	alignItems: 'center',
	marginBottom: 15,
	shadowColor: '#000',
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.2,
	shadowRadius: 4,
	elevation: 4,
  },
  addButtonText: {
	fontSize: 16,
	fontWeight: '600',
	color: '#ffffff',
  },
  eventsContainer: {
	flex: 1,
  },
  eventsTitle: {
	fontSize: 18,
	fontWeight: '600',
	color: '#ffffff',
	marginBottom: 12,
	textAlign: 'center',
  },
  eventCard: {
	backgroundColor: 'rgba(255, 255, 255, 0.95)',
	borderRadius: 12,
	padding: 16,
	marginBottom: 12,
	shadowColor: '#000',
	shadowOffset: { width: 0, height: 2 },
	shadowOpacity: 0.1,
	shadowRadius: 4,
	elevation: 3,
  },
  eventHeader: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'flex-start',
	marginBottom: 8,
  },
  eventTitle: {
	fontSize: 18,
	fontWeight: '700',
	color: '#333',
	flex: 1,
	marginRight: 10,
  },
  eventDescription: {
	fontSize: 14,
	color: '#666',
	marginBottom: 12,
	lineHeight: 20,
  },
  participationInfo: {
	flexDirection: 'row',
	justifyContent: 'space-between',
	alignItems: 'center',
	marginBottom: 12,
	paddingVertical: 8,
	paddingHorizontal: 12,
	backgroundColor: '#f8f9fa',
	borderRadius: 8,
  },
  participantCount: {
	fontSize: 14,
	color: '#666',
	fontWeight: '500',
  },
  participateButton: {
	paddingVertical: 6,
	paddingHorizontal: 12,
	borderRadius: 15,
	minWidth: 80,
	alignItems: 'center',
  },
  participateButtonActive: {
	backgroundColor: '#4CAF50',
  },
  participateButtonInactive: {
	backgroundColor: '#007AFF',
  },
  participateButtonText: {
	fontSize: 12,
	fontWeight: '600',
  },
  participateButtonTextActive: {
	color: '#ffffff',
  },
  participateButtonTextInactive: {
	color: '#ffffff',
  },
  eventFooter: {
	borderTopWidth: 1,
	borderTopColor: '#eee',
	paddingTop: 8,
  },
  eventTime: {
	fontSize: 12,
	color: '#888',
	marginBottom: 4,
  },
  eventLocation: {
	fontSize: 12,
	color: '#888',
  },
  actionButtons: {
	flexDirection: 'row',
	gap: 8,
  },
  editButton: {
	backgroundColor: '#007AFF',
	paddingHorizontal: 10,
	paddingVertical: 6,
	borderRadius: 6,
  },
  deleteButton: {
	backgroundColor: '#FF3B30',
	paddingHorizontal: 10,
	paddingVertical: 6,
	borderRadius: 6,
  },
  buttonText: {
	fontSize: 14,
	color: '#ffffff',
  },
  emptyContainer: {
	alignItems: 'center',
	paddingVertical: 40,
  },
  emptyText: {
	fontSize: 16,
	color: 'rgba(255, 255, 255, 0.8)',
	textAlign: 'center',
	marginBottom: 4,
  },
  emptySubText: {
	fontSize: 14,
	color: 'rgba(255, 255, 255, 0.6)',
	textAlign: 'center',
  },
  loadingContainer: {
	alignItems: 'center',
	paddingVertical: 40,
  },
  loadingText: {
	fontSize: 16,
	color: 'rgba(255, 255, 255, 0.8)',
	textAlign: 'center',
  },
});
