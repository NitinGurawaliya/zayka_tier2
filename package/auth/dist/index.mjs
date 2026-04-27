"use client";

// src/Signin.tsx
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { jsx, jsxs } from "react/jsx-runtime";
function SigninComponent({ backendUrl }) {
  const normalizedBackendUrl = backendUrl.replace(/\/+$/, "");
  const buildApiUrl = (path) => `${normalizedBackendUrl}${path}`;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(buildApiUrl("/auth/check"), {
          credentials: "include"
        });
        if (response.ok) {
          const redirectTo = searchParams.get("redirect") || "/restaurant/dashboard";
          router.push(redirectTo);
        }
      } catch (error2) {
        console.log("User not authenticated");
      }
    };
    checkAuth();
  }, [router, searchParams, backendUrl]);
  async function signinHandler() {
    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }
    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        buildApiUrl("/auth/signin"),
        { email, password },
        { withCredentials: true }
      );
      const token = res.data.token;
      console.log("Signed in successfully:", token);
      const redirectTo = searchParams.get("redirect") || "/restaurant/dashboard";
      router.push(redirectTo);
    } catch (error2) {
      console.error("Signin failed:", error2);
      if (error2.response?.data?.msg) {
        setError(error2.response.data.msg);
      } else {
        setError("Failed to sign in. Please check your credentials.");
      }
    } finally {
      setLoading(false);
    }
  }
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      signinHandler();
    }
  };
  return /* @__PURE__ */ jsx("div", { className: "bg-white border-black-2  dark:bg-gray-900 min-h-screen flex justify-center items-start", children: /* @__PURE__ */ jsxs("div", { className: "w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-4 mt-4", children: [
    /* @__PURE__ */ jsx("div", { className: "flex flex-col items-center mb-6", children: /* @__PURE__ */ jsx(
      "img",
      {
        className: "w-44 h-44",
        src: "https://res.cloudinary.com/dixjcb4on/image/upload/v1745653811/dishes_image/logo_zayka.jpg",
        alt: "DineInn Logo"
      }
    ) }),
    /* @__PURE__ */ jsx("h2", { className: "text-xl font-bold text-gray-900 dark:text-white mb-6 text-center", children: "Sign In to Your Account" }),
    error && /* @__PURE__ */ jsx("div", { className: "mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded", children: error }),
    /* @__PURE__ */ jsxs("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Email" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => setEmail(e.target.value),
            onKeyPress: handleKeyPress,
            className: "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500",
            placeholder: "name@company.com"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { children: [
        /* @__PURE__ */ jsx("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Password" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "password",
            value: password,
            onChange: (e) => setPassword(e.target.value),
            onKeyPress: handleKeyPress,
            className: "w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500",
            placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
          }
        )
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: signinHandler,
          disabled: loading,
          className: "w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          children: loading ? "Signing In..." : "Sign In"
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "text-center", children: /* @__PURE__ */ jsxs("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
        "Don't have an account?",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "/onboarding/auth/signup",
            className: "text-blue-600 hover:text-blue-800 font-medium",
            children: "Sign up"
          }
        )
      ] }) })
    ] })
  ] }) });
}

