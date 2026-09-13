import { Link } from 'react-router-dom'
import { Bus, MapPin, Phone, Mail, Facebook, Twitter, Instagram, Heart } from 'lucide-react'
import './Footer.css'

function Footer() {
  const quickLinks = [
    { to: '/', label: 'Home' },
    { to: '/buses', label: 'Find Buses' },
    { to: '/my-bookings', label: 'My Bookings' },
  ]

  const popularRoutes = [
    'Chennai → Madurai',
    'Chennai → Coimbatore',
    'Chennai → Bangalore',
    'Chennai → Kochi',
    'Bangalore → Chennai',
    'Chennai → Tirupati',
  ]

  return (
    <footer className="footer">
      {/* Gold divider line */}
      <div className="footer-divider" />

      <div className="footer-main container">
        {/* Brand */}
        <div className="footer-brand">
          <div className="footer-logo">
            <span className="footer-logo-icon"><Bus size={20} /></span>
            <span className="footer-logo-text">SOLAN BUS BOOKING</span>
          </div>
          <p className="footer-tagline">
            Connecting Tamil Nadu, Kerala, Karnataka, Andhra Pradesh &amp; Telangana with comfortable and reliable bus services.
          </p>
          <div className="demo-pill" style={{ marginTop: '0.8rem', alignSelf: 'flex-start' }}>
            <span>Demo Travel Booking System</span>
          </div>
          <div className="footer-socials">
            <a href="#" id="footer-facebook" aria-label="Facebook"><Facebook size={17} /></a>
            <a href="#" id="footer-twitter"  aria-label="Twitter"><Twitter  size={17} /></a>
            <a href="#" id="footer-instagram" aria-label="Instagram"><Instagram size={17} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-list">
            {quickLinks.map(({ to, label }) => (
              <li key={to}><Link to={to} className="footer-link">{label}</Link></li>
            ))}
          </ul>
        </div>

        {/* Popular Routes */}
        <div className="footer-col">
          <h4 className="footer-heading">Popular Routes</h4>
          <ul className="footer-list">
            {popularRoutes.map(route => {
              const [from, to] = route.split(' → ')
              return (
                <li key={route}>
                  <Link to={`/buses?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`} className="footer-link">
                    <MapPin size={12} style={{ display:'inline', marginRight:'4px', verticalAlign:'middle' }} />
                    {route}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Contact */}
        <div className="footer-col">
          <h4 className="footer-heading">South India Hub</h4>
          <ul className="footer-list footer-contact">
            <li><Phone size={14} /><span>+91 94440 12345 (Helpline)</span></li>
            <li><Mail size={14} /><span>support@solanbusbooking.in</span></li>
            <li><MapPin size={14} /><span>CMBT, Koyambedu, Chennai, Tamil Nadu</span></li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {new Date().getFullYear()} Solan Bus Booking — South India Express. Demo / College Mini Project.</span>
          <span className="footer-made">
            Made with <Heart size={12} style={{ color:'#e44', display:'inline', verticalAlign:'middle' }} /> for South Indian Travelers
          </span>
        </div>
      </div>
    </footer>
  )
}

export default Footer
