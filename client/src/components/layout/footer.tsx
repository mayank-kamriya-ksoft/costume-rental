import { Crown, Phone, MapPin, Mail, Clock, Star, Heart, Sparkles, Shield, Award } from "lucide-react";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-purple-800 to-amber-600"></div>
      
      {/* Animated Pattern Overlay */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fbbf24' fill-opacity='0.3'%3E%3Cpath d='M30 30l15-15v30l-15-15zm-15 15l15-15h-30l15 15z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          animation: 'float 25s ease-in-out infinite'
        }}></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Shop Info */}
            <div className="space-y-6">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Crown className="h-12 w-12 text-amber-300 drop-shadow-lg" />
                  <Sparkles className="h-6 w-6 text-amber-200 absolute -top-1 -right-1 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white bg-gradient-to-r from-amber-200 to-amber-100 bg-clip-text text-transparent">
                    Kamdhenu Drama King
                  </h3>
                  <p className="text-amber-200 font-medium">✨ Premium Costume Rentals ✨</p>
                </div>
              </div>
              <p className="text-white/90 text-base leading-relaxed">
                Your enchanted gateway to authentic Indian mythological costumes and accessories. 
                We bring divine stories to life with premium quality rentals that transform you into legendary characters.
              </p>
              <div className="flex items-center space-x-2 bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex space-x-1">
                  <Star className="h-5 w-5 text-amber-300 fill-current drop-shadow-sm" />
                  <Star className="h-5 w-5 text-amber-300 fill-current drop-shadow-sm" />
                  <Star className="h-5 w-5 text-amber-300 fill-current drop-shadow-sm" />
                  <Star className="h-5 w-5 text-amber-300 fill-current drop-shadow-sm" />
                  <Star className="h-5 w-5 text-amber-300 fill-current drop-shadow-sm" />
                </div>
                <div className="ml-3">
                  <p className="text-white font-semibold">Trusted by thousands</p>
                  <p className="text-amber-200 text-sm">500+ satisfied customers</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Phone className="h-6 w-6 text-amber-300 mr-2" />
                Contact Us
              </h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <Phone className="h-6 w-6 text-amber-300 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white text-lg">9822044498</p>
                    <p className="text-amber-200">Call us anytime</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <MapPin className="h-6 w-6 text-amber-300 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-white">Pandariba Road</p>
                    <p className="text-white/90">Near Jagrut Hanuman Temple</p>
                    <p className="text-white/90">Chh. Sambhaji Nagar - 431001</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-white/10 rounded-xl p-4 backdrop-blur-sm hover:bg-white/20 transition-all">
                  <Clock className="h-6 w-6 text-amber-300 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-white">Open Daily</p>
                    <p className="text-amber-200">10:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Sparkles className="h-6 w-6 text-amber-300 mr-2" />
                Quick Links
              </h4>
              <div className="space-y-3">
                <a href="/" className="block text-white/90 hover:text-amber-200 transition-colors bg-white/10 rounded-lg p-3 hover:bg-white/20">
                  Browse Divine Costumes
                </a>
                <a href="/" className="block text-white/90 hover:text-amber-200 transition-colors bg-white/10 rounded-lg p-3 hover:bg-white/20">
                  Mythological Accessories
                </a>
                <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-amber-200 font-semibold mb-3">🌟 Popular Categories:</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">Gods</span>
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">Goddesses</span>
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">Warriors</span>
                    <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-purple-900 px-3 py-1 rounded-full text-xs font-bold">Royal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Services */}
            <div className="space-y-6">
              <h4 className="text-2xl font-bold text-white mb-4 flex items-center">
                <Shield className="h-6 w-6 text-amber-300 mr-2" />
                Our Services
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all">
                  <Award className="h-5 w-5 text-amber-300 flex-shrink-0" />
                  <span className="text-white">Premium Quality Costumes</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all">
                  <Sparkles className="h-5 w-5 text-amber-300 flex-shrink-0" />
                  <span className="text-white">Professional Cleaning</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all">
                  <Heart className="h-5 w-5 text-amber-300 flex-shrink-0" />
                  <span className="text-white">All Size Availability</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all">
                  <Crown className="h-5 w-5 text-amber-300 flex-shrink-0" />
                  <span className="text-white">Authentic Accessories</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all">
                  <Clock className="h-5 w-5 text-amber-300 flex-shrink-0" />
                  <span className="text-white">Flexible Rental Periods</span>
                </div>
                <div className="flex items-center space-x-3 bg-white/10 rounded-lg p-3 hover:bg-white/20 transition-all">
                  <Shield className="h-5 w-5 text-amber-300 flex-shrink-0" />
                  <span className="text-white">Custom Fittings Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Beautiful Bottom Bar */}
          <div className="relative mt-16 pt-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent h-px"></div>
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 bg-black/20 rounded-2xl p-6 backdrop-blur-md border border-white/10">
              <div className="text-center md:text-left">
                <p className="text-white font-semibold text-lg mb-1">
                  © 2024 Kamdhenu Drama King. All rights reserved.
                </p>
                <p className="text-amber-200 text-sm">Transforming dreams into divine reality</p>
              </div>
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-white/90">
                <div className="flex items-center space-x-2">
                  <Heart className="h-4 w-4 text-red-400" />
                  <span className="text-sm">Bringing mythology to life since years</span>
                </div>
                <div className="hidden md:block text-amber-200">•</div>
                <div className="flex items-center space-x-2">
                  <Award className="h-4 w-4 text-amber-300" />
                  <span className="text-sm">Trusted by theatre groups & individuals</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}