// src/Signup.tsx
import axios2 from "axios";
import { useState as useState2, useEffect as useEffect2 } from "react";
import { useRouter as useRouter2, useSearchParams as useSearchParams2 } from "next/navigation";
import { Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function SignupComponent({ backendUrl }) {
  const normalizedBackendUrl = backendUrl.replace(/\/+$/, "");
  const buildApiUrl = (path) => `${normalizedBackendUrl}${path}`;
  const [name, setName] = useState2("");
  const [password, setPassword] = useState2("");
  const [email, setEmail] = useState2("");
  const [loading, setLoading] = useState2(false);
  const [showPassword, setShowPassword] = useState2(false);
  const [errors, setErrors] = useState2({});
  const [success, setSuccess] = useState2("");
  const router = useRouter2();
  const searchParams = useSearchParams2();
  useEffect2(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(buildApiUrl("/auth/check"), {
          credentials: "include"
        });
        if (response.ok) {
          const redirectTo = searchParams.get("redirect") || "/restaurant/dashboard";
          router.push(redirectTo);
        }
      } catch (error) {
        console.log("User not authenticated");
      }
    };
    checkAuth();
  }, [router, searchParams, backendUrl]);
  const validateForm = () => {
    const newErrors = {};
    if (!name.trim()) {
      newErrors.name = "Name is required";
    } else if (name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }
    if (!email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      newErrors.password = "Password must contain uppercase, lowercase, and number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  async function signupHandler() {
    if (!validateForm()) {
      return;
    }
    try {
      setLoading(true);
      setErrors({});
      setSuccess("");
      const res = await axios2.post(
        buildApiUrl("/auth/signup"),
        {
          name: name.trim(),
          password,
          email: email.trim().toLowerCase()
        },
        { withCredentials: true }
      );
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => {
        const redirectTo = searchParams.get("redirect") || "/onboarding/details";
        router.push(redirectTo);
      }, 2e3);
    } catch (error) {
      if (axios2.isAxiosError(error)) {
        const axiosError = error;
        if (axiosError.response?.status === 409) {
          setErrors({ email: "An account with this email already exists" });
        } else if (axiosError.response?.data?.msg) {
          setErrors({ general: axiosError.response.data.msg });
        } else {
          setErrors({ general: "Something went wrong. Please try again." });
        }
      } else {
        setErrors({ general: "An unexpected error occurred" });
      }
    } finally {
      setLoading(false);
    }
  }
  const clearError = (field) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      signupHandler();
    }
  };
  return /* @__PURE__ */ jsx2("div", { className: "bg-white border-black-2 dark:bg-gray-900 min-h-screen flex justify-center items-start", children: /* @__PURE__ */ jsxs2("div", { className: "w-full max-w-md bg-white dark:bg-gray-800 rounded-lg p-4 mt-4", children: [
    /* @__PURE__ */ jsx2("div", { className: "flex flex-col items-center mb-6", children: /* @__PURE__ */ jsx2(
      "img",
      {
        className: "w-44 h-44",
        src: "https://res.cloudinary.com/dixjcb4on/image/upload/v1745653811/dishes_image/logo_zayka.jpg",
        alt: "DineInn Logo"
      }
    ) }),
    /* @__PURE__ */ jsx2("h2", { className: "text-xl font-bold text-gray-900 dark:text-white mb-6 text-center", children: "Create Your Account" }),
    success && /* @__PURE__ */ jsxs2("div", { className: "mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded flex items-center", children: [
      /* @__PURE__ */ jsx2(CheckCircle, { className: "h-4 w-4 mr-2" }),
      success
    ] }),
    errors.general && /* @__PURE__ */ jsxs2("div", { className: "mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded flex items-center", children: [
      /* @__PURE__ */ jsx2(AlertCircle, { className: "h-4 w-4 mr-2" }),
      errors.general
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: "space-y-5", children: [
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx2("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Full Name" }),
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "text",
            value: name,
            onChange: (e) => {
              setName(e.target.value);
              clearError("name");
            },
            onKeyPress: handleKeyPress,
            className: `w-full p-2.5 rounded-lg border ${errors.name ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`,
            placeholder: "John Doe"
          }
        ),
        errors.name && /* @__PURE__ */ jsx2("p", { className: "mt-1 text-sm text-red-600", children: errors.name })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx2("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Email" }),
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "email",
            value: email,
            onChange: (e) => {
              setEmail(e.target.value);
              clearError("email");
            },
            onKeyPress: handleKeyPress,
            className: `w-full p-2.5 rounded-lg border ${errors.email ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`,
            placeholder: "name@company.com"
          }
        ),
        errors.email && /* @__PURE__ */ jsx2("p", { className: "mt-1 text-sm text-red-600", children: errors.email })
      ] }),
      /* @__PURE__ */ jsxs2("div", { children: [
        /* @__PURE__ */ jsx2("label", { className: "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1", children: "Password" }),
        /* @__PURE__ */ jsxs2("div", { className: "relative", children: [
          /* @__PURE__ */ jsx2(
            "input",
            {
              type: showPassword ? "text" : "password",
              value: password,
              onChange: (e) => {
                setPassword(e.target.value);
                clearError("password");
              },
              onKeyPress: handleKeyPress,
              className: `w-full p-2.5 rounded-lg border pr-10 ${errors.password ? "border-red-500 focus:ring-red-500 focus:border-red-500" : "border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"} bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white`,
              placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022"
            }
          ),
          /* @__PURE__ */ jsx2(
            "button",
            {
              type: "button",
              onClick: () => setShowPassword(!showPassword),
              className: "absolute inset-y-0 right-0 pr-3 flex items-center",
              children: showPassword ? /* @__PURE__ */ jsx2(EyeOff, { className: "h-4 w-4 text-gray-400" }) : /* @__PURE__ */ jsx2(Eye, { className: "h-4 w-4 text-gray-400" })
            }
          )
        ] }),
        errors.password && /* @__PURE__ */ jsx2("p", { className: "mt-1 text-sm text-red-600", children: errors.password })
      ] }),
      /* @__PURE__ */ jsx2(
        "button",
        {
          onClick: signupHandler,
          disabled: loading,
          className: "w-full bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors",
          children: loading ? "Creating Account..." : "Create Account"
        }
      ),
      /* @__PURE__ */ jsx2("div", { className: "text-center", children: /* @__PURE__ */ jsxs2("p", { className: "text-sm text-gray-600 dark:text-gray-400", children: [
        "Already have an account?",
        " ",
        /* @__PURE__ */ jsx2(
          "a",
          {
            href: "/onboarding/auth/signin",
            className: "text-blue-600 hover:text-blue-800 font-medium",
            children: "Sign in"
          }
        )
      ] }) })
    ] })
  ] }) });
}
export {
  SigninComponent as Signin,
  SignupComponent as Signup
};
