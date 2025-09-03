import { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/Example.module.css";
import Header from "../components/Header";
import { useAuth } from "../hooks/useAuth";

function ExampleProtectedPage() {
  const router = useRouter();
  const { userIsConnected } = useAuth();

  // Si l'utilisateur n'est pas connecté, le hook redirigera automatiquement
  // et ce composant ne s'affichera pas
  if (!userIsConnected) {
    return null; // ou un composant de chargement
  }

  return (
    <div className={styles.main}>
      <Header showBackButton={true} />
      <div className={styles.content}>
        <h1>Page protégée</h1>
        <p>Cette page n'est accessible qu'aux utilisateurs connectés.</p>
      </div>
    </div>
  );
}

export default ExampleProtectedPage;
