import Account from "../pages/account";
import Home from "../pages/home";
import Message from "../pages/message";
import Show from "../pages/show";

export const routerArray = [
  {
    path: "/home",
    element: <Home />,
    title: "Home",
  },
  {
    path: "/message",
    element: <Message />,
    title: "Message",
  },
  {
    path: "/show",
    element: <Show />,
    title: "Show",
  },
  {
    path: "/account",
    element: <Account />,
    title: "Account",
  },
];
