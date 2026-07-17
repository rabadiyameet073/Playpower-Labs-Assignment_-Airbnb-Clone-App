import React, { useState, useRef, useCallback, memo } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { X, Mail, Lock, User, Eye, EyeOff, Phone, ChevronRight } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useFocusTrap } from "../hooks/useFocusTrap";

const AuthModal = memo(function AuthModal() {
  const { authModalOpen, authModalMode, closeAuthModal, login, showToast, openAuthModal } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  useFocusTrap(panelRef, authModalOpen);

  const isLogin = authModalMode === "login";

  const resetForm = useCallback(() => {
    setName("");
    setEmail("");
    setPassword("");
    setPhone("");
    setShowPassword(false);
    setErrors({});
    setIsLoading(false);
  }, []);

  const validate = useCallback(() => {
    const errs: Record<string, string> = {};
    if (!isLogin && !name.trim()) errs.name = "Name is required";
    if (!email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = "Enter a valid email";
    if (!password) errs.password = "Password is required";
    else if (password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  }, [isLogin, name, email, password]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      const userName = isLogin ? email.split("@")[0] : name;
      login({
        name: userName,
        email,
      });
      showToast(isLogin ? `Welcome back, ${userName}!` : `Welcome to Airbnb, ${userName}! 🎉`);
      resetForm();
    }, 1200);
  }, [validate, isLogin, email, name, login, showToast, resetForm]);

  const handleSocialLogin = useCallback((provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const mockName = provider === "Google" ? "Google User" : provider === "Apple" ? "Apple User" : "Facebook User";
      login({ name: mockName, email: `user@${provider.toLowerCase()}.com` });
      showToast(`Signed in with ${provider} successfully!`);
      resetForm();
    }, 1000);
  }, [login, showToast, resetForm]);

  const switchMode = useCallback(() => {
    resetForm();
    openAuthModal(isLogin ? "signup" : "login");
  }, [isLogin, openAuthModal, resetForm]);

  return (
    <Dialog.Root
      open={authModalOpen}
      onOpenChange={(open) => {
        if (!open) {
          closeAuthModal();
          resetForm();
        }
      }}
    >
      <AnimatePresence>
        {authModalOpen && (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.div
                key="auth-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-50 bg-overlay-scrim"
              />
            </Dialog.Overlay>

            <Dialog.Content asChild>
              <motion.div
                key="auth-panel"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, ease: [0.2, 0, 0, 1] }}
                ref={panelRef}
                className="fixed inset-x-4 top-1/2 z-50 -translate-y-1/2 max-w-[480px] mx-auto overflow-hidden rounded-2xl bg-white shadow-modal flex flex-col max-h-[90vh]"
                aria-describedby={undefined}
              >
                {/* Header */}
                <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4">
                  <Dialog.Close asChild>
                    <button
                      type="button"
                      className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-neutral-100 transition-colors"
                      aria-label="Close"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </Dialog.Close>
                  <Dialog.Title className="text-base font-bold text-foreground">
                    {isLogin ? "Log in" : "Sign up"}
                  </Dialog.Title>
                  <div className="w-8" />
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6">
                  <h2 className="text-[22px] font-semibold text-foreground mb-2">
                    {isLogin ? "Welcome back" : "Welcome to Airbnb"}
                  </h2>
                  {!isLogin && (
                    <p className="text-sm text-muted-foreground mb-5">
                      Create an account to book your next adventure
                    </p>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-3" noValidate>
                    {!isLogin && (
                      <div>
                        <div className="relative">
                          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input
                            type="text"
                            placeholder="Full name"
                            value={name}
                            onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: "" })); }}
                            className={`auth-input ${errors.name ? "auth-input-error" : ""}`}
                          />
                        </div>
                        {errors.name && <p className="auth-error-text">{errors.name}</p>}
                      </div>
                    )}

                    <div>
                      <div className="relative">
                        <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                          type="email"
                          placeholder="Email address"
                          value={email}
                          onChange={(e) => { setEmail(e.target.value); setErrors((p) => ({ ...p, email: "" })); }}
                          className={`auth-input ${errors.email ? "auth-input-error" : ""}`}
                          autoComplete="email"
                        />
                      </div>
                      {errors.email && <p className="auth-error-text">{errors.email}</p>}
                    </div>

                    <div>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="Password"
                          value={password}
                          onChange={(e) => { setPassword(e.target.value); setErrors((p) => ({ ...p, password: "" })); }}
                          className={`auth-input ${errors.password ? "auth-input-error" : ""}`}
                          autoComplete={isLogin ? "current-password" : "new-password"}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                          tabIndex={-1}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                      {errors.password && <p className="auth-error-text">{errors.password}</p>}
                    </div>

                    {!isLogin && (
                      <div>
                        <div className="relative">
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400" />
                          <input
                            type="tel"
                            placeholder="Phone number (optional)"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="auth-input"
                          />
                        </div>
                      </div>
                    )}

                    {!isLogin && (
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        By signing up, you agree to Airbnb's{" "}
                        <button type="button" onClick={() => showToast("Terms of Service page coming soon")} className="text-[#FF385C] underline hover:text-[#E31C5F]">Terms of Service</button>,{" "}
                        <button type="button" onClick={() => showToast("Privacy Policy page coming soon")} className="text-[#FF385C] underline hover:text-[#E31C5F]">Privacy Policy</button>, and{" "}
                        <button type="button" onClick={() => showToast("Nondiscrimination Policy page coming soon")} className="text-[#FF385C] underline hover:text-[#E31C5F]">Nondiscrimination Policy</button>.
                      </p>
                    )}

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="auth-submit-btn"
                    >
                      {isLoading ? (
                        <span className="auth-spinner" />
                      ) : (
                        isLogin ? "Log in" : "Sign up"
                      )}
                    </button>
                  </form>

                  {/* Divider */}
                  <div className="flex items-center gap-4 my-5">
                    <div className="flex-1 h-px bg-neutral-200" />
                    <span className="text-xs text-muted-foreground font-medium">or</span>
                    <div className="flex-1 h-px bg-neutral-200" />
                  </div>

                  {/* Social Login Buttons */}
                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Google")}
                      disabled={isLoading}
                      className="auth-social-btn"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      <span className="flex-1 text-center">Continue with Google</span>
                      <ChevronRight className="h-4 w-4 text-neutral-300" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Apple")}
                      disabled={isLoading}
                      className="auth-social-btn"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="currentColor">
                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                      </svg>
                      <span className="flex-1 text-center">Continue with Apple</span>
                      <ChevronRight className="h-4 w-4 text-neutral-300" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSocialLogin("Facebook")}
                      disabled={isLoading}
                      className="auth-social-btn"
                    >
                      <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                      </svg>
                      <span className="flex-1 text-center">Continue with Facebook</span>
                      <ChevronRight className="h-4 w-4 text-neutral-300" />
                    </button>
                  </div>

                  {/* Switch mode */}
                  <div className="mt-6 text-center text-sm text-muted-foreground">
                    {isLogin ? "Don't have an account? " : "Already have an account? "}
                    <button
                      type="button"
                      onClick={switchMode}
                      className="text-[#FF385C] font-semibold underline hover:text-[#E31C5F] transition-colors"
                    >
                      {isLogin ? "Sign up" : "Log in"}
                    </button>
                  </div>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        )}
      </AnimatePresence>
    </Dialog.Root>
  );
});

export default AuthModal;
