import AsyncStorage from "@react-native-async-storage/async-storage";

export const getActualUser = async () => {
  const user = await AsyncStorage.getItem("actualUser");
  return user ? JSON.parse(user) : null;
};
