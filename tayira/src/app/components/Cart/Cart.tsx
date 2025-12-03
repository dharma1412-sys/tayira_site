"use client";
import React, { useState, useEffect } from "react";
import styles from "./Cart.module.scss";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { removeItem, updateQty } from "@/app/store/slices/cartSlice";
import { createOrder, handlePayment } from "@/app/components/Payment/RazorPay";

interface CartItem {
  ID: number;
  Product_Name: string;
  Product_ID: number;
  Product_Image: string;
  link: string;
  Old_Price: Number;
  Final_Price: Number;
  Size: string;
  Color: string;
  Quantity: number;
  Session_ID: string;
}

const initialItems: CartItem[] = [
  {
    ID: 1,
    Product_ID: 50599865975082,
    Product_Name: "Anika Chanderi silk Chikankari kurti",
    Product_Image:
      "//www.labelajachikankari.in/cdn/shop/files/DSC_0558.jpg?v=1757777130&width=300",
    link: "/products/anika-chanderi-silk-chikankari-kurti?variant=50599865975082",
    Old_Price: 1890,
    Final_Price: 1790,
    Size: "36(XS)",
    Color: "Rust Orange",
    Quantity: 2,
    Session_ID: "",
  },
];

export default function Cart() {
  // const [items, setItems] = useState<CartItem[]>(initialItems);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const items = useAppSelector((s) => s.cart.items);

  console.log("Cart items from Redux:", items)
  // const loading = useAppSelector((s) => s.order.loading);

  // const handleQuantityChange = (id: number, delta: number) => {
  //   setItems((prev) =>
  //     prev.map((item) =>
  //       item.id === id
  //         ? { ...item, quantity: Math.max(1, item.quantity + delta) }
  //         : item
  //     )
  //   );
  // };

  // const handleRemove = (id: number) => {
  //   setItems((prev) => prev.filter((item) => item.id !== id));
  // };



   // Fetch cart data from backend and load into Redux store
  useEffect(() => {
    console.log("Fetching cart data...")
    async function fetchCart() {
      try {
        setLoading(true);
        // Replace 'sessionId' with actual session/user identifier if needed
        const res = await fetch("http://localhost:5000/api/cart");
        const data = await res.json();
        if (data && data.data) {
          dispatch({ type: "cart/setCart", payload: data.data });
        }
      } catch (err) {
        console.error("Failed to load cart:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCart();
  }, [dispatch]);

  const estimatedTotal = items.reduce(
    (sum, item) => sum + item.Final_Price * item.Quantity,
    0
  );

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const order = await createOrder(estimatedTotal);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
        order_id: order.id,
        name: "Tayira Store",
        description: "Purchase from Tayira",
        image: "https://your-logo-url.com/logo.png",
        prefill: {
          email: "tayira@example.com",
          contact: "9999999999",
        },
        theme: {
          color: "#3399cc",
        },
      };

      handlePayment(
        options,
        (response) => {
          console.log("Payment successful:", response);
          alert("Payment successful!");
        },
        (error) => {
          console.error("Payment failed:", error);
          alert("Payment failed. Please try again.");
        }
      );
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async(id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/cart/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Failed to delete item: ${res.status} ${text}`);
      }
      dispatch(removeItem(id));
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
    
  };

  return (
    // <div className={styles.drawer} style={{ zIndex: 1000 }}>
    <div id="CartDrawer" className={styles.cartContainer}>
      <div
        className={styles.drawerInner}
        role="dialog"
        aria-modal="true"
        aria-label="Your cart"
        tabIndex={-1}
      >
        <div className={styles.cartHeader}>
          <h2 className={styles.drawerHeading}>Your cart</h2>
          <button
            className={styles.drawerClose}
            type="button"
            aria-label="Close"
            onClick={() => {
              // Implement close logic here
            }}
          >
            {/* Close SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              focusable="false"
              className={styles.iconClose}
              fill="none"
              viewBox="0 0 18 17"
            >
              <path
                d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                fill="currentColor"
              />
            </svg>
          </button>
        </div>

        {items.length === 0 ? (
          <div>Your cart is empty</div>
        ) : (
          <>
            <ul>
              {items.map((it) => (
                <li key={it.ID}>
                  <div className={styles.cart_items_wrapper}>
                    <div className={styles.cart_items}>
                      <div className={`${styles.item} row`}>
                        <div className={`${styles.item_wrapper}`}>
                          <div className="col-2">
                            <img
                              className={`${styles.item_image}`}
                              src="https://i.imgur.com/1GrakTl.jpg"
                            />
                          </div>
                          <div className="col">
                            <div className="row text-muted">{it.Product_Name}</div>
                            <div className={`${styles.item_details}`}>
                              {/* <a href="#" className={`${styles.button}`}>
                                -
                              </a>
                              <a href="#" className={`${styles.border}`}>
                                1
                              </a>
                              <a href="#" className={`${styles.button}`}>
                                +
                              </a> */}
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQty({
                                      id: it.ID,
                                      quantity: it.Quantity - 1,
                                    })
                                  )
                                }
                              >
                                -
                              </button>
                              <span>{it.Quantity}</span>
                              <button
                                onClick={() =>
                                  dispatch(
                                    updateQty({
                                      id: it.ID,
                                      quantity: it.Quantity + 1,
                                    })
                                  )
                                }
                              >
                                +
                              </button>
                            </div>
                          </div>
                          <div className="col">{`Rs 44.00`} </div>
                          <div className="col">
                            {/* <span className="close">&#10005;</span> */}
                            <button
                              type="button"
                              className={styles.drawerClose}
                              aria-label="Remove item"
                              title="Remove item"
                              onClick={() => handleRemoveItem(it.ID)}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                aria-hidden="true"
                                focusable="false"
                                width="15"
                                height="15"
                                viewBox="0 0 18 17"
                                fill="none"
                                fontWeight={700}
                              >
                                <path
                                  d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                                  fill="red"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                      {/* <div className="row">
              <div className="row main align-items-center">
                <div className="col-2">
                  <img
                    className="img-fluid"
                    src="https://i.imgur.com/ba3tvGm.jpg"
                  />
                </div>
                <div className="col">
                  <div className="row text-muted">Shirt</div>
                  <div className="row">Cotton T-shirt</div>
                </div>
                <div className="col">
                  <a href="#">-</a>
                  <a href="#" className="border">
                    1
                  </a>
                  <a href="#">+</a>
                </div>
                <div className="col">
                  &euro; 44.00 <span className="close">&#10005;</span>
                </div>
              </div>
            </div>
            <div className="row border-top border-bottom">
              <div className="row main align-items-center">
                <div className="col-2">
                  <img
                    className="img-fluid"
                    src="https://i.imgur.com/pHQ3xT3.jpg"
                  />
                </div>
                <div className="col">
                  <div className="row text-muted">Shirt</div>
                  <div className="row">Cotton T-shirt</div>
                </div>
                <div className="col">
                  <a href="#">-</a>
                  <a href="#" className="border">
                    1
                  </a>
                  <a href="#">+</a>
                </div>
                <div className="col">
                  &euro; 44.00 <span className="close">&#10005;</span>
                </div>
              </div>
            </div> */}
                    </div>
                    <div id="CartDrawer-CartErrors" role="alert"></div>
                  </div>
                </li>
              ))}
            </ul>
            <div className={styles.cart_footer}>
              <div className={styles.cartDrawerFooter}>
                <div></div>
                <div className={styles.total_wrapper} role="status">
                  <h2 className={styles.total_label}>Total: </h2>
                  <p className={styles.total_value}>
                    ₹ {estimatedTotal.toFixed(2)}
                  </p>
                </div>
                <small
                  className={`${styles.taxNote} ${styles.captionLarge} ${styles.rte}`}
                >
                  Tax included and shipping and discounts calculated at checkout
                </small>
              </div>
              <div className={styles.cartCtas}>
                <button
                  type="button"
                  id="CartDrawer-Checkout"
                  className={`${styles.cartCheckoutButton} ${styles.button} ${styles.zecpeBtn}`}
                  name="checkout"
                  form="CartDrawer-Form"
                  onClick={() => {
                    handleCheckout();
                  }}
                >
                  {loading ? "Processing..." : "Proceed to Payment"}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
