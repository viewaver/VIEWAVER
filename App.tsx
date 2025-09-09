import React, { useState, useRef, useEffect } from 'react';
import Gallery from './components/Gallery';
import Polyhedron from './components/Polyhedron';
import Clock from './components/Clock';

// Tentukan 6 gambar yang akan diulang
const imageUrls = [
  'https://picsum.photos/seed/sky/200',
  'https://picsum.photos/seed/forest/200',
  'https://picsum.photos/seed/water/200',
  'https://picsum.photos/seed/fire/200',
  'https://picsum.photos/seed/earth/200',
  'https://picsum.photos/seed/wind/200',
];

// Tentukan bentuk objek gambar kita
interface RevealedImage {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  rotation: number; // Properti untuk rotasi, akan diatur ke 0
  opacity: number;
}

const SPAWN_INTERVAL = 30; // milidetik - Pemunculan lebih cepat
const IMAGE_LIFESPAN = 800; // md - Berapa lama gambar tetap terlihat penuh (lebih pendek)
const TRANSITION_DURATION = 400; // md - Durasi fade-in/out (lebih cepat)

// Generator Angka Pseudo-Acak (PRNG) sederhana dengan seed untuk konsistensi
function createSeededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const App: React.FC = () => {
  // State untuk menampung gambar di layar
  const [images, setImages] = useState<RevealedImage[]>([]);
  // State untuk mengontrol halaman mana yang ditampilkan
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const targetRotation = useRef({ x: 0, y: 0 });
  const lastSpawnTime = useRef(0);
  const imageIndexRef = useRef(0);
  // Inisialisasi PRNG kita dengan seed tetap untuk hasil yang konsisten
  const random = useRef(createSeededRandom(42)).current;

  useEffect(() => {
    let animationFrameId: number;
    const animate = () => {
      setRotation(currentRotation => {
        const newX = currentRotation.x + (targetRotation.current.x - currentRotation.x) * 0.05;
        const newY = currentRotation.y + (targetRotation.current.y - currentRotation.y) * 0.05;
        if (Math.abs(currentRotation.x - targetRotation.current.x) < 0.0001 &&
            Math.abs(currentRotation.y - targetRotation.current.y) < 0.0001) {
            return targetRotation.current;
        }
        return { x: newX, y: newY };
      });
      animationFrameId = requestAnimationFrame(animate);
    };
    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Efek untuk menyisipkan keyframes animasi warna neon
  useEffect(() => {
    const neonColors = ['#ff00ff', '#00ffff', '#ffff00', '#ff0000', '#00ff00', '#0000ff'];
    const keyframes = `
      @keyframes neon-stroke {
        ${neonColors.map((color, index) => `${(index / neonColors.length) * 100}% { -webkit-text-stroke-color: ${color}; }`).join('\n')}
        100% { -webkit-text-stroke-color: ${neonColors[0]}; }
      }
    `;
    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
  
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { offsetWidth, offsetHeight } = currentTarget;
    
    const x = (clientX - offsetWidth / 2) / (offsetWidth / 2);
    const y = (clientY - offsetHeight / 2) / (offsetHeight / 2);

    const rotationFactor = Math.PI / 2;
    targetRotation.current = {
      x: -y * rotationFactor,
      y: x * rotationFactor,
    };

    // Berhenti memunculkan gambar jika kita berada di halaman galeri
    if (isGalleryVisible) return;

    const now = Date.now();
    if (now - lastSpawnTime.current < SPAWN_INTERVAL) {
      return; // Throttling pembuatan gambar
    }
    lastSpawnTime.current = now;

    // Berputar melalui gambar yang telah ditentukan sebelumnya
    const imageUrl = imageUrls[imageIndexRef.current];
    imageIndexRef.current = (imageIndexRef.current + 1) % imageUrls.length;

    // Gunakan nilai konsisten untuk ukuran dan posisi
    const size = 120; // Ukuran tetap (diperbesar)
    const rotation = 0; // Tidak ada rotasi
    const offsetX = 0; // Tidak ada pergeseran X
    const offsetY = 0; // Tidak ada pergeseran Y

    const newImage: RevealedImage = {
      id: now,
      src: imageUrl,
      x: event.clientX + offsetX,
      y: event.clientY + offsetY,
      size: size,
      rotation: rotation,
      opacity: 1, // Mulai terlihat, hapus fade-in
    };

    // Tambahkan gambar baru
    setImages(prevImages => {
      const updatedImages = [...prevImages, newImage];
      // Batasi jumlah gambar di layar untuk mencegah masalah kinerja
      if (updatedImages.length > 30) {
        return updatedImages.slice(updatedImages.length - 30);
      }
      return updatedImages;
    });

    // Atur timer untuk fade out lalu hapus gambar
    setTimeout(() => {
      setImages(prevImages =>
        prevImages.map(img =>
          img.id === newImage.id ? { ...img, opacity: 0 } : img
        )
      );
      // Hapus dari DOM setelah transisi fade-out
      setTimeout(() => {
        setImages(prevImages => prevImages.filter(img => img.id !== newImage.id));
      }, TRANSITION_DURATION); // Harus cocok dengan durasi transisi CSS
    }, IMAGE_LIFESPAN);
  };
  
  const handleGalleryClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault(); // Mencegah perilaku tautan default
    setIsGalleryVisible(true);
  };

  const handleGoBack = () => {
    setIsGalleryVisible(false);
  }

  return (
    <div 
      className={`relative w-screen h-screen overflow-hidden transition-colors duration-700 ease-in-out ${
        isGalleryVisible ? 'bg-gray-100' : ''
      }`}
      onMouseMove={handleMouseMove}
      role="application"
      aria-label="Interactive image canvas, move your mouse to reveal images and rotate the central shape"
    >
      {/* Latar Belakang Kota (Paling Belakang) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isGalleryVisible ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          backgroundImage: "url('https://lh3.googleusercontent.com/pw/AP1GczMaLWl2MVQzXi-u3RkzzAPR5-XF2w6W1NP8IgW7jOo04rEftFbbNwLf8CvA4t4ihssw3L3qP1g7vLJ6SXrs-UIfBwRO6q18f0crw1LUNx8Isy9ixw=w2400?source=screenshot.guru')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      
      {/* Latar Belakang Awan (Lapisan Tengah) */}
      <div 
        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isGalleryVisible ? 'opacity-0' : 'opacity-100'}`}
        style={{ 
          backgroundImage: "url('https://lh3.googleusercontent.com/pw/AP1GczPWWgB-K9mMX7FBX_MMSkjGhLPol6jCy1rOPFwUaEAeqeGSNMyfacHy-IDyK6FnsHeeSadG1jUdyhoTi57LCsEVX9Y7GJ3wjq5aeFVVGfYKLRl0fA=w2400?source=screenshot.guru')",
          backgroundSize: 'contain',
          backgroundPosition: '80% center',
          backgroundRepeat: 'no-repeat'
        }}
      />

      {/* Konten Utama (Lapisan Atas) */}
      <div className={`relative w-full h-full transition-opacity duration-700 ease-in-out ${isGalleryVisible ? 'opacity-0' : 'opacity-100'}`}>
          <h1
            className="absolute top-12 left-20 text-8xl font-['Metal_Mania'] pointer-events-none select-none"
            style={{
              WebkitTextStroke: '1px white', // Goresan lebih tipis
              color: 'transparent',
              animation: 'neon-stroke 1s linear infinite' // Terapkan animasi
            }}
            aria-label="VIEWAVER"
          >
            VIEWAVER
          </h1>
          <div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            style={{ transform: 'translateY(4rem)' }} // Digeser ke bawah
          >
              <Polyhedron 
                rotationX={rotation.x} 
                rotationY={rotation.y} 
                size={400} // Dibuat lebih besar
                color="#ffd0e0"
              />
          </div>

          <a
            href="#"
            onClick={handleGalleryClick}
            className="absolute top-1/2 right-8 transform -translate-y-1/2 p-4 rounded-full bg-white/5 backdrop-blur-sm hover:bg-white/15 transition-all duration-300 group"
            aria-label="Buka galeri"
          >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
          </a>
          <Clock />
      </div>
      
      {/* Gambar yang Dihasilkan Gerakan Mouse */}
      <div className="absolute inset-0 pointer-events-none">
        {images.map(image => (
          <img
            key={image.id}
            src={image.src}
            alt=""
            className="absolute"
            style={{
              left: image.x,
              top: image.y,
              width: `${image.size}px`,
              height: `${image.size}px`,
              transform: `translate(-50%, -50%) rotate(${image.rotation}deg)`,
              opacity: image.opacity,
              transition: `opacity ${TRANSITION_DURATION}ms ease-out, transform ${TRANSITION_DURATION}ms ease-out`,
              willChange: 'opacity, transform',
            }}
          />
        ))}
      </div>

      <Gallery onBack={handleGoBack} isVisible={isGalleryVisible} />
    </div>
  );
};

export default App;