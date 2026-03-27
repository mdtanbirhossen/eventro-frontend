import { Route } from "@/types/routes.type";
import { Home, Info, Mail, User } from "lucide-react";

export const publicRoutes: Route[] = [
  {
    title: "Public Routes",
    items: [
      {
        title: "Home",
        url: "/",
        icon:Home
      },
      {
        title: "Tutors",
        url: "/tutors",
        icon:User
      },
      {
        title: "About Us",
        url: "/about-us",
        icon:Info
      },
      {
        title: "Contact Us",
        url: "/contact-us",
        icon:Mail
      },
    ],
  },
];
