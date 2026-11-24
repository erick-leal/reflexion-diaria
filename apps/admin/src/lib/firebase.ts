import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Configuracion PUBLICA del proyecto Firebase "un-paso-a-la-vez-3cc3f" (Fase 9).
// No es secreta: termina dentro del JavaScript que descarga el navegador.
// La seguridad esta en la contrasena del admin, en que el registro publico
// esta deshabilitado en la consola de Firebase y en que el backend solo acepta
// el correo ADMIN_EMAIL. Va en el codigo (no en VITE_*) para que el deploy en
// Railway no necesite variables de entorno.
const firebaseConfig = {
  apiKey: "AIzaSyBkYrsP21DZRX6G0LR2ae6lL1SKXGOPino",
  authDomain: "un-paso-a-la-vez-3cc3f.firebaseapp.com",
  projectId: "un-paso-a-la-vez-3cc3f",
  storageBucket: "un-paso-a-la-vez-3cc3f.firebasestorage.app",
  messagingSenderId: "1096194456697",
  appId: "1:1096194456697:web:92933beff2ddc32e69e8a8",
};

export const firebaseApp = initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);
