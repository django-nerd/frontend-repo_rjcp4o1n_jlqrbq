import React, { useEffect, useRef, useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation, useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, ChevronRight, Phone, Star } from 'lucide-react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import Lottie from 'lottie-react'
import './index.css'

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, MotionPathPlugin)
}

const brand = {
  teal: '#1E708A',
  gold: '#D7A35E',
}

const services = [
  { key: 'home-cleaning', name: 'Home Cleaning', lottie: 'https://assets2.lottiefiles.com/packages/lf20_bhdsmd4n.json' },
  { key: 'car-washing', name: 'Car Washing', lottie: 'https://assets5.lottiefiles.com/private_files/lf30_gnifxq6a.json' },
  { key: 'food-delivery', name: 'Food Delivery', lottie: 'https://assets10.lottiefiles.com/packages/lf20_dyq7c7.json' },
  { key: 'doctor-appointment', name: 'Doctor Appointment', lottie: 'https://assets7.lottiefiles.com/packages/lf20_8xwzst.json' },
  { key: 'salon-booking', name: 'Salon Booking', lottie: 'https://assets1.lottiefiles.com/packages/lf20_mrcyvb.json' },
  { key: 'sports', name: 'Sports', lottie: 'https://assets2.lottiefiles.com/packages/lf20_vfnp3v.json' },
  { key: 'events', name: 'Events', lottie: 'https://assets4.lottiefiles.com/packages/lf20_rhnmhzwv.json' },
  { key: 'electrician', name: 'Electrician', lottie: 'https://assets1.lottiefiles.com/packages/lf20_5w6qj3.json' },
]

// Helper to load Lottie from URL
function LottieRemote({ src, className, loop = true, autoplay = true }) {
  const [data, setData] = useState(null)
  useEffect(() => {
    let mounted = true
    fetch(src)
      .then((r) => r.json())
      .then((json) => { if (mounted) setData(json) })
      .catch(() => {})
    return () => { mounted = false }
  }, [src])
  if (!data) return <div className={className} />
  return <Lottie animationData={data} loop={loop} autoplay={autoplay} className={className} />
}

function usePageViews() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [pathname])
}

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}

