import AsyncStorage from "@react-native-async-storage/async-storage";
import type User from "../../../types";

export const isLoggedIn = async (): Promise<User | null> => {
  try {
    const actualUser = await AsyncStorage.getItem("actualUser");
    return actualUser !== null ? JSON.parse(actualUser) : null;
  } catch (error) {
    console.error("Error checking login status:", error);
    return null;
  }
}
