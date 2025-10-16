import { deleteEvent, fetchEvents } from "@/features/events/services";
import { router } from "expo-router";
import { Calendar } from 'react-native-calendars';

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

import { Event, User } from '../types';

export default function UserBoardScreen() {
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [actualUser, setActualUser] = useState<User | null>(null);
	const [eventFetched, setEventFetched] = useState<Event[] | null>(null);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [isDeleting, setIsDeleting] = useState<boolean>(false);
	const [selectedDate, setSelectedDate] = useState(new Date());


	useEffect(() => {
		checkLogin();
		eventList();
		setIsLoading(false)
		setIsDeleting(false)
	}, [isDeleting]);

	const checkLogin = async () => {
		const loggedIn = await isLoggedIn();
		if (loggedIn)
			setIsUserLoggedIn(true);
		if (loggedIn && !actualUser) {
			setActualUser(loggedIn);
			console.log('Actual User', actualUser)}
			else {
				setActualUser(null);
			}
		}
	const eventList = async () =>{
				const events = await fetchEvents();
				if (events){
					setEventFetched(events)
					console.log(events)
					console.log(typeof(events[0]?.date))
				}
				else {
					alert("Pas d'event")
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

	 const handleDelete = (event) => {
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


type ItemProps = {title: string};
const Item = ({title}: ItemProps) => (
  <View style={styles.item}>
    <Text style={styles.title}>{title}</Text>
  </View>
);

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
		  {/* Header */}
		  <View style={styles.header}>

			<Text style={styles.subtitle}>
			 Voici tous nos évenements
			</Text>
		  </View>

					  {/* Features */}
					  { eventFetched && !isLoading ?
					  (
					  <View style={styles.featuresContainer}>
										<Calendar
  // Customize the appearance of the calendar
  style={{
    borderWidth: 1,
    borderColor: 'gray',
    height: 350
  }}
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
  // Specify the current date
  current={new Date().toUTCString()}
  // Callback that gets called when the user selects a day
  onDayPress={day => {
	console.log('selected day', day);
	setSelectedDate(new Date(day.dateString));
  }}
  // Mark specific dates as marked
  markedDates={eventFetched?.reduce((acc, event) => ({
	...acc,
	[new Date(event.date).toISOString().split('T')[0]]: {
	  marked: true,
	  selectedColor: 'blue'
	}
  }), {})}
/>
						<FlatList
						 data={eventFetched.filter((v) => new Date(v.date).toISOString().split('T')[0] === new Date(selectedDate).toISOString().split('T')[0])}
						 renderItem={({item}) =>

						 <>
						 		<View style={styles.featuresContainer}>
									<View style={styles.feature}>
										<View style={styles.featureInner}>

										<Text style={styles.featureIcon}>{item.title.toUpperCase()}</Text>
										</View>
											<View>
												<Text style={styles.featureText}>{item.description}</Text>
											</View>
											<View style={styles.featureInner}>
												<Text style={styles.featureSubText}> 📆{converDateToFr(item.date)}</Text>

												<TouchableOpacity onPress={() => handleDelete(item)}>
													<Text>❌❌</Text>
												</TouchableOpacity>
											</View>
									</View>
								</View>

						</> }
       					 keyExtractor={item => item.id}
						/>

					</View>
					  )
					  :
					  (
								  <View style={styles.featuresContainer}>
									<Text>Pas d'évenement actuellement</Text>
					</View>
					  )
						}

		  <View style={styles.footer}></View>
			<Text style={styles.footerText}>© 2024 EventEase. Tous droits réservés.</Text>
		  </View>
		</ImageBackground>
		</>

	) : (

		<><Text> Pas connectée veuillez vous connecter en cliquant </Text>
		<Text style={styles.login}><Text style={styles.loginLink} onPress={() => router.push('/LoginScreen')}>ici</Text>
			ici
		</Text>
		</>
	 )}
	 </SafeAreaView>

);}

const styles = StyleSheet.create({
  container: {
	flex: 1,
	backgroundColor: '#244d9a',
  },
  backgroundImage: {
	flex: 1,
	width: '100%',
	height: '100%',
  },
  overlay: {
	flex: 1,
	backgroundColor: 'rgba(21, 55, 143, 0.85)',
	justifyContent: 'space-between',
	paddingHorizontal: 24,
	paddingVertical: 40,
  },
  header: {
	alignItems: 'center',
	marginTop: 60,
  },
  logo: {
	fontSize: 64,
	marginBottom: 16,
  },
  title: {
	fontSize: 42,
	fontWeight: '800',
	color: '#ffffff',
	textAlign: 'center',
	marginBottom: 8,
	textShadowColor: 'rgba(0, 0, 0, 0.3)',
	textShadowOffset: { width: 0, height: 2 },
	textShadowRadius: 4,
  },
  subtitle: {
	fontSize: 18,
	color: '#e8f5e8',
	textAlign: 'center',
	fontWeight: '300',
	letterSpacing: 0.5,
  },
  featuresContainer: {
	marginVertical: 0,
  },
  feature: {
	flexDirection: 'column',
	justifyContent: 'space-around',
	flexGrow : 1,
	backgroundColor: 'rgba(255, 255, 255, 0.34)',
	borderRadius: 16,
	padding: 20,
	marginBottom: 16,
	borderWidth: 1,
	borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
	fontSize: 22,
	fontFamily: 'times new roman',
	fontWeight: 'bold',
	marginRight: 16,
	marginBottom: 16,
  },
  featureInner: {
	flexDirection: 'row',
	justifyContent: 'space-between'
  },
  featureText: {
	fontSize: 18,
	color: '#ffffff',
	marginBottom: 16,
	fontWeight: '500',
  },
    featureSubText: {
	fontSize: 14,
	alignSelf: 'center',
	color: '#ffffff',
	fontWeight: '500',
  },
  ctaButton: {
	backgroundColor: '#4CAF50',
	paddingVertical: 18,
	paddingHorizontal: 32,
	borderRadius: 16,
	alignItems: 'center',
	marginBottom: 20,
	shadowColor: '#000',
	shadowOffset: { width: 0, height: 4 },
	shadowOpacity: 0.3,
	shadowRadius: 8,
	elevation: 8,
  },
  ctaButtonText: {
	fontSize: 20,
	fontWeight: '700',
	color: '#ffffff',
	letterSpacing: 0.5,
  },
  footer: {
	alignItems: 'center',
  },
	login: {
	fontSize: 14,
	color: '#c8e6c9',
	textAlign: 'center',
	lineHeight: 20,
	marginBottom: 10,
  },
  loginLink: {
	color: '#ffffff',
	fontWeight: '600',
	textDecorationLine: 'underline',
	cursor: 'pointer',
  }
  ,
  footerText: {
	fontSize: 14,
	color: '#c8e6c9',
	textAlign: 'center',
	fontStyle: 'italic',
	lineHeight: 20,
  },
   item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
});
