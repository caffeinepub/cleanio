import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAdminAuth } from "../hooks/useAdminAuth";

export default function AdminLoginForm() {
  const { login } = useAdminAuth();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Small delay for UX feedback
    await new Promise((r) => setTimeout(r, 400));

    const success = login(password);
    setIsLoading(false);

    if (!success) {
      setError("Incorrect password. Please try again.");
      setPassword("");
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-brand-orange/10 border border-brand-orange/30 rounded-2xl flex items-center justify-center">
            <ShieldCheck className="w-8 h-8 text-brand-orange" />
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="font-display font-black text-2xl text-foreground mb-2">
            Admin Access
          </h1>
          <p className="text-muted-foreground text-sm">
            Enter your admin password to manage bookings.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              placeholder="Admin password"
              className="pl-10 pr-10 bg-charcoal-light border-border text-foreground placeholder:text-muted-foreground focus:border-brand-orange"
              autoFocus
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !password}
            className="w-full bg-brand-orange hover:bg-brand-orange-light text-charcoal font-bold h-11 transition-all"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-charcoal/30 border-t-charcoal rounded-full animate-spin" />
                Verifying…
              </span>
            ) : (
              "Login to Admin"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
