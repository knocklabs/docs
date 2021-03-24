const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const { backgroundColor } = require("tailwindcss/defaultTheme");

module.exports = {
  purge: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./layouts/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        gray: colors.blueGray,
        brand: {
          light: "#F98576",
          DEFAULT: "#E95744",
          dark: "#B83D2D",
        },
        beige: {
          light: "#FFFBF5",
          DEFAULT: "#EEE6DA",
          dark: "#DACFBF",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            lineHeight: 1.5,

            a: {
              color: theme("colors.brand"),
              "&:hover": {
                color: theme("colors.brand.dark"),
              },
            },

            code: {
              backgroundColor: "rgba(135,131,120,0.15)",
              color: "#E95744", // TODO SS: now working through the theme helper
              fontWeight: 400,
              fontSize: "0.85rem",
              borderRadius: 3,
            },

            // Break out display + padding for code within paragraphs.
            "p code": {
              display: "inline-block",
              padding: "0em 0.4em",
            },

            // Break out display + padding for code within lists.
            "li code": {
              display: "inline",
              padding: "0.2em 0.4em",
            },

            // Need to separate these out otherwise typography plugin will override props placed in code {} above
            "code::before": {
              content: '""',
            },
            "code::after": {
              content: '""',
            },

            pre: {
              marginTop: 0,
              marginBottom: 0,
              borderRadius: 0,
            },
          },
        },
        sm: {
          css: {
            a: {
              color: theme("colors.brand"),
              "&:hover": {
                color: theme("colors.brand.dark"),
              },
            },

            pre: {
              marginTop: 0,
              marginBottom: 0,
              borderRadius: 0,
            },
          },
        },
      }),
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
