import { NextRequest, NextResponse } from "next/server";

import { jwtUtils } from "./lib/jwtUtils";
import { isTokenExpiringSoon } from "./lib/tokenUtils";
import { getNewTokensWithRefreshToken } from "./services/auth.services";
import { UserRole } from "./types/role.types";

async function refreshTokenMiddleware(refreshToken: string): Promise<boolean> {
    // console.log(refreshToken);
    try {
        const refresh = await getNewTokensWithRefreshToken(refreshToken);
        // console.log(refresh);
        if (!refresh) return false;

        return true;
    } catch (error) {
        console.error("Error refreshing token in middleware:", error);
        return false;
    }
}

// export async function proxy(request: NextRequest) {
//     try {
//         // Get the current path of the request
//         const { pathname } = request.nextUrl;

//         // Get access token from cookies
//         const accessToken = request.cookies.get("accessToken")?.value;
//         // Get refresh token from cookies
//         const refreshToken = request.cookies.get("refreshToken")?.value;

//         // Verify the access token
//         const verifyAccessToken = accessToken
//             ? jwtUtils.verifyToken(
//                   accessToken,
//                   process.env.JWT_ACCESS_SECRET as string,
//               )
//             : null;

//         // Extract decoded token data
//         const decodedAccessToken = verifyAccessToken?.data;
//         // Check if the token is valid
//         const isValidAccessToken = verifyAccessToken?.success ?? false;

//         // Extract user role from token
//         const role = isValidAccessToken
//             ? (decodedAccessToken?.role as UserRole)
//             : null;

//             console.log("role from proxy",role)
//         const isAdmin = role === "ADMIN";
//         const isUser = role === "USER";

//         if (
//             isValidAccessToken &&
//             refreshToken &&
//             (await isTokenExpiringSoon(accessToken!))
//         ) {
//             const requestHeaders = new Headers(request.headers);

//             const response = NextResponse.next({
//                 request: {
//                     headers: requestHeaders,
//                 },
//             });

//             try {
//                 const refreshed = await refreshTokenMiddleware(refreshToken);
//                 if (refreshed) {
//                     requestHeaders.set("x-token-refreshed", "1");
//                 }

//                 return NextResponse.next({
//                     request: {
//                         headers: requestHeaders,
//                     },
//                     headers: response.headers,
//                 });
//             } catch (error) {
//                 console.error("Error refreshing token:", error);
//             }

//             return response;
//         }

//         // Redirect ADMIN from /dashboard to /admin-dashboard
//         if (isAdmin && pathname.startsWith("/dashboard")) {
//             return NextResponse.redirect(new URL("/admin", request.url));
//         }

//         // Redirect USER from /admin-dashboard to /dashboard
//         if (isUser && pathname.startsWith("/admin")) {
//             return NextResponse.redirect(new URL("/dashboard", request.url));
//         }

//         // If user is not logged in and tries to access protected routes
//         // redirect to home page
//         if (
//             !role &&
//             (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))
//         ) {
//             return NextResponse.redirect(new URL("/", request.url));
//         }

//         // Allow the request to continue
//         return NextResponse.next();
//     } catch (error) {
//         console.error("Error in middleware:", error);

//         // If any error occurs, do not block request
//         return NextResponse.next();
//     }
// }

export async function proxy(request: NextRequest) {
    try {
        const { pathname } = request.nextUrl;

        const accessToken = request.cookies.get("accessToken")?.value;
        const refreshToken = request.cookies.get("refreshToken")?.value;

        const verifyAccessToken = accessToken
            ? jwtUtils.verifyToken(
                  accessToken,
                  process.env.JWT_ACCESS_SECRET as string,
              )
            : null;

        const decodedAccessToken = verifyAccessToken?.data;
        const isValidAccessToken = verifyAccessToken?.success ?? false;

        const role = isValidAccessToken
            ? (decodedAccessToken?.role as UserRole)
            : null;

        const isAdmin = role === "ADMIN";
        const isUser = role === "USER";
console.log('proxy role', role)
        // ✅ Prevent infinite redirect by checking exact routes
        if (isAdmin && pathname === "/dashboard") {
            return NextResponse.redirect(new URL("/admin", request.url));
        }

        if (isUser && pathname === "/admin") {
            return NextResponse.redirect(new URL("/dashboard", request.url));
        }

        // ✅ Protect routes
        if (
            !role &&
            (pathname.startsWith("/admin") || pathname.startsWith("/dashboard"))
        ) {
            return NextResponse.redirect(new URL("/", request.url));
        }

        return NextResponse.next();
    } catch (error) {
        console.error("Error in middleware:", error);
        return NextResponse.next();
    }
}

export const config = {
    matcher: ["/dashboard/:path*", "/admin/:path*"],
};
