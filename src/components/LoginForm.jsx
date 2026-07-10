import { useState } from 'react'
import './LoginForm.css'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateField(name, value) {
  switch (name) {
    case 'email':
      if (!value.trim()) return 'Email is required'
      if (!EMAIL_PATTERN.test(value.trim())) return 'Enter a valid email address'
      return ''
    case 'password':
      if (!value) return 'Password is required'
      if (value.length < 8) return 'Password must be at least 8 characters'
      if (!/[A-Z]/.test(value)) return 'Password must include an uppercase letter'
      if (!/[0-9]/.test(value)) return 'Password must include a number'
      return ''
    default:
      return ''
  }
}

function validateForm(values) {
  return {
    email: validateField('email', values.email),
    password: validateField('password', values.password),
  }
}

function LoginForm() {
  const [values, setValues] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({ email: '', password: '' })
  const [touched, setTouched] = useState({ email: false, password: false })
  const [submitStatus, setSubmitStatus] = useState(null)

  function handleChange(event) {
    const { name, value } = event.target
    const nextValues = { ...values, [name]: value }
    setValues(nextValues)

    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
    }

    if (submitStatus) setSubmitStatus(null)
  }

  function handleBlur(event) {
    const { name, value } = event.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }))
  }

  function handleSubmit(event) {
    event.preventDefault()

    const nextErrors = validateForm(values)
    setErrors(nextErrors)
    setTouched({ email: true, password: true })

    const hasErrors = Object.values(nextErrors).some(Boolean)
    if (hasErrors) {
      setSubmitStatus({ type: 'error', message: 'Fix the errors below to continue.' })
      return
    }

    setSubmitStatus({ type: 'success', message: 'Login successful!' })
  }

  return (
    <section className="login-page">
      <div className="login-card">
        <header className="login-header">
          <h1>Sign in</h1>
          <p>Enter your email and password to continue.</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p id="email-error" className="field-error" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          <div className="form-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? 'password-error' : undefined}
              placeholder="At least 8 characters"
            />
            {errors.password && (
              <p id="password-error" className="field-error" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          {submitStatus && (
            <p
              className={`form-status form-status--${submitStatus.type}`}
              role="status"
            >
              {submitStatus.message}
            </p>
          )}

          <button type="submit" className="login-submit">
            Sign in
          </button>
        </form>
      </div>
    </section>
  )
}

export default LoginForm
