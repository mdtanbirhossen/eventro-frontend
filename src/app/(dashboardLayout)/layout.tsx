
import { AppSidebar } from "@/components/layout/app-sidebar";
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { Roles } from "@/constants/roles";
import { getUserFromToken,  } from "@/services/auth.services";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
    admin,
    user,
}: {
    children: React.ReactNode;
    admin: React.ReactNode;
    user: React.ReactNode;
}) {

    const userInfo = await getUserFromToken();
    if (!userInfo) {
        redirect("/login?reason=auth");
    }
    let content;
    switch (userInfo.role) {
        case Roles.admin:
            content = admin
            break;
        case Roles.user:
            content = user
            break;

        default:
            content = <div>Unauthorized</div>
    }
    return (
        <SidebarProvider>
            <AppSidebar user={userInfo} />
            <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
                    <SidebarTrigger className="-ml-1" />
                </header>
                <div className="flex flex-1 flex-col gap-4 p-4">
                    {content}

                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
