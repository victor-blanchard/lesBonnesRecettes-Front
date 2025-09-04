import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

export const authGuard = () => {
  const router = useRouter();
  const userIsConnected = useSelector((state) => state.users.value.userIsConnected);
  console.log("userIsConnected:", userIsConnected);

  useEffect(() => {
    if (!userIsConnected) {
      router.push("/connexion");
    }
  }, [userIsConnected, router]);

  return { userIsConnected };
};