function Header() {
  const headerRef = useRef(null)
  useEffect(() => {
    const el = headerRef.current
    let last = 0
    const onScroll = () => {
      const y = window.scrollY
      const diff = y - last
      if (y > 80 && diff > 0) el?.classList.add('-translate-y-full')
      else el?.classList.remove('-translate-y-full')
      last = y
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header ref={headerRef} className="sticky top-0 z-40 backdrop-blur bg-white/70 transition-transform">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl" style={{ background: brand.teal }} />
          <span className="font-semibold tracking-tight" style={{ color: brand.teal }}>Local Konnect</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/testimonials">Testimonials</NavLink>
          <NavLink to="/download">Download App</NavLink>
        </nav>
        <button className="md:hidden p-2 rounded-lg border border-gray-200"><Menu size={20} /></button>
      </div>
    </header>
  )
}

function NavLink({ to, children }) {
  return (
    <Link to={to} className="text-sm text-gray-700 hover:text-gray-900 transition-colors">
      {children}
    </Link>
  )
}

function Hero() {
  const container = useRef(null)

  useEffect(() => {
    if (!container.current) return

    const ctx = gsap.context(() => {
      gsap.from('.hero-stagger', { opacity: 0, y: 20, duration: 0.8, stagger: 0.1, ease: 'power3.out' })

      const icons = gsap.utils.toArray('.orbit-icon')
      icons.forEach((icon, i) => {
        gsap.to(icon, {
          duration: 14 + i,
          repeat: -1,
          ease: 'none',
          motionPath: {
            path: '#orbit-path',
            align: '#orbit-path',
            autoRotate: false,
            alignOrigin: [0.5, 0.5],
          },
        })
      })

      const handleMove = (e) => {
        const rect = container.current.getBoundingClientRect()
        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height
        gsap.to('.parallax', { x: x * 20, y: y * 20, duration: 0.6, ease: 'power3.out' })
      }
      container.current.addEventListener('mousemove', handleMove)

      return () => container.current?.removeEventListener('mousemove', handleMove)
    }, container)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={container} className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl opacity-30" style={{ background: brand.teal }} />
        <div className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full blur-3xl opacity-20" style={{ background: brand.gold }} />
      </div>
      <div className="max-w-7xl mx-auto px-4 pt-16 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div className="parallax">
          <p className="hero-stagger text-sm font-medium" style={{ color: brand.teal }}>SERVICES ON-DEMAND</p>
          <h1 className="hero-stagger text-4xl md:text-6xl font-semibold tracking-tight leading-tight mt-3">
            Get anything done in your city
          </h1>
          <p className="hero-stagger text-gray-600 mt-4 max-w-xl">
            Book trusted professionals for home, health, and everyday needs. Premium experience, local convenience.
          </p>

          <div className="hero-stagger mt-6 flex items-center gap-3 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50">
              <Search size={18} className="text-gray-500" />
              <input placeholder="Search a service" className="bg-transparent outline-none text-sm" />
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <select className="px-3 py-2 bg-gray-50 rounded-xl text-sm outline-none">
              <option>Mumbai</option>
              <option>Delhi</option>
              <option>Bengaluru</option>
              <option>Pune</option>
            </select>
            <Link to="/categories" className="ml-auto px-4 py-2 rounded-xl text-white font-medium" style={{ background: brand.teal }}>
              Explore
            </Link>
          </div>

          <div className="hero-stagger mt-6 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1"><Star size={16} className="text-yellow-500" /> 4.9/5</div>
            <div>Trusted by 50k+ users</div>
          </div>
        </div>

        <div className="relative h-[420px] parallax">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600" fill="none">
            <path id="orbit-path" d="M 300 50 C 450 50 550 150 550 300 C 550 450 450 550 300 550 C 150 550 50 450 50 300 C 50 150 150 50 300 50 Z" stroke="#e5e7eb" />
          </svg>
          {services.slice(0,8).map((s) => (
            <div key={s.key} className="orbit-icon absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl bg-white shadow-lg border border-gray-100 flex items-center justify-center">
              <LottieRemote src={s.lottie} className="w-10 h-10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function Categories() {
  useEffect(() => {
    const cards = gsap.utils.toArray('.category-card')
    gsap.from(cards, { opacity: 0, y: 24, duration: 0.8, stagger: 0.08, ease: 'power3.out' })
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Popular Categories</h2>
      <p className="text-gray-600 mt-3">Tap a card to explore services near you.</p>

      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-10">
        {services.map((s) => (
          <Link key={s.key} to={`/service/${s.key}`} className="category-card group rounded-3xl p-5 bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 relative overflow-hidden">
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" style={{ background: 'linear-gradient(120deg, rgba(30,112,138,0.06), rgba(215,163,94,0.06))' }} />
            <div className="w-16 h-16 rounded-2xl border border-gray-100 bg-gray-50 flex items-center justify-center group-hover:rotate-3 transition-transform">
              <LottieRemote src={s.lottie} className="w-10 h-10" />
            </div>
            <h3 className="mt-4 font-medium">{s.name}</h3>
            <div className="mt-3 text-sm text-gray-600 flex items-center gap-1">
              Explore <ChevronRight size={16} />
            </div>
            <div className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-[#D7A35E] to-transparent opacity-0 group-hover:opacity-100" />
          </Link>
        ))}
      </div>
    </section>
  )
}

function ServiceDetails() {
  const { id } = useParams()
  const svc = services.find(s => s.key === id) || services[0]
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div className="rounded-3xl bg-gray-50 aspect-video flex items-center justify-center">
          <LottieRemote src={svc.lottie} className="w-48 h-48" />
        </div>
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">{svc.name}</h2>
          <p className="text-gray-600 mt-3">Deep cleaning by vetted professionals. Eco-safe supplies, punctual service, transparent pricing.</p>
          <div className="mt-6 flex items-center gap-3">
            <Link to="/book" className="px-5 py-3 rounded-xl text-white" style={{ background: brand.teal }}>Book now</Link>
            <button className="px-5 py-3 rounded-xl border" style={{ borderColor: brand.teal, color: brand.teal }}>View packages</button>
          </div>
          <ul className="mt-6 grid sm:grid-cols-2 gap-3 text-sm text-gray-700">
            <li className="flex items-center gap-2"><Phone size={16} /> 24x7 Support</li>
            <li className="flex items-center gap-2"><Star size={16} /> 4.9 Rated Pros</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function BookingFlow() {
  return (
    <section className="max-w-3xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold tracking-tight">Book your service</h2>
      <div className="mt-8 space-y-6">
        <div className="rounded-2xl border p-4">
          <h3 className="font-medium">Step 1: Select date & time</h3>
          <input type="date" className="mt-3 px-3 py-2 border rounded-lg" />
        </div>
        <div className="rounded-2xl border p-4">
          <h3 className="font-medium">Step 2: Address</h3>
          <input placeholder="Your address" className="mt-3 px-3 py-2 border rounded-lg w-full" />
        </div>
        <div className="rounded-2xl border p-4">
          <h3 className="font-medium">Step 3: Confirm</h3>
          <button className="mt-3 px-5 py-3 rounded-xl text-white" style={{ background: brand.teal }}>Confirm Booking</button>
        </div>
      </div>
    </section>
  )
}

function LoginOTP() {
  return (
    <section className="max-w-md mx-auto px-4 py-16">
      <h2 className="text-3xl font-semibold tracking-tight">Login with OTP</h2>
      <input placeholder="Phone number" className="mt-6 px-4 py-3 border rounded-xl w-full" />
      <button className="mt-4 px-5 py-3 rounded-xl text-white w-full" style={{ background: brand.teal }}>Send OTP</button>
    </section>
  )
}

function Testimonials() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Loved by locals</h2>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {[1,2,3].map((i) => (
          <div key={i} className="rounded-3xl border p-6 bg-white shadow-sm">
            <div className="flex items-center gap-2 text-yellow-500">
              {Array.from({ length: 5 }).map((_, j) => <Star key={j} size={16} fill="#F59E0B" color="#F59E0B" />)}
            </div>
            <p className="mt-4 text-gray-700">Amazing experience! booked in 2 taps and the pro arrived on time. Clean finish.</p>
            <div className="mt-4 text-sm text-gray-500">Mumbai</div>
          </div>
        ))}
      </div>
    </section>
  )
}

function DownloadApp() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16 grid md:grid-cols-2 gap-10 items-center">
      <div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Get the Local Konnect app</h2>
        <p className="text-gray-600 mt-3">Faster bookings, live tracking, rewards and more.</p>
        <div className="mt-6 flex items-center gap-3">
          <button className="px-5 py-3 rounded-xl text-white" style={{ background: brand.teal }}>App Store</button>
          <button className="px-5 py-3 rounded-xl border" style={{ borderColor: brand.teal, color: brand.teal }}>Play Store</button>
        </div>
      </div>
      <div className="relative h-96">
        <div className="absolute right-10 top-6 w-56 h-96 rounded-[2rem] bg-gradient-to-b from-gray-100 to-white shadow-2xl" />
        <div className="absolute right-0 top-0 w-56 h-96 rounded-[2rem] bg-gradient-to-b from-white to-gray-100 shadow-2xl" />
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="mt-20 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <div className="w-10 h-10 rounded-xl mb-3" style={{ background: brand.teal }} />
          <p className="text-gray-600">Premium services for every day, in every city.</p>
        </div>
        <div>
          <div className="font-medium mb-3">Company</div>
          <ul className="space-y-2 text-gray-600">
            <li>About</li>
            <li>Careers</li>
            <li>Help</li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Legal</div>
          <ul className="space-y-2 text-gray-600">
            <li>Terms</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div>
          <div className="font-medium mb-3">Get the app</div>
          <div className="flex gap-2">
            <div className="h-10 w-28 rounded-xl bg-black" />
            <div className="h-10 w-28 rounded-xl bg-black" />
          </div>
        </div>
      </div>
      <div className="py-6 text-center text-xs text-gray-500">© {new Date().getFullYear()} Local Konnect</div>
    </footer>
  )
}

function HomePage() {
  return (
    <>
      <Hero />
      <Categories />
      <DownloadApp />
      <Testimonials />
    </>
  )
}

function PageTransitions() {
  usePageViews()
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.35 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/service/:id" element={<ServiceDetails />} />
          <Route path="/book" element={<BookingFlow />} />
          <Route path="/login" element={<LoginOTP />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/download" element={<DownloadApp />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <PageTransitions />
      </Layout>
    </BrowserRouter>
  )
}
