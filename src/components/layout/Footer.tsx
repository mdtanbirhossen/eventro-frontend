import { Roles } from "@/constants/roles";
import { adminRoutes } from "@/routes/adminRoutes";
import { publicRoutes } from "@/routes/publicRoutes";
import { userRoutes } from "@/routes/userRoutes";
import { getUserInfo } from "@/services/auth.services";
import { Route } from "@/types/routes.type";
import Image from "next/image";
import Link from "next/link";

const Footer = async () => {
    const user = await getUserInfo();

    let routes: Route[] = publicRoutes;

    if (user) {
        switch (user.role) {
            case Roles.admin:
                routes = adminRoutes;
                break;
            case Roles.user:
                routes = userRoutes;
                break;
            default:
                routes = publicRoutes;
                break;
        }
    } else {
        routes = publicRoutes;
    }

    return (
        <footer className="relative text-gray-200 bg-linear-to-br from-[#1F84BC] via-[#36B8C2] to-[#62A83D] dark:bg-none dark:bg-background dark:border-t dark:border-border">
            <div className="max-w-7xl mx-auto py-4 px-2 md:px-5 md:py-12 grid gap-10 md:grid-cols-4">
                {/* Brand */}
                <div>
                    <h2 className="text-2xl font-bold text-white dark:text-foreground mb-3 flex items-center">
                        <img className="max-h-8 dark:invert" src={'/logo/eventro-no-bg.png'} alt="Eventro image" />
                    </h2>
                    <p className="text-sm text-gray-300 dark:text-muted-foreground">
                        Discover, book, and manage events with ease. Eventro helps you create
                        unforgettable experiences and stay connected with what matters.
                    </p>
                </div>

                {/* Explore */}
                <div>
                    <h3 className="text-lg font-semibold text-white dark:text-foreground mb-3">Explore</h3>
                    <ul className="space-y-2 text-sm dark:text-muted-foreground">
                        <li>
                            <Link href="/events" className="hover:text-white dark:hover:text-foreground transition">
                                Browse Events
                            </Link>
                        </li>
                        <li>
                            <Link href="/create-event" className="hover:text-white dark:hover:text-foreground transition">
                                Create an Event
                            </Link>
                        </li>
                        <li>
                            <Link href="/login" className="hover:text-white dark:hover:text-foreground transition">
                                Login
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Dashboard */}
                {routes.map((item) => (
                    <div key={item.title}>
                        <h3 className="text-lg font-semibold text-white dark:text-foreground mb-3">
                            {item.title}
                        </h3>
                        <ul className="space-y-2 text-sm dark:text-muted-foreground">
                            {item.items.map((subItem) => (
                                <li key={subItem.title}>
                                    <Link
                                        href={subItem.url}
                                        className="hover:text-white dark:hover:text-foreground transition"
                                    >
                                        {subItem.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Support */}
                <div>
                    <h3 className="text-lg font-semibold text-white dark:text-foreground mb-3">Support</h3>
                    <ul className="space-y-2 text-sm dark:text-muted-foreground">
                        <li>
                            <Link href="/about-us" className="hover:text-white dark:hover:text-foreground transition">
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact-us" className="hover:text-white dark:hover:text-foreground transition">
                                Contact
                            </Link>
                        </li>
                        <li>
                            <Link href="/faq" className="hover:text-white dark:hover:text-foreground transition">
                                FAQ
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-gray-800 dark:border-border py-4 text-center text-sm text-gray-500 dark:text-muted-foreground">
                © {new Date().getFullYear()} Eventro. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;