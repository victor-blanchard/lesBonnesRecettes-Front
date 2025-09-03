import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export const useAuth = () => {
  const router = useRouter();
  const userIsConnected = useSelector((state) => state.users.value.userIsConnected);

  useEffect(() => {
    if (!userIsConnected) {
      router.push("/connexion");
    }
  }, [userIsConnected, router]);

  return { userIsConnected };
};
