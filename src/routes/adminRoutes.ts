import { Route } from "@/types/routes.type";
import { BookA, LayoutDashboard, ListStart, User } from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "Admin Management",
    items: [
      {
        title: "Dashboard",
        url: "/admin",
        icon: LayoutDashboard
      },
      {
        title: "Users",
        url: "/admin/users",
        icon: User
      },
      {
        title: "Bookings",
        url: "/admin/bookings",
        icon: ListStart
      },
      {
        title: "Categories",
        url: "/admin/categories",
        icon: BookA
      },
    ],
  },
];
