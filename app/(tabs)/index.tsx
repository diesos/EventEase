import { isLoggedIn } from "@/features/auth/services";
import React, { useEffect, useState } from "react";
import HomeScreen from "../../screens/HomeScreen";
import UserBoard from "../../screens/UserBoardScreen";


export default function Index() {

      const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
      const [actualUser, setActualUser] = useState<User | null>(null);
      const [eventFetched, setEventFetched] = useState<Event[] | null>(null);


      useEffect(() => {
        const checkLogin = async () => {
          const loggedIn = await isLoggedIn();
          setIsUserLoggedIn(loggedIn);
          if (loggedIn) {
            setActualUser(loggedIn);
            }
            else {
              setActualUser(null);
            }
          }
        checkLogin();
      }, []);
  return (
    <>
      {actualUser ? <UserBoard /> : <HomeScreen />}
    </>
  );
}
