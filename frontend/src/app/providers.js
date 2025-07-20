// src/app/providers.js
"use client";
import { SessionProvider } from "next-auth/react";
import { AuthProvider } from '@/contexts/AuthContext';


export function Providers({ children }) {

  return <SessionProvider><AuthProvider>{children}</AuthProvider></SessionProvider>;
}

// This file wraps the application with the SessionProvider from next-auth
// It allows the use of session data throughout the app, enabling features like user authentication and session management.
// AuthProvider enables access to custom authentication state from the Flask backend.
// The "use client" directive indicates that this component should be rendered on the client side.
