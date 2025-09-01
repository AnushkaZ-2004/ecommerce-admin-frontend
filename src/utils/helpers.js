import { ORDER_STATUS_COLORS, ERROR_MESSAGES } from "./constants";

// Format currency
export const formatCurrency = (amount) => {
  if (amount === null || amount === undefined) return "$0.00";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

// Format date
export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Format date with time
export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// Get status badge class
export const getStatusBadgeClass = (status) => {
  return ORDER_STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
};

// Validate email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate product form
export const validateProduct = (product) => {
  const errors = {};

  if (!product.name || product.name.trim().length === 0) {
    errors.name = "Product name is required";
  }

  if (!product.price || product.price <= 0) {
    errors.price = "Price must be greater than 0";
  }

  if (!product.stockQuantity || product.stockQuantity < 0) {
    errors.stockQuantity = "Stock quantity must be 0 or greater";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Generate random ID (for temporary use)
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};

// Debounce function
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

// Handle API errors
export const handleApiError = (error) => {
  console.error("API Error:", error);

  if (!navigator.onLine) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  if (error.status === 401) {
    return ERROR_MESSAGES.UNAUTHORIZED;
  }

  if (error.status >= 500) {
    return ERROR_MESSAGES.SERVER_ERROR;
  }

  if (error.status >= 400) {
    return ERROR_MESSAGES.VALIDATION_ERROR;
  }

  return ERROR_MESSAGES.GENERIC_ERROR;
};

// Calculate percentage change
export const calculatePercentageChange = (current, previous) => {
  if (previous === 0) return 0;
  return ((current - previous) / previous) * 100;
};

// Truncate text
export const truncateText = (text, maxLength) => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substr(0, maxLength) + "...";
};

// Sort array of objects by key
export const sortByKey = (array, key, direction = "asc") => {
  return array.sort((a, b) => {
    const aVal = a[key];
    const bVal = b[key];

    if (aVal < bVal) return direction === "asc" ? -1 : 1;
    if (aVal > bVal) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

// Filter array based on search term
export const filterBySearch = (array, searchTerm, searchKeys) => {
  if (!searchTerm) return array;

  const lowercaseSearch = searchTerm.toLowerCase();

  return array.filter((item) => {
    return searchKeys.some((key) => {
      const value = item[key];
      if (typeof value === "string") {
        return value.toLowerCase().includes(lowercaseSearch);
      }
      if (typeof value === "number") {
        return value.toString().includes(searchTerm);
      }
      return false;
    });
  });
};

// Local storage helpers
export const getFromStorage = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error("Error getting from localStorage:", error);
    return defaultValue;
  }
};

export const setToStorage = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error("Error setting to localStorage:", error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error("Error removing from localStorage:", error);
  }
};
