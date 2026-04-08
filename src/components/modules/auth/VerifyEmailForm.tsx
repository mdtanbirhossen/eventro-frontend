"use client"
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import "@/components/modules/login/LoginForm.css";

export default function VerifyEmailForm() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
    // Simulate verification
    const timer = setTimeout(() => {
      setStatus("success");
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="login-container">
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
      <div className="grid-background"></div>

      <Card className={`login-card ${isAnimated ? "fade-in-up" : ""}`}>
        <div className="card-top-decoration"></div>

        <CardHeader className="text-center pb-6">
          <div className="logo-container">
            <div className="logo-badge">
              <Sparkles className="logo-icon" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold bg-linear-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-4">
            Verify Email
          </CardTitle>
          <CardDescription className="text-base mt-2 text-slate-600">
            Please wait while we verify your email address.
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0 text-center pb-6">
          {status === "loading" && (
            <div className="flex flex-col items-center justify-center space-y-4 py-8">
               <Loader2 className="h-12 w-12 text-primary animate-spin" />
               <p className="text-muted-foreground animate-pulse mt-4">Verifying secure token...</p>
            </div>
          )}
          {status === "success" && (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
               <div className="rounded-full bg-emerald-100 p-3 mb-2">
                 <CheckCircle2 className="h-10 w-10 text-emerald-600" />
               </div>
               <h3 className="text-xl font-semibold text-emerald-800 border-none">Verification Successful!</h3>
               <p className="text-muted-foreground mt-2 mb-4">Your account has been verified. You can now access all features.</p>

               <Button asChild className="w-full mt-6 shadow-md bg-zinc-900 border border-zinc-700 text-white hover:bg-zinc-800/90 hover:scale-[1.02] transition-all">
                  <Link href="/login">
                     <span className="flex items-center justify-center gap-2">Continue to Login <ArrowRight className="h-4 w-4" /></span>
                  </Link>
               </Button>
            </div>
          )}
          {status === "error" && (
            <div className="flex flex-col items-center justify-center space-y-4 py-4">
               <div className="rounded-full bg-red-100 p-3 mb-2">
                 <XCircle className="h-10 w-10 text-red-600" />
               </div>
               <h3 className="text-xl font-semibold text-red-800">Verification Failed</h3>
               <p className="text-muted-foreground mt-2 mb-4">The link is invalid or has expired.</p>

               <Button asChild variant="outline" className="w-full mt-6 hover:bg-red-50 hover:text-red-600">
                  <Link href="/forgot-password">Request New Link</Link>
               </Button>
            </div>
          )}
        </CardContent>
      </Card>
      <div className="floating-element element-1"></div>
      <div className="floating-element element-2"></div>
      <div className="floating-element element-3"></div>
    </div>
  );
}
