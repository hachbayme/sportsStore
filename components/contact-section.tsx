// components/contact-section.tsx
"use client"

import { Mail, Phone, MapPin, Clock, Facebook, Twitter, Instagram, Youtube } from "lucide-react"


export default function ContactSection() {

  return (
    <section id="contact" className="py-20 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            { "Contactez-nous"}
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            {"Nous sommes là pour vous aider. Contactez-nous pour toute question ou demande"
            }
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* معلومات الاتصال */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-white mb-6">
                { "Informations de contact"}
              </h3>
              
              <div className="space-y-6">
                {/* الهاتف */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{ "Téléphone"}</h4>
                    <p className="text-gray-300">+966 12 345 6789</p>
                    <p className="text-gray-300">+966 55 123 4567</p>
                  </div>
                </div>

                {/* البريد الإلكتروني */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{ "Email"}</h4>
                    <p className="text-gray-300">info@sportzone.sa</p>
                    <p className="text-gray-300">support@sportzone.sa</p>
                  </div>
                </div>

                {/* العنوان */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{"Adresse"}</h4>
                    <p className="text-gray-300">
                      {"Oujda ..........."
                      }
                    </p>
                  </div>
                </div>

                {/* أوقات العمل */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-amber-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="h-6 w-6 text-amber-400" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{"Heures d'ouverture"}</h4>
                    <p className="text-gray-300">
                      {"Samedi - Jeudi: 8h - 22h"}
                    </p>
                    <p className="text-gray-300">
                      { "Vendredi: 16h - 22h"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* وسائل التواصل الاجتماعي */}
            <div>
              <h4 className="text-xl font-semibold text-white mb-4">
                { "Suivez-nous sur"}
              </h4>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition-all duration-300 hover:scale-110"
                  aria-label="Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-blue-400 text-white rounded-full flex items-center justify-center hover:bg-blue-500 transition-all duration-300 hover:scale-110"
                  aria-label="Twitter"
                >
                  <Twitter className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:scale-110"
                  aria-label="Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-red-600 text-white rounded-full flex items-center justify-center hover:bg-red-700 transition-all duration-300 hover:scale-110"
                  aria-label="YouTube"
                >
                  <Youtube className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>

          {/* الخريطة */}
          <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
            <div className="h-96 bg-gray-700 relative">
              {/* خريطة Google Maps iframe */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d13123.348954277764!2d-1.9062566501385187!3d34.68405711161604!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd7864a5b195795d%3A0x6628af48453c1f44!2z2YjYs9i3INin2YTZhdiv2YrZhtip2Iwg2YjYrNiv2Kk!5e0!3m2!1sar!2sma!4v1763229978181!5m2!1sar!2sma"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="SportZone Location"
                className="absolute inset-0"
              />
              
              {/* Fallback في حالة عدم تحميل الخريطة */}
              <div className="absolute inset-0 flex items-center justify-center bg-gray-800 bg-opacity-90 hidden">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-amber-400 mx-auto mb-4" />
                  <p className="text-gray-300">
                    { "Carte de notre emplacement à Oujda, Maroc"
                    }
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-gray-800">
              <h4 className="font-semibold text-white mb-2">
                {"Notre emplacement"}
              </h4>
              <p className="text-gray-300 text-sm">
                {"...... Oujda, Maroc"
                }
              </p>
              <div className="flex items-center gap-2 mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors cursor-pointer">
                <MapPin className="h-4 w-4" />
                <span>
                  {"Directions"}
                </span>
              </div>
            </div>
          </div>
        </div>


      </div>
    </section>
  )
}