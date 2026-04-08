import { useState } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { GlassCard } from "../ui/glass-card"
import { useAuth } from "../../hooks/useAuth"
import { useTheme } from "../../hooks/useTheme"
import { Eye, EyeOff, Loader2, Sparkles, AlertCircle, CheckCircle2, ArrowLeft, Mail, KeyRound, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { userAPI } from "../../services/api"

export function LoginForm() {
  const { login, signup } = useAuth()
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Error state for inline error messages
  const [loginError, setLoginError] = useState("")
  const [signupError, setSignupError] = useState("")
  const [shakeLogin, setShakeLogin] = useState(false)
  const [shakeSignup, setShakeSignup] = useState(false)

  // Forgot password state
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotStep, setForgotStep] = useState(1) // 1=email, 2=new password, 3=success
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showNewPassword, setShowNewPassword] = useState(false)

  const [loginData, setLoginData] = useState({
    email: "",
    password: ""
  })

  const BTECH_BRANCHES = [
    "Computer Science and Engineering (CSE)",
    "Electronics and Communication Engineering (ECE)",
    "Electrical and Electronics Engineering (EEE)",
    "Mechanical Engineering (ME)",
    "Civil Engineering (CE)",
    "Information Technology (IT)",
    "Artificial Intelligence and Machine Learning (AI&ML)",
    "Data Science (DS)",
    "Cyber Security",
    "Computer Science and Business Systems (CSBS)"
  ]

  const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"]

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "student",
    department: "",
    year: ""
  })

  const triggerShake = (setter) => {
    setter(true)
    setTimeout(() => setter(false), 600)
  }

  const handleLogin = async e => {
    e.preventDefault()
    setLoginError("")
    setIsLoading(true)
    try {
      await login(loginData.email, loginData.password)
      toast.success("Welcome back!")
    } catch (error) {
      const msg = error.message || "Invalid credentials. Please check your email and password."
      setLoginError(msg)
      triggerShake(setShakeLogin)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async e => {
    e.preventDefault()
    setSignupError("")
    if (signupData.password !== signupData.confirmPassword) {
      setSignupError("Passwords don't match")
      triggerShake(setShakeSignup)
      toast.error("Passwords don't match")
      return
    }
    if (signupData.password.length < 8) {
      setSignupError("Password must be at least 8 characters")
      triggerShake(setShakeSignup)
      toast.error("Password must be at least 8 characters")
      return
    }
    setIsLoading(true)
    try {
      await signup(signupData.name, signupData.email, signupData.password, signupData.role, signupData.department, signupData.year)
      toast.success("Account created successfully!")
    } catch (error) {
      const msg = error.message || "An error occurred. Please try again."
      setSignupError(msg)
      triggerShake(setShakeSignup)
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  // Forgot password handlers
  const handleForgotPasswordOpen = () => {
    setShowForgotPassword(true)
    setForgotStep(1)
    setForgotEmail("")
    setForgotError("")
    setNewPassword("")
    setConfirmNewPassword("")
  }

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false)
    setForgotStep(1)
    setForgotEmail("")
    setForgotError("")
    setNewPassword("")
    setConfirmNewPassword("")
  }

  const handleVerifyEmail = async (e) => {
    e.preventDefault()
    setForgotError("")
    if (!forgotEmail.trim()) {
      setForgotError("Please enter your email address.")
      return
    }
    setForgotLoading(true)
    try {
      const response = await userAPI.forgotPassword(forgotEmail)
      if (response.success) {
        setForgotStep(2)
      }
    } catch (error) {
      setForgotError(error.response?.data?.message || "No account found with this email address.")
    } finally {
      setForgotLoading(false)
    }
  }

  const handleResetPassword = async (e) => {
    e.preventDefault()
    setForgotError("")
    if (newPassword.length < 8) {
      setForgotError("Password must be at least 8 characters.")
      return
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError("Passwords do not match.")
      return
    }
    setForgotLoading(true)
    try {
      const response = await userAPI.resetPassword(forgotEmail, newPassword)
      if (response.success) {
        setForgotStep(3)
        toast.success("Password reset successfully!")
      }
    } catch (error) {
      setForgotError(error.response?.data?.message || "Failed to reset password. Please try again.")
    } finally {
      setForgotLoading(false)
    }
  }

  // Theme-aware colors
  const textColor = isDark ? '#fff' : '#1a1040'
  const mutedText = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(26,16,64,0.5)'
  const labelColor = isDark ? 'rgba(255,255,255,0.8)' : 'rgba(26,16,64,0.75)'

  const bgGradient = isDark
    ? 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #831843 100%)'
    : 'linear-gradient(135deg, #f0ecff 0%, #e8e0ff 30%, #fce7f3 60%, #f5f3ff 100%)'

  const cardBg = isDark
    ? 'rgba(255,255,255,0.07)'
    : 'rgba(255,255,255,0.65)'
  const cardBorder = isDark
    ? '1px solid rgba(255,255,255,0.12)'
    : '1px solid rgba(255,255,255,0.6)'
  const cardShadow = isDark
    ? '0 24px 80px rgba(30, 27, 75, 0.5)'
    : '0 24px 80px rgba(124, 58, 237, 0.08), 0 8px 24px rgba(0,0,0,0.06)'

  const inputStyle = {
    background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.04)',
    border: isDark ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(124,58,237,0.12)',
    backdropFilter: 'blur(8px)',
    color: textColor,
    borderRadius: 10,
    padding: '10px 14px',
    width: '100%',
    fontSize: 14,
    outline: 'none',
    transition: 'all 0.3s ease',
  }

  const inputErrorStyle = {
    ...inputStyle,
    border: '1px solid rgba(239, 68, 68, 0.7)',
    boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.15)',
  }

  const labelStyle = {
    color: labelColor,
    fontSize: 14,
    fontWeight: 500,
    marginBottom: 6,
    display: 'block',
  }

  const orbColor1 = isDark ? 'rgba(124, 58, 237, 0.3)' : 'rgba(124, 58, 237, 0.15)'
  const orbColor2 = isDark ? 'rgba(236, 72, 153, 0.25)' : 'rgba(236, 72, 153, 0.12)'

  // Error message component
  const ErrorMessage = ({ message }) => {
    if (!message) return null
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        background: isDark ? 'rgba(239, 68, 68, 0.15)' : 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: 10,
        animation: 'errorSlideIn 0.3s ease-out',
      }}>
        <AlertCircle style={{ width: 16, height: 16, color: '#EF4444', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#EF4444', fontWeight: 500 }}>{message}</span>
      </div>
    )
  }

  // Success message component
  const SuccessMessage = ({ message }) => {
    if (!message) return null
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 14px',
        background: isDark ? 'rgba(34, 197, 94, 0.15)' : 'rgba(34, 197, 94, 0.08)',
        border: '1px solid rgba(34, 197, 94, 0.3)',
        borderRadius: 10,
        animation: 'errorSlideIn 0.3s ease-out',
      }}>
        <CheckCircle2 style={{ width: 16, height: 16, color: '#22C55E', flexShrink: 0 }} />
        <span style={{ fontSize: 13, color: '#22C55E', fontWeight: 500 }}>{message}</span>
      </div>
    )
  }

  // Forgot Password Modal
  const renderForgotPasswordModal = () => {
    if (!showForgotPassword) return null

    return (
      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        animation: 'modalFadeIn 0.3s ease-out',
      }}>
        {/* Backdrop */}
        <div
          onClick={handleForgotPasswordClose}
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(8px)',
          }}
        />

        {/* Modal content */}
        <div style={{
          position: 'relative',
          zIndex: 101,
          background: isDark ? 'rgba(30, 27, 75, 0.95)' : 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(24px) saturate(180%)',
          WebkitBackdropFilter: 'blur(24px) saturate(180%)',
          border: cardBorder,
          borderRadius: 20,
          boxShadow: isDark ? '0 24px 80px rgba(0,0,0,0.6)' : '0 24px 80px rgba(124, 58, 237, 0.15)',
          padding: 32,
          width: '100%',
          maxWidth: 400,
          animation: 'modalSlideUp 0.3s ease-out',
        }}>
          {/* Step 1: Enter Email */}
          {forgotStep === 1 && (
            <form onSubmit={handleVerifyEmail} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
                }}>
                  <Mail style={{ width: 24, height: 24, color: '#fff' }} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: textColor, marginBottom: 6 }}>
                  Forgot Password?
                </h2>
                <p style={{ fontSize: 13, color: mutedText, lineHeight: 1.5 }}>
                  Enter the email address associated with your account and we'll verify it for you.
                </p>
              </div>

              <div>
                <label style={labelStyle} htmlFor="forgot-email">Email Address</label>
                <input
                  id="forgot-email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={forgotEmail}
                  onChange={e => { setForgotEmail(e.target.value); setForgotError("") }}
                  required
                  autoFocus
                  className="search-input-glow"
                  style={forgotError ? inputErrorStyle : inputStyle}
                />
              </div>

              {forgotError && <ErrorMessage message={forgotError} />}

              <button
                type="submit"
                disabled={forgotLoading}
                className="create-btn-shimmer"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: forgotLoading ? 'not-allowed' : 'pointer',
                  opacity: forgotLoading ? 0.7 : 1,
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                }}
              >
                {forgotLoading ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                    Verifying...
                  </>
                ) : (
                  <>
                    <Mail style={{ width: 16, height: 16 }} />
                    Verify Email
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleForgotPasswordClose}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  color: '#A78BFA',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Back to Sign In
              </button>
            </form>
          )}

          {/* Step 2: Enter New Password */}
          {forgotStep === 2 && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{
                  width: 56,
                  height: 56,
                  borderRadius: 16,
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
                }}>
                  <KeyRound style={{ width: 24, height: 24, color: '#fff' }} />
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: textColor, marginBottom: 6 }}>
                  Reset Password
                </h2>
                <p style={{ fontSize: 13, color: mutedText, lineHeight: 1.5 }}>
                  Email verified! Create a new password for <strong style={{ color: '#A78BFA' }}>{forgotEmail}</strong>
                </p>
              </div>

              <div>
                <label style={labelStyle} htmlFor="new-password">New Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="At least 8 characters"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setForgotError("") }}
                    required
                    autoFocus
                    className="search-input-glow"
                    style={{ ...(forgotError ? inputErrorStyle : inputStyle), paddingRight: 40 }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{
                      position: 'absolute',
                      right: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26,16,64,0.4)',
                      cursor: 'pointer',
                      padding: 4,
                    }}
                  >
                    {showNewPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={labelStyle} htmlFor="confirm-new-password">Confirm New Password</label>
                <input
                  id="confirm-new-password"
                  type="password"
                  placeholder="Re-enter your new password"
                  value={confirmNewPassword}
                  onChange={e => { setConfirmNewPassword(e.target.value); setForgotError("") }}
                  required
                  className="search-input-glow"
                  style={forgotError ? inputErrorStyle : inputStyle}
                />
              </div>

              {forgotError && <ErrorMessage message={forgotError} />}

              <button
                type="submit"
                disabled={forgotLoading}
                className="create-btn-shimmer"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: forgotLoading ? 'not-allowed' : 'pointer',
                  opacity: forgotLoading ? 0.7 : 1,
                  boxShadow: '0 8px 32px rgba(124, 58, 237, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                }}
              >
                {forgotLoading ? (
                  <>
                    <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                    Resetting...
                  </>
                ) : (
                  <>
                    <KeyRound style={{ width: 16, height: 16 }} />
                    Reset Password
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setForgotStep(1); setForgotError("") }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  background: 'none',
                  border: 'none',
                  color: '#A78BFA',
                  fontSize: 14,
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                <ArrowLeft style={{ width: 14, height: 14 }} />
                Use a different email
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {forgotStep === 3 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center', textAlign: 'center' }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.4)',
                animation: 'successPop 0.5s ease-out',
              }}>
                <ShieldCheck style={{ width: 28, height: 28, color: '#fff' }} />
              </div>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: textColor, marginBottom: 6 }}>
                  Password Reset!
                </h2>
                <p style={{ fontSize: 13, color: mutedText, lineHeight: 1.6 }}>
                  Your password has been reset successfully. You can now sign in with your new password.
                </p>
              </div>

              <button
                type="button"
                onClick={handleForgotPasswordClose}
                className="create-btn-shimmer"
                style={{
                  width: '100%',
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #22C55E, #16A34A)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontSize: 15,
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 8px 32px rgba(34, 197, 94, 0.35)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  transition: 'all 0.3s ease',
                }}
              >
                <Sparkles style={{ width: 16, height: 16 }} />
                Back to Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: bgGradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        position: 'relative',
        overflow: 'hidden',
        transition: 'background 0.5s ease',
      }}
    >
      {/* Background Orbs */}
      <div
        className="orb-float-1"
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-15%',
          width: 500,
          height: 500,
          background: orbColor1,
          borderRadius: '50%',
          filter: 'blur(120px)',
        }}
      />
      <div
        className="orb-float-2"
        style={{
          position: 'absolute',
          bottom: '-20%',
          right: '-15%',
          width: 500,
          height: 500,
          background: orbColor2,
          borderRadius: '50%',
          filter: 'blur(100px)',
        }}
      />

      <div style={{ position: 'relative', zIndex: 10, width: '100%', maxWidth: 420 }}>
        <div
          style={{
            background: cardBg,
            backdropFilter: 'blur(24px) saturate(180%)',
            WebkitBackdropFilter: 'blur(24px) saturate(180%)',
            border: cardBorder,
            borderRadius: 20,
            boxShadow: cardShadow,
            padding: 32,
            transition: 'all 0.3s ease',
          }}
        >
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <div className="flex items-center justify-center space-x-2" style={{ marginBottom: 16 }}>
              <div
                className="logo-pulse"
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)',
                }}
              >
                <span style={{ color: '#fff', fontWeight: 700, fontSize: 18 }}>P</span>
              </div>
              <span
                style={{
                  fontSize: 24,
                  fontWeight: 700,
                  background: 'linear-gradient(90deg, #A78BFA, #EC4899, #FBBF24)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                ProTrackr
              </span>
            </div>
            <p style={{ color: mutedText, fontSize: 14 }}>
              Track Progress. Showcase Success.
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList
              className="grid w-full grid-cols-2"
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(124,58,237,0.06)',
                backdropFilter: 'blur(8px)',
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(124,58,237,0.08)',
              }}
            >
              <TabsTrigger value="login" onClick={() => { setLoginError(""); setSignupError("") }}>Sign In</TabsTrigger>
              <TabsTrigger value="signup" onClick={() => { setLoginError(""); setSignupError("") }}>Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="mt-6">
              <form
                onSubmit={handleLogin}
                className={shakeLogin ? 'shake-animation' : ''}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {/* Inline error message for login */}
                {loginError && <ErrorMessage message={loginError} />}

                <div>
                  <label style={labelStyle} htmlFor="login-email">Email</label>
                  <input
                    id="login-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={loginData.email}
                    onChange={e => { setLoginData({ ...loginData, email: e.target.value }); setLoginError("") }}
                    required
                    className="search-input-glow"
                    style={loginError ? inputErrorStyle : inputStyle}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label style={labelStyle} htmlFor="login-password">Password</label>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#A78BFA',
                        fontSize: 13,
                        cursor: 'pointer',
                        marginBottom: 6,
                        fontWeight: 500,
                        transition: 'color 0.2s ease',
                      }}
                      onMouseEnter={e => e.target.style.color = '#C4B5FD'}
                      onMouseLeave={e => e.target.style.color = '#A78BFA'}
                      onClick={handleForgotPasswordOpen}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={e => { setLoginData({ ...loginData, password: e.target.value }); setLoginError("") }}
                      required
                      className="search-input-glow"
                      style={{ ...(loginError ? inputErrorStyle : inputStyle), paddingRight: 40 }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{
                        position: 'absolute',
                        right: 8,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(26,16,64,0.4)',
                        cursor: 'pointer',
                        padding: 4,
                      }}
                    >
                      {showPassword ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="create-btn-shimmer"
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    transition: 'all 0.3s ease',
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      Signing in...
                    </>
                  ) : (
                    <>
                      <Sparkles style={{ width: 16, height: 16 }} />
                      Sign In
                    </>
                  )}
                </button>
              </form>

              <div
                style={{
                  marginTop: 24,
                  padding: 16,
                  background: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(124,58,237,0.04)',
                  border: isDark ? '1px solid rgba(255,255,255,0.08)' : '1px solid rgba(124,58,237,0.08)',
                  borderRadius: 10,
                }}
              >
                <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 8, color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,16,64,0.6)' }}>
                  Test Accounts:
                </p>
                <div style={{ fontSize: 12, color: mutedText, lineHeight: 1.8 }}>
                  <p>Student: rahul@example.com / Password123</p>
                  <p>Faculty: praveen@example.edu / Password123</p>
                  <p>Admin: hari@example.edu / Password123</p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form
                onSubmit={handleSignup}
                className={shakeSignup ? 'shake-animation' : ''}
                style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
              >
                {/* Inline error message for signup */}
                {signupError && <ErrorMessage message={signupError} />}

                <div>
                  <label style={labelStyle} htmlFor="signup-name">Full Name</label>
                  <input
                    id="signup-name"
                    type="text"
                    placeholder="Your full name"
                    value={signupData.name}
                    onChange={e => { setSignupData({ ...signupData, name: e.target.value }); setSignupError("") }}
                    required
                    className="search-input-glow"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle} htmlFor="signup-email">Email</label>
                  <input
                    id="signup-email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={signupData.email}
                    onChange={e => { setSignupData({ ...signupData, email: e.target.value }); setSignupError("") }}
                    required
                    className="search-input-glow"
                    style={signupError && signupError.toLowerCase().includes('email') ? inputErrorStyle : inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Account Type</label>
                  <RadioGroup
                    value={signupData.role}
                    onValueChange={value => setSignupData({ ...signupData, role: value, department: '', year: '' })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="student" id="student" />
                      <Label htmlFor="student" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,16,64,0.65)' }}>Student</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="faculty" id="faculty" />
                      <Label htmlFor="faculty" style={{ color: isDark ? 'rgba(255,255,255,0.7)' : 'rgba(26,16,64,0.65)' }}>Faculty</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* Branch / Department Selector */}
                <div>
                  <label style={labelStyle} htmlFor="signup-department">
                    {signupData.role === 'student' ? 'Branch (B.Tech)' : 'Department'}
                  </label>
                  <select
                    id="signup-department"
                    value={signupData.department}
                    onChange={e => { setSignupData({ ...signupData, department: e.target.value }); setSignupError('') }}
                    required
                    style={{
                      ...inputStyle,
                      cursor: 'pointer',
                      appearance: 'none',
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${isDark ? '%23ffffff80' : '%231a104080'}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 12px center',
                      paddingRight: 36,
                    }}
                  >
                    <option value="" disabled>Select your {signupData.role === 'student' ? 'branch' : 'department'}</option>
                    {BTECH_BRANCHES.map(branch => (
                      <option key={branch} value={branch} style={{ color: '#1a1040', background: '#fff' }}>{branch}</option>
                    ))}
                  </select>
                </div>

                {/* Year Selector - Only for students */}
                {signupData.role === 'student' && (
                  <div>
                    <label style={labelStyle} htmlFor="signup-year">Year of Study</label>
                    <select
                      id="signup-year"
                      value={signupData.year}
                      onChange={e => { setSignupData({ ...signupData, year: e.target.value }); setSignupError('') }}
                      required
                      style={{
                        ...inputStyle,
                        cursor: 'pointer',
                        appearance: 'none',
                        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='${isDark ? '%23ffffff80' : '%231a104080'}' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        paddingRight: 36,
                      }}
                    >
                      <option value="" disabled>Select your year</option>
                      {YEARS.map(yr => (
                        <option key={yr} value={yr} style={{ color: '#1a1040', background: '#fff' }}>{yr}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label style={labelStyle} htmlFor="signup-password">Password</label>
                  <input
                    id="signup-password"
                    type="password"
                    placeholder="Create a password (min. 8 characters)"
                    value={signupData.password}
                    onChange={e => { setSignupData({ ...signupData, password: e.target.value }); setSignupError("") }}
                    required
                    className="search-input-glow"
                    style={signupError && signupError.toLowerCase().includes('password') ? inputErrorStyle : inputStyle}
                  />
                </div>

                <div>
                  <label style={labelStyle} htmlFor="signup-confirm">Confirm Password</label>
                  <input
                    id="signup-confirm"
                    type="password"
                    placeholder="Confirm your password"
                    value={signupData.confirmPassword}
                    onChange={e => { setSignupData({ ...signupData, confirmPassword: e.target.value }); setSignupError("") }}
                    required
                    className="search-input-glow"
                    style={signupError && signupError.toLowerCase().includes('match') ? inputErrorStyle : inputStyle}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="create-btn-shimmer"
                  style={{
                    width: '100%',
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 10,
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: isLoading ? 'not-allowed' : 'pointer',
                    opacity: isLoading ? 0.7 : 1,
                    boxShadow: '0 8px 32px rgba(124, 58, 237, 0.35)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}
                >
                  {isLoading ? (
                    <>
                      <Loader2 style={{ width: 16, height: 16, animation: 'spin 1s linear infinite' }} />
                      Creating account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </form>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {renderForgotPasswordModal()}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }

        .shake-animation {
          animation: shake 0.5s ease-in-out;
        }

        @keyframes errorSlideIn {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes modalFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalSlideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes successPop {
          0% { transform: scale(0); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
