import { useLocation } from "wouter";
import RegisterForm from "@/components/auth/register-form";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Crown, Star, Palette, Users, Shield, Heart } from "lucide-react";

export default function Register() {
  const [, setLocation] = useLocation();

  const handleRegisterSuccess = () => {
    // Redirect to dashboard after successful registration
    setLocation("/dashboard");
  };

  const handleSwitchToLogin = () => {
    // Navigate to login page
    setLocation("/login");
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
          <div className="absolute inset-0 bright-gradient"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
            <div className="max-w-md text-center space-y-6">
              {/* Logo/Brand */}
              <div className="mb-8">
                <div className="inline-flex items-center gap-3 mb-4">
                  <div className="relative">
                    <Crown className="h-12 w-12 text-white" />
                    <Heart className="h-6 w-6 text-pink-300 absolute -top-1 -right-1" />
                  </div>
                  <h1 className="text-3xl font-bold">Join Our Community</h1>
                </div>
                <p className="text-white/90 text-lg">Start Your Costume Rental Journey</p>
              </div>

              {/* Benefits */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-white/90">
                  <Users className="h-5 w-5 text-pink-300" />
                  <span>Join Thousands of Happy Customers</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Shield className="h-5 w-5 text-pink-300" />
                  <span>Secure & Trusted Platform</span>
                </div>
                <div className="flex items-center gap-3 text-white/90">
                  <Star className="h-5 w-5 text-pink-300" />
                  <span>Exclusive Member Benefits</span>
                </div>
              </div>

              {/* Quote */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-8">
                <p className="text-white/90 italic text-lg mb-3">
                  "Transform your events with our stunning costume collection. Every rental is a step towards your perfect performance."
                </p>
                <div className="flex items-center justify-center gap-1">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-4 w-4 text-yellow-300 fill-current" />
                  ))}
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-16 left-16 opacity-20">
                <Users className="h-20 w-20 text-white rotate-12" />
              </div>
              <div className="absolute bottom-16 right-16 opacity-20">
                <Heart className="h-16 w-16 text-pink-300 -rotate-12" />
              </div>
              <div className="absolute top-32 right-28 opacity-10">
                <Shield className="h-24 w-24 text-white rotate-45" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Registration Form */}
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
                <h2 className="text-3xl font-bold text-foreground mb-2">Create Account</h2>
                <p className="text-muted-foreground">Join us and start renting amazing costumes</p>
              </div>

              <RegisterForm 
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={handleSwitchToLogin}
              />
            </div>
            
            {/* Additional navigation link */}
            <div className="text-center">
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link 
                  href="/login" 
                  className="text-primary hover:text-primary/80 font-semibold transition-colors"
                  data-testid="link-login"
                >
                  Sign in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}