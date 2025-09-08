import "../styles/globals.css";
import Head from "next/head";
import { Provider } from "react-redux";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import users from "../reducers/users";
import recipes from "../reducers/recipes";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

const reducers = combineReducers({ users, recipes });

// Configuration conditionnelle pour Next.js
const persistConfig = {
  key: "recette",
  storage:
    typeof window !== "undefined"
      ? storage
      : {
          getItem: () => Promise.resolve(null),
          setItem: () => Promise.resolve(),
          removeItem: () => Promise.resolve(),
        },
  whitelist: ["users", "recipes"], // Spécifier explicitement les reducers à persister
};

const store = configureStore({
  reducer: persistReducer(persistConfig, reducers),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

const persistor = persistStore(store);

function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <PersistGate persistor={persistor} loading={null}>
        <Head>
          <title>Recette®</title>
        </Head>
        <Component {...pageProps} />
      </PersistGate>
    </Provider>
  );
}

export default App;
