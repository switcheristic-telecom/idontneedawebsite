import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        win: {
          bg: "#c0c0c0",
          titlebar: "#000080",
          "titlebar-inactive": "#808080",
          desktop: "#008080",
          text: "#000000",
          highlight: "#0a246a",
          "highlight-text": "#ffffff",
          border: {
            light: "#ffffff",
            dark: "#808080",
            darker: "#404040",
          },
        },
      },
      fontFamily: {
        win: ["Tahoma", "Verdana", "Arial", "sans-serif"],
      },
      fontSize: {
        win: ["11px", { lineHeight: "14px" }],
        "win-title": ["11px", { lineHeight: "14px", fontWeight: "700" }],
      },
    },
  },
  plugins: [],
} satisfies Config;
