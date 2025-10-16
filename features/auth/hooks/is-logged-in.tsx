import AsyncStorage from '@react-native-async-storage/async-storage';

export const isLoggedIn = async () => {
	try {
		const user = await AsyncStorage.getItem('user');
		return user !== null;
	} catch (error) {
		console.error('Error checking login status:', error);
		return false;
	}
};
