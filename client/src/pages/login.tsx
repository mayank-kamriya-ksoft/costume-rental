import { useLocation } from "wouter";
import LoginForm from "@/components/auth/login-form";
import { Link } from "wouter";
import { ArrowLeft, Crown } from "lucide-react";

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
        <div className="hidden lg:flex lg:w-1/2 xl:w-3/5 relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
          
          <div className="relative z-10 flex flex-col justify-center p-12 lg:p-16">
            <div className="max-w-lg">
              {/* Brand Header */}
              <div className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                    <Crown className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white">Kamdhenu Drama Making</h1>
                    <p className="text-gray-300 text-sm">Professional Costume Rentals</p>
                  </div>
                </div>
              </div>

              {/* Value Proposition */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                    Authentic costumes for your perfect performance
                  </h2>
                  <p className="text-gray-300 text-lg leading-relaxed">
                    Trusted by theater groups and event organizers across the region. 
                    Premium quality costumes and accessories for every occasion.
                  </p>
                </div>

                {/* Key Features */}
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-medium">Traditional & Contemporary Collections</p>
                      <p className="text-gray-400 text-sm">Extensive range for all types of performances</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-medium">Professional Quality Assurance</p>
                      <p className="text-gray-400 text-sm">Every costume carefully maintained and cleaned</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
                    <div>
                      <p className="text-white font-medium">Flexible Rental Periods</p>
                      <p className="text-gray-400 text-sm">From single day to extended productions</p>
                    </div>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                  <p className="text-white italic mb-2">
                    "Exceptional quality and service. Their costume collection helped make our production truly memorable."
                  </p>
                  <p className="text-gray-400 text-sm">— City Theatre Company</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Login Form */}
        <div className="w-full lg:w-1/2 xl:w-2/5 flex items-center justify-center p-6 lg:p-12 bg-white">
          <div className="w-full max-w-md">
            {/* Mobile Header */}
            <div className="lg:hidden text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-amber-400 to-orange-500 rounded-lg flex items-center justify-center">
                  <Crown className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Kamdhenu</h1>
              </div>
              <p className="text-gray-600">Professional Costume Rentals</p>
            </div>

            {/* Login Section */}
            <div className="space-y-6">
              <div className="text-center lg:text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome back</h2>
                <p className="text-gray-600">Please sign in to your account</p>
              </div>

              <LoginForm 
                onSuccess={handleLoginSuccess}
                onSwitchToRegister={handleSwitchToRegister}
              />

              <div className="text-center">
                <p className="text-gray-600">
                  Don't have an account?{" "}
                  <Link 
                    href="/register" 
                    className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                    data-testid="link-register"
                  >
                    Sign up here
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