<template>
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="100%" height="100%">
  <defs>
    <!-- Gradien Background Icon -->
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e130c"/>
      <stop offset="50%" stop-color="#2a1810"/>
      <stop offset="100%" stop-color="#0f0a07"/>
    </linearGradient>

    <!-- Gradien Emas / Sinema -->
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D"/>
      <stop offset="50%" stop-color="#F59E0B"/>
      <stop offset="100%" stop-color="#D97706"/>
    </linearGradient>

    <!-- Gradien Ketupat (Hijau Anyaman Halus) -->
    <linearGradient id="ketupatGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#10B981"/>
      <stop offset="100%" stop-color="#047857"/>
    </linearGradient>

    <!-- Gradien Dodol (Karamel / Cokelat Manis) -->
    <linearGradient id="dodolTop" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#92400E"/>
      <stop offset="100%" stop-color="#78350F"/>
    </linearGradient>
    <linearGradient id="dodolSide" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#542306"/>
      <stop offset="100%" stop-color="#381403"/>
    </linearGradient>

    <!-- Shadow -->
    <filter id="dropShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#000000" flood-opacity="0.5"/>
    </filter>
  </defs>

  <!-- Frame Background Persegi Membulat -->
  <rect x="25" y="25" width="450" height="450" rx="90" fill="url(#bgGrad)" stroke="#F59E0B" stroke-width="3" stroke-opacity="0.3"/>

  <!-- Grup Logo Utama (Ketupat + Play Button + Dodol) -->
  <g filter="url(#dropShadow)" transform="translate(0, -10)">

    <!-- 1. Siluet Ketupat Luar (Belah Ketupat / Diamond Frame) -->
    <path d="M 250 80 L 400 230 L 250 380 L 100 230 Z"
          fill="none"
          stroke="url(#ketupatGrad)"
          stroke-width="14"
          stroke-linejoin="round"/>

    <!-- Anyaman Ketupat (Pita Geometris Minimalis) -->
    <path d="M 175 155 L 325 305 M 325 155 L 175 305"
          stroke="url(#ketupatGrad)"
          stroke-width="5"
          stroke-dasharray="16 12"
          stroke-opacity="0.45"/>

    <!-- Lubang Frame Sinema di Tepi Ketupat (Film Strip Notch) -->
    <rect x="160" y="135" width="10" height="8" rx="2" fill="#F59E0B" opacity="0.6" transform="rotate(45 160 135)"/>
    <rect x="330" y="135" width="10" height="8" rx="2" fill="#F59E0B" opacity="0.6" transform="rotate(45 330 135)"/>
    <rect x="160" y="305" width="10" height="8" rx="2" fill="#F59E0B" opacity="0.6" transform="rotate(45 160 305)"/>
    <rect x="330" y="305" width="10" height="8" rx="2" fill="#F59E0B" opacity="0.6" transform="rotate(45 330 305)"/>

    <!-- 2. Ikon Segitiga Play Button (Streaming Media) di Tengah -->
    <polygon points="225,185 305,230 225,275"
             fill="url(#goldGrad)"
             filter="url(#dropShadow)"/>

    <!-- 3. Elemen Dodol (Potongan Balok Dodol Manis di Sudut Kanan-Bawah Ketupat) -->
    <g transform="translate(290, 310)">
      <!-- Balok Dodol 1 (Depan) -->
      <!-- Atas -->
      <polygon points="40,20 65,8 45,0 20,12" fill="url(#dodolTop)" stroke="#FBBF24" stroke-width="0.5"/>
      <!-- Sisi Kiri -->
      <polygon points="20,12 40,20 40,42 20,34" fill="url(#dodolSide)"/>
      <!-- Sisi Kanan -->
      <polygon points="40,20 65,8 65,30 40,42" fill="#451a03"/>
      <!-- Kilau Gula / Dodol Glaze -->
      <line x1="32" y1="16" x2="48" y2="9" stroke="#FDE68A" stroke-width="1.5" stroke-linecap="round" opacity="0.7"/>
    </g>

    <g transform="translate(325, 275)">
      <!-- Balok Dodol 2 (Kecil di Belakang) -->
      <polygon points="30,15 50,6 35,0 15,9" fill="url(#dodolTop)"/>
      <polygon points="15,9 30,15 30,30 15,24" fill="url(#dodolSide)"/>
      <polygon points="30,15 50,6 50,21 30,30" fill="#451a03"/>
    </g>

    <!-- Daun / Tali Janur Pengikat Ketupat di Pucuk Atas -->
    <path d="M 250 80 C 240 50 220 40 200 45 C 225 55 235 70 245 80 Z" fill="#34D399"/>
    <path d="M 250 80 C 265 50 290 45 305 52 C 285 60 270 70 255 80 Z" fill="#059669"/>
  </g>

  <!-- Typography / Brand Badge -->
  <text x="250" y="420"
        text-anchor="middle"
        fill="#F3F4F6"
        font-family="system-ui, -apple-system, sans-serif"
        font-weight="800"
        font-size="22"
        letter-spacing="5">LAYAR HSS</text>
  <text x="250" y="445"
        text-anchor="middle"
        fill="#F59E0B"
        font-family="system-ui, -apple-system, sans-serif"
        font-weight="600"
        font-size="12"
        letter-spacing="3">SINEAS BANUA STREAM</text>
</svg>

</template>
