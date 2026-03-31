import { Route } from "@/types/routes.type";
import {
  LayoutDashboard,
  CalendarDays,
  CalendarCheck,
  Mail,
  CreditCard,
  Bell,
  User,
} from "lucide-react";

export const userRoutes: Route[] = [
  {
    title: "User Dashboard",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "My Created Events",
        url: "/dashboard/my-events",
        icon: CalendarDays,
      },
      {
        title: "My Joined Events",
        url: "/dashboard/my-joined-events",
        icon: CalendarCheck,
      },
      {
        title: "My Invitations",
        url: "/dashboard/my-invitations",
        icon: Mail,
      },
      {
        title: "My Payments",
        url: "/dashboard/my-payments",
        icon: CreditCard,
      },
      {
        title: "My Notifications",
        url: "/dashboard/notifications",
        icon: Bell,
      },
      {
        title: "Settings",
        url: "/dashboard/settings",
        icon: User,
      },
    ],
  },
];