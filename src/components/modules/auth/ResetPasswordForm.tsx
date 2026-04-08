"use client"
import AppField from "@/components/shared/form/AppField";
import AppSubmitButton from "@/components/shared/form/AppSubmitButton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useForm } from "@tanstack/react-form";
import { Sparkles, ArrowRight, EyeOff, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import "@/components/modules/login/LoginForm.css";

const resetZodSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function ResetPasswordForm() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setIsAnimated(true);
  }, []);

  const form = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      setServerError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setIsSubmitSuccessful(true);
        toast.success("Password reset successfully!");
        setTimeout(() => {
           router.push("/login");
        }, 2000);
      } catch (error: any) {
        setServerError(`Reset failed: ${error.message}`);
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
            Reset Password
          </CardTitle>
          <CardDescription className="text-base mt-2 text-slate-600">
            Create a new strong password below
          </CardDescription>
        </CardHeader>

        <CardContent className="pt-0">
          {isSubmitSuccessful ? (
            <div className="text-center space-y-4">
               <Alert className="bg-emerald-50 border-emerald-200 text-emerald-800">
                  <AlertDescription>
                     Your password has been reset successfully! Redirecting to login...
                  </AlertDescription>
               </Alert>
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
                name="password"
                validators={{ onChange: resetZodSchema.shape.password }}
              >
                {(field) => (
                  <div className="field-wrapper">
                    <AppField
                      field={field}
                      label="New Password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
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
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      }
                    />
                  </div>
                )}
              </form.Field>

              <form.Field
                name="confirmPassword"
                validators={{
                    onChangeListenTo: ["password"],
                    onChange: ({ value, fieldApi }) => {
                        if (value !== fieldApi.form.getFieldValue("password")) {
                            return "Passwords do not match";
                        }
                        return undefined;
                    }
                }}
              >
                {(field) => (
                  <div className="field-wrapper">
                    <AppField
                      field={field}
                      label="Confirm Password"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      className="field-input"
                      append={
                        <Button
                          type="button"
                          onClick={() => setShowConfirmPassword((value) => !value)}
                          variant="ghost"
                          size="icon"
                          className="password-toggle"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="size-4" />
                          ) : (
                            <Eye className="size-4" />
                          )}
                        </Button>
                      }
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
                      pendingLabel="Resetting..."
                      disabled={!canSubmit}
                      className="submit-button"
                    >
                      <span className="button-text">Reset Password</span>
                      <ArrowRight className="button-icon" />
                    </AppSubmitButton>
                  </div>
                )}
              </form.Subscribe>
            </form>
          )}
        </CardContent>
      </Card>
      <div className="floating-element element-1"></div>
      <div className="floating-element element-2"></div>
      <div className="floating-element element-3"></div>
    </div>
  );
}
