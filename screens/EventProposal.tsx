import { fetchEvents } from "@/features/events/services";
import DateTimePicker, {
	DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import uuid from "react-native-uuid";
import { isLoggedIn } from "../features/auth/services/isLoggedIn";

import AsyncStorage from "@react-native-async-storage/async-storage";
import {
	ImageBackground,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TextInput,
	TouchableOpacity,
	View,
} from "react-native";
import { Event, User } from "../types";
import {createEvent} from "../features/events/services/eventService"

export default function EventProposal() {
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [actualUser, setActualUser] = useState<User | null>(null);
  const [eventFetched, setEventFetched] = useState<Event[] | null>(null);
  const [inputValue, setInputValue] = React.useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [eventId, setEventId] = useState(uuid.v4());
  const [eventDate, setEventDate] = useState<Date>(new Date());
  const [eventDescription, setEventDescription] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventImageUrl, setEventImageUrl] = useState("");
  const [eventIsActive, setEventIsActive] = useState(true);

  const submitValue = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    const newEvent: Event = {
      id: uuid.v4() || Math.floor(Math.random() * 1000) ,
      title: eventTitle || "Pas de titre",
      description: eventDescription || "Pas de description",
      date: eventDate || new Date(),
      location: eventLocation || '',
      imageUrl: eventImageUrl || '',
	  isActive: true
    };
    alert(JSON.stringify(newEvent));
    try {
      await createEvent(newEvent);
      alert("Event crée avec succès");
      return { success: true, message: "Event crée avec succès" };
    } catch (err) {
      alert(err);
      return {
        success: false,
        message: "Erreur lors de la création de l'event.",
      };
    }
  };

  const setDate = (event: DateTimePickerEvent, date: Date) => {
    const {
      type,
      nativeEvent: { timestamp, utcOffset },
    } = event;
  };

  const onChangeHandler = (event) => {
    setInputValue(event.target.value);
  };
  useEffect(() => {
    checkLogin();
    eventList();
  }, []);

  const checkLogin = async () => {
    const loggedIn = await isLoggedIn();
    if (loggedIn) setIsUserLoggedIn(true);
    if (loggedIn && !actualUser) {
      setActualUser(loggedIn);
      console.log("Actual User", actualUser);
    } else {
      setActualUser(null);
    }
  };

  const eventList = async () => {
    const events = await fetchEvents();
    if (events) setEventFetched(events);
    else {
      alert("Pas d'event");
      setEventFetched(null);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {isUserLoggedIn ? (
        <>
          <StatusBar barStyle="light-content" backgroundColor="#163686" />

          <ImageBackground
            source={{
              uri: "https://i.ibb.co/k2ZCcJqZ/Gemini-Generated-Image-1831281831281831.webp",
            }}
            style={styles.backgroundImage}
            resizeMode="cover"
          >
            <View style={styles.overlay}>
              {/* Header */}
              <View style={styles.header}>
                <Text style={styles.logo}>🗓️</Text>
                <Text style={styles.title}>EventEase</Text>
                <Text style={styles.subtitle}>
                  Bienvenu ! {actualUser?.firstName} {actualUser?.name}
                </Text>
              </View>

              {/* Features */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}> Nom de l'évenement</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setEventTitle(text)}
                  placeholder="Votre nom"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                />

                <Text style={styles.label}> Description de l'évenement</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setEventDescription(text)}
                  placeholder="Votre nom"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                />

                <Text style={styles.label}> Date de l'évenement</Text>
                <DateTimePicker
                  value={eventDate}
                  onChange={(event, date) => date && setEventDate(date)}
                  minimumDate={new Date()}
                  timeZoneOffsetInSeconds={3600}
                  mode="datetime"
                />

                <Text style={styles.label}> Localisation de l'évenement</Text>
                <TextInput
                  style={styles.input}
                  onChangeText={(text) => setEventLocation(text)}
                  placeholder="Votre nom"
                  placeholderTextColor="rgba(255, 255, 255, 0.4)"
                />

                <TouchableOpacity
                  style={styles.ctaButton}
                  onPress={() => submitValue()}
                >
                  <Text>Crée un event</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        </>
      ) : (
        <>
          <Text>Pas connectée veuillez vous connecter en cliquant</Text>
          <Text style={styles.login}>
            <Text
              style={styles.loginLink}
              onPress={() => router.push("/Login")}
            >
              ici
            </Text>
          </Text>
        </>
      )}
      <View style={styles.footer}></View>
      <Text style={styles.footerText}>
        © 2024 EventEase. Tous droits réservés.
      </Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#244d9a",
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(21, 55, 143, 0.85)",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  header: {
    alignItems: "center",
    marginTop: 60,
  },
  logo: {
    fontSize: 64,
    marginBottom: 16,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 8,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontSize: 18,
    color: "#e8f5e8",
    textAlign: "center",
    fontWeight: "300",
    letterSpacing: 0.5,
  },
  featuresContainer: {
    marginVertical: 40,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  featureIcon: {
    fontSize: 32,
    marginRight: 16,
  },
  featureText: {
    fontSize: 18,
    color: "#ffffff",
    fontWeight: "500",
    flex: 1,
  },
  ctaButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 16,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  ctaButtonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.5,
  },
  footer: {
    alignItems: "center",
  },
  login: {
    fontSize: 14,
    color: "#c8e6c9",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 10,
  },
  loginLink: {
    color: "#ffffff",
    fontWeight: "600",
    textDecorationLine: "underline",
    cursor: "pointer",
  },
  footerText: {
    fontSize: 14,
    color: "#c8e6c9",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  inputContainer: {
    marginBottom: 300,
    color: "#ffffff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 5,
    color: "#ffffff",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: "#ffffff",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
  },
});
