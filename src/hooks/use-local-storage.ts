// Reference: https://usehooks.com/useLocalStorage/

import { useCallback, useEffect, useState } from 'react';

const subscribers = new Map<string, Set<() => void>>();

const subscribeToKey = (key: string, callback: () => void) => {
  if (!subscribers.has(key)) {
    subscribers.set(key, new Set());
  }
  const keySubscribers = subscribers.get(key)!;
  keySubscribers.add(callback);
  return () => {
    keySubscribers.delete(callback);
    if (keySubscribers.size === 0) {
      subscribers.delete(key);
    }
  };
};

const notifySubscribers = (key: string) => {
  const keySubscribers = subscribers.get(key);
  if (!keySubscribers) return;
  keySubscribers.forEach(callback => {
    try {
      callback();
    } catch (error) {
      console.error(error);
    }
  });
};

const useLocalStorage = <T>(key: string, initialValue: T) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.error(error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: ((val: T) => T) | T) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        // Save state
        setStoredValue(valueToStore);
        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          notifySubscribers(key);
        }
      } catch (error) {
        // A more advanced implementation would handle the error case
        console.error(error);
      }
    },
    [key, storedValue]
  );

  useEffect(() => {
    const handleStorageChange = () => {
      if (typeof window === 'undefined') return;
      try {
        const item = window.localStorage.getItem(key);
        setStoredValue(item ? JSON.parse(item) : initialValue);
      } catch (error) {
        console.error(error);
      }
    };

    const unsubscribe = subscribeToKey(key, handleStorageChange);

    const storageListener = (event: StorageEvent) => {
      if (event.key === null || event.key === key) {
        handleStorageChange();
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', storageListener);
    }

    return () => {
      unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', storageListener);
      }
    };
  }, [initialValue, key]);

  return [storedValue, setValue] as const;
};

export default useLocalStorage;
