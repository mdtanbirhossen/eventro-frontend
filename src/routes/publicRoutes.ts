import { Route } from "@/types/routes.type";
import { Home, CalendarDays, Info, Phone } from "lucide-react";

export const publicRoutes: Route[] = [
    {
        title: "Eventro",
        items: [
            { title: "Home", url: "/", icon: Home },
            { title: "Browse Events", url: "/events", icon: CalendarDays },
            { title: "About Us", url: "/about-us", icon: Info },
            { title: "Contact Us", url: "/contact-us", icon: Phone },
        ],
    },
];
