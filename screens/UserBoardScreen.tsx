import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
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
			console.log('Actual User', actualUser)}
			else {
				setActualUser(null);
			}
		}

		const disconnecting = async() => {
			await Disconnect();
			setIsUserLoggedIn(false);
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

						<TouchableOpacity style={styles.feature} onPress={() => router.push('/EventProposal')}>
						  <Text style={styles.featureIcon}>📮</Text>
						  <Text style={styles.featureText}>Proposer un événement</Text>
						</TouchableOpacity>


						<TouchableOpacity style={styles.feature} onPress={() => router.push('/Profile')}>
						  <Text style={styles.featureIcon}>👨🏻‍🔧</Text>
						  <Text style={styles.featureText}>Éditer mon profil</Text>
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
						  <Text style={styles.featureIcon}>❌❌</Text>
						  <Text style={styles.featureText}>Vous n'êtes pas connectée</Text>
						  <Text style={styles.login}><Text style={styles.loginLink} onPress={() => router.push('/Login')}>Cliquez ici</Text></Text>
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
	marginVertical: 40,
  },
  feature: {
	flexDirection: 'row',
	alignItems: 'center',
	backgroundColor: 'rgba(255, 255, 255, 0.1)',
	borderRadius: 16,
	padding: 20,
	marginBottom: 16,
	borderWidth: 1,
	borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  featureIcon: {
	fontSize: 32,
	marginRight: 16,
  },
  featureText: {
	fontSize: 18,
	color: '#ffffff',
	fontWeight: '500',
	flex: 1,
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
});
