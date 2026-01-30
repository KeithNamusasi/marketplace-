import React from 'react';
import './ProductCard.css';

import { Link } from 'react-router-dom';

function ProductCard({ item, onAddToCart }) {
  return (
    <div className="card-glass">
      <div className="card-image">
        <img src={item.image} alt={item.title} />
        <span className="card-tag">{item.category}</span>
      </div>

      <div className="card-content">
        <h3>{item.title}</h3>
        <p className="card-price">{item.price}</p>

        <div className="card-footer">
          <Link to={`/product/${item.id}`} className="btn-details" style={{ textDecoration: 'none', textAlign: 'center' }}>Details</Link>
          <button className="btn-buy" onClick={() => onAddToCart(item)}>Buy Now</button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;