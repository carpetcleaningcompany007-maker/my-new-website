module.exports = {
  content: ["./pages/landing*.html"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#faf6ef",
          100: "#efe3c9",
          300: "#d8b36a",
          400: "#c89a4a",
          500: "#b78433",
          700: "#6f4e1d",
        },
        ink: {
          950: "#090d13",
          900: "#0e1622",
          800: "#162231",
          700: "#243447",
        },
      },
      boxShadow: {
        soft: "0 14px 34px rgba(4,9,20,0.16)",
        card: "0 28px 80px rgba(4,9,20,0.42)",
      },
    },
  },
  plugins: [],
};
