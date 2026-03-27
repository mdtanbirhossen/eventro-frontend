"use client";

import { useRouter } from "next/navigation";
import { logoutUser } from "@/services/auth.services";

    export default function LogoutButton() {
    const handleLogout = async () => {
        const router = useRouter();
        await logoutUser(); // calls backend + clears cookies
        router.refresh();   // re-render server components
    };

    return (
        <button
            onClick={handleLogout}
            className="w-full text-left"
        >
            Logout
        </button>
    );
}