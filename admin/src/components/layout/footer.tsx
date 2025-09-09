import { Crown, Phone, MapPin, Mail, Clock, Star } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-500 via-purple-600 to-yellow-500 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Shop Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Crown className="h-8 w-8 text-yellow-300" />
              <div>
                <h3 className="text-xl font-bold">Kamdhenu Drama King</h3>
                <p className="text-sm text-white/80">Premium Costume Rentals</p>
              </div>
            </div>
            <p className="text-white/90 text-sm">
              Your one-stop destination for authentic Indian mythological costumes and accessories. 
              Bringing epic characters to life with premium quality rentals.
            </p>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <Star className="h-4 w-4 text-yellow-300 fill-current" />
              <span className="text-sm text-white/80 ml-2">Trusted by customers</span>
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Contact Us</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-yellow-300" />
                <div>
                  <p className="font-medium">9822044498</p>
                  <p className="text-sm text-white/80">Call us anytime</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-yellow-300 mt-1" />
                <div>
                  <p className="font-medium">Pandariba Road</p>
                  <p className="text-sm text-white/90">Near Jagrut Hanuman Temple</p>
                  <p className="text-sm text-white/90">Chh. Sambhaji Nagar - 431001</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="h-5 w-5 text-yellow-300" />
                <div>
                  <p className="font-medium">Open Daily</p>
                  <p className="text-sm text-white/80">10:00 AM - 8:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Links</h4>
            <div className="space-y-2">
              <a href="/" className="block text-white/90 hover:text-white transition-colors">
                Browse Costumes
              </a>
              <a href="/" className="block text-white/90 hover:text-white transition-colors">
                Accessories
              </a>
              <a href="/admin" className="block text-white/90 hover:text-white transition-colors">
                Admin Dashboard
              </a>
              <div className="pt-2">
                <p className="text-sm text-white/80">Popular Categories:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Gods</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Goddesses</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Warriors</span>
                  <span className="bg-white/20 px-2 py-1 rounded text-xs">Royal</span>
                </div>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Our Services</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Premium Quality Costumes</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Professional Cleaning</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>All Size Availability</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Authentic Accessories</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Flexible Rental Periods</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-300 rounded-full"></div>
                <span>Custom Fittings Available</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 mt-8 pt-6 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            <p className="text-sm text-white/80">
              © 2024 Kamdhenu Drama King. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-white/80">
              <span>Bringing mythology to life since years</span>
              <span>•</span>
              <span>Trusted by theatre groups & individuals</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}