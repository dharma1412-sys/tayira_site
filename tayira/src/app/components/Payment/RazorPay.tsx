export interface RazorpayOptions {
  key: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  prefill: {
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
}

export interface OrderResponse {
    id: string;
    entity?: string;
    amount: number;
    currency: string;
    receipt?: string;
    status?: string;
}

export const createOrder = async (amount: number, signal?: AbortSignal): Promise<OrderResponse> => {
    const payload = {
      Order_ID: 6,
      Customer_ID: 1,
      Total_Amount: amount,
      Discount_Amount: 0,
      Final_Amount: amount,
      Payment_Method: null,
      Transaction_ID: null,
      Delivery_Address: null,
      Billing_Address: null,
      Notes: null,
    };

    const res = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal,
    });

    if (!res.ok) {
        const text = await res.text().catch(() => res.statusText);
        throw new Error(`Failed to create order (${res.status}): ${text}`);
    }

    const data = await res.json();
    console.log('Order created:', data);
    if (!data ) {  //|| typeof data.id !== 'string'
        throw new Error('Invalid order response from server');
    }

    return data as OrderResponse;
};

export const handlePayment = (
  options: RazorpayOptions,
  onSuccess: (response: any) => void,
  onError: (error: any) => void
) => {
  const razorpay = new (window as any).Razorpay({
    ...options,
    handler: onSuccess,
  });

  razorpay.on('payment.failed', onError);
  razorpay.open();
};
