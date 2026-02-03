"use client";

// import { useEffect } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { getWhatsAppUrl } from "@/lib/whatsapp";

// const HERO_IMAGE_SIZES =
//   "(max-width: 768px) 100vw, (max-width: 1024px) 95vw, (min-width: 1025px) 65vw, 900px";

// /** Ladder-style heading: two lines, second line stepped right. Positioned over the hero image. */
// function LadderHeading({ className = "" }: { className?: string }) {
//   return (
//     <div
//       className={`absolute z-10 flex flex-col justify-start items-start text-[#1a3a1a] pointer-events-none ${className}`}
//       aria-hidden={false}
//     >
//       <h1 className="text-[2.25rem] leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[3.5rem] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]">
//         Build strength
//       </h1>
//       <h1 className="mt-0.5 text-[2.25rem] leading-tight font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl 2xl:text-[3.5rem] drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] sm:ml-10 md:ml-12 lg:ml-14 xl:ml-16 2xl:ml-20">
//         Improve flexibility
//       </h1>
//     </div>
//   );
// }

// export default function Hero({
//   onHeroReady,
// }: {
//   onHeroReady?: () => void;
// }) {
//   useEffect(() => {
//     onHeroReady?.();
//   }, [onHeroReady]);

//   return (
//     <section className="relative w-full min-h-[min(100vh,920px)] bg-[#faf8f5] pt-24 sm:pt-28 pb-16 sm:pb-24 lg:pb-32 overflow-hidden">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 h-full">
//         {/* ========== Mobile & Tablet: stacked ========== */}
//         <div className="lg:hidden flex flex-col">
//           {/* Hero figure: image with ladder heading over it (same relationship on all sizes) */}
//           <div className="relative w-full max-w-xl mx-auto">
//             <div className="relative w-full aspect-4/5 sm:aspect-3/4 max-h-[65vh] sm:max-h-[70vh]">
//               <Image
//                 src="/hero-section.webp"
//                 alt="Yoga pose - calm, confident practice"
//                 fill
//                 className="object-contain object-bottom"
//                 sizes={HERO_IMAGE_SIZES}
//                 priority
//                 onLoad={onHeroReady}
//               />
//             </div>
//             {/* Ladder heading over image — upper-left, along curve; avoid face */}
//             <LadderHeading className="top-[12%] left-[6%] right-[10%] sm:top-[14%] sm:left-[8%] md:top-[16%] md:left-[10%]" />
//           </div>

//           {/* Below image: subheading, sub-subheading, CTAs */}
//           <div className="mt-8 sm:mt-10 text-left max-w-xl">
//             <p className="text-xl sm:text-2xl font-medium text-[#2d5a2d] leading-snug">
//               Feel Better in Your Body
//             </p>
//             <p className="mt-3 sm:mt-4 text-base sm:text-lg text-[#2d2d2d]/90 leading-relaxed">
//               Yoga that fits life, wherever you are.
//             </p>
//             <div className="mt-8 sm:mt-10 flex flex-col gap-4">
//               <Link
//                 href={getWhatsAppUrl()}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center justify-center w-full min-h-13 sm:min-h-14 px-8 py-4 sm:py-4.5 bg-[#2d5a2d] text-white text-base sm:text-lg font-semibold rounded-full shadow-lg hover:bg-[#1a3a1a] active:bg-[#1a3a1a] transition-colors duration-300"
//               >
//                 Join Class
//               </Link>
//               <Link
//                 href={getWhatsAppUrl()}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center justify-center w-full min-h-13 sm:min-h-14 px-8 py-4 sm:py-4.5 border-2 border-[#2d5a2d] text-[#2d5a2d] text-base sm:text-lg font-semibold rounded-full hover:bg-[#2d5a2d]/8 active:bg-[#2d5a2d]/12 transition-colors duration-300"
//               >
//                 Book a Consultation
//               </Link>
//             </div>
//           </div>
//         </div>

//         {/* ========== Desktop: ladder over image + text/CTAs to the side ========== */}
//         <div className="hidden lg:flex lg:items-center lg:justify-between lg:gap-12 xl:gap-16 lg:min-h-[calc(100vh-8rem)]">
//           {/* Side panel: subheading, sub-subheading, CTAs */}
//           <div className="shrink-0 w-full max-w-md xl:max-w-lg flex flex-col justify-center text-left order-2">
//             <p className="text-2xl xl:text-3xl font-medium text-[#2d5a2d] leading-snug">
//               Feel Better in Your Body
//             </p>
//             <p className="mt-4 xl:mt-5 text-lg xl:text-xl text-[#2d2d2d]/90 leading-relaxed">
//               Yoga that fits life, wherever you are.
//             </p>
//             <div className="mt-10 xl:mt-12 flex flex-wrap gap-4">
//               <Link
//                 href={getWhatsAppUrl()}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center justify-center min-h-13 px-8 py-3.5 bg-[#2d5a2d] text-white text-base xl:text-lg font-semibold rounded-full shadow-lg hover:bg-[#1a3a1a] transition-colors duration-300"
//               >
//                 Join Class
//               </Link>
//               <Link
//                 href={getWhatsAppUrl()}
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className="inline-flex items-center justify-center min-h-13 px-8 py-3.5 border-2 border-[#2d5a2d] text-[#2d5a2d] text-base xl:text-lg font-semibold rounded-full hover:bg-[#2d5a2d]/8 transition-colors duration-300"
//               >
//                 Book a Consultation
//               </Link>
//             </div>
//           </div>

