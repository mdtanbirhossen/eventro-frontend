import { Route } from "@/types/routes.type";
import {
    LayoutDashboard,
    Users,
    CalendarPlus,
    CalendarDays,
    CreditCard,
    Settings,
    ClipboardList,
    CalendarCheck,
    Mail,
    Bell,
} from "lucide-react";

export const adminRoutes: Route[] = [
    {
        title: "Admin Panel",
        items: [
            { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
            {
                title: "Manage Events",
                url: "/admin/events",
                icon: CalendarDays,
            },
            {
                title: "Create Event",
                url: "/admin/events/create",
                icon: CalendarPlus,
            },
            { title: "Manage Users", url: "/admin/users", icon: Users },
            {
                title: "Manage Categories",
                url: "/admin/categories",
                icon: Users,
            },
            {
                title: "Manage Bookings",
                url: "/admin/bookings",
                icon: ClipboardList,
            },
            { title: "Payments", url: "/admin/payments", icon: CreditCard },
            { title: "Settings", url: "/admin/settings", icon: Settings },
            {
                title: "My Created Events",
                url: "/admin/my-events",
                icon: CalendarDays,
            },
            {
                title: "My Joined Events",
                url: "/admin/my-joined-events",
                icon: CalendarCheck,
            },
            {
                title: "My Invitations",
                url: "/admin/my-invitations",
                icon: Mail,
            },
            {
                title: "My Payments",
                url: "/admin/my-payments",
                icon: CreditCard,
            },
            {
                title: "My Notifications",
                url: "/admin/notifications",
                icon: Bell,
            },
        ],
    },
];
