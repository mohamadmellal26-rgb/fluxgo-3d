import { useState } from 'react';
import { Search } from 'lucide-react';
import './Discover.css';

interface TemplateProject {
  id: string;
  title: string;
  category: string;
}

const TEMPLATE_ITEMS: TemplateProject[] = [
  { id: '1', title: 'Cube Interaction', category: '3D' },
  { id: '2', title: 'Play Jam Typography', category: 'Motion' },
  { id: '3', title: 'The Castle Scene', category: '3D' },
  { id: '4', title: 'Modern Landing Page', category: 'Website' },
  { id: '5', title: 'Corporate Slide Deck', category: 'Presentation' },
];

const CATEGORIES = ['All', 'Presentation', 'Motion', '3D', 'Website'];

export default function Discover() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? TEMPLATE_ITEMS 
    : TEMPLATE_ITEMS.filter(item => item.category === activeCategory);

  return (
    <div className="discover-container">
      
      {/* القسم العلوي المتمركز */}
      <header className="discover-header-centered">
        <div className="title-badge-wrapper">
          <h1 className="discover-title">Explore What's New</h1>
          <span className="new-badge">NEW</span>
        </div>
        <p className="discover-subtitle">
          Explore the new 3D Shape effect and more in Hana — pick a template below to get started.
        </p>

        {/* شريط البحث */}
        <div className="search-box-centered">
          <Search className="search-icon" />
          <input 
            type="text" 
            placeholder="Find a template" 
            className="search-input-centered" 
          />
        </div>

        {/* شريط التصنيفات المتمركز */}
        <div className="categories-bar-centered">
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              className={`category-pill ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* شبكة القوالب */}
      <section className="discover-section">
        <div className="discover-grid">
          {filteredItems.map(item => (
            <div key={item.id} className="template-card-wrapper">
              <div className="template-preview" />
              <h3 className="template-title">{item.title}</h3>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}