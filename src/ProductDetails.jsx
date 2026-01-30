import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ProductDetails.css';

function ProductDetails({ onAddToCart }) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:3000/api/products/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))
            .catch(err => console.error(err));
    }, [id]);

    if (!product) {
        return (
            <div style={{ padding: '100px', textAlign: 'center', color: 'white' }}>
                <h2>Loading Product...</h2>
                <p>Retrieving details from the secure database.</p>
            </div>
        );
    }

    const handleWhatsApp = () => {
        if (!product) return;
        const phone = product.seller_phone || '254700000000';
        const msg = `Hi, I am interested in your ${product.title} listed on GenMax.`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    };

    const handleAdd = () => {
        // Add multiple times defined by quantity
        for (let i = 0; i < quantity; i++) {
            onAddToCart(product);
        }
        // Could add a toast notification here
        alert(`Added ${quantity} ${product.title} to cart!`);
    };

    return (
        <div className="product-details-container">
            <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#888', marginBottom: '20px', cursor: 'pointer' }}>
                ← Back to Results
            </button>

            <div className="details-grid">
                <div className="details-image">
                    <img src={product.image} alt={product.title} />
                </div>

                <div className="details-info">
                    <span style={{ color: '#0070f3', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.9rem' }}>{product.category}</span>
                    <h1>{product.title}</h1>
                    <div className="details-price">{product.price}</div>

                    <p className="details-description">
                        Experience the future with the {product.title}. This item represents the pinnacle of {product.category} engineering.
                        Verified by GenMax secure protocols.
                    </p>

                    <div className="seller-info" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', padding: '15px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                        <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400" style={{ width: '40px', height: '40px', borderRadius: '50%' }} alt="Seller" />
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold' }}>{product.seller_name || "Verified Seller"}</div>
                            <div style={{ fontSize: '0.8rem', color: '#888' }}>Member since 2024</div>
                        </div>
                        <button onClick={handleWhatsApp} style={{ background: '#25D366', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
                            <span>📱</span> Chat
                        </button>
                    </div>

                    <div className="details-actions">
                        <div className="quantity-selector">
                            <button className="qty-btn" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span className="qty-display">{quantity}</span>
                            <button className="qty-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button className="add-cart-btn" onClick={handleAdd}>ADD TO CART</button>
                    </div>
                </div>
            </div>

            <div className="reviews-section">
                <h3>User Reviews (3)</h3>
                <div className="review-card">
                    <div className="stars">★★★★★</div>
                    <p><strong>Alex M.</strong> - "Incredible quality. Fast shipping via drone delivery!"</p>
                </div>
                <div className="review-card">
                    <div className="stars">★★★★☆</div>
                    <p><strong>Sarah K.</strong> - "Works exactly as described. The future is here."</p>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
