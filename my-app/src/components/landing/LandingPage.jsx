import {
  ArrowRight,
  CheckCircle,
  Users,
  Target,
  Eye,
  Sparkles,
  Star,
} from "lucide-react";
import { Button } from "../ui/button";
import { GlassCard } from "../ui/glass-card";
import { Badge } from "../ui/badge";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { useTheme } from "../../hooks/useTheme";

export function LandingPage({ onGetStarted }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Theme-aware colors
  const textColor = isDark ? "#fff" : "#1a1040";
  const mutedText = isDark ? "rgba(255,255,255,0.7)" : "rgba(26,16,64,0.6)";
  const subtleText = isDark ? "rgba(255,255,255,0.6)" : "rgba(26,16,64,0.45)";
  const cardBg = isDark ? "rgba(255,255,255,0.06)" : "rgba(255,255,255,0.55)";
  const cardBorder = isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.5)";
  const cardHoverBg = isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.7)";
  const cardHoverBorder = isDark ? "rgba(255,255,255,0.25)" : "rgba(124,58,237,0.2)";

  const bgGradient = isDark
    ? "linear-gradient(135deg, #1e1b4b 0%, #4c1d95 40%, #831843 100%)"
    : "linear-gradient(135deg, #f0ecff 0%, #ede9fe 25%, #fce7f3 50%, #e8e0ff 75%, #f5f3ff 100%)";

  const orbColor1 = isDark ? "rgba(124, 58, 237, 0.3)" : "rgba(124, 58, 237, 0.12)";
  const orbColor2 = isDark ? "rgba(236, 72, 153, 0.25)" : "rgba(236, 72, 153, 0.1)";
  const orbColor3 = isDark ? "rgba(245, 158, 11, 0.2)" : "rgba(245, 158, 11, 0.08)";

  const features = [
    {
      icon: Target,
      title: "Milestone Tracking",
      description:
        "Break down projects into manageable milestones and track progress in real-time.",
      gradient: "linear-gradient(135deg, #7C3AED, #EC4899)",
    },
    {
      icon: Eye,
      title: "Public Portfolios",
      description:
        "Showcase your best work with recruiter-friendly public portfolios.",
      gradient: "linear-gradient(135deg, #EC4899, #F59E0B)",
    },
    {
      icon: Users,
      title: "Faculty Dashboard",
      description:
        "Teachers can monitor student progress and provide timely feedback.",
      gradient: "linear-gradient(135deg, #06B6D4, #7C3AED)",
    },
    {
      icon: CheckCircle,
      title: "Media Uploads",
      description:
        "Upload images, videos, and documents to showcase your projects.",
      gradient: "linear-gradient(135deg, #F59E0B, #EF4444)",
    },
  ];

  const testimonials = [
    {
      name: "Rahul Chowdary",
      role: "Computer Science Student",
      content:
        "ProTrackr helped me organize my projects and made it easy to share my work with potential employers.",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Dr. Praveen Kumar",
      role: "Faculty, CS Department",
      content:
        "The faculty dashboard gives me great visibility into student progress. I can provide feedback right when it's needed.",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Samson Jaya Raju",
      role: "UI/UX Design Student",
      content:
        "The portfolio feature helped me land my dream internship. Recruiters love the clean, professional presentation.",
      avatar:
        "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&h=150&fit=crop&crop=face",
    },
  ];

  const stats = [
    { value: "10K+", label: "Students" },
    { value: "25K+", label: "Projects" },
    { value: "500+", label: "Faculty" },
    { value: "98%", label: "Satisfaction" },
  ];

  return (
    <div
      style={{
        background: bgGradient,
        minHeight: "100vh",
        position: "relative",
        overflow: "hidden",
        transition: "background 0.5s ease",
      }}
    >
      {/* Animated Background Orbs */}
      <div
        className="orb-float-1"
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: 600,
          height: 600,
          background: orbColor1,
          borderRadius: "50%",
          filter: "blur(120px)",
        }}
      />
      <div
        className="orb-float-2"
        style={{
          position: "absolute",
          top: "40%",
          right: "-15%",
          width: 500,
          height: 500,
          background: orbColor2,
          borderRadius: "50%",
          filter: "blur(100px)",
        }}
      />
      <div
        className="orb-float-3"
        style={{
          position: "absolute",
          bottom: "-10%",
          left: "30%",
          width: 400,
          height: 400,
          background: orbColor3,
          borderRadius: "50%",
          filter: "blur(80px)",
        }}
      />

      {/* Navigation */}
      <nav
        style={{ position: "relative", zIndex: 10 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="logo-pulse"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 8px 24px rgba(124, 58, 237, 0.4)",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 700, fontSize: 18 }}>P</span>
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: textColor }}>
              ProTrackr
            </span>
          </div>
          <Button
            onClick={onGetStarted}
            style={{
              background: isDark ? "rgba(255,255,255,0.1)" : "rgba(124,58,237,0.08)",
              backdropFilter: "blur(8px)",
              border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(124,58,237,0.15)",
              color: textColor,
            }}
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <div style={{ position: "relative", zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-16">
          <div className="text-center">
            {/* Pill Badge */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "8px 20px",
                borderRadius: 9999,
                background: isDark ? "rgba(255,255,255,0.1)" : "rgba(124,58,237,0.08)",
                backdropFilter: "blur(8px)",
                border: isDark ? "1px solid rgba(255,255,255,0.2)" : "1px solid rgba(124,58,237,0.12)",
                marginBottom: 32,
              }}
            >
              <Sparkles style={{ width: 16, height: 16, color: "#FBBF24", marginRight: 8 }} />
              <span style={{ fontSize: 14, color: isDark ? "rgba(255,255,255,0.9)" : "rgba(26,16,64,0.7)" }}>
                Now with AI-powered insights
              </span>
            </div>

            {/* Hero Text */}
            <h1
              style={{
                fontSize: "clamp(3rem, 6vw, 4.5rem)",
                fontWeight: 800,
                color: textColor,
                marginBottom: 24,
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Track Progress.
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #A78BFA, #EC4899, #FBBF24)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Showcase Success.
              </span>
            </h1>

            <p
              style={{
                fontSize: 20,
                color: mutedText,
                marginBottom: 40,
                maxWidth: 640,
                marginLeft: "auto",
                marginRight: "auto",
                lineHeight: 1.6,
              }}
            >
              The ultimate platform for students to manage projects, track
              milestones, and create stunning portfolios that get noticed by
              recruiters.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center" style={{ marginBottom: 48 }}>
              <Button
                size="lg"
                onClick={onGetStarted}
                className="create-btn-shimmer"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                  color: "#fff",
                  fontSize: 18,
                  padding: "16px 32px",
                  height: "auto",
                  border: "none",
                  boxShadow: "0 12px 40px rgba(124, 58, 237, 0.4)",
                  cursor: "pointer",
                }}
              >
                Get Started Free
                <ArrowRight style={{ width: 20, height: 20, marginLeft: 8 }} />
              </Button>
            </div>

            {/* Stats Strip */}
            <div className="flex justify-center gap-8 flex-wrap" style={{ marginBottom: 64 }}>
              {stats.map((stat, i) => (
                <div key={i} className="text-center">
                  <p
                    style={{
                      fontSize: 30,
                      fontWeight: 700,
                      background: "linear-gradient(90deg, #A78BFA, #FBBF24)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {stat.value}
                  </p>
                  <p style={{ fontSize: 14, color: subtleText }}>
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            {/* Hero Image */}
            <div style={{ position: "relative", maxWidth: 896, margin: "0 auto" }}>
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(90deg, rgba(124,58,237,0.5), rgba(236,72,153,0.5))",
                  borderRadius: 20,
                  filter: "blur(20px)",
                  zIndex: -1,
                  transform: "scale(0.95)",
                }}
              />
              <div
                style={{
                  background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)",
                  backdropFilter: "blur(16px) saturate(180%)",
                  border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.6)",
                  borderRadius: 16,
                  padding: 6,
                  boxShadow: isDark
                    ? "0 24px 80px rgba(30, 27, 75, 0.5)"
                    : "0 24px 80px rgba(124, 58, 237, 0.08), 0 8px 24px rgba(0,0,0,0.06)",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden" }}>
                  <ImageWithFallback
                    src="https://images.unsplash.com/photo-1565687981296-535f09db714e?w=1200&h=675&fit=crop"
                    alt="ProTrackr Dashboard Preview"
                    className="w-full h-full object-cover"
                  />
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "linear-gradient(to top, rgba(30,27,75,0.7), transparent)",
                    }}
                  />
                  <div style={{ position: "absolute", bottom: 24, left: 24, color: "#fff" }}>
                    <p style={{ fontSize: 14, opacity: 0.9, fontWeight: 500 }}>
                      Student Dashboard Preview
                    </p>
                    <p style={{ fontSize: 12, opacity: 0.7 }}>
                      Real-time project tracking and portfolio management
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div
        style={{ position: "relative", zIndex: 10 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center" style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 16px",
              borderRadius: 9999,
              background: "linear-gradient(135deg, #7C3AED, #EC4899)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              boxShadow: "0 8px 24px rgba(124, 58, 237, 0.3)",
            }}
          >
            <Star style={{ width: 14, height: 14, marginRight: 6 }} />
            Features
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: textColor,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Everything you need to succeed
          </h2>
          <p style={{ fontSize: 20, color: mutedText, maxWidth: 640, margin: "0 auto" }}>
            From project planning to portfolio showcase, ProTrackr provides all
            the tools students and faculty need.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={index}
                style={{
                  background: cardBg,
                  backdropFilter: "blur(16px) saturate(180%)",
                  border: `1px solid ${cardBorder}`,
                  borderRadius: 16,
                  padding: 32,
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  cursor: "default",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-6px)";
                  e.currentTarget.style.borderColor = cardHoverBorder;
                  e.currentTarget.style.background = cardHoverBg;
                  e.currentTarget.style.boxShadow = "0 16px 48px rgba(124,58,237,0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.borderColor = cardBorder;
                  e.currentTarget.style.background = cardBg;
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <div
                  style={{
                    width: 56,
                    height: 56,
                    background: feature.gradient,
                    borderRadius: 16,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 24px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                  }}
                >
                  <Icon style={{ width: 28, height: 28, color: "#fff" }} />
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 600, color: textColor, marginBottom: 12 }}>
                  {feature.title}
                </h3>
                <p style={{ color: subtleText, lineHeight: 1.6, fontSize: 14 }}>
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Testimonials Section */}
      <div
        style={{ position: "relative", zIndex: 10 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div className="text-center" style={{ marginBottom: 64 }}>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 16px",
              borderRadius: 9999,
              background: "linear-gradient(135deg, #EC4899, #F59E0B)",
              color: "#fff",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 16,
              boxShadow: "0 8px 24px rgba(236, 72, 153, 0.3)",
            }}
          >
            Testimonials
          </div>
          <h2
            style={{
              fontSize: "clamp(2rem, 4vw, 3rem)",
              fontWeight: 700,
              color: textColor,
              marginBottom: 16,
              letterSpacing: "-0.02em",
            }}
          >
            Loved by students & faculty
          </h2>
          <p style={{ fontSize: 20, color: mutedText, maxWidth: 640, margin: "0 auto" }}>
            See what our users are saying about ProTrackr
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              style={{
                background: cardBg,
                backdropFilter: "blur(16px) saturate(180%)",
                border: `1px solid ${cardBorder}`,
                borderRadius: 16,
                padding: 32,
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-6px)";
                e.currentTarget.style.borderColor = cardHoverBorder;
                e.currentTarget.style.boxShadow = "0 16px 48px rgba(124,58,237,0.12)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.borderColor = cardBorder;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <div className="flex items-center gap-1" style={{ marginBottom: 16 }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    style={{
                      width: 16,
                      height: 16,
                      fill: "#FBBF24",
                      color: "#FBBF24",
                    }}
                  />
                ))}
              </div>
              <p style={{ color: isDark ? "rgba(255,255,255,0.85)" : "rgba(26,16,64,0.75)", marginBottom: 24, lineHeight: 1.6, fontStyle: "italic" }}>
                "{testimonial.content}"
              </p>

              <div className="flex items-center space-x-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: isDark ? "2px solid rgba(255,255,255,0.2)" : "2px solid rgba(124,58,237,0.15)",
                  }}
                />
                <div>
                  <p style={{ fontWeight: 600, color: textColor }}>{testimonial.name}</p>
                  <p style={{ fontSize: 14, color: subtleText }}>{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div
        style={{ position: "relative", zIndex: 10 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
      >
        <div style={{ position: "relative" }}>
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(90deg, rgba(124,58,237,0.4), rgba(236,72,153,0.4))",
              borderRadius: 24,
              filter: "blur(20px)",
              zIndex: -1,
            }}
          />
          <div
            style={{
              background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.6)",
              backdropFilter: "blur(20px) saturate(180%)",
              border: isDark ? "1px solid rgba(255,255,255,0.15)" : "1px solid rgba(255,255,255,0.5)",
              borderRadius: 24,
              padding: "64px 32px",
              textAlign: "center",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                fontWeight: 700,
                color: textColor,
                marginBottom: 16,
              }}
            >
              Ready to transform your project management?
            </h2>
            <p style={{ fontSize: 20, color: mutedText, marginBottom: 40, maxWidth: 640, margin: "0 auto 40px" }}>
              Join thousands of students and faculty already using ProTrackr to
              track progress and showcase success.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={onGetStarted}
                className="create-btn-shimmer"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                  color: "#fff",
                  fontSize: 18,
                  padding: "16px 32px",
                  height: "auto",
                  border: "none",
                  boxShadow: "0 12px 40px rgba(124, 58, 237, 0.4)",
                }}
              >
                Start Your Free Account
                <ArrowRight style={{ width: 20, height: 20, marginLeft: 8 }} />
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={() =>
                  window.open(
                    "https://mail.google.com/mail/?view=cm&fs=1&to=2400031291@kluniversity.in",
                    "_blank"
                  )
                }
                style={{
                  background: isDark ? "rgba(255,255,255,0.1)" : "rgba(124,58,237,0.06)",
                  color: textColor,
                  fontSize: 18,
                  padding: "16px 32px",
                  height: "auto",
                  border: isDark ? "1px solid rgba(255,255,255,0.3)" : "1px solid rgba(124,58,237,0.15)",
                  backdropFilter: "blur(8px)",
                }}
              >
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{
        position: "relative",
        zIndex: 10,
        borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(124,58,237,0.08)"
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2" style={{ marginBottom: 16 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    background: "linear-gradient(135deg, #7C3AED, #EC4899)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 12px rgba(124,58,237,0.3)",
                  }}
                >
                  <span style={{ color: "#fff", fontWeight: 700 }}>P</span>
                </div>
                <span style={{ fontSize: 20, fontWeight: 700, color: textColor }}>ProTrackr</span>
              </div>
              <p style={{ color: subtleText, fontSize: 14, lineHeight: 1.6 }}>
                Empowering students to track progress and showcase success.
              </p>
            </div>

            {[
              { title: "Product", links: ["Features", "Pricing", "Demo"] },
              { title: "Support", links: ["Help Center", "Contact", "Privacy"] },
              { title: "Company", links: ["About", "Blog", "Careers"] },
            ].map((section, i) => (
              <div key={i}>
                <h4 style={{ fontWeight: 600, color: textColor, marginBottom: 16 }}>{section.title}</h4>
                <ul style={{ listStyle: "none", padding: 0 }}>
                  {section.links.map((link, j) => (
                    <li key={j} style={{ marginBottom: 8 }}>
                      <a
                        href="#"
                        style={{
                          color: subtleText,
                          textDecoration: "none",
                          fontSize: 14,
                          transition: "color 0.2s",
                        }}
                        onMouseEnter={(e) => (e.target.style.color = textColor)}
                        onMouseLeave={(e) => (e.target.style.color = subtleText)}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div style={{
            borderTop: isDark ? "1px solid rgba(255,255,255,0.1)" : "1px solid rgba(124,58,237,0.08)",
            marginTop: 32,
            paddingTop: 32,
            textAlign: "center"
          }}>
            <p style={{ color: subtleText, fontSize: 14 }}>
              © 2025 ProTrackr. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
