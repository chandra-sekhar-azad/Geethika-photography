import { Heart, Camera, Gift, Users, Award, Target, Sparkles } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="valentine-gradient text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-4">
            <Heart className="w-12 h-12 fill-white" />
            <h1 className="text-4xl md:text-5xl font-display font-bold">
              About Us
            </h1>
          </div>
          <p className="text-xl">Capturing Moments, Creating Memories</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Our Story */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-valentine-red mb-6">Our Story</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              Welcome to <strong>Geethika Digital World</strong> – your one-stop destination for personalized gifts, professional photography, videography, and stunning event decorations. Founded with a passion for celebrating life's special moments, we have been serving our customers with dedication and creativity.
            </p>
            <p>
              What started as a small venture to help people express their love through customized gifts has grown into a comprehensive service provider for all your celebration needs. From intimate gatherings to grand celebrations, we bring your vision to life with our expertise and attention to detail.
            </p>
            <p>
              At Geethika Digital World, we believe that every moment is precious and deserves to be celebrated in a unique way. Whether it's a personalized photo frame, a custom-designed t-shirt, or a beautifully decorated event space, we pour our heart into every project.
            </p>
          </div>
        </section>

        {/* What We Do */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-valentine-red mb-6 text-center">What We Do</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-valentine-pink/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-valentine-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Personalized Gifts</h3>
              <p className="text-gray-600">
                Custom photo frames, mugs, t-shirts, cushions, keychains, and more. Make every gift special with personalization.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-valentine-pink/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Camera className="w-8 h-8 text-valentine-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Photography & Videography</h3>
              <p className="text-gray-600">
                Professional photography and videography services for weddings, events, birthdays, and special occasions.
              </p>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 text-center hover:shadow-xl transition-shadow">
              <div className="bg-valentine-pink/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-valentine-red" />
              </div>
              <h3 className="text-xl font-bold mb-3">Event Decoration</h3>
              <p className="text-gray-600">
                Beautiful event decorations, home redecor, shop redecor, and themed setups to make your celebrations memorable.
              </p>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold text-valentine-red mb-6 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-valentine-red text-white w-12 h-12 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Customer First</h3>
                <p className="text-gray-600">
                  Your satisfaction is our priority. We go the extra mile to ensure every customer has a delightful experience.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-valentine-red text-white w-12 h-12 rounded-lg flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Quality Excellence</h3>
                <p className="text-gray-600">
                  We use premium materials and maintain high standards in all our products and services.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-valentine-red text-white w-12 h-12 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Creativity & Innovation</h3>
                <p className="text-gray-600">
                  We constantly innovate and bring fresh ideas to make your celebrations unique and memorable.
                </p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="bg-valentine-red text-white w-12 h-12 rounded-lg flex items-center justify-center">
                  <Target className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">Timely Delivery</h3>
                <p className="text-gray-600">
                  We understand the importance of time and ensure prompt delivery of all orders and services.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gradient-to-r from-valentine-pink/20 to-valentine-red/10 rounded-xl p-8 mb-8 border border-valentine-pink/30">
          <h2 className="text-3xl font-bold text-valentine-red mb-6 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-semibold text-valentine-red mb-1">✓ Wide Product Range</p>
              <p className="text-sm text-gray-600">Hundreds of customizable products to choose from</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-semibold text-valentine-red mb-1">✓ Professional Team</p>
              <p className="text-sm text-gray-600">Experienced photographers, designers, and decorators</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-semibold text-valentine-red mb-1">✓ Affordable Pricing</p>
              <p className="text-sm text-gray-600">Competitive prices without compromising quality</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-semibold text-valentine-red mb-1">✓ Quick Turnaround</p>
              <p className="text-sm text-gray-600">Fast processing and delivery of orders</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-semibold text-valentine-red mb-1">✓ Secure Payments</p>
              <p className="text-sm text-gray-600">Safe and encrypted payment processing</p>
            </div>
            <div className="bg-white rounded-lg p-4 shadow">
              <p className="font-semibold text-valentine-red mb-1">✓ Customer Support</p>
              <p className="text-sm text-gray-600">Dedicated support team to assist you</p>
            </div>
          </div>
        </section>

        {/* Our Mission */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Target className="w-8 h-8 text-valentine-red" />
            <h2 className="text-3xl font-bold text-valentine-red">Our Mission</h2>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed">
            Our mission is to help people celebrate life's precious moments by providing high-quality personalized products and professional services. We aim to be the most trusted and preferred choice for gifts, photography, and event decoration services, making every celebration special and memorable.
          </p>
        </section>

        {/* Team */}
        <section className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-8 h-8 text-valentine-red" />
            <h2 className="text-3xl font-bold text-valentine-red">Our Team</h2>
          </div>
          <p className="text-gray-700 leading-relaxed mb-4">
            Behind Geethika Digital World is a passionate team of designers, photographers, videographers, and customer service professionals who work together to bring your ideas to life. Our team combines creativity with technical expertise to deliver exceptional results every time.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We continuously train and upgrade our skills to stay ahead of trends and provide you with the best possible service. Your happiness is our success, and we take pride in being part of your special moments.
          </p>
        </section>

        {/* Contact CTA */}
        <section className="bg-valentine-gradient text-white rounded-xl shadow-lg p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Let's Create Something Special Together</h2>
          <p className="text-lg mb-6">
            Have a question or want to discuss your requirements? We'd love to hear from you!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/contact"
              className="bg-white text-valentine-red px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Contact Us
            </a>
            <a
              href="/shop"
              className="bg-valentine-red border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-valentine-red/90 transition-colors"
            >
              Shop Now
            </a>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutPage;
