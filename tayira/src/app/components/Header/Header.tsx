"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Cart from "@/app/components/Cart/Cart";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";

export default function Header() {
  const cartSliderOpen = useAppSelector((s) => s.cart.cartSliderOpen);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(cartSliderOpen || false);
  const dispatch = useAppDispatch();

  console.log("Cart Slider Open:", cartSliderOpen);

  useEffect(() => {
    setCartOpen(cartSliderOpen || false);
  }, [cartSliderOpen]);

  const handleCartClose = () => {
    setCartOpen(false);
    // Dispatch action to open the cart slider
    dispatch({ type: "cart/setCartSliderClose", payload: true });
  };

  return (
    <header className="w-full border-b border-gray-300 header">
      <div className="flex items-center justify-between w-full px-4 py-1 header-wrapper">
        {/* Logo */}
        <div className="flex items-center gap-2 wrapper-logo">
          <a href="/">
            <Image
              src="/Images/tayira-logo.jpeg"
              alt="Logo"
              width={40}
              height={40}
              priority
              className="dark:invert logo"
            />
          </a>
        </div>

        {/* Title */}
        <div className="wrapper-title">
          <span className="text-xl font-bold title">Tayira</span>
        </div>

        {/* Hamburger Menu Button */}
        <button
          className="flex flex-col justify-center items-center w-8 h-8"
          aria-label="Open menu"
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            className="icon icon-hamburger"
            fill="none"
            viewBox="0 0 18 16"
          >
            <path
              d="M1 .5a.5.5 0 100 1h15.71a.5.5 0 000-1H1zM.5 8a.5.5 0 01.5-.5h15.71a.5.5 0 010 1H1A.5.5 0 01.5 8zm0 7a.5.5 0 01.5-.5h15.71a.5.5 0 010 1H1a.5.5 0 01-.5-.5z"
              fill="currentColor"
            ></path>
          </svg>
        </button>
        {/* Cart Icon */}
        <button
          className="relative ml-4"
          aria-label="Open cart"
          onClick={() => setCartOpen(true)}
        >
          <svg
            className="icon icon-cart"
            aria-hidden="true"
            focusable="false"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 40 40"
            fill="none"
          >
            <path
              fill="currentColor"
              fillRule="evenodd"
              d="M20.5 6.5a4.75 4.75 0 00-4.75 4.75v.56h-3.16l-.77 11.6a5 5 0 004.99 5.34h7.38a5 5 0 004.99-5.33l-.77-11.6h-3.16v-.57A4.75 4.75 0 0020.5 6.5zm3.75 5.31v-.56a3.75 3.75 0 10-7.5 0v.56h7.5zm-7.5 1h7.5v.56a3.75 3.75 0 11-7.5 0v-.56zm-1 0v.56a4.75 4.75 0 109.5 0v-.56h2.22l.71 10.67a4 4 0 01-3.99 4.27h-7.38a4 4 0 01-4-4.27l.72-10.67h2.22z"
            ></path>
          </svg>
        </button>

        {/* Cart Modal */}
        <div
          className={`fixed top-0 right-0 h-full w-[90%] bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4 text-gray-800"
            aria-label="Close menu"
            onClick={() => handleCartClose()}
          >
            ✕
          </button>
          <div className="">
            <Cart />
          </div>
        </div>

        {/* Slide-out Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-4 right-4 text-gray-800"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
          <ul className="flex flex-col gap-6 mt-16 px-8">
            <li>
              <a href="#" className="hover:text-blue-600 font-semibold">
                Home
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 font-semibold">
                Products
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-blue-600 font-semibold">
                Contact
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
