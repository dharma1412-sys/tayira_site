const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());
app.use(express.static('public'));

// Products Routes (existing)
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT ID, Category, Product_Name, Description, Gender, Product_List_Price_Per_Qty, Product_Sell_Price_Per_Qty, Image_Url FROM tayira_product_details ORDER BY Created_At DESC');
    res.json({ products: rows });
    console.log("Products fetched:", rows.length);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/products', async (req, res) => {
  const { product_name, image, dress_code, description, price } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO products (product_name, image, dress_code, description, price) VALUES (?, ?, ?, ?, ?)',
      [product_name, image, dress_code, description, price]
    );
    res.status(201).json({ id: result.insertId, message: 'Product added' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/productdetails/:product_id', async (req, res) => {
  const { product_id } = req.params;
  console.log("Fetching details for product ID:", product_id);
  
  try {
    const [rows] = await db.execute(
      'SELECT * FROM tayira_product_details WHERE ID = ?',
      [product_id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json({ product: rows[0] });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Vendor Details Routes
app.get('/api/vendor-details', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tayira_vendor_details ORDER BY ID DESC');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching vendor details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/vendor-details', async (req, res) => {
  const { Vendor_Name, Vendor_Place, Vendor_Contact_Number, Vendor_Product_Category, Vendor_Address } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO tayira_vendor_details (Vendor_Name, Vendor_Place, Vendor_Contact_Number, Vendor_Product_Category, Vendor_Address) VALUES (?, ?, ?, ?, ?)',
      [Vendor_Name, Vendor_Place, Vendor_Contact_Number, Vendor_Product_Category, Vendor_Address]
    );
    res.status(201).json({ id: result.insertId, message: 'Vendor added' });
  } catch (error) {
    console.error('Error adding vendor:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Vendor
app.put('/api/vendor-details/:id', async (req, res) => {
  const { id } = req.params;
  const { Vendor_Name, Vendor_Place, Vendor_Contact_Number, Vendor_Product_Category, Vendor_Address } = req.body;
  try {
    const [result] = await db.execute(
      `UPDATE tayira_vendor_details 
       SET Vendor_Name=?, Vendor_Place=?, Vendor_Contact_Number=?, Vendor_Product_Category=?, Vendor_Address=? 
       WHERE ID=?`,
      [Vendor_Name, Vendor_Place, Vendor_Contact_Number, Vendor_Product_Category, Vendor_Address, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json({ message: "Vendor updated successfully" });
  } catch (error) {
    console.error("Error updating vendor:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete Vendor
app.delete('/api/vendor-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      `DELETE FROM tayira_vendor_details WHERE ID=?`, 
      [id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json({ message: "Vendor deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor:", error);
    res.status(500).json({ error: "Server error" });
  }
});


// Vendor Order Details Routes
app.get('/api/vendor-order-details', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tayira_vendor_order_details ORDER BY ID DESC');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching vendor order details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/vendor-order-details', async (req, res) => {
  const { Vendor_ID, Order_Number, Order_Date, Purchase_category, Purchase_Quantity, Purchase_Amount, Paid_Balance, Paid_Date, Non_Paid_Balance } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO tayira_vendor_order_details (Vendor_ID, Order_Number, Order_Date, Purchase_category, Purchase_Quantity, Purchase_Amount, Paid_Balance, Paid_Date, Non_Paid_Balance) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Vendor_ID, Order_Number, Order_Date, Purchase_category, Purchase_Quantity, Purchase_Amount, Paid_Balance, Paid_Date, Non_Paid_Balance]
    );
    res.status(201).json({ id: result.insertId, message: 'Vendor order added' });
  } catch (error) {
    console.error('Error adding vendor order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update Vendor Order - Enhanced null handling
app.put('/api/vendor-order-details/:id', async (req, res) => {
  const { id } = req.params;
  const { 
    Vendor_ID, 
    Order_Number, 
    Order_Date, 
    Purchase_category, 
    Purchase_Quantity, 
    Purchase_Amount, 
    Paid_Balance, 
    Paid_Date, 
    Non_Paid_Balance 
  } = req.body;
  
  console.log(`Updating vendor order ID: ${id}`, req.body);
  
  try {
    // Validate required fields
    if (!Vendor_ID || !Order_Number || !Order_Date || !Purchase_category || 
        Purchase_Quantity === undefined || !Purchase_Amount || !Paid_Balance || 
        Non_Paid_Balance === undefined) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Check if record exists
    const [existingRows] = await db.execute('SELECT * FROM tayira_vendor_order_details WHERE ID = ?', [id]);
    console.log('Existing vendor order record:', existingRows.length);
    
    if (existingRows.length === 0) {
      return res.status(404).json({ error: "Vendor order not found" });
    }
    
    // Prepare update parameters with null handling
    const updateParams = [
      parseInt(Vendor_ID),           // Convert to integer
      parseInt(Order_Number),        // Convert to integer
      Order_Date,                    // Already formatted as yyyy-MM-dd
      Purchase_category,
      parseInt(Purchase_Quantity),   // Convert to integer
      parseFloat(Purchase_Amount),   // Convert to float
      parseFloat(Paid_Balance),      // Convert to float
      Paid_Date || null,             // Handle null dates
      parseFloat(Non_Paid_Balance),  // Convert to float
      parseInt(id)                   // Convert to integer
    ];
    
    console.log('Update parameters:', updateParams);
    
    const [result] = await db.execute(
      `UPDATE tayira_vendor_order_details 
       SET Vendor_ID=?, Order_Number=?, Order_Date=?, Purchase_category=?, 
           Purchase_Quantity=?, Purchase_Amount=?, Paid_Balance=?, 
           Paid_Date=?, Non_Paid_Balance=? 
       WHERE ID=?`,
      updateParams
    );
    
    console.log('Vendor order update result:', result);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vendor order not found" });
    }
    
    res.json({ message: "Vendor order updated successfully" });
  } catch (error) {
    console.error("Error updating vendor order:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({ error: "Server error", details: error.message });
  }
});


// Delete Vendor Order
app.delete('/api/vendor-order-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute(
      `DELETE FROM tayira_vendor_order_details WHERE ID=?`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vendor order not found" });
    }

    res.json({ message: "Vendor order deleted successfully" });
  } catch (error) {
    console.error("Error deleting vendor order:", error);
    res.status(500).json({ error: "Server error" });
  }
});





// Product Details Routes
app.get('/api/product-details', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tayira_product_details ORDER BY ID DESC');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching product details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/product-details', async (req, res) => {
  // Fixed: Use percent_of_discount instead of _of_Discount
  const { 
    Vendor_order_Id, 
    Category, 
    Product_Name, 
    Product_Quantity, 
    Total_Purchase_Price, 
    Purchase_Price_Per_Qty, 
    Product_Gst_Per_Qty, 
    Product_List_Price_Per_Qty, 
    Product_Sell_Price_Per_Qty, 
    percent_of_discount,  // Changed from _of_Discount
    Total_Product_List_Price, 
    Total_Product_Sell_Price, 
    Gender, 
    Size, 
    Length, 
    Width, 
    Description 
  } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO tayira_product_details (Vendor_order_Id, Category, Product_Name, Product_Quantity, Total_Purchase_Price, Purchase_Price_Per_Qty, Product_Gst_Per_Qty, Product_List_Price_Per_Qty, Product_Sell_Price_Per_Qty, percent_of_discount, Total_Product_List_Price, Total_Product_Sell_Price, Gender, Size, Length, Width, Description) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        Vendor_order_Id, 
        Category, 
        Product_Name, 
        Product_Quantity, 
        Total_Purchase_Price, 
        Purchase_Price_Per_Qty, 
        Product_Gst_Per_Qty, 
        Product_List_Price_Per_Qty, 
        Product_Sell_Price_Per_Qty, 
        percent_of_discount,  // Fixed column name
        Total_Product_List_Price, 
        Total_Product_Sell_Price, 
        Gender, 
        Size, 
        Length, 
        Width, 
        Description
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Product detail added' });
  } catch (error) {
    console.error('Error adding product detail:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Customer Order Details Routes
app.get('/api/customer-order-details', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tayira_customer_order_details ORDER BY ID DESC');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching customer order details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/customer-order-details', async (req, res) => {
  const { 
    Ordered_Product_ID, 
    Ordered_Price, 
    Received_Payment_Amount, 
    Customer_Paid_Amount, 
    Mode_of_Payment, 
    Payment_Transaction_ID, 
    Ordered_Date, 
    Payment_Date, 
    Order_Type, 
    Period_of_EMI 
  } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO tayira_customer_order_details (Ordered_Product_ID, Ordered_Price, Received_Payment_Amount, Customer_Paid_Amount, Mode_of_Payment, Payment_Transaction_ID, Ordered_Date, Payment_Date, Order_Type, Period_of_EMI) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        Ordered_Product_ID, 
        Ordered_Price, 
        Received_Payment_Amount, 
        Customer_Paid_Amount, 
        Mode_of_Payment, 
        Payment_Transaction_ID, 
        Ordered_Date, 
        Payment_Date, 
        Order_Type, 
        Period_of_EMI
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Customer order added' });
  } catch (error) {
    console.error('Error adding customer order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Customer Details Routes
app.get('/api/customer-details', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tayira_customer_details ORDER BY ID DESC');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/customer-details', async (req, res) => {
  const { 
    Order_ID, 
    Customer_Name, 
    Customer_Number, 
    Cust_Alternate_Number, 
    Customer_Billing_Address, 
    Customer_Delivery_Address 
  } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO tayira_customer_details (Order_ID, Customer_Name, Customer_Number, Cust_Alternate_Number, Customer_Billing_Address, Customer_Delivery_Address) VALUES (?, ?, ?, ?, ?, ?)',
      [
        Order_ID, 
        Customer_Name, 
        Customer_Number, 
        Cust_Alternate_Number, 
        Customer_Billing_Address, 
        Customer_Delivery_Address
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Customer added' });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Expense Details Routes
app.get('/api/expense-details', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM tayira_expense_details ORDER BY ID DESC');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching expense details:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/expense-details', async (req, res) => {
  const { 
    Expense_Type, 
    Expense_Amount, 
    Expense_Date, 
    Details 
  } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO tayira_expense_details (Expense_Type, Expense_Amount, Expense_Date, Details) VALUES (?, ?, ?, ?)',
      [Expense_Type, Expense_Amount, Expense_Date, Details]
    );
    res.status(201).json({ id: result.insertId, message: 'Expense added' });
  } catch (error) {
    console.error('Error adding expense:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

//Cart Routes
app.post('/api/addToCart', async (req, res) => {
  const { Customer_PhoneNo, Customer_ID, Product_ID, Product_Name, Old_Price, Final_Price, Size, Color, Quantity, sessionId } = req.body;
  try {
    const [result] = await db.execute(
      'INSERT INTO tayira_cart (Session_ID, Customer_PhoneNo, Customer_ID, Product_ID, Product_Name, Old_Price, Final_Price, Size, Color, Quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [sessionId, Customer_PhoneNo, Customer_ID, Product_ID, Product_Name, Old_Price, Final_Price, Size, Color, Quantity]
    );
    res.status(201).json({ id: result.insertId, message: 'Added in Cart' });
  } catch (error) {
    console.error('Error adding cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch cart - optional filters by sessionId, customerPhone, or customerId
app.get('/api/cart', async (req, res) => {
  const { sessionId, customerPhone, customerId } = req.query;

  try {
    let sql = 'SELECT * FROM tayira_cart';
    const conditions = [];
    const params = [];

    if (sessionId) {
      conditions.push('Session_ID = ?');
      params.push(sessionId);
    }
    if (customerPhone) {
      conditions.push('Customer_PhoneNo = ?');
      params.push(customerPhone);
    }
    if (customerId) {
      conditions.push('Customer_ID = ?');
      params.push(customerId);
    }

    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');
    sql += ' ORDER BY ID DESC';

    const [rows] = await db.execute(sql, params);
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Fetch single cart item by ID
app.get('/api/cart/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await db.execute('SELECT * FROM tayira_cart WHERE ID = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Cart item not found' });
    res.json({ data: rows[0] });
  } catch (error) {
    console.error('Error fetching cart item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete single cart item by ID
app.delete('/api/cart/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM tayira_cart WHERE ID = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Cart item not found' });
    }
    res.json({ message: 'Cart item deleted successfully' });
  } catch (error) {
    console.error('Error deleting cart item:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Bulk delete cart items by sessionId, customerPhone or customerId (requires at least one filter)
app.delete('/api/cart', async (req, res) => {
  const { sessionId, customerPhone, customerId } = req.query;

  if (!sessionId && !customerPhone && !customerId) {
    return res.status(400).json({ error: 'Provide sessionId or customerPhone or customerId to delete items' });
  }

  try {
    let sql = 'DELETE FROM tayira_cart';
    const conditions = [];
    const params = [];

    if (sessionId) {
      conditions.push('Session_ID = ?');
      params.push(sessionId);
    }
    if (customerPhone) {
      conditions.push('Customer_PhoneNo = ?');
      params.push(customerPhone);
    }
    if (customerId) {
      conditions.push('Customer_ID = ?');
      params.push(customerId);
    }

    if (conditions.length) sql += ' WHERE ' + conditions.join(' AND ');

    const [result] = await db.execute(sql, params);
    res.json({ message: 'Cart items deleted', deletedCount: result.affectedRows });
  } catch (error) {
    console.error('Error deleting cart items:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Orders Routes
app.get('/api/orders', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM orders ORDER BY Created_At DESC');
    res.json({ data: rows });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/orders', async (req, res) => {
  const { 
    Order_ID, 
    Customer_ID, 
    Total_Amount, 
    Discount_Amount, 
    Final_Amount, 
    Payment_Method, 
    Transaction_ID, 
    Delivery_Address, 
    Billing_Address, 
    Notes 
  } = req.body;
  
  try {
    const [result] = await db.execute(
      'INSERT INTO orders (Order_ID, Customer_ID, Total_Amount, Discount_Amount, Final_Amount, Payment_Method, Transaction_ID, Delivery_Address, Billing_Address, Notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [Order_ID, Customer_ID, Total_Amount, Discount_Amount, Final_Amount, Payment_Method, Transaction_ID, Delivery_Address, Billing_Address, Notes]
    );
    res.status(201).json({ id: result.insertId, message: 'Order created' });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.execute('SELECT * FROM orders WHERE ID = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ data: rows[0] });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  const { Payment_Status, Order_Status, Transaction_ID } = req.body;
  
  try {
    const [result] = await db.execute(
      `UPDATE orders 
       SET Payment_Status = ?, Order_Status = ?, Transaction_ID = ? 
       WHERE ID = ?`,
      [Payment_Status, Order_Status, Transaction_ID, id]
    );
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order updated successfully' });
  } catch (error) {
    console.error('Error updating order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/orders/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.execute('DELETE FROM orders WHERE ID = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});