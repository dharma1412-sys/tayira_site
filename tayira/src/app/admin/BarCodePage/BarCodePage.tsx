'use client';
import React, { useRef, useState } from "react";
import JsBarcode from "jsbarcode";

interface ProductInfo {
    title: string;
    id: string;
    price: string;
    logo: string; // URL or base64
}

const defaultLogo =
    "https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg"; // Placeholder logo

const BarCodePage: React.FC = () => {
    const [product, setProduct] = useState<ProductInfo>({
        title: "",
        id: "",
        price: "",
        logo: defaultLogo,
    });
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value, files } = e.target as any;
        if (name === "logo" && files && files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                setProduct((prev) => ({
                    ...prev,
                    logo: ev.target?.result as string,
                }));
            };
            reader.readAsDataURL(files[0]);
        } else {
            setProduct((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    // 4x6 inches at 300 DPI = 1200x1800 pixels
    const CANVAS_WIDTH = 800;
    const CANVAS_HEIGHT = 600;

    // Import JsBarcode at the top of your file:
    // import JsBarcode from "jsbarcode";


    const generateImage = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas size to 4x6 inches at 300 DPI
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // White background
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw logo (scaled up)
        const logoImg = new window.Image();
        logoImg.src = product.logo;
        await new Promise((resolve) => {
            logoImg.onload = resolve;
            logoImg.onerror = resolve;
        });
        // Logo: 240x240px, margin 40px
        ctx.drawImage(logoImg, 100, 0, 600, 360);

        // Draw product title
        // ctx.font = "bold 72px Arial";
        // ctx.fillStyle = "#222";
        // ctx.textAlign = "center";
        // ctx.fillText(product.title, 320, 140);
        // ctx.textAlign = "center";

        // Draw product ID
        // ctx.font = "48px Arial";
        // ctx.fillStyle = "#555";
        // ctx.fillText(`ID: ${product.id}`, 320, 220);

        // Draw price
        ctx.font = "bold 80px Arial";
        ctx.fillStyle = "#000";
        ctx.fillText(`₹${product.price}`, 40, 350);
        ctx.textAlign = "left";

        // --- Draw barcode for product.id ---
        // 2x4 inches at 300 DPI = 600x1200 pixels
        const barcodeWidth = 800;
        const barcodeHeight = 160;
        // Create a temporary canvas for barcode
        const barcodeCanvas = document.createElement("canvas");
        barcodeCanvas.width = barcodeWidth;
        barcodeCanvas.height = barcodeHeight;

        JsBarcode(barcodeCanvas, product.id, {
            format: "CODE128",
            width: 6, // bar width
            height: barcodeHeight,
            displayValue: false,
            margin: 0,
        });

        // Draw barcode onto main canvas (centered horizontally, placed lower)
        const barcodeX = (CANVAS_WIDTH - barcodeWidth) / 2;
        const barcodeY = 400; // adjust as needed
        ctx.drawImage(barcodeCanvas, barcodeX, barcodeY, barcodeWidth, barcodeHeight);

        // Generate image URL
        setImageUrl(canvas.toDataURL("image/png"));
    };

    return (
        <div style={{ maxWidth: 400, margin: "0 auto" }}>
            <h2>Thermal Barcode Image Generator</h2>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    generateImage();
                }}
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
            >
                <input
                    name="title"
                    placeholder="Product Title"
                    value={product.title}
                    onChange={handleChange}
                    required
                />
                <input
                    name="id"
                    placeholder="Product ID"
                    value={product.id}
                    onChange={handleChange}
                    required
                />
                <input
                    name="price"
                    placeholder="Price"
                    value={product.price}
                    onChange={handleChange}
                    required
                    type="number"
                    min="0"
                />
                <label>
                    Logo:
                    <input
                        name="logo"
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                    />
                </label>
                <button type="submit">Generate Image</button>
            </form>
            <canvas
                ref={canvasRef}
                width={320}
                height={110}
                style={{ display: "none" }}
            />
            {imageUrl && (
                <div style={{ marginTop: 20 }}>
                    <h4>Preview:</h4>
                    <img
                        src={imageUrl}
                        alt="Barcode"
                        style={{
                            border: "1px solid #ccc",
                            background: "#fff",
                            width: 150,
                            height: 240,
                            padding: 8,
                        }}
                    />
                    <a
                        href={imageUrl}
                        download="barcode.png"
                        style={{ display: "block", marginTop: 8 }}
                    >
                        Download Image
                    </a>
                </div>
            )}
        </div>
    );
};

export default BarCodePage;