import { Heart, Camera, Gift, Users, Award, Target, Sparkles, MapPin, Phone, Mail, Clock, MessageCircle } from 'lucide-react';

const AboutPage = () => {
  const handleWhatsApp = () => {
    const message = 'Hi! I would like to know more about your services.';
    const whatsappUrl = `https://wa.me/919492686421?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleCall = () => {
    window.location.href = 'tel:+919492686421';
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg-light)' }}>

      {/* Page Header */}
      <div className="relative py-10 sm:py-14 md:py-18 border-b" style={{ backgroundColor: 'var(--color-bg-hero)', borderColor: 'rgba(168,213,213,0.4)' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-2">
            <Heart className="w-7 h-7 sm:w-9 sm:h-9" style={{ color: 'var(--color-teal-500)', fill: 'var(--color-teal-500)' }} />
            <h1 className="font-display font-semibold text-3xl sm:text-4xl md:text-5xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>
              About Us
            </h1>
          </div>
          <p className="font-body text-sm sm:text-base md:text-lg ml-10 sm:ml-12" style={{ color: 'var(--color-text-mid)' }}>
            Capturing Moments, Creating Memories
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 md:py-14 space-y-8">

        {/* Our Story */}
        <section className="bg-white rounded-xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 16px rgba(26,43,53,0.06)' }}>
          <div className="flex items-center gap-2 mb-5">
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>Our Story</h2>
          </div>
          <div className="space-y-4 font-body text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-mid)' }}>
            <p>
              Welcome to <strong style={{ color: 'var(--color-text-dark)' }}>Geethika Digital World</strong> – your one-stop destination for personalized gifts, professional photography, videography, and stunning event decorations. Founded with a passion for celebrating life's special moments, we have been serving our customers with dedication and creativity.
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
        <section>
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>What We Do</h2>
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {[
              { icon: Gift, title: 'Personalized Gifts', desc: 'Custom photo frames, mugs, t-shirts, cushions, keychains, and more. Make every gift special with personalization.' },
              { icon: Camera, title: 'Photography & Videography', desc: 'Professional photography and videography services for weddings, events, birthdays, and special occasions.' },
              { icon: Sparkles, title: 'Event Decoration', desc: 'Beautiful event decorations, home redecor, shop redecor, and themed setups to make your celebrations memorable.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title}
                className="bg-white border rounded-xl p-6 text-center transition-all duration-300 hover:-translate-y-1 group"
                style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 10px rgba(26,43,53,0.05)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 14px 36px rgba(61,138,138,0.13)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = '0 2px 10px rgba(26,43,53,0.05)'}
              >
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110"
                  style={{ backgroundColor: 'var(--color-teal-50)', border: '1px solid rgba(91,163,163,0.2)' }}>
                  <Icon className="w-8 h-8" style={{ color: 'var(--color-teal-500)' }} />
                </div>
                <h3 className="font-display font-semibold text-lg sm:text-xl mb-3 transition-colors"
                  style={{ color: 'var(--color-text-dark)' }}>
                  {title}
                </h3>
                <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-text-mid)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Our Values */}
        <section className="bg-white rounded-xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 16px rgba(26,43,53,0.06)' }}>
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>Our Values</h2>
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { icon: Heart, title: 'Customer First', desc: 'Your satisfaction is our priority. We go the extra mile to ensure every customer has a delightful experience.' },
              { icon: Award, title: 'Quality Excellence', desc: 'We use premium materials and maintain high standards in all our products and services.' },
              { icon: Sparkles, title: 'Creativity & Innovation', desc: 'We constantly innovate and bring fresh ideas to make your celebrations unique and memorable.' },
              { icon: Target, title: 'Timely Delivery', desc: 'We understand the importance of time and ensure prompt delivery of all orders and services.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex gap-4 group p-3 rounded-xl transition-all" style={{ backgroundColor: 'transparent' }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-teal-50)'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <div className="flex-shrink-0">
                  <div className="w-11 h-11 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: 'var(--color-navy-800)' }}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-lg mb-1" style={{ color: 'var(--color-text-dark)' }}>{title}</h3>
                  <p className="font-body text-sm leading-relaxed" style={{ color: 'var(--color-text-mid)' }}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-white rounded-xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 16px rgba(26,43,53,0.06)' }}>
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>Why Choose Us?</h2>
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { label: '✓ Wide Product Range', desc: 'Hundreds of customizable products to choose from' },
              { label: '✓ Professional Team', desc: 'Experienced photographers, designers, and decorators' },
              { label: '✓ Affordable Pricing', desc: 'Competitive prices without compromising quality' },
              { label: '✓ Quick Turnaround', desc: 'Fast processing and delivery of orders' },
              { label: '✓ Secure Payments', desc: 'Safe and encrypted payment processing' },
              { label: '✓ Customer Support', desc: 'Dedicated support team to assist you' },
            ].map(({ label, desc }) => (
              <div key={label}
                className="p-4 rounded-xl border transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: 'var(--color-teal-50)', borderColor: 'rgba(91,163,163,0.2)' }}
                onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 18px rgba(61,138,138,0.12)'}
                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
              >
                <p className="font-body font-semibold text-sm mb-1" style={{ color: 'var(--color-teal-500)' }}>{label}</p>
                <p className="font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Mission & Team row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-white rounded-xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 16px rgba(26,43,53,0.06)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-teal-50)' }}>
                <Target className="w-5 h-5" style={{ color: 'var(--color-teal-500)' }} />
              </div>
              <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>Our Mission</h2>
            </div>
            <p className="font-body text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-mid)' }}>
              Our mission is to help people celebrate life's precious moments by providing high-quality personalized products and professional services. We aim to be the most trusted and preferred choice for gifts, photography, and event decoration services, making every celebration special and memorable.
            </p>
          </section>

          <section className="bg-white rounded-xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 16px rgba(26,43,53,0.06)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--color-teal-50)' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--color-teal-500)' }} />
              </div>
              <h2 className="font-display font-semibold text-xl sm:text-2xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>Our Team</h2>
            </div>
            <p className="font-body text-sm sm:text-base leading-relaxed mb-3" style={{ color: 'var(--color-text-mid)' }}>
              Behind Geethika Digital World is a passionate team of designers, photographers, videographers, and customer service professionals who work together to bring your ideas to life.
            </p>
            <p className="font-body text-sm sm:text-base leading-relaxed" style={{ color: 'var(--color-text-mid)' }}>
              We continuously train and upgrade our skills to stay ahead of trends and provide you with the best possible service. Your happiness is our success.
            </p>
          </section>
        </div>

        {/* CTA Banner */}
        <section className="rounded-xl p-8 sm:p-10 text-center text-white" style={{ background: 'linear-gradient(135deg, var(--color-navy-800) 0%, var(--color-teal-500) 100%)' }}>
          <h2 className="font-display font-semibold text-2xl sm:text-3xl mb-3 tracking-wide">Let's Create Something Special Together</h2>
          <p className="font-body text-sm sm:text-base mb-7 opacity-85 max-w-xl mx-auto">
            Have a question or want to discuss your requirements? We'd love to hear from you!
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={handleWhatsApp}
              className="font-body font-semibold px-7 py-3 rounded-lg uppercase tracking-widest transition-all text-sm hover:-translate-y-0.5"
              style={{ backgroundColor: 'rgba(255,255,255,0.15)', color: 'white', border: '1.5px solid rgba(255,255,255,0.4)' }}
              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.25)'}
              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.15)'}
            >
              Contact Us
            </button>
            <a
              href="/shop"
              className="font-body font-semibold px-7 py-3 rounded-lg uppercase tracking-widest transition-all text-sm hover:-translate-y-0.5"
              style={{ backgroundColor: 'white', color: 'var(--color-navy-800)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--color-teal-50)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'white'; }}
            >
              Shop Now
            </a>
          </div>
        </section>

        {/* Get In Touch */}
        <section>
          <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
            <h2 className="font-display font-semibold text-2xl sm:text-3xl tracking-wide" style={{ color: 'var(--color-text-dark)' }}>Get In Touch</h2>
            <div className="h-0.5 w-8 rounded" style={{ backgroundColor: 'var(--color-teal-400)' }}></div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

            {/* Contact Details Column */}
            <div className="space-y-5">
              {/* Contact Info Card */}
              <div className="bg-white rounded-xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 16px rgba(26,43,53,0.06)' }}>
                <h3 className="font-display font-semibold text-xl sm:text-2xl mb-5" style={{ color: 'var(--color-text-dark)' }}>Contact Information</h3>
                <div className="space-y-4">
                  {[
                    {
                      icon: MapPin,
                      title: 'Address',
                      content: (
                        <>
                          <p className="font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>Geethika Digital World<br />Hyderabad, Telangana<br />India</p>
                          <a href="https://maps.app.goo.gl/xWe5mszQAzkjj3iQA" target="_blank" rel="noopener noreferrer"
                            className="font-body text-sm font-medium transition-colors mt-1 inline-block" style={{ color: 'var(--color-teal-500)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-600)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-teal-500)'}
                          >View on Google Maps →</a>
                        </>
                      )
                    },
                    {
                      icon: Phone,
                      title: 'Phone',
                      content: (
                        <>
                          <p className="font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>+91 94926 86421</p>
                          <button onClick={handleCall}
                            className="font-body text-sm font-medium mt-1 transition-colors" style={{ color: 'var(--color-teal-500)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-600)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-teal-500)'}
                          >Call Now</button>
                        </>
                      )
                    },
                    {
                      icon: Mail,
                      title: 'Email',
                      content: <p className="font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>geethikaphotoplanet9@gmail.com</p>
                    },
                    {
                      icon: Clock,
                      title: 'Business Hours',
                      content: (
                        <p className="font-body text-sm" style={{ color: 'var(--color-text-mid)' }}>
                          Monday – Saturday: 10:00 AM – 8:00 PM<br />Sunday: 11:00 AM – 6:00 PM
                        </p>
                      )
                    },
                  ].map(({ icon: Icon, title, content }) => (
                    <div key={title} className="flex items-start space-x-4">
                      <div className="p-2.5 rounded-lg flex-shrink-0" style={{ backgroundColor: 'var(--color-teal-50)' }}>
                        <Icon className="w-5 h-5" style={{ color: 'var(--color-teal-500)' }} />
                      </div>
                      <div>
                        <h4 className="font-body font-semibold text-sm mb-0.5" style={{ color: 'var(--color-text-dark)' }}>{title}</h4>
                        {content}
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleWhatsApp}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-3.5 rounded-xl font-body font-semibold flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg uppercase tracking-widest text-sm"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>

              {/* Special Offers Card */}
              <div className="bg-white rounded-xl border p-6 sm:p-8 shadow-sm" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 16px rgba(26,43,53,0.06)' }}>
                <h3 className="font-display font-semibold text-xl mb-4" style={{ color: 'var(--color-text-dark)' }}>Special Offers</h3>
                <div className="space-y-3">
                  {[
                    { emoji: '✨', title: 'Flat 20% OFF on all products', sub: 'Valid for limited time' },
                    { emoji: '📸', title: 'Free couple photoshoot with event booking', sub: 'Limited slots available' },
                  ].map(({ emoji, title, sub }) => (
                    <div key={title} className="p-4 rounded-xl border" style={{ backgroundColor: 'var(--color-teal-50)', borderColor: 'rgba(91,163,163,0.2)' }}>
                      <p className="font-body font-semibold text-sm mb-1" style={{ color: 'var(--color-teal-500)' }}>{emoji} {title}</p>
                      <p className="font-body text-xs" style={{ color: 'var(--color-text-mid)' }}>{sub}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Map */}
            <div className="bg-white rounded-xl border overflow-hidden shadow-sm" style={{ borderColor: 'rgba(168,213,213,0.35)', boxShadow: '0 2px 16px rgba(26,43,53,0.06)' }}>
              <div className="h-full min-h-[420px] sm:min-h-[500px] relative flex flex-col">
                <div className="flex-1">
                  <iframe
                    src="https://www.google.com/maps?q=17.4167,78.4833&hl=en&z=14&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: '360px' }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Geethika Digital World Location - Hyderabad"
                  />
                </div>
                <div className="p-4 border-t" style={{ borderColor: 'rgba(168,213,213,0.3)' }}>
                  <a
                    href="https://maps.app.goo.gl/xWe5mszQAzkjj3iQA"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center space-x-2 font-body font-semibold transition-colors text-sm"
                    style={{ color: 'var(--color-teal-500)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--color-teal-600)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--color-teal-500)'}
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutPage;
