const AuthUtils = {
  setApiExpiry: (dateString: string) => {
    if (!dateString) localStorage.removeItem("apiTokenExpiryDate");
    else localStorage.setItem("apiTokenExpiryDate", dateString || "");
  },
  clearApiExpiry: () => {
    localStorage.removeItem("apiTokenExpiryDate");
  },
  isApiTokenExpired: () => {
    const expiryDate = localStorage.getItem("apiTokenExpiryDate");
    if (expiryDate) {
      const expiryDateObj = new Date(expiryDate);
      const currentDate = new Date();
      return expiryDateObj <= currentDate;
    }
    return true;
  },
  apiLoginInProgress: () => {
    return localStorage.getItem("apiLoginInProgress") === "true";
  },
  setApiLoginInProgress: (inProgress: boolean) => {
    if (inProgress) localStorage.setItem("apiLoginInProgress", "true");
    else localStorage.removeItem("apiLoginInProgress");
  }
};

export default AuthUtils;
