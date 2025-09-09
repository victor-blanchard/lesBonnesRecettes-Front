// hooks/useAuthGuard.js
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export const useAuthGuard = () => {
  const router = useRouter();
  const userIsConnected = useSelector((state) => state.users.value.userIsConnected);

  useEffect(() => {
    if (!userIsConnected) {
      router.push("/connexion");
    }
    // console.log("userIsConnecteeed:", userIsConnected);
  }, [userIsConnected, router]);

  return { userIsConnected };
};
