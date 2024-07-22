import { render } from "preact";

import Header from "./components/header.tsx";
import Switch from "./components/switch.tsx";
import useRoute from "./hooks/use_route.ts";
import Home from "./pages/home.tsx";
import Options from "./pages/options.tsx";

const mountPoint = document.getElementById("mount");

if (mountPoint) {
  render(
    <App />,
    mountPoint,
  );
}

function App() {
  return (
    <main>
      <Header title="Browser Extension Boilerplate" />
      <Switch
        value={useRoute()}
        defaultCase={<Home default path="/home" />}
        cases={{
          "#options": <Options path="/options" />,
        }}
      />
    </main>
  );
}
