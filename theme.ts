// Copied over from knocklabs/control, with the following changes:
// (1) Removed global style customization
import { extendTheme, flexbox } from "@chakra-ui/react";

const colors = {
  brand: {
    // TODO: Add proper brand colors in here
    900: "#891E10",
    800: "#153e75",
    700: "#E4321B",
    600: "#E95744",
    500: "#E95744",
    400: "#E95744",
    300: "#EF8476",
    100: "#F4ADA4",
  },
  beige: {
    100: "#FFFBF5",
    500: "#EEE6DA",
    900: "#DACFBF",
  },
  functionBlue: "#5469D4",
  gray: {
    100: "#E4E8EE",
    200: "#DDDEE1",
    300: "#A5ACB8",
    400: "#9EA0AA",
    500: "#697386",
    600: "#515669",
    700: "#3C4257",
    800: "#3C4257",
    900: "#1A1F36",
  },
  red: {
    100: "#FAE3E2",
    200: "#F6CCCB",
    300: "#F0A9A7",
    400: "#E87975",
    500: "#DD514C",
    600: "#CB3A31",
    700: "#AA2D27",
    800: "#8D2723",
    900: "#752522",
  },
};

const fonts = {
  body: "Inter, system-ui, sans-serif",
  heading: "Inter, system-ui, sans-serif",
};

const fontSizes = {
  xs: "0.75rem",
  sm: "0.875rem",
  md: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "1.75rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
  "6xl": "3.75rem",
  "7xl": "4.5rem",
  "8xl": "6rem",
  "9xl": "8rem",
};

const textStyles = {
  formLabel: {
    fontWeight: "semibold",
    fontSize: "14px",
    lineHeight: "20px",
  },
  smallcaps: {
    fontWeight: "bold",
    fontSize: "11px",
    textTransform: "uppercase",
    color: "gray.600",
  },
};

const components = {
  Input: {
    baseStyle: {
      fontWeight: 500,
    },
    sizes: {},
    variants: {},
    defaultProps: {
      size: "sm",
      variant: "outline",
    },
  },
  Heading: {
    sizes: {
      smlg: {
        fontSize: "2xl",
      },
    },
  },
  Button: {
    baseStyle: {
      fontWeight: 500,
    },
    sizes: {
      sm: {
        paddingTop: 0,
        paddingBottom: 0,
        paddingLeft: 2,
        paddingRight: 2,
        height: "28px",
        borderRadius: "md",
        fontSize: 14,
        lineHeight: "20px",
      },
    },
    variants: {},
  },
  MenuItem: {
    baseStyle: {
      fontWeight: "medium",
      fontSize: 14,
    },
  },
  Text: {
    sizes: {
      sm: {
        fontSize: 14,
      },
    },
  },
  Tooltip: {
    baseStyle: {
      borderRadius: "md",
      padding: 2
    },
    sizes: {
      lg: {
        display: "flex",
        maxWidth: 60,
        margin: 2,
        fontSize: 20,
      }
    }
  }
};

const styles = {
  global: {
    body: {
      // Removed global style customization (1)
    },
  },
};

const theme = extendTheme({
  colors,
  fonts,
  fontSizes,
  textStyles,
  components,
  styles,
});

export default theme;
