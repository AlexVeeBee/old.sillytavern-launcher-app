import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Setup from "./pages/setup";
import InstallChecker from "./pages/checker";
import LauncherDashboard from "./pages/home";
import AppStart from "./pages/AppStart";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "preact/compat";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppStart />
  },
  {
    path: "/setup",
    element: <Setup />
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
      <Toaster
        toastOptions={{
          position: "bottom-right",
          style: {
            borderRadius: "3px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </>
  );
}

export default App;
