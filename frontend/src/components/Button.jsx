"use client";
import React from "react";
import Link from "next/link";

const Button = ({ href, children, variant = "primary", size = "base" }) => {
  const base =
    "inline-block rounded font-semibold focus:outline-none transition duration-200";
  const sizes = {
    base: "px-4 py-2 text-base rounded-lg",
    lg: "px-8 py-4 text-lg",
  };
  const variants = {
    primary: "bg-yellow-500 hover:bg-yellow-600 text-white",
    secondary: "bg-gray-700 hover:bg-gray-800 text-white",
  };

  return (
    <Link href={href}>
      <span className={`${base} ${variants[variant]} ${sizes[size]}`}>
        {children}
      </span>
    </Link>
  );
};

export default Button;
