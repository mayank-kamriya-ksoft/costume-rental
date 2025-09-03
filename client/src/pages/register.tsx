import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import RegisterForm from "@/components/auth/register-form";
import { Link } from "wouter";

export default function Register() {
  const [, setLocation] = useLocation();

  const handleRegisterSuccess = () => {
    // Redirect to home page after successful registration
    setLocation("/");
  };

  const handleSwitchToLogin = () => {
    // Navigate to login page
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main content area */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          <div className="bg-card rounded-lg shadow-lg border p-8">
            <RegisterForm 
              onSuccess={handleRegisterSuccess}
              onSwitchToLogin={handleSwitchToLogin}
            />
          </div>
          
          {/* Additional navigation link */}
          <div className="text-center mt-6">
            <p className="text-muted-foreground">
              Already have an account?{" "}
              <Link 
                href="/login" 
                className="text-primary hover:underline font-semibold"
                data-testid="link-login"
              >
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}