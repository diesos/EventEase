import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserLogin } from '../../../types';

export const Login = async (user: UserLogin) => {
	  try {
	const response = await AsyncStorage.getItem('users');
	if (response) {
		  const users = JSON.parse(response);
		  const foundUser = users.find((u: UserLogin) => u.email === user.email && u.password === user.password);
		  if (foundUser) {
			console.warn('User found:', foundUser);
			console.log('all Users:', await AsyncStorage.getItem('users'));
			await AsyncStorage.setItem('actualUser', JSON.stringify(foundUser));
		return { success: true, foundUser };
		  } else {
		return { success: false, message: 'Email ou mot de passe incorrect' };
		  }
	} else {
		  return { success: false, message: 'Aucun utilisateur trouvé. Veuillez vous inscrire.' };
	}
	  } catch (error) {
	console.error('Login error:', error);
	return { success: false, message: 'Une erreur est survenue lors de la connexion.' };
	  }
};


export const Disconnect = async () => {
	try {

	const response = await AsyncStorage.getItem('actualUser');
	if (response) {
		await AsyncStorage.removeItem('actualUser');
		console.log("Decconectée")
		return { success: true, message: "Disconnected" };
		  }
		  else {
			console.log("Erreur")
		return { success : false, message: "Error while trying to disconnect"}
		  }
	} catch (error) {
	console.error('Login error:', error);
	return { success: false, message: 'Une erreur est survenue lors de la connexion.' };
	  }
};
