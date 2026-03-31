import { Route } from "@/types/routes.type";
import {
  LayoutDashboard,
  Users,
  CalendarPlus,
  CalendarDays,
  CreditCard,
  ClipboardList,
  CalendarCheck,
  Mail,
  Bell,
  Settings,
  Tag,
  User,
} from "lucide-react";

export const adminRoutes: Route[] = [
  {
    title: "Admin Panel",
    items: [{ title: "Dashboard", url: "/admin", icon: LayoutDashboard }],
  },

  {
    title: "Event Management",
    items: [
      { title: "Manage Events", url: "/admin/events", icon: CalendarDays },
      { title: "Create Event", url: "/admin/events/create", icon: CalendarPlus },
      {
        title: "Manage Bookings",
        url: "/admin/bookings",
        icon: ClipboardList,
      },
    ],
  },

  {
    title: "User & Category Management",
    items: [
      { title: "Manage Users", url: "/admin/users", icon: Users },
      { title: "Manage Categories", url: "/admin/categories", icon: Tag },
    ],
  },

  {
    title: "Payments",
    items: [{ title: "Payments", url: "/admin/payments", icon: CreditCard }],
  },

  {
    title: "My Activities",
    items: [
      { title: "My Created Events", url: "/admin/my-events", icon: CalendarDays },
      {
        title: "My Joined Events",
        url: "/admin/my-joined-events",
        icon: CalendarCheck,
      },
      { title: "My Invitations", url: "/admin/my-invitations", icon: Mail },
      { title: "My Payments", url: "/admin/my-payments", icon: CreditCard },
      { title: "My Notifications", url: "/admin/notifications", icon: Bell },
    ],
  },

  {
    title: "Account",
    items: [
      { title: "Settings", url: "/admin/settings", icon: Settings },
      { title: "Profile", url: "/admin/profile", icon: User },
    ],
  },
];