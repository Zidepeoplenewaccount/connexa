import { useState, useEffect } from 'react';
import './Gallery.css';
import GroupPhoto from '../assets/IMG_0132.jpg';
import ZideTeamPhoto from '../assets/IMG_0164.jpg';
import EmptyRoom from '../assets/MLD00002.jpg';
import GirlHoldingIGThingy from '../assets/MLD00080.jpg';
import SameGirlSmiling from '../assets/MLD00181.jpg';
import MokiGoingOffStage from '../assets/MLD00332.jpg';
import BackViewOfAppReview from '../assets/MLD00437.jpg';
import MokiAskingQuestion from '../assets/MLD00501.jpg';
import FirstSpeaker from '../assets/MLD00519.jpg';
import LinkdinGuySpeaking from '../assets/MLD00575.jpg';
import AnimatorGuySpeaking from '../assets/MLD00633.jpg';
import HannahSpeaking from '../assets/MLD00651.jpg';
import EstherSpeaking from '../assets/MLD00705.jpg';
import LinkedinAndHrGuyClass from '../assets/MLD00732.jpg';
import AnimatorGuyClass from '../assets/MLD00743.jpg';
import CoreZideTeamPhoto from '../assets/MLD00876.jpg';

export default function Gallery() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxImage, setLightboxImage] = useState(null);

  // Placeholder images - replace with actual event photos
  const images = [
    {
      id: 1,
      url:  GroupPhoto,
      caption: '',
      alt: 'Keynote speaker on stage'
    },
    {
      id: 2,
      url: ZideTeamPhoto,
      caption: '',
      alt: 'Zide team members'
    },
    {
      id: 3,
      url: EmptyRoom,
      caption: '',
      alt: 'Empty conference room'
    },
    {
      id: 4,
      url: GirlHoldingIGThingy,
      caption: '',
      alt: 'Girl holding Instagram thingy'
    },
    {
      id: 5,
      url: SameGirlSmiling,
      caption: '',
      alt: 'Same girl smiling'
    },
    {
      id: 6,
      url: MokiGoingOffStage,
      caption: '',
      alt: 'Moki going off stage'
    },
    {
      id: 7,
      url: BackViewOfAppReview,
      caption: 'Zidepeople App Demo',
      alt: 'Back view of app review'
    },
    {
      id: 8,
      url: MokiAskingQuestion,
      caption: '',
      alt: 'Moki asking a question'
    },
    {
      id: 9,
      url: FirstSpeaker,
      caption: 'Victor Adeyemo - "What HR Professionals Look For In Candidates".',
      alt: 'First speaker on stage'
    },
    {
      id: 10,
      url: LinkdinGuySpeaking,
      caption: 'Oladotun Ajayi - "Leveraging Social Media to Build Skills and Meet Global Industry Demands".',
      alt: 'LinkedIn guy speaking'
    },
    {
      id: 11,
      url: AnimatorGuySpeaking,
      caption: 'Chukwukere Oriaku - "Zidepeople: A Digital Platform for Flexible Jobs in Nigeria".',
      alt: 'Animator guy speaking'
    },
    {
      id: 12,
      url: HannahSpeaking,
      caption: 'Hannah Adejugbagbe - "Personal Branding and Online Perception".',
      alt: 'Hannah speaking'
    },
    {
      id: 13,
      url: EstherSpeaking,
      caption: 'Esther Oyeleye - "Turning Your SKills into Profits and How Zidepeople Helps You Earn Flexibly".',
      alt: 'Esther speaking'
    },
    {
        id : 14, 
        url : LinkedinAndHrGuyClass, 
        caption : "Victor And Oladotun private class", 
        alt : "LinkedIn and HR guy in class"
     },
     {
        id : 15, 
        url : AnimatorGuyClass, 
        caption : "Chukwukere Oriaku private class", 
        alt : "Animator guy in class"
     },
     {
        id : 16, 
        url : CoreZideTeamPhoto, 
        caption : "Core Zidepeople team photo", 
        alt : "Core Zide team photo"
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
          <p>Relive the energy, connections, and moments from The Future of Flexible Work 2025</p>
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
                  {/* Placeholder gradient if image doesn't exist 
                  <div className="gallery-placeholder">
                    <span className="gallery-placeholder-icon">📸</span>
                    <p>Event Photo {index + 1}</p>
                  </div>*/}
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
            <img src={lightboxImage.url} alt={lightboxImage.alt} loading="lazy"/>
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