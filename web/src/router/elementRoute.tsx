import Home from "../pages/home";
import Enterprise from "../pages/enterprise";

export const routerArray = [
  {
    path: "/home",
    title: "信息发送",
    element: <Home />,
    children: [
      {
        path: "/home/enterprise",
        title: "企业微信",
        element: <Enterprise />,
      },
    ],
  },
];
