import { useState, useEffect } from "react";

function useChromeStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {

    const loadValue = async () => {
      try {
        const data = await chrome.storage.sync.get({ [key]: initialValue });
        setValue(data[key]);
      } catch (err) {
        console.error(`Error while loading ${key}:`, err);
      }
    };

    loadValue();

    const listener = (changes, area) => {
      if (area === "sync" && changes[key]) {
        setValue(changes[key].newValue);
      }
    };

    chrome.storage.onChanged.addListener(listener);

    return () => {
      chrome.storage.onChanged.removeListener(listener);
    };
  }, [key, initialValue]);

  const setStorageValue = async (newValue) => {
    try {
      console.log("Setting storage value:", key, newValue);
      await chrome.storage.sync.set({ [key]: newValue });
      setValue(newValue);
    } catch (err) {
      console.error(`Error while setting ${key}:`, err);
    }
  };

  return [value, setStorageValue];
}

export default useChromeStorage;
