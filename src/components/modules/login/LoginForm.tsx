"use client"
import { loginAction } from "@/app/(authRouteGroup)/login/_action";
/* eslint-disable @typescript-eslint/no-explicit-any */
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { ILoginPayload, loginZodSchema } from "@/zod/auth.validation";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { Eye, EyeOff, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import "./LoginForm.css";

interface LoginFormProps {
  redirectPath?: string;
}

const LoginForm = ({ redirectPath }: LoginFormProps) => {
  const { login } = useAuth()
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (payload: ILoginPayload) => loginAction(payload),
  })

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },

    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        const result = await mutateAsync(value) as any;
        if (!result.success) {
          setServerError(result.message || "Login failed");
          return;
        }
        login(result?.data?.user, result?.data?.accessToken)
        const targetPath = redirectPath ? redirectPath : "/";
        router.push(targetPath)
        toast.success(result.message)

      } catch (error: any) {
        setServerError(`Login failed: ${error.message}`);
      }
    }
  })

  return (
    <div className="login-container">
      {/* Animated Background Elements */}
      <div className="gradient-orb orb-1"></div>
      <div className="gradient-orb orb-2"></div>
      <div className="gradient-orb orb-3"></div>
      
      {/* Grid Background Pattern */}
      <div className="grid-background"></div>

      {/* Main Card */}
      <Card className={`login-card ${isAnimated ? "fade-in-up" : ""}`}>
        {/* Decorative Top Border */}
        <div className="card-top-decoration"></div>

        <CardHeader className="text-center pb-6">
          {/* Logo/Icon with animation */}
          <div className="logo-container">
            <div className="logo-badge">
              <Sparkles className="logo-icon" />
            </div>
          </div>

          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-violet-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mt-4">
            Welcome to Eventro
          </CardTitle>
          <CardDescription className="text-base mt-2 text-slate-600">
            Sign in to manage and create amazing events
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          <form
            method="POST"
            action="#"
            noValidate
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {/* Email Field */}
            <form.Field
              name="email"
              validators={{ onChange: loginZodSchema.shape.email }}
            >
              {(field) => (
                <div className="field-wrapper">
                  <AppField
                    field={field}
                    label="Email Address"
                    type="email"
                    placeholder="your@email.com"
                    className="field-input"
                  />
                </div>
              )}
            </form.Field>

            {/* Password Field */}
            <form.Field
              name="password"
              validators={{ onChange: loginZodSchema.shape.password }}
            >
              {(field) => (
                <div className="field-wrapper">
                  <AppField
                    field={field}
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    className="field-input"
                    append={
                      <Button
                        type="button"
                        onClick={() => setShowPassword((value) => !value)}
                        variant="ghost"
                        size="icon"
                        className="password-toggle"
                      >
                        {showPassword ? (
                          <EyeOff className="size-4" aria-hidden="true" />
                        ) : (
                          <Eye className="size-4" aria-hidden="true" />
                        )}
                      </Button>
                    }
                  />
                </div>
              )}
            </form.Field>

            {/* Forgot Password Link */}
            <div className="flex justify-between items-center mt-3">
              <div></div>
              <Link
                href="/forgot-password"
                className="forgot-password-link"
              >
                Forgot password?
              </Link>
            </div>

            {/* Error Alert */}
            {serverError && (
              <div className="error-alert-wrapper">
                <Alert variant={"destructive"} className="error-alert">
                  <AlertDescription>{serverError}</AlertDescription>
                </Alert>
              </div>
            )}

            {/* Submit Button */}
            <form.Subscribe
              selector={(s) => [s.canSubmit, s.isSubmitting] as const}
            >
              {([canSubmit, isSubmitting]) => (
                <div className="button-wrapper">
                  <AppSubmitButton
                    isPending={isSubmitting || isPending}
                    pendingLabel="Signing in..."
                    disabled={!canSubmit}
                    className="submit-button"
                  >
                    <span className="button-text">Sign In</span>
                    <ArrowRight className="button-icon" />
                  </AppSubmitButton>
                </div>
              )}
            </form.Subscribe>

            {/* Divider */}
            <div className="divider">
              <span>New to Eventro?</span>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 border-t ">
          <p className="text-sm text-slate-600 mt-4">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="signup-link"
            >
              Create one now
            </Link>
          </p>
        </CardFooter>
      </Card>

      {/* Floating Decorative Elements */}
      <div className="floating-element element-1"></div>
      <div className="floating-element element-2"></div>
      <div className="floating-element element-3"></div>
    </div>
  );
}

export default LoginForm