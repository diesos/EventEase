import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
	Alert,
	ImageBackground,
	SafeAreaView,
	StatusBar,
	StyleSheet,
	Text,
	TouchableOpacity,
	View
} from "react-native";
import { isLoggedIn } from "../features/auth/services/isLoggedIn";
import { Disconnect } from "../features/auth/services/LoginService";
import { User } from '../types';

export default function UserBoardScreen() {
	const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
	const [actualUser, setActualUser] = useState<User | null>(null);

	useEffect(() => {
		checkLogin();
	}, []);

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

		const disconnecting = async() => {
			await Disconnect();
			setIsUserLoggedIn(false);

			// Timeout de 2 secondes avant redirection
			setTimeout(() => {
				router.push('/Login');
			}, 2000);
		}

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
			<Text style={styles.logo}>🗓️</Text>
			<Text style={styles.title}>EventEase</Text>
			<Text style={styles.subtitle}>
			  Bienvenu ! {actualUser?.firstName} {actualUser?.name}
			</Text>
		  </View>

					  {/* Features */}
					  <View style={styles.featuresContainer}>

									<TouchableOpacity style={styles.feature} onPress={() => router.push('/Event')}>

						  <Text style={styles.featureIcon}>📆</Text>
						  <Text style={styles.featureText}>Accédez à nos événements</Text>
</TouchableOpacity>

						<TouchableOpacity style={styles.feature} onPress={() => disconnecting()}>
						  <Text style={styles.featureIcon}>👨🏻‍🔧</Text>
						  <Text style={styles.featureText}>Déconnexion</Text>
						</TouchableOpacity>
						</View>

		  <View style={styles.footer}></View>
			<Text style={styles.footerText}>© 2024 EventEase. Tous droits réservés.</Text>
		  </View>
		</ImageBackground>
		</>
  )
: (

		<>
		 <View style={styles.featuresContainer}>
		<View style={styles.feature}>
						  <Text style={styles.featureIcon}>🔐</Text>
						  <Text style={styles.featureText}>Connexion requise</Text>
						  <Text style={styles.login}>Connectez-vous pour accéder à votre tableau de bord</Text>
				  <TouchableOpacity style={styles.loginButton} onPress={() => router.push('/Login')}>
					<Text style={styles.loginButtonText}>Se connecter</Text>
				  </TouchableOpacity>
						</View>

		</View>
		</>
)
	}
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
	justifyContent: 'space-between',
	paddingHorizontal: 24,
	paddingVertical: 40,
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
	marginVertical: 40,
  },
  feature: {
	flexDirection: 'column',
	alignItems: 'center',
	backgroundColor: 'rgba(255, 255, 255, 0.1)',
	borderRadius: 16,
	padding: 20,
	marginBottom: 16,
	borderWidth: 1,
	borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
	fontSize: 48,
	marginBottom: 16,
  },
  featureText: {
	fontSize: 20,
	color: '#ffffff',
	fontWeight: '700',
	textAlign: 'center',
	marginBottom: 12,
  },
  footer: {
	alignItems: 'center',
  },
	login: {
	fontSize: 16,
	color: 'rgba(255, 255, 255, 0.9)',
	textAlign: 'center',
	lineHeight: 22,
	marginBottom: 15,
	paddingHorizontal: 10,
  },
  loginButton: {
	backgroundColor: '#4CAF50',
	paddingVertical: 12,
	paddingHorizontal: 20,
	borderRadius: 20,
	alignItems: 'center',
	marginTop: 15,
	marginHorizontal: 20,
  },
  loginButtonText: {
	fontSize: 16,
	fontWeight: '600',
	color: '#ffffff',
  },
  footerText: {
	fontSize: 14,
	color: '#c8e6c9',
	textAlign: 'center',
	fontStyle: 'italic',
	lineHeight: 20,
  },
});
