import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import API from '../services/api'

export default function ResetPassword() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!password || !confirmPassword) {
      setError('Please fill in both password fields.')
      return
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      const res = await API.post(`/auth/reset-password/${token}`, { password })
      setSuccess(res.data?.message || 'Password reset successful.')
      setTimeout(() => navigate('/login'), 1600)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.')
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
            Reset Password
          </h1>
          <p style={{ color: '#6b7280' }}>Enter your new password.</p>
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
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: 'block',
                marginBottom: 7,
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#374151'
              }}>
                New Password
              </label>
              <input
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div style={{ marginBottom: 22 }}>
              <label style={{
                display: 'block',
                marginBottom: 7,
                fontWeight: 600,
                fontSize: '0.85rem',
                color: '#374151'
              }}>
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Re-enter your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="btn-primary"
              style={{ width: '100%', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}
              disabled={loading}
            >
              {loading ? 'Resetting...' : 'Reset Password ->'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 18, fontSize: '0.88rem', color: '#6b7280' }}>
            <Link to="/login" style={{ color: '#dc2626', fontWeight: 600 }}>Back to login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
