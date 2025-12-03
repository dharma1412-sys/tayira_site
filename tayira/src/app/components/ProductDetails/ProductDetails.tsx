"use client";
import React, { useEffect, useState } from "react";
import styles from "./ProductDetails.module.scss";
import { useAppDispatch } from "@/app/store/hooks";

type ProductVariant = {
  id: number;
  name: string;
  option1: string;
  option2?: string;
  option3?: string;
  price: number;
  discount_price?: number;
  available: boolean;
};

type ProductDetails = {
  ID: number;
  Product_Name: string;
  Description: string;
  Image_Url: string;
  Image_List: string[];
  Product_List_Price_Per_Qty: number;
  Product_Sell_Price_Per_Qty?: number;
  variants: ProductVariant[];
  sizes: string[];
  colors: string[];
  otherVariants?: { label: string; url: string }[];
};

type ProductDetailsProps = { product_id: string };

const ProductDetails: React.FC<ProductDetailsProps> = ({ product_id }) => {
  const [product, setProduct] = useState<ProductDetails | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(
    null
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetch(
      `http://localhost:5000/api/productdetails/${encodeURIComponent(
        product_id
      )}`
    )
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch products");
        return res.json();
      })
      .then((data) => {
        setProduct(data.product || null);
        setSelectedSize(data.sizes?.[0] || "");
        setSelectedColor(data.colors?.[0] || "");
        const variant = data.variants?.[0];
        setSelectedVariantId(data.product.ID || variant?.id || null);
      })
      .catch((err) => {
        // setError(err.message);
        // setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (product && selectedSize && selectedColor) {
      // const variant = product.variants.find(
      //   (v) => v.option1 === selectedSize && v.option2 === selectedColor
      // );
      // setSelectedVariantId(variant?.id || null);
    }
  }, [selectedSize, selectedColor, product]);

  if (!product) return <div>Loading...</div>;

  const sizes = ["M", "L", "XL", "XXL", "3XL", "4XL"];
  const colors = ["Red", "Blue", "Green", "Black", "White", "Yellow"];
  product.sizes = sizes;
  product.colors = colors;

  console.log("Product Details:", product);
  4;

  const addToCart = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    product: ProductDetails
  ) => {
    setLoading(true);
    e.preventDefault();
    // setMessage(null);
    // setError(null);
    const payload = {
      Customer_PhoneNo: 9876765477,
      Customer_ID: 1,
      Product_ID: product.ID,
      Product_Name: product.Product_Name,
      Old_Price: product.Product_List_Price_Per_Qty,
      Final_Price:
        product.Product_Sell_Price_Per_Qty ||
        product.Product_List_Price_Per_Qty,
      Size: selectedSize,
      Color: selectedColor,
      Quantity: quantity,
      sessionId: crypto.randomUUID(), // Renplace with actual session ID
    };

    console.log("Adding to cart:", product, payload);

    const res = await fetch("http://localhost:5000/api/addToCart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => res.statusText);
      setLoading(false);
      throw new Error(`Failed to create cart (${res.status}): ${text}`);
    }

    const data = await res.json();
    setLoading(false);
    console.log("cart added:", data);
    const res1 = await fetch("http://localhost:5000/api/cart");
    const data1 = await res1.json();
    if (data1 && data1.data) {
      dispatch({ type: "cart/setCart", payload: data1.data });
    }
    // Dispatch action to open the cart slider
    dispatch({ type: "cart/setCartSliderOpen", payload: true });

    if (!data) {
      //|| typeof data.id !== 'string'
      throw new Error("Invalid cart response from server");
    }
  };

  return (
    <div className={`${styles.product_wrapper}`}>
      <div className="grid__item product__media-wrapper">
        <div
          className="product__media-list contains-media grid grid--peek list-unstyled slider slider--mobile"
          role="list"
        >
          {product?.Image_List?.map((img, idx) => (
            <div
              key={idx}
              className="product__media-item grid__item slider__slide"
            >
              <div className="product-media-container media-type-image media-fit-contain global-media-settings gradient">
                <img
                  src={img}
                  alt={product?.Product_Name}
                  width={400}
                  height={600}
                  className="image-magnify-lightbox"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className={`${styles.product_info_wrapper}`}>
        <div className={`${styles.product_title}`}>
          <h1>{product?.Product_Name}</h1>
        </div>
        <div
          className={`${styles.reiews_wrapper}`}
          style={{ margin: "10px 0 15px 0" }}
        >
          {/* Star rating placeholder */}
          <span>★★★★★</span> <span>0 Reviews</span>
        </div>
        <div className={`${styles.price_container}`}>
          <div className={`${styles.price_regular}`}>
            <span className="visually-hidden visually-hidden--inline">
              Regular price
            </span>
            <span
              className={`${styles.price_item} ${styles.price_item_regular}`}
            >{`Rs. ${product?.Product_List_Price_Per_Qty}`}</span>
          </div>
          <div className={`${styles.price_sale}`}>
            <span className="hidden">Regular price</span>
            <span>
              <s
                className={`${styles.price_item} ${styles.price_item_regular}`}
              >{`Rs. ${product?.Product_List_Price_Per_Qty ?? 0}`}</s>
            </span>
            <span className="hidden">Sale price</span>
            <span className={`${styles.price_item} ${styles.price_item_last}`}>
              {`Rs. ${
                product?.Product_Sell_Price_Per_Qty ||
                product?.Product_List_Price_Per_Qty ||
                0
              }`}
            </span>
          </div>
          <small className="unit-price caption hidden">
            <span className="visually-hidden">Unit price</span>
            <span className="price-item price-item--last">
              <span></span>
              <span aria-hidden="true">/</span>
              <span className="visually-hidden">&nbsp;per&nbsp;</span>
              <span></span>
            </span>
          </small>
          <span className={`${styles.price_badge}`}>
            {`SAVE Rs, ${
              product?.Product_List_Price_Per_Qty -
              (product?.Product_Sell_Price_Per_Qty || 0)
            }`}
          </span>
        </div>
        <div className="product__tax caption rte">Tax included.</div>
        <form
          // method="post"
          // action="/cart/add"
          className="form"
          // encType="multipart/form-data"
          style={{ marginTop: 16 }}
        >
          <input type="hidden" name="id" value={selectedVariantId || ""} />
          <fieldset className={`js ${styles.product_size_wrapper}`}>
            <legend className={`${styles.form_label}`}>Size</legend>
            {product?.sizes?.map((size) => (
              <label
                key={size}
                style={{ marginRight: 8 }}
                className={`${selectedSize === size && styles.checked}`}
              >
                <input
                  type="radio"
                  name="Size"
                  value={size}
                  checked={selectedSize === size}
                  onChange={() => setSelectedSize(size)}
                />
                {size}
              </label>
            ))}
          </fieldset>
          <fieldset className={`js ${styles.product_color_wrapper}`}>
            <legend className={`${styles.form_label}`}>Color</legend>
            {product?.colors?.map((color) => (
              <label
                key={color}
                style={{ marginRight: 8 }}
                className={`${selectedColor === color && styles.checked}`}
              >
                <input
                  type="radio"
                  name="Color"
                  value={color}
                  checked={selectedColor === color}
                  onChange={() => setSelectedColor(color)}
                />
                {color}
              </label>
            ))}
          </fieldset>
          <div className={`${styles.quantity_wrapper}`}>
            <label className="quantity__label form__label" htmlFor="quantity">
              Quantity
            </label>
            <div className={`${styles.quantity}`}>
              <button
                type="button"
                onClick={() => setQuantity(quantity - 1)}
                className={`${styles.quantity_button}`}
              >
                <span className={`${styles.quantity_icon}`} aria-hidden="true">
                  −
                </span>
              </button>
              <input
                type="number"
                name="quantity"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                className={`${styles.quantity_input}`}
              />
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className={`${styles.quantity_button}`}
              >
                <span className={`${styles.quantity_icon}`} aria-hidden="true">
                  +
                </span>
              </button>
            </div>
          </div>
          <div
            className={`${styles.product_form_buttons}`}
            style={{ marginTop: 16 }}
          >
            {/* <button
              type="submit"
              className={`${styles.product_cart_button} ${styles.button}`}
              disabled={!selectedVariantId}
            >
              Add to cart
            </button> */}
            <button
              type="submit"
              className={`${styles.product_buy_now_button} ${styles.button}`}
              disabled={!selectedVariantId}
              onClick={(e) => addToCart(e, product)}
            >
              Add to cart
            </button>
          </div>
        </form>
        {product?.otherVariants && (
          <fieldset
            className="js product-form__input product-form__input--pill"
            style={{ marginTop: 16 }}
          >
            <legend className="form__label">Other variants</legend>
            {product?.otherVariants?.map((v) => (
              <label key={v.url} style={{ marginRight: 8 }}>
                <input
                  type="radio"
                  name="other_variant"
                  value={v.url}
                  onChange={() => (window.location.href = v.url)}
                />
                {v.label}
              </label>
            ))}
          </fieldset>
        )}
        {/* <div
          className="product__accordion accordion quick-add-hidden"
          style={{ marginTop: 24 }}
        >
          <details>
            <summary>
              <h2 className="h4 accordion__title inline-richtext">
                Product Description
              </h2>
            </summary>
            <div className="accordion__content rte">
              <div dangerouslySetInnerHTML={{ __html: product?.description }} />
            </div>
          </details>
        </div> */}
      </div>
    </div>
  );
};

export default ProductDetails;
