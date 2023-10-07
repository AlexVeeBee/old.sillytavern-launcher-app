import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Setup from "./pages/setup";
import InstallChecker from "./pages/checker";
import LauncherDashboard from "./pages/home";
import AppStart from "./pages/AppStart";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppStart />
  },
  {
    path: "/checker",
    element: <InstallChecker />
  },
  {
    path: "/launcher",
    element: <LauncherDashboard />
  }
])

declare global {
  var router: typeof routes
}

function App() {
  globalThis.router = routes

  return (
    <>
      <RouterProvider router={routes}/>
    </>
  );
}

export default App;
