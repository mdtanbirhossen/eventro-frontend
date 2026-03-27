import { Route } from "@/types/routes.type";
import {
    LayoutDashboard,
    Ticket,
    CalendarCheck,
    User,
    Settings,
} from "lucide-react";

export const userRoutes: Route[] = [
    {
        title: "User Dashboard",
        items: [
            { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
            {
                title: "My Bookings",
                url: "/dashboard/bookings",
                icon: CalendarCheck,
            },
            { title: "My Tickets", url: "/dashboard/tickets", icon: Ticket },
            { title: "My Profile", url: "/dashboard/profile", icon: User },
            { title: "Settings", url: "/dashboard/settings", icon: Settings },
        ],
    },
];
