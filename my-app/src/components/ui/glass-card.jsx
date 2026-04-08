import { cn } from "./utils";
import { useTheme } from "../../hooks/useTheme";

export function GlassCard({ children, className, variant = 'default', blur = 'md', glow = false, ...props }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg'
  };

  const darkStyle = {
    background: 'rgba(255, 255, 255, 0.06)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backdropFilter: 'blur(20px) saturate(180%)',
    WebkitBackdropFilter: 'blur(20px) saturate(180%)',
    boxShadow: glow
      ? '0 8px 32px rgba(124, 58, 237, 0.2), inset 0 1px 0 rgba(255,255,255,0.08)'
      : '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.06)',
  };

  const lightStyle = {
    background: 'rgba(255, 255, 255, 0.55)',
    border: '1px solid rgba(255, 255, 255, 0.6)',
    backdropFilter: 'blur(24px) saturate(200%)',
    WebkitBackdropFilter: 'blur(24px) saturate(200%)',
    boxShadow: glow
      ? '0 8px 32px rgba(124, 58, 237, 0.15), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.8)'
      : '0 8px 32px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8)',
  };

  return (
    <div
      className={cn(
        'rounded-2xl transition-all duration-300',
        blurClasses[blur],
        className
      )}
      style={isDark ? darkStyle : lightStyle}
      {...props}
    >
      {children}
    </div>
  );
}