import { useLocation } from "wouter";
import RegisterForm from "@/components/auth/register-form";
import { Link } from "wouter";
import { ArrowLeft, Sparkles, Crown, Star, Palette, Users, Shield, Heart, Theater, Drama } from "lucide-react";

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
        <button 
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all hover:shadow-lg"
          data-testid="button-home"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium">Back to Home</span>
        </button>
      </div>

      <div className="min-h-screen flex">
        {/* Left Column - Visual/Branding */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative overflow-hidden">
          <div className="absolute inset-0 bright-gradient"></div>
          <div className="relative z-10 flex flex-col justify-center items-center text-white p-8 lg:p-12">
            <div className="max-w-lg text-center space-y-8">
              {/* Logo/Brand */}
              <div className="mb-8">
                <div className="flex flex-col items-center gap-4 mb-6">
                  <div className="relative">
                    <Crown className="h-16 w-16 text-white" />
                    <Drama className="h-8 w-8 text-pink-300 absolute -bottom-2 -right-2" />
                  </div>
                  <div>
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2">Join Our Drama Community</h1>
                    <p className="text-white/90 text-lg lg:text-xl">Start Your Costume Rental Journey</p>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-6">
                <div className="flex items-center justify-center gap-4 text-white/90 text-lg">
                  <Users className="h-6 w-6 text-pink-300 flex-shrink-0" />
                  <span>Join Thousands of Drama Artists</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-white/90 text-lg">
                  <Theater className="h-6 w-6 text-pink-300 flex-shrink-0" />
                  <span>Access Exclusive Stage Collections</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-white/90 text-lg">
                  <Shield className="h-6 w-6 text-pink-300 flex-shrink-0" />
                  <span>Secure & Trusted Platform</span>
                </div>
                <div className="flex items-center justify-center gap-4 text-white/90 text-lg">
                  <Star className="h-6 w-6 text-pink-300 flex-shrink-0" />
                  <span>VIP Member Benefits</span>
                </div>
              </div>

              {/* Drama Quote */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-8">
                <p className="text-white/95 italic text-lg lg:text-xl mb-3">
                  "Transform your performances with our stunning costume collection. Every rental brings your character to life."
                </p>
                <div className="flex items-center justify-center gap-1 mt-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                  ))}
                </div>
                <p className="text-white/80 text-sm mt-2">Trusted by 500+ Drama Groups</p>
              </div>

              {/* Decorative drama elements */}
              <div className="absolute top-16 left-16 opacity-15">
                <Drama className="h-28 w-28 text-white rotate-12" />
              </div>
              <div className="absolute bottom-16 right-16 opacity-15">
                <Users className="h-24 w-24 text-pink-300 -rotate-12" />
              </div>
              <div className="absolute top-1/3 right-20 opacity-10">
                <Theater className="h-32 w-32 text-white rotate-45" />
              </div>
              <div className="absolute bottom-1/3 left-20 opacity-15">
                <Heart className="h-20 w-20 text-pink-300 rotate-12" />
              </div>
              {/* Theater curtains effect */}
              <div className="absolute top-0 left-0 w-8 h-full bg-gradient-to-r from-purple-900/30 to-transparent"></div>
              <div className="absolute top-0 right-0 w-8 h-full bg-gradient-to-l from-purple-900/30 to-transparent"></div>
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