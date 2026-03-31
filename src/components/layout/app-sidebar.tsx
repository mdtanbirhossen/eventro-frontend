"use client";

import * as React from "react";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Roles } from "@/constants/roles";
import { adminRoutes } from "@/routes/adminRoutes";
import { publicRoutes } from "@/routes/publicRoutes";
import Image from "next/image";
import { Route } from "@/types/routes.type";
import { NavUser } from "./nav-user";
import { User } from "@/types/user.types";
import { userRoutes } from "@/routes/userRoutes";
import { JwtUserPayload } from "@/types/auth.types";

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: JwtUserPayload;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  // ✅ Only render role-specific menu after hydration
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  let routes: Route[] = [];

  // Only switch roles if we're on client AND user exists
  if (isClient && user) {
    switch (user.role) {
      case Roles.admin:
        routes = adminRoutes;
        break;
      case Roles.user:
        routes = userRoutes;
        break;
      default:
        routes = [];
    }
  }

  return (
    <Sidebar {...props}>
      <SidebarContent>
        <SidebarHeader>
          <Image
            src={"/logo/eventro-no-bg.png"}
            width={150}
            height={50}
            alt="Eventro"
          />
        </SidebarHeader>

        {/* ✅ Static routes (same for everyone) */}
        {publicRoutes.map((group) => (
          <SidebarGroup key={group.title}>
            <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => (
                  <SidebarMenuItem key={item.url}>
                    <SidebarMenuButton asChild>
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}

        {/* ✅ Role-specific routes (only render after hydration) */}
        {isClient &&
          routes.map((group) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {group.items.map((item) => (
                    <SidebarMenuItem key={item.url}>
                      <SidebarMenuButton asChild>
                        <Link href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
      </SidebarContent>

      <SidebarFooter>
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}