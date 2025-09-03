import { useLocation } from "wouter";
import LoginForm from "@/components/auth/login-form";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Crown, Star, Palette } from "lucide-react";

export default function Login() {
  const [, setLocation] = useLocation();

  const handleLoginSuccess = () => {
    // Redirect to dashboard after successful login
    setLocation("/dashboard");
  };

  const handleSwitchToRegister = () => {
    // Navigate to register page
    setLocation("/register");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-accent/20">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:shadow-lg"
          data-testid="link-home"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back to Home</span>
        </Link>
      </div>

      <div className="min-h-screen flex">
        {/* Left Column - Visual/Branding */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
          <div className="absolute inset-0 indian-gradient"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="max-w-md text-center space-y-6">
              {/* Logo/Brand */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Crown className="h-12 w-12 text-white" />
                    <Sparkles className="h-6 w-6 text-yellow-300 absolute -top-1 -right-1" />
                  </div>
                  <h1 className="text-3xl font-bold">Kamdhenu Drama Making</h1>
                </div>
                <p className="text-white/90 text-lg">Premium Costume Rental Experience</p>
              </div>

              {/* Feature highlights */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <Star className="h-5 w-5 text-yellow-300" />
                  <span>Authentic Traditional Costumes</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Palette className="h-5 w-5 text-yellow-300" />
                  <span>Professional Quality Accessories</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Crown className="h-5 w-5 text-yellow-300" />
                  <span>Perfect for Theater & Events</span>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-20 left-20 opacity-20">
                <Crown className="h-24 w-24 text-white rotate-12" />
              </div>
              <div className="absolute bottom-20 right-20 opacity-20">
                <Sparkles className="h-16 w-16 text-yellow-300 -rotate-12" />
              </div>
              <div className="absolute top-40 right-32 opacity-10">
                <Star className="h-20 w-20 text-white rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12">
          <div className="w-full max-w-md space-y-8">
            {/* Mobile Logo */}
            <div className="lg:hidden text-center mb-8">
              <div className="inline-flex items-center gap-2 mb-2">
                <Crown className="h-8 w-8 text-primary" />
                <h1 className="text-2xl font-bold text-foreground">Kamdhenu</h1>
              </div>
              <p className="text-muted-foreground">Premium Costume Rental</p>
            </div>

            {/* Form Container */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 p-8 lg:p-10">
              <div className="mb-8">
                <h2 className="text-3xl font-bold text-foreground mb-2">Welcome Back</h2>
                <p className="text-muted-foreground">Sign in to access your costume rentals</p>
              </div>

              <LoginForm 
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={handleSwitchToRegister}
              />
            </div>
            
            {/* Additional navigation link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Don't have an account?{" "}
                <Link 
                  href="/register" 
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  data-testid="link-register"
                >
                  Create one here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}