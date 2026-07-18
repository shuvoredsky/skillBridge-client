"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { wishlistService, WishlistItem } from "@/services/wishlist.service";
import { message } from "antd";

interface WishlistContextType {
  wishlist: WishlistItem[];
  wishlistIds: string[];
  loading: boolean;
  isSaved: (tutorId: string) => boolean;
  toggleWishlist: (tutorId: string) => Promise<void>;
  loadWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadWishlist = async () => {
    if (!user || user.role !== "STUDENT") {
      setWishlist([]);
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await wishlistService.getWishlist();
      if (data && !error) {
        setWishlist(data);
      }
    } catch (err) {
      console.error("Failed to load wishlist:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWishlist();
  }, [user]);

  const isSaved = (tutorId: string) => {
    return wishlist.some((item) => item.tutorId === tutorId);
  };

  const toggleWishlist = async (tutorId: string) => {
    if (!user) {
      message.warning("Please login to save tutors");
      return;
    }
    if (user.role !== "STUDENT") {
      message.warning("Only students can save tutors to wishlist");
      return;
    }

    const saved = isSaved(tutorId);
    
    // Save previous state for rollback
    const previousWishlist = [...wishlist];
    
    if (saved) {
      // Remove optimistically
      setWishlist((prev) => prev.filter((item) => item.tutorId !== tutorId));
    } else {
      // Add optimistically (temp item to represent loading state)
      const tempItem: WishlistItem = {
        id: `temp_${Date.now()}`,
        studentId: user.id,
        tutorId,
        createdAt: new Date().toISOString(),
        tutor: {
          id: tutorId,
          rating: 0,
          totalReviews: 0,
          hourlyRate: 0,
          subjects: [],
          user: {
            id: "",
            name: "Loading...",
            email: "",
          }
        }
      };
      setWishlist((prev) => [tempItem, ...prev]);
    }

    try {
      if (saved) {
        const { error } = await wishlistService.removeFromWishlist(tutorId);
        if (error) throw new Error(error);
        message.success("Removed from wishlist");
      } else {
        const { data, error } = await wishlistService.addToWishlist(tutorId);
        if (error || !data) throw new Error(error || "Failed to add to wishlist");
        
        // Replace temp item with real updated item details
        setWishlist((prev) =>
          prev.map((item) => (item.tutorId === tutorId ? data : item))
        );
        message.success("Saved to wishlist");
      }
    } catch (err: any) {
      // Rollback optimistic state
      setWishlist(previousWishlist);
      message.error(err.message || "Failed to toggle wishlist");
    }
  };

  const wishlistIds = wishlist.map((item) => item.tutorId);

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistIds,
        loading,
        isSaved,
        toggleWishlist,
        loadWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }
  return context;
}
