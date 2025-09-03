import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const userIsConnected = useSelector((state) => state.users.value.userIsConnected);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    if (!userIsConnected) {
      // Rediriger vers la page de connexion
      router.push("/connexion");
    }
  }, [userIsConnected, router]);

  // Si l'utilisateur n'est pas connecté, ne pas afficher le contenu
  if (!userIsConnected) {
    return null; // ou un composant de chargement
  }

  // Si l'utilisateur est connecté, afficher le contenu protégé
  return children;
};

export default ProtectedRoute;
