// Clearbit doesn't detect the correct url when using catch all routes (e.g. [...slug].tsx)
// so we need to directly set the path on route change
export const setClearbitPath = (path) => {
  if (typeof window !== "undefined" && typeof window.clearbit !== "undefined") {
    window.clearbit.push(["set", { path }]);
  }
};
