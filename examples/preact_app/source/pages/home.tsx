import { useCallback, useEffect, useState } from "preact/hooks";

import {
  addStorageListener,
  getStorage,
  updateStorage,
} from "../utilities/storage_helpers.ts";

export interface HomeProps {
  default?: boolean;
  path?: string;
}

export default function Home(_props: HomeProps) {
  const [display, setDisplay] = useState<string>("");
  const [inputData, setInputData] = useState<string>("");

  useEffect(() => {
    getStorage().then(setDisplay);
    return addStorageListener(setDisplay);
  }, [setDisplay]);

  return (
    <div>
      <h1>It feels like home</h1>
      <a href="#options">go to options</a>
      <h3>Stored String: {display}</h3>
      <input
        placeholder={display}
        onChange={useCallback((e: Event) => {
          if (e.target instanceof HTMLInputElement) {
            setInputData(e.target.value);
          }
        }, [setInputData])}
      />
      <button
        onClick={useCallback(() => updateStorage(inputData), [inputData])}
      >
        Update Storage
      </button>
    </div>
  );
}
