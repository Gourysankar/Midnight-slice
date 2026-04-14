import { useState } from 'react'
import { Link } from 'react-router-dom'
import API from '../services/api'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email) {
      setError('Please enter your email address.')
      return
    }

    setLoading(true)
    try {
      const res = await API.post('/auth/forgot-password', { email })
      setSuccess(res.data?.message || 'Password reset email sent.')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page-enter" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 20px'
    }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h1 style={{
            fontFamily: "'Syne',sans-serif",
            fontWeight: 800,
            fontSize: '2rem',
            color: '#111827',
            marginBottom: 8
          }}>
            Forgot Password
          </h1>
          <p style={{ color: '#6b7280' }}>Enter your email to receive a reset link.</p>
        </div>

        <div className="glass-card" style={{ padding: '34px 30px' }}>
          {error && (
            <div style={{
              background: 'rgba(220,38,38,0.07)',
              border: '1px solid rgba(220,38,38,0.22)',
              borderLeft: '4px solid #dc2626',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 18,
              color: '#dc2626',
              fontSize: '0.88rem',
              fontWeight: 500
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{
              background: 'rgba(5,150,105,0.07)',
              border: '1px solid rgba(5,150,105,0.24)',
              borderLeft: '4px solid #059669',
              borderRadius: 12,
              padding: '12px 16px',
              marginBottom: 18,
              color: '#065f46',
              fontSize: '0.88rem',
              fontWeight: 500
            }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 22 }}>
              <label style={{
                display: 'block',
                marginBottom: 7,
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#374151'
              }}>
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send Reset Link ->'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.88rem', color: '#6b7280' }}>
            Remembered your password?{' '}
            <Link to="/login" style={{ color: '#dc2626', fontWeight: 600 }}>Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
