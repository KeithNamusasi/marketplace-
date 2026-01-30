import React, { useState, useEffect } from 'react';
import './Profile.css';
import ProductCard from './ProductCard';

function Profile({ products = [] }) {
    const [user, setUser] = useState({ name: 'Loading...', email: '', phone: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const res = await fetch('http://localhost:3000/api/user/profile', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setUser(data);
                setEditForm(data);
            } catch (err) {
                console.error("Failed to load profile", err);
            }
        };
        fetchProfile();
    }, []);

    const handleUpdate = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        try {
            const res = await fetch('http://localhost:3000/api/user/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(editForm)
            });
            if (res.ok) {
                setUser(editForm);
                setIsEditing(false);
                alert("Profile Updated!");
            } else {
                alert("Update failed");
            }
        } catch (err) {
            alert("Update failed");
        }
    };

    const myListings = products.filter(p => p.seller_id === user.id);

    return (
        <div className="profile-container">
            <div className="profile-card">
                <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400"
                    alt="Profile"
                    className="profile-avatar"
                />
                <div className="profile-info">
                    {isEditing ? (
                        <form onSubmit={handleUpdate} className="edit-profile-form" style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                            <input className="edit-input" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} placeholder="Name" />
                            <input className="edit-input" value={editForm.phone || ''} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} placeholder="Phone (e.g. 2547...)" />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <button type="submit" className="save-btn" style={{ background: '#0070f3', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Save</button>
                                <button type="button" onClick={() => setIsEditing(false)} className="cancel-btn" style={{ background: '#333', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                            </div>
                        </form>
                    ) : (
                        <>
                            <h6>Verified Member</h6>
                            <h1>{user.name}</h1>
                            <p style={{ color: '#888' }}>{user.email} • {user.phone || "No Phone Added"}</p>

                            <div className="profile-stats">
                                <div><span>{myListings.length}</span> Listings</div>
                                <div><span>4.9</span> Rating</div>
                                <div><span>12</span> Sales</div>
                            </div>

                            <div className="profile-actions">
                                <button className="btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div className="my-listings">
                <h2 className="listing-header">My Active <span>Listings</span></h2>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px' }}>
                    {myListings.map(item => (
                        <ProductCard key={item.id} item={item} onAddToCart={() => { }} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Profile;