//           {/* Hero figure: image + ladder heading — immersive, not confined to column */}
//           <div className="relative flex-1 min-w-0 flex justify-end items-center order-1">
//             <div className="relative w-full max-w-[85%] xl:max-w-[80%] 2xl:max-w-[75%] aspect-3/4 xl:aspect-4/5 max-h-[85vh]">
//               <Image
//                 src="/hero-section.webp"
//                 alt="Yoga pose - calm, confident practice"
//                 fill
//                 className="object-contain object-bottom"
//                 sizes={HERO_IMAGE_SIZES}
//                 priority
//               />
//               {/* Ladder heading over image — same visual relationship as mobile */}
//               <LadderHeading className="top-[14%] left-[6%] right-[15%] xl:top-[16%] xl:left-[8%] 2xl:top-[18%] 2xl:left-[10%]" />
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }
import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Dumbbell, Activity,  Leaf } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/whatsapp';

interface HeroProps {
  onHeroReady?: () => void;
}

export default function Hero({ onHeroReady }: HeroProps) {
  useEffect(() => {
    // Call onHeroReady when component mounts
    onHeroReady?.();
  }, [onHeroReady]);
  return (
    <div className="min-h-screen bg-white font-sans text-gray-800 overflow-x-hidden">
      <Head>
        <title>Yoga by Neha - Build strength. Improve flexibility.</title>
        <meta name="description" content="Join our yoga classes with leading Indian instructors" />
      </Head>


      {/* Hero Section */}
      <main className="container mx-auto px-4 sm:px-6 pt-12 sm:pt-16 lg:pt-0 xl:pt-0 2xl:pt-0 pb-16 sm:pb-24 relative lg:-mt-20 xl:-mt-24 2xl:-mt-28">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 items-center">
          
          {/* Left Content */}
          <div className="relative z-10 max-w-xl lg:ml-10 lg:pt-24 xl:pt-28 2xl:pt-32">
            <div className="mb-4 sm:mb-6">
              <span className="inline-flex items-center justify-center w-8 h-8 bg-green-100 rounded-full mb-2">
                <Leaf className="w-5 h-5 text-green-600" />
              </span>
            </div>
            
            <h1 className="text-5xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.15] text-gray-900 mb-4 sm:mb-6">
              <span className="text-[#2d5a2d]">Build</span> strength. <br />
              Improve <br />
              <span className="text-[#2d5a2d]">flexibility</span>
            </h1>
            
            <p className="text-gray-500 text-base sm:text-lg mb-6 sm:mb-8 leading-relaxed max-w-md">
            Feel Better in Your Body <br /> Yoga that fits life, wherever you are.
             
            </p>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#2d5a2d] hover:bg-[#1a3a1a] text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 rounded-md font-medium text-sm sm:text-base transition-all shadow-lg shadow-green-200"
              >
                Join Class
              </Link>

              <Link
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-[#2d5a2d] hover:bg-[#1a3a1a] text-white px-5 sm:px-6 lg:px-8 py-2.5 sm:py-3 lg:py-3.5 rounded-md font-medium text-sm sm:text-base transition-all shadow-lg shadow-green-200"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          {/* Right Content - Image & Floating Elements */}
          <div className="relative lg:h-[700px] xl:h-[800px] 2xl:h-[900px] flex items-center justify-center lg:pt-24 xl:pt-28 2xl:pt-32">
            
            {/* Main Image Container */}
            <div className="relative w-full max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl aspect-[3/4] lg:aspect-auto lg:h-full">
              {/* Background decorative blob */}
              <div className="absolute inset-0 bg-gradient-to-tr from-green-50 to-transparent rounded-full blur-3xl opacity-60 transform translate-y-10"></div>
              
              {/* Main Image */}
              <img 
                src="/hero-section.webp" 
                alt="Woman doing yoga" 
                className="relative z-10 w-full h-full object-contain object-center rounded-3xl lg:rounded-none lg:bg-transparent"
                style={{ maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)' }}
              />

              {/* Floating Elements */}
              
              {/* Dumbbell Icon - Top Right */}
              <div className="absolute top-12 sm:top-20 right-0 lg:-right-4 z-20 bg-white p-2 sm:p-3 rounded-2xl shadow-xl shadow-green-100/50 animate-bounce duration-3000">
                <div className="bg-green-50 p-1.5 sm:p-2 rounded-xl">
                  <Link href={getWhatsAppUrl()} target="_blank" rel="noopener noreferrer">
                    <Leaf className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                  </Link>
                </div>
              </div>

             

            </div>
          </div>
        </div>
      </main>
    </div>
  );
}