import { useState, useEffect } from 'react';
import './gallery.css';

export default function Gallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Placeholder images - replace with actual event photos
  const images = [
    {
      id: 1,
      url: '/gallery/event-1.jpg',
      caption: 'Opening keynote - Connexa 2025',
      alt: 'Keynote speaker on stage'
    },
    {
      id: 2,
      url: '/gallery/event-2.jpg',
      caption: 'Networking session with industry leaders',
      alt: 'Attendees networking'
    },
    {
      id: 3,
      url: '/gallery/event-3.jpg',
      caption: 'Panel discussion on flexible work',
      alt: 'Panel discussion'
    },
    {
      id: 4,
      url: '/gallery/event-4.jpg',
      caption: 'Vendor marketplace in action',
      alt: 'Vendor booths'
    },
    {
      id: 5,
      url: '/gallery/event-5.jpg',
      caption: 'Award ceremony winners',
      alt: 'Award winners on stage'
    },
    {
      id: 6,
      url: '/gallery/event-6.jpg',
      caption: 'Community connections',
      alt: 'Group photo'
    },
    {
      id: 7,
      url: '/gallery/event-7.jpg',
      caption: 'Workshop sessions',
      alt: 'Workshop in progress'
    },
    {
      id: 8,
      url: '/gallery/event-8.jpg',
      caption: 'Closing celebration',
      alt: 'Closing event'
    }
  ];

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % images.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [images.length]);

  function nextSlide() {
    setCurrentSlide((prev) => (prev + 1) % images.length);
  }

  function prevSlide() {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length);
  }

  function goToSlide(index) {
    setCurrentSlide(index);
  }

  function openLightbox(image) {
    setLightboxImage(image);
    setIsLightboxOpen(true);
  }

  function closeLightbox() {
    setIsLightboxOpen(false);
    setLightboxImage(null);
  }

  return (
    <section className="gallery-section" id="gallery">
      <div className="container">
        <div className="gallery-header">
          <span className="section-tag">MEMORIES</span>
          <h2 className="section-title">
            Last Year's <span className="highlight-orange">Highlights</span>
          </h2>
          <p>Relive the energy, connections, and moments from Connexa 2025</p>
        </div>

        {/* Main Slideshow */}
        <div className="gallery-slideshow">
          <div className="gallery-slides">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`gallery-slide ${index === currentSlide ? 'active' : ''}`}
                onClick={() => openLightbox(image)}
              >
                <div 
                  className="gallery-slide-image"
                  style={{ 
                    backgroundImage: `url(${image.url})`,
                    backgroundColor: '#1a1a1a' // Fallback while images load
                  }}
                >
                  {/* Placeholder gradient if image doesn't exist */}
                  <div className="gallery-placeholder">
                    <span className="gallery-placeholder-icon">📸</span>
                    <p>Event Photo {index + 1}</p>
                  </div>
                </div>
                <div className="gallery-slide-caption">
                  <p>{image.caption}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          <button className="gallery-nav gallery-nav-prev" onClick={prevSlide}>
            ←
          </button>
          <button className="gallery-nav gallery-nav-next" onClick={nextSlide}>
            →
          </button>

          {/* Slide Counter */}
          <div className="gallery-counter">
            {currentSlide + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Navigation */}
        <div className="gallery-thumbnails">
          {images.map((image, index) => (
            <button
              key={image.id}
              className={`gallery-thumbnail ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              style={{ backgroundImage: `url(${image.url})` }}
            >
              <div className="gallery-thumbnail-overlay">
                <span>{index + 1}</span>
              </div>
            </button>
          ))}
        </div>

        {/* Grid View */}
        <div className="gallery-grid">
          <h3>Event Moments</h3>
          <div className="gallery-grid-items">
            {images.map((image) => (
              <div
                key={image.id}
                className="gallery-grid-item"
                onClick={() => openLightbox(image)}
              >
                <div 
                  className="gallery-grid-image"
                  style={{ backgroundImage: `url(${image.url})` }}
                >
                  <div className="gallery-grid-overlay">
                    <span className="gallery-grid-icon">🔍</span>
                  </div>
                  {/* Placeholder */}
                  <div className="gallery-placeholder">
                    <span className="gallery-placeholder-icon">📸</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {isLightboxOpen && lightboxImage && (
        <div className="gallery-lightbox" onClick={closeLightbox}>
          <button className="gallery-lightbox-close" onClick={closeLightbox}>
            ×
          </button>
          <div 
            className="gallery-lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={lightboxImage.url} alt={lightboxImage.alt} />
            <div className="gallery-lightbox-caption">
              <p>{lightboxImage.caption}</p>
            </div>
            <button className="gallery-lightbox-nav gallery-lightbox-prev" onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex(img => img.id === lightboxImage.id);
              const prevIndex = (currentIndex - 1 + images.length) % images.length;
              setLightboxImage(images[prevIndex]);
            }}>
              ←
            </button>
            <button className="gallery-lightbox-nav gallery-lightbox-next" onClick={(e) => {
              e.stopPropagation();
              const currentIndex = images.findIndex(img => img.id === lightboxImage.id);
              const nextIndex = (currentIndex + 1) % images.length;
              setLightboxImage(images[nextIndex]);
            }}>
              →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}