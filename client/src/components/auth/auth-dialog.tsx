import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import LoginForm from "./login-form";
import RegisterForm from "./register-form";

interface AuthDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "login" | "register";
}

export default function AuthDialog({ isOpen, onOpenChange, initialMode = "login" }: AuthDialogProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode);

  const handleSuccess = () => {
    onOpenChange(false);
  };

  const switchToLogin = () => setMode("login");
  const switchToRegister = () => setMode("register");

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="sr-only">
            {mode === "login" ? "Login" : "Register"}
          </DialogTitle>
        </DialogHeader>
        
        {mode === "login" ? (
          <LoginForm
            onSuccess={handleSuccess}
            onSwitchToRegister={switchToRegister}
          />
        ) : (
          <RegisterForm
            onSuccess={handleSuccess}
            onSwitchToLogin={switchToLogin}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}