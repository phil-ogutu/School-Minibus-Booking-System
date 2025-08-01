"use client";
import React from "react";
import Link from "next/link";

export default function Button({
  href,
  children,
  variant = "primary",
  size = "base",
  ...props
}) {
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

  const cls = `${base} ${variants[variant]} ${sizes[size]}`;

  if (href) {
    return (
      <Link href={href} {...props}>
        <span className={cls}>{children}</span>
      </Link>
    );
  }

  return (
    <button className={cls} {...props}>
      {children}
    </button>
  );
}
