"use client";

import { useState } from "react";
import AuthForm from "@/components/auth-form";
import Profile from "@/components/profile";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4 selection:bg-primary/20">
      {isAuthenticated ? (
        <Profile onLogout={handleLogout} />
      ) : (
        <AuthForm onAuthSuccess={handleAuthSuccess} />
      )}
    </div>
  );
}
