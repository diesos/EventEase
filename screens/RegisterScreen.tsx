import { router } from "expo-router";
import React from "react";
import {
  ImageBackground,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { Register as RegisterService } from "../features/auth/services/RegisterService";
import type { User } from '../types';


export default function Index() {

  const [name, setName] = React.useState("");
  const [firstName, setFirstName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const formIsValid = name && firstName && email && password;


const handleRegister = async () => {
  if (!formIsValid) {
    alert("Veuillez remplir tous les champs.");
    return;
  }

  const newUser: User = {
    name,
    firstName,
    email,
    password,
  };

  try {
    const response = await RegisterService(newUser);
    if (response.success) {
      alert("Inscription réussie ! Vous pouvez maintenant vous connecter.");
      console.log("Registration response:", newUser);
      router.push("/Login");
    } else {
      alert(`Erreur lors de l'inscription : ${response.message}`);
    }
  } catch (error) {
    alert("Une erreur est survenue. Veuillez réessayer plus tard.");
    console.error("Registration error:", error);
  }
}
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1443ba" />

      <ImageBackground
        source={{
          uri: 'https://i.ibb.co/k2ZCcJqZ/Gemini-Generated-Image-1831281831281831.webp'
        }}
        style={styles.backgroundImage}
        resizeMode="cover"
        blurRadius={5}
      >
        <View style={styles.overlay}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
            <Text style={styles.backButtonText}>← Accueil</Text>
          </TouchableOpacity>

          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>EventEase</Text>
            <Text style={styles.subtitle}>
              Connectez-vous
            </Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nom *</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Votre nom"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
          </View>

                    <View style={styles.inputContainer}>
            <Text style={styles.label}>Prénom *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Votre prénom"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
          </View>

                    <View style={styles.inputContainer}>
            <Text style={styles.label}>Email *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Votre email"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
            />
          </View>


                    <View style={styles.inputContainer}>
            <Text style={styles.label}>Mot de passe *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Votre mot de passe"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              secureTextEntry
            />
          </View>

                    <View style={styles.inputContainer}>
            <Text style={styles.label}>Re-tapez votre mot de passe *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Votre mot de passe"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              secureTextEntry
            />
          </View>
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => handleRegister()}
            activeOpacity={0.8}
          >
            <Text style={styles.ctaButtonText}>🚀 S'inscrire</Text>

          </TouchableOpacity>
                                <View style={styles.footer}>
            <Text style={styles.login}>
              Vous avez déja un compte ?
              <Text style={styles.loginLink}
              onPress={() => router.push("/Login")}> Se connecter</Text>
            </Text>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Tous nos événements sont gratuits et ouverts à tous ! (conférences, ateliers, sorties)
            </Text>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

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
    marginTop: 0,
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
    gap: 16,
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

  inputContainer: {
    marginBottom: 0,
    color: '#ffffff',
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    color: '#ffffff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#ffffff',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',

  }
});
