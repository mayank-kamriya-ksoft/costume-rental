import { useLocation } from "wouter";
import RegisterForm from "@/components/auth/register-form";
import { Link } from "wouter";
import { ArrowLeft, Crown, Users, Shield, Star } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <button 
          onClick={() => setLocation("/")}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-gray-50 rounded-lg shadow-sm border transition-all"
          data-testid="button-home"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="font-medium text-gray-700">Back to Home</span>
        </button>
      </div>

      <div className="min-h-screen flex">
        {/* Left Column - Professional Branding */}
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16">
            <div className="max-w-lg">
              {/* Brand Header */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Kamdhenu Drama Making</h1>
                    <p className="text-gray-300 text-sm">Join Our Community</p>
                  </div>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                    Join thousands of satisfied customers
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Create your account today and get access to our premium collection 
                    of costumes and exclusive member benefits.
                  </p>
                </div>

                {/* Member Benefits */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-medium">Priority Access to New Collections</p>
                      <p className="text-gray-400 text-sm">Be the first to rent the latest costumes</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-medium">Member Discounts & Special Offers</p>
                      <p className="text-gray-400 text-sm">Exclusive pricing for regular customers</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-medium">Personalized Recommendations</p>
                      <p className="text-gray-400 text-sm">Costume suggestions based on your preferences</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-medium">Easy Booking Management</p>
                      <p className="text-gray-400 text-sm">Track your rentals and manage orders online</p>
                    </div>
                  </div>
                </div>

                {/* Trust Indicators */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <div className="flex items-center gap-4 mb-3">
                    <Users className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-medium">5,000+ Happy Customers</span>
                  </div>
                  <div className="flex items-center gap-4 mb-3">
                    <Shield className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-medium">100% Secure & Private</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Star className="h-5 w-5 text-emerald-400" />
                    <span className="text-white font-medium">4.9/5 Customer Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Registration Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Kamdhenu</h1>
              </div>
              <p className="text-gray-600">Join Our Community</p>
            </div>

            {/* Registration Section */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Create your account</h2>
                <p className="text-gray-600">Start your costume rental journey today</p>
              </div>

              <RegisterForm 
                onSuccess={handleRegisterSuccess}
                onSwitchToLogin={handleSwitchToLogin}
              />

              <div className="text-center">
                <p className="text-gray-600">
                  Already have an account?{" "}
                  <Link 
                    href="/login" 
                    className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
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
    </div>
  );
}