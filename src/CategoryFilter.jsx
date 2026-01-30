import React from 'react';
import './CategoryFilter.css';

const categories = [
    "All",
    "Tech",
    "Fashion",
    "Automotive",
    "Real Estate",
    "Home & Garden",
    "Services",
    "Collectibles"
];

function CategoryFilter({ selectedCategory, onSelectCategory }) {
    return (
        <div className="category-filter">
            {categories.map(cat => (
                <button
                    key={cat}
                    className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                    onClick={() => onSelectCategory(cat)}
                >
                    {cat}
                </button>
            ))}
        </div>
    );
}

export default CategoryFilter;
