import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { ShoppingCart, Package, Menu, X, LogOut } from 'lucide-react'
import logoSvg from '../assets/logo.svg'

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth()
  const { cartCount, cartTotal } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  const navLinks = user
    ? isAdmin()
      ? [
        { path: '/admin', label: 'Dashboard' },
        { path: '/admin/orders', label: 'Orders' },
        { path: '/admin/inventory', label: 'Inventory' },
      ]
      : [
        { path: '/dashboard', label: 'Browse' },
        { path: '/customize', label: 'Customize' },
        { path: '/orders', label: 'My Orders' },
      ]
    : [
      { path: '/', label: 'Home' },
      { path: '/register', label: 'Register' },
    ]

  function handleLogout() {
    setMenuOpen(false)
    logout()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[1000] h-[68px] flex items-center px-[clamp(16px,4vw,40px)] gap-2"
      style={{
        background: 'hsla(260, 87%, 3%, 0.85)',
        backdropFilter: 'blur(28px) saturate(180%)',
        WebkitBackdropFilter: 'blur(28px) saturate(180%)',
        borderBottom: '1px solid hsla(0,0%,100%,0.06)',
        boxShadow: '0 2px 20px hsla(0,0%,0%,0.3)',
      }}>

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 no-underline mr-auto shrink-0">
        <img src={logoSvg} alt="Midnight Slice" className="w-8 h-8" />
        <span style={{
          fontFamily: "'Syne',sans-serif",
          fontWeight: 800, fontSize: '1.2rem',
          background: 'linear-gradient(135deg, hsl(262,83%,58%), hsl(280,80%,70%))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          Midnight Slice
        </span>
      </Link>

      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-1">
        {navLinks.map(link => (
          <Link key={link.path} to={link.path} style={{
            padding: '8px 16px',
            borderRadius: 50,
            fontWeight: 500,
            fontSize: '0.9rem',
            textDecoration: 'none',
            color: isActive(link.path) ? 'hsl(262,83%,68%)' : 'hsl(0,0%,70%)',
            background: isActive(link.path) ? 'hsla(262,83%,58%,0.1)' : 'transparent',
            border: isActive(link.path) ? '1px solid hsla(262,83%,58%,0.2)' : '1px solid transparent',
            transition: 'all 0.25s',
            whiteSpace: 'nowrap',
          }}>
            {link.label}
          </Link>
        ))}

        {/* Cart & Orders for logged-in users */}
        {user && !isAdmin() && (
          <>
            <Link to="/orders" className="btn-icon ml-1" title="My Orders">
              <Package size={18} />
            </Link>
            <Link to="/checkout" className="flex items-center gap-2 ml-1 px-4 py-2 rounded-full text-white text-sm font-bold no-underline transition-all"
              style={{
                background: 'linear-gradient(135deg, hsl(262,83%,58%), hsl(262,83%,48%))',
                boxShadow: '0 4px 12px hsla(262,83%,58%,0.25)',
              }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <ShoppingCart size={16} /> {cartCount > 0 ? `${cartCount} • ₹${cartTotal}` : 'Cart'}
            </Link>
          </>
        )}
      </div>

      {/* Auth */}
      <div className="hidden md:flex items-center gap-2.5 ml-2">
        {user ? (
          <>
            <div className="w-[34px] h-[34px] rounded-full flex items-center justify-center font-bold text-sm text-white shrink-0"
              style={{
                background: 'linear-gradient(135deg, hsl(262,83%,58%), hsl(280,80%,70%))',
                boxShadow: '0 2px 10px hsla(262,83%,58%,0.3)',
              }}>
              {user.role === 'admin' ? 'A' : 'U'}
            </div>
            <button className="btn-glass" style={{ padding: '8px 18px', fontSize: '0.85rem' }} onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className="btn-outline" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Sign In</button>
            </Link>
            <Link to="/register">
              <button className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>Get Started</button>
            </Link>
          </>
        )}
      </div>

      {/* Mobile Toggle */}
      <button className="md:hidden btn-icon" onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="absolute top-[68px] left-0 right-0 p-4 flex flex-col gap-2 md:hidden liquid-glass rounded-b-2xl"
          style={{ background: 'hsla(260,87%,3%,0.95)' }}>
          {navLinks.map(link => (
            <Link key={link.path} to={link.path} onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 rounded-xl text-sm font-medium transition-all"
              style={{
                color: isActive(link.path) ? 'hsl(262,83%,68%)' : 'hsl(0,0%,70%)',
                background: isActive(link.path) ? 'hsla(262,83%,58%,0.1)' : 'transparent',
              }}>
              {link.label}
            </Link>
          ))}
          {user ? (
            <button className="btn-glass w-full justify-center mt-2" onClick={handleLogout}>
              <LogOut size={14} /> Logout
            </button>
          ) : (
            <div className="flex gap-2 mt-2">
              <Link to="/login" className="flex-1" onClick={() => setMenuOpen(false)}>
                <button className="btn-outline w-full justify-center">Sign In</button>
              </Link>
              <Link to="/register" className="flex-1" onClick={() => setMenuOpen(false)}>
                <button className="btn-primary w-full justify-center">Get Started</button>
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Gradient Divider */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px]"
        style={{ background: 'linear-gradient(90deg, transparent, hsla(262,83%,58%,0.3), transparent)' }} />
    </nav>
  )
}
