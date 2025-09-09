import React, { useState, useRef, useMemo, useEffect, useCallback } from 'react';

// Generator Angka Pseudo-Acak (PRNG) untuk layout yang konsisten
function createSeededRandom(seed: number) {
  return function() {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

const galleryImages = [
    { src: 'https://picsum.photos/seed/a/400/600', title: 'Jendela Menuju Langit', description: 'Sebuah eksplorasi vertikal tentang kontras dan aspirasi.' },
    { src: 'https://picsum.photos/seed/b/500/300', title: 'Cakrawala Senja', description: 'Warna-warna hangat yang memudar di penghujung hari.' },
    { src: 'https://picsum.photos/seed/c/300/400', title: 'Potret Hening', description: 'Momen ketenangan yang tertangkap dalam bingkai.' },
    { src: 'https://picsum.photos/seed/d/600/400', title: 'Bentangan Impian', description: 'Lanskap sureal di mana kenyataan bertemu fantasi.' },
    { src: 'https://picsum.photos/seed/e/350/500', title: 'Lorong Kenangan', description: 'Sebuah perjalanan visual melalui jalan setapak yang terlupakan.' },
    { src: 'https://picsum.photos/seed/f/550/350', title: 'Gema Perkotaan', description: 'Dinamika kehidupan kota dalam satu sapuan kuas.' },
    { src: 'https://picsum.photos/seed/g/400/400', title: 'Keseimbangan Sempurna', description: 'Harmoni bentuk dan ruang dalam komposisi simetris.' },
    { src: 'https://picsum.photos/seed/h/300/500', title: 'Pilar Cahaya', description: 'Struktur yang menjulang, menantang gravitasi dan kegelapan.' },
    { src: 'https://picsum.photos/seed/i/500/600', title: 'Misteri Hutan Pinus', description: 'Kedalaman dan keteduhan hutan yang mengundang.' },
    { src: 'https://picsum.photos/seed/j/600/500', title: 'Padang Pasir Emas', description: 'Keagungan dan kesunyian gurun di bawah matahari.' },
    { src: 'https://picsum.photos/seed/k/320/480', title: 'Refleksi Diri', description: 'Permukaan air yang tenang memantulkan jiwa.' },
    { src: 'https://picsum.photos/seed/l/480/320', title: 'Jalan Pulang', description: 'Garis-garis yang menuntun mata menuju ketenangan.' },
    { src: 'https://picsum.photos/seed/m/500/500', title: 'Simpul Waktu', description: 'Sebuah abstraksi tentang masa lalu, kini, dan masa depan.' },
    { src: 'https://picsum.photos/seed/n/380/520', title: 'Menara Gading', description: 'Isolasi dan keindahan dalam kesendirian.' },
    { src: 'https://picsum.photos/seed/o/520/380', title: 'Sungai Kehidupan', description: 'Aliran tanpa henti yang membentuk lanskap.' },
    { src: 'https://picsum.photos/seed/p/450/600', title: 'Gerbang Fajar', description: 'Harapan baru yang terbit bersama mentari.' },
    { src: 'https://picsum.photos/seed/q/600/450', title: 'Melodi Visual', description: 'Ritme dan gerakan yang tertuang dalam warna.' },
    { src: 'https://picsum.photos/seed/r/300/300', title: 'Inti Energi', description: 'Pusat kekuatan dalam bentuk yang paling murni.' },
    { src: 'https://picsum.photos/seed/s/700/400', title: 'Jembatan Antar Dunia', description: 'Struktur yang menghubungkan dua realitas berbeda.' },
    { src: 'https://picsum.photos/seed/t/400/700', title: 'Air Terjun Beku', description: 'Gerakan yang diabadikan dalam keheningan es.' },
    { src: 'https://picsum.photos/seed/u/420/580', title: 'Tarian Bayangan', description: 'Interaksi antara cahaya dan kegelapan.' },
    { src: 'https://picsum.photos/seed/v/580/420', title: 'Puncak Ambisi', description: 'Pemandangan dari atas, setelah perjuangan panjang.' },
    { src: 'https://picsum.photos/seed/w/600/600', title: 'Mandala Kosmik', description: 'Pola universal yang mengatur alam semesta.' },
    { src: 'https://picsum.photos/seed/x/350/650', title: 'Serat Kayu', description: 'Kisah waktu yang terukir dalam setiap garis.' },
    { src: 'https://picsum.photos/seed/y/650/350', title: 'Garis Pantai Tak Berujung', description: 'Pertemuan abadi antara darat dan laut.' },
    { src: 'https://picsum.photos/seed/z/500/400', title: 'Jendela Imajinasi', description: 'Melihat dunia melalui lensa yang berbeda.' },
    { src: 'https://picsum.photos/seed/aa/400/500', title: 'Bunga Mekar', description: 'Keindahan sesaat yang terekam selamanya.' },
    { src: 'https://picsum.photos/seed/bb/300/600', title: 'Monolit', description: 'Kehadiran yang kuat dan tak tergoyahkan.' },
    { src: 'https://picsum.photos/seed/cc/600/300', title: 'Surat dari Masa Lalu', description: 'Warna pudar yang menceritakan sebuah kisah.' },
    { src: 'https://picsum.photos/seed/dd/450/550', title: 'Labirin Pikiran', description: 'Jalan berliku menuju pemahaman diri.' },
    { src: 'https://picsum.photos/seed/ee/550/450', title: 'Gurun Kaca', description: 'Refleksi tak terbatas di dataran yang sunyi.' },
    { src: 'https://picsum.photos/seed/ff/380/480', title: 'Rembulan di Siang Hari', description: 'Sesuatu yang tak terduga dan mempesona.' },
    { src: 'https://picsum.photos/seed/gg/480/380', title: 'Jejak Langkah', description: 'Tanda-tanda kehidupan yang ditinggalkan.' },
    { src: 'https://picsum.photos/seed/hh/700/500', title: 'Katedral Alam', description: 'Keagungan alam yang menginspirasi kekaguman.' },
    { src: 'https://picsum.photos/seed/ii/500/700', title: 'Rasi Bintang Buatan', description: 'Menghubungkan titik-titik dalam kekacauan.' },
    { src: 'https://picsum.photos/seed/jj/330/430', title: 'Permata Tersembunyi', description: 'Keindahan yang ditemukan di tempat tak terduga.' },
    { src: 'https://picsum.photos/seed/kk/430/330', title: 'Harmoni Disonan', description: 'Bentrokan warna yang menciptakan keindahan baru.' },
    { src: 'https://picsum.photos/seed/ll/530/530', title: 'Pusaran Waktu', description: 'Gerakan melingkar dari siklus kehidupan.' },
];


// Konstanta untuk layout
const GRID_WIDTH = 1800;
const GRID_HEIGHT = 1200;
const TARGET_AREA = 40000;

interface GalleryProps {
  onBack: () => void;
  isVisible: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ onBack, isVisible }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [translateStart, setTranslateStart] = useState({ x: 0, y: 0 });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const didDragRef = useRef(false);

  useEffect(() => {
    if (isVisible) {
      const initialX = -(GRID_WIDTH / 2) + (window.innerWidth / 2);
      const initialY = -(GRID_HEIGHT / 2) + (window.innerHeight / 2);
      setTranslate({ x: initialX, y: initialY });
    }
  }, [isVisible]);

  const imageLayout = useMemo(() => {
    const random = createSeededRandom(123);
    const layouts = [];
    const urlRegex = /\/(\d+)\/(\d+)$/;

    const COLS = 8;
    const ROWS = Math.ceil(galleryImages.length / COLS);
    const cellWidth = GRID_WIDTH / COLS;
    const cellHeight = GRID_HEIGHT / ROWS;

    const shuffledImages = [...galleryImages].sort(() => random() - 0.5);

    shuffledImages.forEach((imgData, i) => {
        const col = i % COLS;
        const row = Math.floor(i / COLS);
        
        const cellCenterX = (col * cellWidth) + (cellWidth / 2);
        const cellCenterY = (row * cellHeight) + (cellHeight / 2);

        const offsetX = (random() - 0.5) * (cellWidth * 0.7);
        const offsetY = (random() - 0.5) * (cellHeight * 0.7);

        const left = cellCenterX + offsetX;
        const top = cellCenterY + offsetY;

        const match = imgData.src.match(urlRegex);
        let imgWidth: number, imgHeight: number;
        if (match) {
            const originalWidth = parseInt(match[1], 10);
            const originalHeight = parseInt(match[2], 10);
            const aspectRatio = originalWidth / originalHeight;
            imgHeight = Math.sqrt(TARGET_AREA / aspectRatio);
            imgWidth = aspectRatio * imgHeight;
        } else {
            imgWidth = Math.sqrt(TARGET_AREA);
            imgHeight = Math.sqrt(TARGET_AREA);
        }

        layouts.push({
            id: i,
            ...imgData,
            top: top,
            left: left,
            width: imgWidth,
            height: imgHeight,
            rotation: (random() - 0.5) * 30,
        });
    });
    return layouts;
  }, []);

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const goToNext = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prevIndex) => (prevIndex! + 1) % imageLayout.length);
  }, [lightboxIndex, imageLayout.length]);

  const goToPrev = useCallback(() => {
    if (lightboxIndex === null) return;
    setLightboxIndex((prevIndex) => (prevIndex! - 1 + imageLayout.length) % imageLayout.length);
  }, [lightboxIndex, imageLayout.length]);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'ArrowRight') goToNext();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'Escape') closeLightbox();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, goToNext, goToPrev]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (lightboxIndex !== null) return;
    e.preventDefault();
    setIsDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
    setTranslateStart({ x: translate.x, y: translate.y });
    didDragRef.current = false;
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || lightboxIndex !== null) return;
    const dx = e.clientX - startPos.x;
    const dy = e.clientY - startPos.y;

    if (!didDragRef.current) {
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance > 5) { // Ambang batas untuk dianggap "menyeret"
        didDragRef.current = true;
      }
    }
    
    setTranslate({ x: translateStart.x + dx, y: translateStart.y + dy });
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
  };
  
  const handleImageClick = (index: number) => {
    if (!didDragRef.current) {
      openLightbox(index);
    }
  };

  const rawOffsetX = translate.x % GRID_WIDTH;
  const offsetX = rawOffsetX > 0 ? rawOffsetX - GRID_WIDTH : rawOffsetX;
  
  const rawOffsetY = translate.y % GRID_HEIGHT;
  const offsetY = rawOffsetY > 0 ? rawOffsetY - GRID_HEIGHT : rawOffsetY;

  return (
    <div
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
      aria-label="Galeri gambar, klik dan seret untuk menjelajah"
      aria-hidden={!isVisible}
    >
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-30 p-3 rounded-full bg-white/60 text-black shadow-md backdrop-blur-sm hover:bg-white/90 transition-all focus:outline-none focus:ring-2 focus:ring-black/50"
        aria-label="Kembali ke halaman utama"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <div
        className="absolute top-0 left-0"
        style={{
          transform: `translate(${offsetX}px, ${offsetY}px)`,
        }}
      >
        {[-1, 0, 1].map(i => 
          [-1, 0, 1].map(j => (
            <div
              key={`${i}-${j}`}
              className="absolute"
              style={{
                width: `${GRID_WIDTH}px`,
                height: `${GRID_HEIGHT}px`,
                transform: `translate(${i * GRID_WIDTH}px, ${j * GRID_HEIGHT}px)`
              }}
            >
              {imageLayout.map((img, index) => (
                  <div
                    key={`${img.id}-${i}-${j}`}
                    onClick={() => handleImageClick(index)}
                    className="absolute cursor-pointer group transition-all duration-300 ease-in-out hover:shadow-xl hover:z-10"
                    style={{
                        top: `${img.top}px`,
                        left: `${img.left}px`,
                        transform: `translate(-50%, -50%) rotate(${img.rotation}deg)`,
                    }}
                  >
                    <img
                      src={img.src}
                      alt={img.title}
                      draggable="false"
                      className="block object-cover transition-transform duration-300 ease-in-out group-hover:scale-150"
                      style={{
                        width: `${img.width}px`,
                        height: `${img.height}px`,
                      }}
                    />
                  </div>
                ))}
            </div>
          ))
        )}
      </div>
      
      {/* Lightbox Modal */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Tampilan gambar yang diperbesar"
        >
            <div className="relative w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                {/* Tombol Tutup */}
                <button
                    onClick={closeLightbox}
                    className="absolute top-6 right-6 z-50 p-3 rounded-full text-white bg-black/30 hover:bg-black/60 transition-colors"
                    aria-label="Tutup"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                
                {/* Tombol Navigasi */}
                <button
                    onClick={goToPrev}
                    className="absolute left-4 md:left-8 z-50 p-3 rounded-full text-white bg-black/30 hover:bg-black/60 transition-colors"
                    aria-label="Gambar sebelumnya"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={goToNext}
                    className="absolute right-4 md:right-8 z-50 p-3 rounded-full text-white bg-black/30 hover:bg-black/60 transition-colors"
                    aria-label="Gambar berikutnya"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
                
                {/* Konten Gambar */}
                <div className="relative max-w-screen-lg w-full h-full p-4 flex items-center justify-center">
                    <div className="relative">
                        {imageLayout.map((img, index) => (
                            <img
                                key={img.id}
                                src={img.src}
                                alt={img.title}
                                className={`block max-w-full max-h-[85vh] object-contain transition-opacity duration-300 ease-in-out ${index === lightboxIndex ? 'opacity-100' : 'opacity-0 absolute top-0 left-0'}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;