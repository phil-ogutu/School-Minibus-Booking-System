"use client";
import React from "react";
import Link from "next/link";

const Button = ({ children, href, onClick, variant = "primary" }) => {
  const baseStyle = "px-6 py-3 rounded font-semibold transition duration-300";
  const variants = {
    primary: "bg-green-600 text-white hover:bg-green-700",
    secondary: "bg-yellow-400 text-black hover:bg-yellow-500",
  };

  const className = `${baseStyle} ${variants[variant]}`;

  if (href) {
    return (
      <Link href={href}>
        <button className={className}>{children}</button>
      </Link>
    );
  }

  return (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  );
};

export default Button;
