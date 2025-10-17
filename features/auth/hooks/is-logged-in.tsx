import AsyncStorage from '@react-native-async-storage/async-storage';

export const isLoggedIn = async () => {
	try {
		const user = await AsyncStorage.getItem('user');
		return user !== null;
	} catch (error) {
		return false;
	}
};
