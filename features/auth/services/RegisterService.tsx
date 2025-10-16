import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User } from '../../../types';

export const Register = async (user: User) => {
	  try {
		const response = await AsyncStorage.getItem('users');
		if (response) {
		  const users = JSON.parse(response);
		  const foundUser = users.find((u: User) => u.email === user.email);
		  if (foundUser) {
			return { success: false, message: 'Email déjà utilisé' };
		  } else {
			users.push(user);
			await AsyncStorage.setItem('users', JSON.stringify(users));
			return { success: true, user };
		  }
		} else {
		  await AsyncStorage.setItem('users', JSON.stringify([user]));
		  return { success: true, user };
		}
	  } catch (error) {
		console.error('Register error:', error);
		return { success: false, message: 'Une erreur est survenue lors de l\'inscription.' };
	  }
};


export const CheckEmailExists = async (email: string) => {
	  try {
		const response = await AsyncStorage.getItem('users');
		if (response) {
		  const users = JSON.parse(response);
		  const foundUser = users.find((u: User) => u.email === email);
		  return foundUser !== undefined;
		} else {
		  return false;
		}
	  } catch (error) {
		console.error('CheckEmailExists error:', error);
		return false;
	  }
};
