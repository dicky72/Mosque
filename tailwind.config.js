/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(142.1 76.2% 36.3%)", // Green color
          foreground: "hsl(355.7 100% 97.3%)",
        },
        secondary: {
          DEFAULT: "hsl(60 54.0% 94.5%)", // Light gold
          foreground: "hsl(24 9.8% 10.0%)",
        },
        destructive: {
          DEFAULT: "hsl(0 84.2% 60.2%)",
          foreground: "hsl(60 9.1% 97.8%)",
        },
        muted: {
          DEFAULT: "hsl(60 4.8% 95.9%)",
          foreground: "hsl(25 5.3% 44.7%)",
        },
        accent: {
          DEFAULT: "hsl(60 4.8% 95.9%)",
          foreground: "hsl(24 9.8% 10.0%)",
        },
        popover: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(24 9.8% 10.0%)",
        },
        card: {
          DEFAULT: "hsl(0 0% 100%)",
          foreground: "hsl(24 9.8% 10.0%)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-in-up": {
          "0%": {
            opacity: 0,
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: 1,
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in-up": "fade-in-up 0.5s ease-out forwards",
      },
      utilities: {
        ".animation-delay-100": {
          "animation-delay": "100ms",
        },
        ".animation-delay-200": {
          "animation-delay": "200ms",
        },
        ".animation-delay-300": {
          "animation-delay": "300ms",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}

