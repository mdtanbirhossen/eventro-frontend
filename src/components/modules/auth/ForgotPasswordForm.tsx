"use client"
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import "@/components/modules/login/LoginForm.css";

const forgotZodSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export default function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        // Mocking an API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitSuccessful(true);
        toast.success("Password reset link sent to your email!");
      } catch (error: any) {
        setServerError(`Request failed: ${error.message || "Unknown error"}`);
      }
    }
  });

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
            Forgot Password
          </CardTitle>
          <CardDescription className="text-base mt-2 text-slate-600">
            Enter your email to receive a password reset link
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {isSubmitSuccessful ? (
            <div className="text-center space-y-4">
               <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                  <AlertDescription>
                     We've sent a password reset link to your email. Please check your inbox and spam folder.
                  </AlertDescription>
               </Alert>
               <Button asChild variant="outline" className="w-full mt-4">
                  <Link href="/login">Back to Login</Link>
               </Button>
            </div>
          ) : (
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
              <form.Field
                name="email"
                validators={{ onChange: forgotZodSchema.shape.email }}
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

              {serverError && (
                <div className="error-alert-wrapper">
                  <Alert variant={"destructive"} className="error-alert">
                    <AlertDescription>{serverError}</AlertDescription>
                  </Alert>
                </div>
              )}

              <form.Subscribe
                selector={(s) => [s.canSubmit, s.isSubmitting] as const}
              >
                {([canSubmit, isSubmitting]) => (
                  <div className="button-wrapper">
                    <AppSubmitButton
                      isPending={isSubmitting}
                      pendingLabel="Sending link..."
                      disabled={!canSubmit}
                      className="submit-button"
                    >
                      <span className="button-text">Send Reset Link</span>
                      <ArrowRight className="button-icon" />
                    </AppSubmitButton>
                  </div>
                )}
              </form.Subscribe>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col items-center gap-4 border-t ">
          <p className="text-sm text-slate-600 mt-4">
            Remembered your password?{" "}
            <Link href="/login" className="signup-link">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>

      <div className="floating-element element-1"></div>
      <div className="floating-element element-2"></div>
      <div className="floating-element element-3"></div>
    </div>
  );
}
