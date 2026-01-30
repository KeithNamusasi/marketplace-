import React, { useState } from 'react';
import './Cart.css';

function Cart({ onClose, items, onRemove }) {
    const [paymentMethod, setPaymentMethod] = useState(null); // 'mpesa'
    const [phone, setPhone] = useState('');
    const [processing, setProcessing] = useState(false);
    const [showSTK, setShowSTK] = useState(false);
    const [pin, setPin] = useState('');

    const total = items.reduce((sum, item) => {
        // Basic price parsing for "1,200 KES" string
        const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
        return sum + (price || 0);
    }, 0);

    const handleCheckout = () => {
        setPaymentMethod('mpesa');
    };

    const payWithMpesa = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const res = await fetch('http://localhost:3000/api/payment/mpesa', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone, amount: total })
            });
            const data = await res.json();

            if (data.success) {
                // Instead of immediate alert, show the STK simulation
                setTimeout(() => {
                    setProcessing(false);
                    setShowSTK(true);
                }, 1000);
            }
        } catch (err) {
            alert("Payment failed");
            setProcessing(false);
        }
    };

    const handleConfirmPin = (e) => {
        e.preventDefault();
        if (pin.length === 4) {
            alert(`Success! Payment of ${total.toLocaleString()} KES for GenMax Order processed via M-Pesa.`);
            setShowSTK(false);
            onClose();
        } else {
            alert("Please enter a 4-digit PIN");
        }
    };

    return (
        <div className="cart-overlay">
            {showSTK && (
                <div className="stk-simulate-overlay">
                    <div className="stk-phone-ui">
                        <div className="stk-header">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/1/15/M-Pesa_logo-01.png" alt="M-Pesa" style={{ height: '30px' }} />
                        </div>
                        <div className="stk-body">
                            <p>Do you want to pay {total.toLocaleString()} KES to <strong>GenMax Marketplace</strong>?</p>
                            <form onSubmit={handleConfirmPin}>
                                <input
                                    type="password"
                                    placeholder="Enter M-PESA PIN"
                                    maxLength="4"
                                    value={pin}
                                    onChange={(e) => setPin(e.target.value)}
                                    autoFocus
                                />
                                <div className="stk-actions">
                                    <button type="submit" className="stk-btn confirm">Send</button>
                                    <button type="button" className="stk-btn cancel" onClick={() => setShowSTK(false)}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <div className="cart-sidebar">
                <div className="cart-header">
                    <h2>Your Cart ({items.length})</h2>
                    <button className="close-cart" onClick={onClose}>✕</button>
                </div>

                <div className="cart-items">
                    {items.length === 0 ? (
                        <p style={{ textAlign: 'center', color: '#666', marginTop: '40px' }}>Your cart is empty.</p>
                    ) : (
                        items.map((item, index) => (
                            <div key={`${item.id}-${index}`} className="cart-item">
                                <img src={item.image} alt={item.title} className="cart-item-image" />
                                <div className="cart-item-details">
                                    <h4>{item.title}</h4>
                                    <div className="cart-item-price">{item.price}</div>
                                    <button className="remove-btn" onClick={() => onRemove(index)}>Remove</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                <div className="cart-footer">
                    <div className="total-row">
                        <span>Total</span>
                        <span>{total.toLocaleString()} KES</span>
                    </div>

                    {paymentMethod === 'mpesa' ? (
                        <form onSubmit={payWithMpesa} className="mpesa-form" style={{ marginTop: '20px' }}>
                            <h4 style={{ marginBottom: '10px', color: '#25D366' }}>M-PESA Checkout</h4>
                            <input
                                type="text"
                                placeholder="Phone (e.g., 2547...)"
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #333', background: '#222', color: 'white' }}
                                required
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="checkout-btn"
                                style={{ background: processing ? '#555' : '#25D366' }}
                            >
                                {processing ? "Sending STK Push..." : "Pay Now"}
                            </button>
                            <button type="button" onClick={() => setPaymentMethod(null)} style={{ background: 'none', border: 'none', color: '#888', width: '100%', marginTop: '10px', cursor: 'pointer' }}>Back</button>
                        </form>
                    ) : (
                        items.length > 0 && <button className="checkout-btn" onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Cart;
