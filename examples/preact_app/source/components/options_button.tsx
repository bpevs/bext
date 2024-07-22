import { useCallback } from "preact/hooks";
import browserAPI from "browser";

export default function OptionsButton() {
  const onClick = useCallback(() => {
    browserAPI.runtime.openOptionsPage();
  }, []);

  return (
    <button onClick={onClick}>
      Options
    </button>
  );
}
