import { render } from "preact";
import App from "./App";
import "./styles.css";
import "./style/cards.css";
import "./style/flex.css";

const html = document.querySelector("html");
html?.addEventListener("contextmenu", (e) => e.preventDefault())

render(<App />, document.getElementById("root")!);
