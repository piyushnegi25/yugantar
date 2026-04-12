"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  color: string;
  size: string;
  quantity: number;
  category?: string;
}

interface CartState {
  items: CartItem[];
  isLoading: boolean;
  totalItems: number;
  subtotal: number;
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ITEMS"; payload: CartItem[] }
  | { type: "ADD_ITEM"; payload: Omit<CartItem, "id"> }
  | { type: "UPDATE_ITEM"; payload: { id: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "CLEAR_CART" };

interface CartContextType extends CartState {
  addToCart: (item: Omit<CartItem, "id">) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  refreshCart: () => void;
  migrateCart: () => void;
}

const initialState: CartState = {
  items: [],
  isLoading: false,
  totalItems: 0,
  subtotal: 0,
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };

    case "SET_ITEMS": {
      const items = action.payload;
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items, totalItems, subtotal };
    }

    case "ADD_ITEM": {
      const newItem = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.productId === newItem.productId &&
          item.color === newItem.color &&
          item.size === newItem.size
      );

      let updatedItems: CartItem[];
      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, { ...newItem, id: uuidv4() }];
      }

      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items: updatedItems, totalItems, subtotal };
    }

    case "UPDATE_ITEM": {
      const { id, quantity } = action.payload;
      const updatedItems =
        quantity === 0
          ? state.items.filter((item) => item.id !== id)
          : state.items.map((item) =>
              item.id === id ? { ...item, quantity } : item
            );

      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items: updatedItems, totalItems, subtotal };
    }

    case "REMOVE_ITEM": {
      const updatedItems = state.items.filter(
        (item) => item.id !== action.payload
      );
      const totalItems = updatedItems.reduce(
        (sum, item) => sum + item.quantity,
        0
      );
      const subtotal = updatedItems.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );
      return { ...state, items: updatedItems, totalItems, subtotal };
    }

    case "CLEAR_CART":
      return { ...state, items: [], totalItems: 0, subtotal: 0 };

    default:
      return state;
  }
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

// Helper function to get session ID from cookie or create new one
function getSessionId(): string {
  if (typeof window === "undefined") return uuidv4();

  let sessionId = document.cookie
    .split("; ")
    .find((row) => row.startsWith("cart_session="))
    ?.split("=")[1];

  if (!sessionId) {
    sessionId = uuidv4();
    // Set cookie for 30 days
    document.cookie = `cart_session=${sessionId}; path=/; max-age=${
      30 * 24 * 60 * 60
    }; samesite=strict`;
  }

  return sessionId!;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [mounted, setMounted] = useState(false);

  // Sync cart with server
  const syncCart = useCallback(async (items: CartItem[]) => {
    if (typeof window === "undefined") return;

    try {
      const sessionId = getSessionId();

      if (items.length === 0) {
        const clearResponse = await fetch(
          `/api/cart?sessionId=${encodeURIComponent(sessionId)}`,
          {
            method: "DELETE",
            credentials: "include",
          }
        );

        if (!clearResponse.ok) {
          console.error("Failed to clear cart on server");
        }

        return;
      }

      const response = await fetch("/api/cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          items: items.map(({ id, ...item }) => item),
          sessionId,
        }),
      });

      if (!response.ok) {
        console.error("Failed to sync cart with server");
      }
    } catch (error) {
      console.error("Error syncing cart:", error);
    }
  }, []);

  // Migrate cart when user logs in
  const migrateCart = useCallback(async () => {
    if (typeof window === "undefined") return;

    try {
      const sessionId = getSessionId();
      const response = await fetch("/api/cart/migrate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sessionId }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.items) {
          const items: CartItem[] = data.items.map((item: any) => ({
            ...item,
            id: uuidv4(),
          }));
          dispatch({ type: "SET_ITEMS", payload: items });
        }
      }
    } catch (error) {
      console.error("Error migrating cart:", error);
    }
  }, []);

  // Load cart from server on mount
  const refreshCart = useCallback(async () => {
    if (typeof window === "undefined") return;

    dispatch({ type: "SET_LOADING", payload: true });
    try {
      const sessionId = getSessionId();
      const response = await fetch(`/api/cart?sessionId=${sessionId}`, {
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.items) {
          const items: CartItem[] = data.items.map((item: any) => ({
            ...item,
            id: uuidv4(),
          }));
          dispatch({ type: "SET_ITEMS", payload: items });
        }
      }
    } catch (error) {
      console.error("Error loading cart:", error);
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }, []);

  // Cart actions
  const addToCart = useCallback((item: Omit<CartItem, "id">) => {
    dispatch({ type: "ADD_ITEM", payload: item });
  }, []);

  const updateQuantity = useCallback((id: string, quantity: number) => {
    dispatch({ type: "UPDATE_ITEM", payload: { id, quantity } });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id });
  }, []);

  const clearCart = useCallback(() => {
    dispatch({ type: "CLEAR_CART" });
  }, []);

  // Sync cart with server whenever items change
  useEffect(() => {
    if (mounted) {
      const timeoutId = setTimeout(() => {
        syncCart(state.items);
      }, 500); // Debounce sync operations

      return () => clearTimeout(timeoutId);
    }
  }, [state.items, syncCart, mounted]);

  // Load cart on mount
  useEffect(() => {
    setMounted(true);
    refreshCart();
  }, [refreshCart]);

  const contextValue: CartContextType = {
    ...state,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
    migrateCart,
  };

  // Prevent hydration mismatch by providing consistent initial state
  if (!mounted) {
    return (
      <CartContext.Provider
        value={{
          ...initialState,
          addToCart,
          updateQuantity,
          removeFromCart,
          clearCart,
          refreshCart,
          migrateCart,
        }}
      >
        {children}
      </CartContext.Provider>
    );
  }

  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
