import "@fontsource-variable/atkinson-hyperlegible-mono/index.css";
import "@fontsource-variable/atkinson-hyperlegible-next/index.css";
import "./index.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import pkgJson from "../package.json";
import { App } from "@/App";

async function main() {
  const { version } = pkgJson;
  const el =
    document.getElementById("root") ??
    document.body.appendChild(document.createElement("div"));

  const root = createRoot(el);

  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}

main();
