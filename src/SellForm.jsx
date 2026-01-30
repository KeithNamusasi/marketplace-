import React, { useState } from 'react';
import './SellForm.css';

function SellForm({ onAddProduct }) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: 'Tech',
    image: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price) return;

    const token = localStorage.getItem('token');
    if (!token) {
      alert("You must be logged in to sell!");
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: formData.name,
          price: formData.price,
          category: formData.category,
          image: formData.image,
          description: "User listed item."
        })
      });

      if (!response.ok) throw new Error('Failed to create product');

      const newProduct = await response.json();
      onAddProduct(newProduct);
      alert(`Listing Created: ${formData.name}`);

      setFormData({ name: '', price: '', category: 'Tech', image: '' });

    } catch (error) {
      console.error("Error selling item:", error);
      alert("Failed to list item. Please try again.");
    }
  };

  return (
    <section className="sell-section">
      <div className="sell-form-container">
        <h2 className="form-title">Launch Your <span>Product</span></h2>
        <form onSubmit={handleSubmit} className="futuristic-form">
          <div className="input-group">
            <label>Item Name</label>
            <input
              type="text"
              value={formData.name}
              placeholder="e.g. Cyber Helmet v2"
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <label>Image URL</label>
            <input
              type="text"
              value={formData.image}
              placeholder="https://..."
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
          </div>

          <div className="input-row">
            <div className="input-group">
              <label>Price (KES)</label>
              <input
                type="number"
                value={formData.price}
                placeholder="0.00"
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option>Tech</option>
                <option>Fashion</option>
                <option>Automotive</option>
                <option>Real Estate</option>
                <option>Home & Garden</option>
                <option>Services</option>
              </select>
            </div>
          </div>

          <button type="submit" className="launch-btn">Initialize Listing</button>
        </form>
      </div>
    </section>
  );
}

export default SellForm;