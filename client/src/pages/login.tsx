import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import LoginForm from "@/components/auth/login-form";
import { Link } from "wouter";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLoginSuccess = () => {
    // Redirect to home page after successful login
    setLocation("/");
  };

  const handleSwitchToRegister = () => {
    // Navigate to register page
    setLocation("/register");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main content area */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg border p-8">
            <LoginForm 
              onSuccess={handleLoginSuccess}
              onSwitchToRegister={handleSwitchToRegister}
            />
          </div>
          
          {/* Additional navigation link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Don't have an account?{" "}
              <Link 
                href="/register" 
                className="text-primary hover:underline font-semibold"
                data-testid="link-register"
              >
                Create one here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}