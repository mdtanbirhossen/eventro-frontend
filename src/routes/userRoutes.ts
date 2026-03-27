import { Route } from "@/types/routes.type";
import { BookA, LayoutDashboard, User2 } from "lucide-react";

export const userRoutes: Route[] = [
  {
    title: "Student Management",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard
      },
      {
        title: "My Bookings",
        url: "/dashboard/bookings",
        icon: BookA
      },
      {
        title: "Profile",
        url: "/dashboard/profile",
        icon: User2
      },
    ],
  },
];
