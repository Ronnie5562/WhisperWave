import Home from "./pages/Home";
import Server from "./pages/Server";
import Explore from "./pages/Explore";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import ToggleColorMode from "./components/ToggleColorMode";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="/" element={<Home />} />
      <Route path="/server/:serverId/:channelId?" element={<Server />} />
      <Route path="/explore/:categoryName" element={<Explore />} />
    </Route>
  )
);

const App = () => {
  return (
    <ToggleColorMode>
      <RouterProvider router={router} />
    </ToggleColorMode>
  );
};

export default App;
