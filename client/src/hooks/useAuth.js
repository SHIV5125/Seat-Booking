"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

// Custom hook to check if the user is authenticated
export default function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    } else {
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading };
}
