const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

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
              backgroundColor: "rgb(250, 250, 250)",
              fontWeight: 400,
              padding: theme("p-1"),
              "&::before": undefined,
              "&::after": undefined,
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
