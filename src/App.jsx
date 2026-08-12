import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Library, X, Heart } from 'lucide-react';

const injectStyles = () => {
  const style = document.createElement('style');
  style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+Devanagari:wght@400;500;600;700;800&family=Playfair+Display:ital,wght@0,400;0,600;1,400&family=Inter:wght@300;400;500;600;700&display=swap');
    
    body {
      background-color: #0c0c0c;
      color: #fbf8f1;
      font-family: 'Inter', sans-serif;
      overflow-x: hidden;
      overflow-y: auto;
      margin: 0;
      padding: 0;
    }

    .font-serif { font-family: 'Playfair Display', 'Noto Serif Devanagari', serif; }

    .devanagari { font-family: 'Noto Serif Devanagari', 'Playfair Display', serif; }

    .gold-text { color: #f8e4b0; }

    .gold-line { background: linear-gradient(90deg, transparent, #e8b95b, transparent); }

    .music-glass {
      background: linear-gradient(135deg, rgba(12,12,12,.94), rgba(29,20,12,.90));
      border: 1px solid rgba(244, 208, 128, .28);
      box-shadow: 0 24px 70px rgba(0,0,0,.48), inset 0 1px 0 rgba(255,255,255,.06);
    }

    .vintage-glow { box-shadow: 0 0 30px rgba(245, 158, 11, .12); }

    /* Film Grain Generation */
    .film-grain {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      pointer-events: none;
      z-index: 50;
      opacity: 0.15;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    /* Subtle flickering scanlines */
    @keyframes scanline {
      0% { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    .scanlines::before {
      content: " ";
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
      z-index: 49;
      background-size: 100% 2px, 3px 100%;
      pointer-events: none;
    }

    /* Custom Scrollbar for collection */
    .hide-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .hide-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
  `;
  document.head.appendChild(style);
};

const SONGS_DATA = [
  {
    id: 1,
    title: "Dil Laga Liya Maine Tumse Pyaar Karke",
    movie: "JO JEETA WOHI SIKANDAR",
    artist: "Udit Narayan, Sadhana Sargam",
    year: 1992,
    // Using Unsplash placeholders that fit the vibe (since we can't use copyrighted material)
    artwork: "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=1920", // Bus journey
    memoryCaption: "Some journeys were never about reaching the destination.",
    // Placeholder audio - user should replace these with real files
    audioSource: "music/Udit_Narayan_Alka_Yagnik_-_Dil_laga_liya_maine_(mp3.pm).mp3"
  },
  {
    id: 2,
    title: "Tune Zindagi Mein Aake",
    movie: "CRIMINAL",
    artist: "Kumar Sanu, Alka Yagnik",
    year: 1994,
    artwork: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=1920", // Rain on window
    memoryCaption: "Some songs arrived before we knew we needed them.",
    audioSource: "music/Udit_Narayan_feat._Alka_Yagnik_72_-_Tune_Zindagi_Mein_Aake_(mp3.pm).mp3"
  },
  {
    id: 3,
    title: "Gore Gore Mukhde Pe",
    movie: "1942: A LOVE STORY",
    artist: "Kumar Sanu",
    year: 1994,
    artwork: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1498843053639-170ff2122f35?auto=format&fit=crop&q=80&w=1920", // Old street/college
    memoryCaption: "Before DMs, there were handwritten letters.",
    audioSource: "music/Udit_Narayan_Alka_Yagnik_-_Gore_Gore_Mukhde_Pe_(mp3.pm).mp3"
  },
  {
    id: 4,
    title: "Hamara Dil Aapke Paas",
    movie: "DIL SE",
    artist: "Sukhwinder Singh, Sapna Awasthi",
    year: 1998,
    artwork: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&q=80&w=1920", // Train/Movement
    memoryCaption: "The journey was slower. The memories lasted longer.",
    audioSource: "music/Udit_Narayan_Alka_Yagnik_-_Hamara_Dil_Aapke_Paas_(mp3.pm).mp3"
  },
  {
    id: 5,
    title: "Tere Naam",
    movie: "DILWALE DULHANIA LE JAYENGE",
    artist: "Kumar Sanu, Lata Mangeshkar",
    year: 1995,
    artwork: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1522276498395-f4f68f7f8454?auto=format&fit=crop&q=80&w=1920", // Fields/Sunset
    memoryCaption: "Somewhere between the bus stop and home, we grew up.",
    audioSource: "music/Udit_Narayan_Alka_Yagnik_-_Tere_Naam_(mp3.pm).mp3"
  },
  {
    id: 6,
    title: "Na Jane Kaise bate hai Jo Dil Kah Paye Hai",
    movie: "DIL TO PAGAL HAI",
    artist: "Lata Mangeshkar, Udit Narayan",
    year: 1997,
    artwork: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1518602164578-cd0074062767?auto=format&fit=crop&q=80&w=1920", // Dance/Rain
    memoryCaption: "When hearts spoke louder than words ever could.",
    audioSource: "music/Na Jane Kaise Bate Hai(PagalWorldl).mp3"
  },
  {
    id: 7,
    title: "Chand Chupa Badal Mein",
    movie: "TAAL",
    artist: "Alka Yagnik, Udit Narayan",
    year: 1999,
    artwork: "https://images.unsplash.com/photo-1483412033650-1015ddeb83d1?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?auto=format&fit=crop&q=80&w=1920", // Music/Nature
    memoryCaption: "Rhythms that stayed with us long after the song ended.",
    audioSource: "music/Udit_Narayan_Alka_Yagnik_-_Chand_Chupa_Badal_Mein_(mp3.pm).mp3"
  },
  {
    id: 8,
    title: "Ladki Badi Anjani Hai",
    movie: "HUM AAPKE HAIN KOUN",
    artist: "Lata Mangeshkar, Udit Narayan",
    year: 1994,
    artwork: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1530023367847-a683933f4172?auto=format&fit=crop&q=80&w=1920", // Family/Celebration
    memoryCaption: "Every wedding felt like our own celebration.",
    audioSource: "music/Udit_Narayan_Alka_Yagnik_-_04._Ladki_Badi_Anjani_Hai_(mp3.pm).mp3"
  },
  {
    id: 9,
    title: "Kuch Kuch Hota Hai",
    movie: "RANGEELA",
    artist: "Udit Narayan, Asha Bhosle",
    year: 1995,
    artwork: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&q=80&w=1920", // Colors/Dance
    memoryCaption: "Colors were brighter. Life was louder.",
    audioSource: "music/Udit_Narayan_Alka_Yagnik_-_Kuch_Kuch_Hota_Hai_(mp3.pm).mp3"
  },
  {
    id: 10,
    title: "Tu Mere Samne",
    movie: "KUCH KUCH HOTA HAI",
    artist: "Udit Narayan, Alka Yagnik",
    year: 1998,
    artwork: "https://images.unsplash.com/photo-1518563259479-d003c05a6503?auto=format&fit=crop&q=80&w=400",
    memoryImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=1920", // College/Memories
    memoryCaption: "Some feelings didn't need names to be felt.",
    audioSource: "music/Udit_Narayan_Alka_Yagnik_-_Tu_Mere_Samne_(mp3.pm).mp3"
  }
];

const RadioBadge = ({ currentSong }) => (
  <div className="relative z-30 w-full">
    <div className="max-w-md mx-auto bg-gradient-to-r from-amber-900/60 via-stone-900/70 to-amber-900/60 backdrop-blur-md border border-amber-200/20 rounded-2xl px-4 py-2 flex items-center justify-between shadow-lg">
      {/* Left red dot indicator */}
      <div className="flex items-center space-x-2">
        <motion.div
          className="w-2 h-2 rounded-full bg-red-500"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
        />
        <span className="text-[10px] font-black tracking-[0.3em] text-amber-200">ON AIR</span>
      </div>

      {/* Center: Song name scrolling if long */}
      <div className="flex-1 mx-3 overflow-hidden">
        <div className="whitespace-nowrap">
          <motion.span
            key={currentSong.id}
            initial={{ x: '100%' }}
            animate={{ x: '-100%' }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="inline-block text-xs font-bold text-amber-50"
          >
            ▶ {currentSong.title} — {currentSong.artist} ★ 90s सफर FM 90.0
          </motion.span>
        </div>
      </div>

      {/* Right: rotating frequency dial */}
      <div className="relative w-6 h-6 shrink-0">
        <motion.div
          className="absolute inset-0 rounded-full border border-amber-200/40"
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-2 bg-amber-200" />
        </motion.div>
        <div className="absolute inset-1.5 rounded-full bg-amber-200/20" />
      </div>
    </div>
  </div>
);

const TicketStub = ({ song }) => {
  // Generate a stable "ticket number" from song id (looks like old bus ticket)
  const ticketNo = `9S-${String(song.id).padStart(4, '0')}-${(song.id * 7).toString().slice(-3)}`;
  const seat = `${(song.id * 13) % 60 + 1}`;

  return (
    <div className="relative z-30 w-full max-w-5xl mx-auto px-3 md:px-8 my-5">
      <div className="relative overflow-hidden rounded-2xl border border-amber-900/30 bg-[#e9c992] text-stone-900 shadow-2xl">
        <div className="absolute inset-0 opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_3px,rgba(80,40,10,.16)_4px)]" />

        {/* Perforated edges */}
        <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#160d0a]" />
        <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#160d0a]" />

        <div className="relative p-4 md:p-5 flex items-center gap-4 md:gap-8">
          <div className="shrink-0 border-r border-amber-900/30 pr-4 md:pr-8">
            <div className="text-2xl md:text-4xl font-black devanagari text-red-900 leading-none">90s सफर</div>
            <div className="text-xs md:text-sm tracking-[.35em] font-bold text-red-900/80 mt-2">EXPRESS</div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="text-[9px] md:text-[10px] uppercase tracking-[.18em] font-bold text-stone-600">SONG</div>
            <div className="font-bold text-sm md:text-xl truncate">{song.title}</div>
            <div className="text-[10px] md:text-sm text-stone-600 truncate mt-1">{song.artist}</div>
          </div>

          <div className="hidden sm:block w-px h-14 bg-amber-900/25" />

          <div className="hidden sm:block shrink-0 min-w-[130px]">
            <div className="text-[9px] uppercase tracking-[.18em] font-bold text-stone-600">SEAT NO.</div>
            <div className="font-black text-lg">90s-{String(seat).padStart(3, '0')}</div>
            <div className="text-[9px] uppercase tracking-[.18em] font-bold text-stone-600 mt-2">JOURNEY</div>
            <div className="text-xs truncate">यादों की गलियों में...</div>
          </div>

          <div className="hidden md:flex shrink-0 w-14 h-14 border-l border-amber-900/20 pl-3 items-center justify-center opacity-70">
            <div className="flex gap-[2px] items-end h-10">
              {Array.from({ length: 16 }).map((_, i) => (
                <span key={i} className="w-[2px] bg-stone-800" style={{ height: `${14 + (i % 5) * 5}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useFavourites = () => {
  const [favourites, setFavourites] = useState(() => {
    try {
      const stored = localStorage.getItem('90sSafar_favourites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('90sSafar_favourites', JSON.stringify(favourites));
    } catch { }
  }, [favourites]);

  const toggleFavourite = useCallback((songId) => {
    setFavourites(prev => prev.includes(songId)
      ? prev.filter(id => id !== songId)
      : [...prev, songId]
    );
  }, []);

  const isFavourite = useCallback((songId) => favourites.includes(songId), [favourites]);

  return { favourites, toggleFavourite, isFavourite };
};

const BUS_QUOTES = [
  // Classic truck-bus warnings
  { text: "Horn OK Please", tag: "बस", emoji: "📯" },
  { text: "Buri Nazar Wale Tera Muh Kala", tag: "बस", emoji: "👁️" },
  { text: "Dekho Magar Pyar Se", tag: "बस", emoji: "🚌" },
  { text: "Awaaz Neeche, Gaon Paas Hai", tag: "बस", emoji: "🤫" },
  { text: "Latak Mat, Patak Dungi", tag: "बस", emoji: "😤" },
  { text: "Maa Ki Dua, Naaal Pairo Mein", tag: "बस", emoji: "🙏" },
  { text: "Wait For Side", tag: "बस", emoji: "⏸️" },
  { text: "Samay Se Pehle Aur Bhagya Se Adhik…", tag: "बस", emoji: "⏰" },

  // Funny attitude / zindagi
  { text: "जरा कम पी मेरी रानी, इराक का पानी बहुत महंगा है।", tag: "ज़िन्दगी", emoji: "🍺" },
  { text: "पैसे से दोस्ती, दोस्ती में प्यार, प्यार में धोखा — सब बिज़नेस है यार।", tag: "ज़िन्दगी", emoji: "💰" },
  { text: "जिंदगी में कुछ करना है? तो पहले WiFi का पासवर्ड पूछ ले।", tag: "ज़िन्दगी", emoji: "📶" },
  { text: "हम वो नहीं जो सोचते हो, हम वो हैं जो सोच भी नहीं सकते तुम।", tag: "ज़िन्दगी", emoji: "😎" },
  { text: "सोच समझकर बोलो, मोबाइल में रिकॉर्डिंग चालू है।", tag: "ज़िन्दगी", emoji: "🎙️" },
  { text: "नौकरी मिल गई, बीवी मिल गई, बस अब पार्किंग नहीं मिल रही।", tag: "ज़िन्दगी", emoji: "🅿️" },
  { text: "चाय पी चुका हूँ, अब दुनिया की परवाह नहीं।", tag: "ज़िन्दगी", emoji: "☕" },
  { text: "आज दिन अच्छा है, क्योंकि शाम तक मन बदल जाएगा।", tag: "ज़िन्दगी", emoji: "🌤️" },

  // Funny love / pyaar
  { text: "हस मत पगली, प्यार हो जाएगा।", tag: "प्यार", emoji: "❤️" },
  { text: "प्यार वो नहीं जो दिल में हो, प्यार वो है जो recharge में हो।", tag: "प्यार", emoji: "🔋" },
  { text: "मोहब्बत हुई, इत्तेफाक हुआ, फिर recharge प्लान खत्म हुआ।", tag: "प्यार", emoji: "📱" },
  { text: "रिश्ता वो अच्छा है जिसमें WiFi दोनों को अच्छा मिले।", tag: "प्यार", emoji: "💑" },
  { text: "क्रश तो स्कूल में था, अब क्रश सिर्फ बजट पर है।", tag: "प्यार", emoji: "📚" },
  { text: "तुम्हारे बिना जी लेंगे, बस मोबाइल का चार्जर भेज दो।", tag: "प्यार", emoji: "🔌" },

  // Funny shaadi / rishtedaar
  { text: "रिश्ता करो बेटा, वरना बुढ़ापे में बिल्ली भी नहीं देखेगी।", tag: "शादी", emoji: "💍" },
  { text: "शादी कर लो, बाद में मोहल्ले वाले तय करेंगे कब बच्चा होगा।", tag: "शादी", emoji: "👶" },
  { text: "सास जी कहती हैं — बेटा तू भी हमारा बेटा है, रसोई में बर्तन माँज दे।", tag: "शादी", emoji: "🍳" },
  { text: "पत्नी की खुशी = ससुराल की तारीफ, पति की खुशी = चाय + अखबार।", tag: "शादी", emoji: "📰" },
  { text: "दूल्हा बनके जा रहा हूँ, अगर वापस आ गया तो भाग लेना।", tag: "शादी", emoji: "🤵" },

  // Funny hustle / life
  { text: "काम चलाऊ इंसान हूँ, वैलेंटाइन नहीं मनाता।", tag: "मेहनत", emoji: "💪" },
  { text: "मेहनत इतनी खामोश से करो कि किस्मत भी चकरा जाए।", tag: "मेहनत", emoji: "🎯" },
  { text: "खाली पेट सोचोगे तो बुरा लगेगा, पेट भर के सोचो तो नींद आ जाएगी।", tag: "मेहनत", emoji: "🍔" },
  { text: "आलस ऐसा कि बिस्तर से उठते-उठते दिन निकल जाता है।", tag: "मेहनत", emoji: "🛌" },
  { text: "BOSS आ रहा है — तब तक काम की नकल कर लो।", tag: "मेहनत", emoji: "👔" },
  { text: "ऑफिस में काम कम, चाय की लाइन ज़्यादा।", tag: "मेहनत", emoji: "🫖" }
];

const QUOTE_TAGS = ["सब", "बस", "ज़िन्दगी", "प्यार", "शादी", "मेहनत"];

const useMusicPlayer = (songs) => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hasEnded, setHasEnded] = useState(false);
  const audioRef = useRef(new Audio());

  const currentSong = songs[currentSongIndex];

  useEffect(() => {
    const audio = audioRef.current;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    const handleEnded = () => {
      setIsPlaying(false);
      setHasEnded(true);
      // Auto-play a random next song
      setCurrentSongIndex((prev) => {
        if (songs.length <= 1) return prev;
        let nextIdx;
        do {
          nextIdx = Math.floor(Math.random() * songs.length);
        } while (nextIdx === prev);
        return nextIdx;
      });
    };

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    // When song index changes, update source and play if it was already playing
    // OR if we're in shuffle/auto-play mode (song ended and triggered a new index)
    const audio = audioRef.current;
    audio.src = currentSong.audioSource;
    setHasEnded(false);

    if (isPlaying || hasEnded) {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch(e => console.error("Playback prevented:", e));
    }
  }, [currentSongIndex, currentSong.audioSource]); // Intentionally omitting isPlaying to not re-trigger on play/pause

  const play = useCallback(() => {
    audioRef.current.play().then(() => setIsPlaying(true)).catch(e => console.error(e));
  }, []);

  const pause = useCallback(() => {
    audioRef.current.pause();
    setIsPlaying(false);
  }, []);

  const togglePlay = useCallback(() => {
    isPlaying ? pause() : play();
  }, [isPlaying, play, pause]);

  const next = useCallback(() => {
    setCurrentSongIndex((prev) => {
      if (songs.length <= 1) return prev;
      let nextIdx;
      do {
        nextIdx = Math.floor(Math.random() * songs.length);
      } while (nextIdx === prev);
      return nextIdx;
    });
    setHasEnded(false);
    // Auto play next song if we were playing, or if we triggered it manually it usually means we want to listen
    if (isPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [songs.length, isPlaying, play]);

  const previous = useCallback(() => {
    setCurrentSongIndex((prev) => (prev === 0 ? songs.length - 1 : prev - 1));
    setHasEnded(false);
    if (isPlaying) {
      setTimeout(() => play(), 100);
    }
  }, [songs.length, isPlaying, play]);

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const jumpToSong = (index) => {
    setCurrentSongIndex(index);
    setHasEnded(false);
    setTimeout(() => play(), 100);
  };

  return {
    currentSong,
    currentSongIndex,
    isPlaying,
    currentTime,
    duration,
    hasEnded,
    setHasEnded,
    play,
    pause,
    togglePlay,
    next,
    previous,
    seek,
    jumpToSong
  };
};

const FilmOverlay = () => (
  <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
    <div className="film-grain"></div>
    <div className="scanlines w-full h-full opacity-30"></div>
    {/* Vignette */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.8)_120%)]"></div>
  </div>
);

const AsentisBackground = () => {
  // Sync sun position with real time
  // Sunrise ~6am, Sunset ~7pm. Outside this range sun is below horizon.
  const hour = new Date().getHours();
  const minute = new Date().getMinutes();
  const timeInHours = hour + minute / 60;

  // Map 6am → top, 7pm → bottom, in between arc
  let sunProgress = (timeInHours - 6) / 13; // 0 at 6am, 1 at 7pm
  sunProgress = Math.max(0, Math.min(1, sunProgress));

  // Sun arc: y from top (10%) to bottom (60%) of screen
  const sunBottom = 10 + sunProgress * 55; // 10% at sunrise, ~65% at sunset
  const sunOpacity = timeInHours >= 5.5 && timeInHours <= 19.5 ? 1 : 0.3;

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Warm sunset / desert sky base */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, #1a0f1f 0%, #3d1a2e 22%, #7c2d3a 45%, #c2410c 65%, #d97706 80%, #f59e0b 95%, #fbbf24 100%)'
        }}
      />

      {/* Sun glow on the horizon */}
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          bottom: `${sunBottom}%`,
          width: '60vw',
          height: '60vw',
          maxWidth: '500px',
          maxHeight: '500px',
          background: 'radial-gradient(circle, rgba(253,224,71,0.55) 0%, rgba(251,191,36,0.25) 35%, transparent 70%)',
          filter: 'blur(20px)',
          opacity: sunOpacity
        }}
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute left-1/2 -translate-x-1/2 rounded-full pointer-events-none"
        style={{
          bottom: `${sunBottom + 2}%`,
          width: '38vw',
          height: '38vw',
          maxWidth: '320px',
          maxHeight: '320px',
          background: 'radial-gradient(circle, rgba(254,240,138,0.9) 0%, rgba(253,224,71,0.4) 50%, transparent 80%)',
          opacity: sunOpacity
        }}
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Distant hazy mountain silhouette */}
      <svg
        className="absolute bottom-[18%] left-0 right-0 w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ height: '18%', opacity: 0.35 }}
      >
        <path
          d="M0,200 L0,120 L80,90 L160,110 L240,70 L320,100 L400,60 L500,95 L600,55 L700,90 L800,65 L900,100 L1000,75 L1100,105 L1200,80 L1200,200 Z"
          fill="#451a03"
        />
      </svg>

      {/* Closer hills silhouette */}
      <svg
        className="absolute bottom-0 left-0 right-0 w-full"
        viewBox="0 0 1200 200"
        preserveAspectRatio="none"
        style={{ height: '22%', opacity: 0.7 }}
      >
        <path
          d="M0,200 L0,140 L100,110 L220,135 L340,100 L460,130 L580,95 L700,125 L820,90 L940,120 L1060,100 L1200,130 L1200,200 Z"
          fill="#1c0a08"
        />
      </svg>

      {/* Soft warm vignette to keep text readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(28,10,8,0.55) 100%)'
        }}
      />

      {/* Floating dust / pollen particles */}
      {Array.from({ length: 28 }).map((_, i) => {
        const size = 1.5 + (i % 4) * 0.7;
        const startX = (i * 37) % 100;
        const duration = 8 + (i % 5) * 2;
        const delay = (i * 0.4) % duration;
        return (
          <motion.div
            key={i}
            className="absolute rounded-full bg-amber-100"
            style={{
              width: `${size}px`,
              height: `${size}px`,
              left: `${startX}%`,
              bottom: '-10px',
              boxShadow: '0 0 4px rgba(254,240,138,0.6)',
              opacity: 0.5
            }}
            animate={{
              y: [0, -800],
              x: [0, (i % 2 === 0 ? 30 : -30), 0],
              opacity: [0, 0.7, 0]
            }}
            transition={{
              duration,
              delay,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
        );
      })}

      {/* Slow drifting clouds (hazy) */}
      <motion.div
        className="absolute"
        style={{ top: '8%', left: 0, right: 0, height: '14%' }}
        animate={{ x: ['-10%', '10%'] }}
        transition={{ duration: 40, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
      >
        <div
          className="absolute"
          style={{
            top: '20%',
            left: '15%',
            width: '45%',
            height: '70%',
            background: 'radial-gradient(ellipse, rgba(252,211,77,0.18) 0%, transparent 70%)',
            filter: 'blur(10px)'
          }}
        />
        <div
          className="absolute"
          style={{
            top: '40%',
            left: '55%',
            width: '35%',
            height: '60%',
            background: 'radial-gradient(ellipse, rgba(245,158,11,0.2) 0%, transparent 70%)',
            filter: 'blur(10px)'
          }}
        />
      </motion.div>
    </div>
  );
};

const BusBody = () => (
  <div className="relative w-[280px] sm:w-[340px] md:w-[390px] h-20 md:h-24 shrink-0">
    <div
      className="absolute left-0 right-0 top-1 h-[74%] md:h-[78%] rounded-2xl overflow-hidden border border-amber-100/20 shadow-[0_15px_35px_rgba(0,0,0,.45)]"
      style={{ background: 'linear-gradient(180deg,#b91c1c 0%,#8b1e1e 52%,#5b1414 100%)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400" />
      <div className="absolute top-2 left-2 right-2 flex gap-1.5">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="relative flex-1 h-8 md:h-10 rounded-md overflow-hidden border border-black/20 bg-gradient-to-b from-amber-100 to-yellow-300">
            <motion.div
              className="absolute bottom-0 left-1/2 -translate-x-1/2"
              animate={{ y: [0, -1, 0] }}
              transition={{ duration: 1.2 + i * .08, repeat: Infinity, delay: i * .12 }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-stone-900 mx-auto" />
              <div className="w-5 h-2.5 rounded-t bg-stone-900" />
            </motion.div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-2 left-0 right-0 flex justify-center">
        <span className="px-3 py-1 rounded bg-black/55 text-[8px] md:text-[10px] font-black tracking-[.22em] text-yellow-200">90s सफर EXPRESS</span>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-5 rounded-l bg-yellow-100" style={{ boxShadow: '0 0 18px rgba(253,224,71,.95)' }} />
    </div>

    <div className="absolute bottom-0.5 left-8 md:left-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-stone-950 border-2 border-stone-500 shadow-lg">
      <div className="absolute inset-1 rounded-full border border-stone-600" />
    </div>
    <div className="absolute bottom-0.5 right-8 md:right-10 w-7 h-7 md:w-8 md:h-8 rounded-full bg-stone-950 border-2 border-stone-500 shadow-lg">
      <div className="absolute inset-1 rounded-full border border-stone-600" />
    </div>
  </div>
);

const AnimatedBus = () => {
  const duration = 9;
  return (
    <div className="relative w-full h-32 md:h-36 overflow-hidden">
      {/* Highway */}
      <div className="absolute inset-x-0 bottom-2 h-16 md:h-20 bg-gradient-to-b from-stone-900/75 to-black/90 border-y border-amber-200/10 shadow-[inset_0_8px_25px_rgba(0,0,0,.3)]">
        <div className="absolute top-1/2 left-0 right-0 h-[3px] -translate-y-1/2 overflow-hidden">
          <motion.div
            className="flex gap-10 md:gap-14 w-max"
            animate={{ x: [0, -90] }}
            transition={{ duration: .55, repeat: Infinity, ease: 'linear' }}
          >
            {Array.from({ length: 100 }).map((_, i) => <span key={i} className="w-12 md:w-16 h-[3px] bg-amber-200/55 rounded-full shrink-0" />)}
          </motion.div>
        </div>
        <div className="absolute bottom-2 left-0 right-0 h-px bg-amber-200/20" />
      </div>

      {/* Bus 1 */}
      <motion.div
        className="absolute top-0"
        initial={{ x: '-420px' }}
        animate={{ x: 'calc(100vw + 420px)' }}
        transition={{ duration, repeat: Infinity, ease: 'linear' }}
      >
        <BusBody />
      </motion.div>

      {/* Bus 2 overlaps the cycle so there is no empty road */}
      <motion.div
        className="absolute top-0"
        initial={{ x: '-420px' }}
        animate={{ x: 'calc(100vw + 420px)' }}
        transition={{ duration, delay: duration * 0.52, repeat: Infinity, ease: 'linear' }}
      >
        <BusBody />
      </motion.div>
    </div>
  );
};

const formatTime = (time) => {
  if (time && !isNaN(time)) {
    const minutes = Math.floor(time / 60);
    const formatMinutes = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const seconds = Math.floor(time % 60);
    const formatSeconds = seconds < 10 ? `0${seconds}` : `${seconds}`;
    return `${formatMinutes}:${formatSeconds}`;
  }
  return '00:00';
};

const ProgressBar = ({ currentTime, duration, onSeek }) => {
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full flex flex-col mt-2">
      <div
        className="w-full h-1 bg-white/20 rounded-full cursor-pointer relative overflow-hidden group"
        onClick={(e) => {
          const bounds = e.currentTarget.getBoundingClientRect();
          const percent = (e.clientX - bounds.left) / bounds.width;
          onSeek(percent * duration);
        }}
      >
        <motion.div
          className="absolute top-0 left-0 h-full bg-white rounded-full"
          style={{ width: `${progress}%` }}
          layout
        />
      </div>
      <div className="flex justify-between w-full mt-2">
        <span className="text-[10px] text-white/70 font-mono">{formatTime(currentTime)}</span>
        <span className="text-[10px] text-white/70 font-mono">{formatTime(duration)}</span>
      </div>
    </div>
  );
};

const PlayerView = ({
  playerState,
  onOpenMemories,
  isFavourite,
  onToggleFavourite
}) => {
  const {
    currentSong,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    next,
    previous,
    seek
  } = playerState;

  const [quote, setQuote] = useState(BUS_QUOTES[0]);
  const [isHonking, setIsHonking] = useState(false);
  const [liveUsers, setLiveUsers] = useState(517);
  const [activeTag, setActiveTag] = useState('सब');

  useEffect(() => {
    const hour = new Date().getHours();
    const baseUsers = hour > 18 || hour < 2 ? 800 : 400;
    setLiveUsers(baseUsers + Math.floor(Math.random() * 100));
    const interval = setInterval(() => {
      setLiveUsers(prev => Math.max(100, Math.min(2000, prev + Math.floor(Math.random() * 9) - 4)));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const pool = activeTag === 'सब' ? BUS_QUOTES : BUS_QUOTES.filter(q => q.tag === activeTag);
    if (pool.length) setQuote(pool[Math.floor(Math.random() * pool.length)]);
  }, [currentSong.id, activeTag]);

  const handleHonk = useCallback(() => {
    if (isHonking) return;
    setIsHonking(true);
    setTimeout(() => setIsHonking(false), 1400);
  }, [isHonking]);

  const visualizerHeights = [14, 24, 10, 30, 18, 36, 16, 27, 12, 32, 22, 40, 18, 29, 12, 34, 20, 38, 16, 27, 11, 31, 18, 35, 14, 24, 10, 30, 18, 38, 15, 27];

  return (
    <div className="relative min-h-screen w-full overflow-x-hidden bg-[#130b09] text-white">
      <AsentisBackground />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentSong.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: .14 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[1] pointer-events-none"
        >
          <img src={currentSong.memoryImage} alt="" className="w-full h-full object-cover grayscale sepia-[25%]" />
        </motion.div>
      </AnimatePresence>

      <div className="relative z-20 min-h-screen pb-8">
        {/* TOP NAV */}
        <div className="max-w-[1500px] mx-auto px-5 md:px-10 pt-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm md:text-base font-semibold text-amber-50/90">
            <span className="text-lg">◷</span>
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-sm md:text-base font-semibold text-amber-50/90">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,.8)]" />
            {liveUsers} लोग सफर में हैं
          </div>

          <button
            onClick={onOpenMemories}
            className="flex items-center gap-2 rounded-full border border-amber-100/25 bg-black/25 backdrop-blur-md px-4 py-2 text-sm md:text-base text-amber-50 hover:bg-black/40 transition vintage-glow"
          >
            <Library size={19} />
            <span>मेरी यादें</span>
          </button>
        </div>

        {/* HERO */}
        <div className="max-w-[1100px] mx-auto px-4 md:px-8 pt-5 md:pt-8 text-center">
          <div className="flex justify-center">
            <motion.button
              onClick={handleHonk}
              whileTap={{ scale: .96 }}
              animate={isHonking ? { x: [-5, 5, -5, 5, 0] } : {}}
              className="absolute left-5 md:left-10 top-28 md:top-32 rounded-full border border-amber-300/60 bg-black/25 backdrop-blur-md px-5 py-2.5 text-amber-100 shadow-[0_0_25px_rgba(245,158,11,.16)] hover:bg-amber-300/10 transition"
            >
              <span className="mr-2">📯</span>
              हॉर्न ओके प्लीज़
            </motion.button>
          </div>

          <motion.h1
            key={currentSong.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            className="devanagari text-6xl md:text-8xl font-extrabold tracking-tight text-amber-50 drop-shadow-[0_5px_20px_rgba(0,0,0,.65)]"
          >
            90s सफर
          </motion.h1>

          <div className="mx-auto mt-2 h-px w-48 gold-line" />
          <div className="text-amber-200/80 text-xl mt-1">✦ ◇ ✦</div>

          <AnimatePresence mode="wait">
            <motion.div
              key={quote.text}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl mx-auto mt-2"
            >
              <p className="devanagari text-2xl md:text-4xl font-semibold leading-tight text-amber-50 drop-shadow-[0_3px_10px_rgba(0,0,0,.8)]">
                “{quote.text}”
              </p>
            </motion.div>
          </AnimatePresence>

          {/* TAGS */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {QUOTE_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => setActiveTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-bold border backdrop-blur-md transition-all ${activeTag === tag
                    ? 'bg-amber-200 text-stone-900 border-amber-100 shadow-[0_0_20px_rgba(245,158,11,.28)]'
                    : 'bg-black/35 text-amber-50/90 border-amber-100/20 hover:bg-black/50'
                  }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* RADIO */}
        <div className="mt-6">
          <div className="max-w-md mx-auto px-4">
            <div className="rounded-2xl border border-amber-300/40 bg-black/35 backdrop-blur-md px-5 py-3 flex items-center justify-between shadow-[0_0_30px_rgba(245,158,11,.1)]">
              <div className="flex items-center gap-2 shrink-0">
                <motion.span className="w-3 h-3 rounded-full bg-red-500" animate={{ opacity: [1, .35, 1] }} transition={{ duration: 1.1, repeat: Infinity }} />
                <span className="text-sm font-black tracking-[.25em] text-amber-100">ON AIR</span>
              </div>
              <span className="text-xs md:text-sm text-amber-50/80 truncate mx-3">सिर्फ 90s के लिए</span>
              <span className="text-amber-200">◉</span>
            </div>
          </div>
        </div>

        {/* LONG ROAD + BUS */}
        <div className="mt-2 w-full">
          <AnimatedBus />
        </div>

        {/* TICKET */}
        <TicketStub song={currentSong} />

        {/* MUSIC PLAYER */}
        <div className="max-w-[1450px] mx-auto px-4 md:px-5">
          <div className="music-glass rounded-[1.8rem] md:rounded-[2rem] p-4 md:p-6">
            <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr_1.2fr] gap-5 lg:gap-8 items-center">

              {/* SONG */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shrink-0 border border-amber-100/20 shadow-xl">
                  <img src={currentSong.artwork} alt={currentSong.title} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] tracking-[.25em] text-amber-200/60 uppercase">Now Playing</div>
                  <h3 className="text-lg md:text-xl font-bold text-amber-50 truncate mt-1">{currentSong.title}</h3>
                  <p className="text-sm md:text-base text-white/60 truncate mt-1">{currentSong.artist}</p>
                  <ProgressBar currentTime={currentTime} duration={duration} onSeek={seek} />
                </div>
              </div>

              {/* CONTROLS */}
              <div className="flex items-center justify-center gap-5 md:gap-7">
                <button
                  onClick={() => onToggleFavourite(currentSong.id)}
                  className="w-12 h-12 rounded-full border border-white/20 bg-white/[.03] flex items-center justify-center text-amber-50/80 hover:text-red-400 hover:border-red-400/40 transition"
                  aria-label="Favourite"
                >
                  <Heart size={23} fill={isFavourite(currentSong.id) ? 'currentColor' : 'none'} className={isFavourite(currentSong.id) ? 'text-red-400' : ''} />
                </button>

                <button onClick={previous} className="w-12 h-12 flex items-center justify-center text-amber-50 hover:text-amber-200 hover:scale-110 transition" aria-label="Previous song">
                  <SkipBack size={34} strokeWidth={1.8} />
                </button>

                <button
                  onClick={togglePlay}
                  className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-50 to-amber-200 text-stone-900 flex items-center justify-center shadow-[0_0_35px_rgba(251,191,36,.25)] hover:scale-105 transition"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={32} fill="currentColor" /> : <Play size={32} fill="currentColor" className="ml-1" />}
                </button>

                <button onClick={next} className="w-12 h-12 flex items-center justify-center text-amber-50 hover:text-amber-200 hover:scale-110 transition" aria-label="Next song">
                  <SkipForward size={34} strokeWidth={1.8} />
                </button>
              </div>

              {/* VISUALIZER */}
              <div className="hidden lg:flex flex-col items-center justify-center gap-3">
                <div className="flex items-end gap-[3px] h-14 w-full max-w-sm px-2">
                  {visualizerHeights.map((h, i) => (
                    <motion.span
                      key={i}
                      className="flex-1 max-w-2 rounded-full bg-gradient-to-t from-amber-500 to-amber-200"
                      animate={{ height: [`${Math.max(6, h - 10)}px`, `${h + 8}px`, `${Math.max(8, h - 4)}px`] }}
                      transition={{ duration: .8 + (i % 5) * .08, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-4 w-full max-w-sm text-amber-50/70">
                  <span className="text-xl">🔊</span>
                  <div className="flex-1 h-1.5 rounded-full bg-white/15 overflow-hidden">
                    <div className="h-full w-1/2 bg-gradient-to-r from-amber-300 to-amber-500 rounded-full" />
                  </div>
                  <button className="text-amber-50/70 hover:text-white" aria-label="Playlist">
                    <span className="text-2xl">☷</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex lg:hidden justify-center mt-4 text-amber-200/50 text-xs tracking-[.3em]">90s के गाने • 90s की बातें • 90s की यादें</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CollectionView = ({ songs, onClose, onSelectSong, currentSongId }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 bg-stone-950 text-amber-50 overflow-y-auto hide-scrollbar"
  >
    <div className="min-h-screen p-8 md:p-16">
      <div className="flex justify-between items-center mb-16">
        <div>
          <h2 className="font-serif text-4xl text-amber-200">Memories</h2>
          <p className="text-white/50 tracking-widest text-sm uppercase mt-2">The Soundtrack of a Generation</p>
        </div>
        <button
          onClick={onClose}
          className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors"
          aria-label="Close collection"
        >
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
        {songs.map((song, idx) => (
          <motion.div
            key={song.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className={`group cursor-pointer flex flex-col ${song.id === currentSongId ? 'opacity-50 pointer-events-none' : ''}`}
            onClick={() => onSelectSong(idx)}
          >
            <div className="relative aspect-[4/3] overflow-hidden mb-4 border border-white/5">
              <img
                src={song.memoryImage}
                alt={song.title}
                className="w-full h-full object-cover filter grayscale-[30%] sepia-[20%] group-hover:grayscale-0 group-hover:sepia-0 group-hover:scale-105 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/10 transition-colors duration-500" />

              {/* Play Icon on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center border border-white/20">
                  <Play size={24} className="text-amber-200 ml-1" />
                </div>
              </div>
            </div>

            <div className="flex justify-between items-baseline">
              <h3 className="font-serif text-2xl group-hover:text-amber-200 transition-colors">{song.title}</h3>
              <span className="font-mono text-sm text-white/40">{song.year}</span>
            </div>
            <p className="text-xs uppercase tracking-widest text-white/50 mt-1">{song.movie}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

const BusIntro = ({ onComplete }) => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const randomQuote =
      BUS_QUOTES[Math.floor(Math.random() * BUS_QUOTES.length)];

    setQuote(randomQuote);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-50 bg-stone-950 flex flex-col items-center justify-center overflow-hidden"
      exit={{ opacity: 0, transition: { duration: 1.5 } }}
    >
      {/* Background layer */}
      <motion.div
        className="absolute inset-0 opacity-40"
        initial={{ x: '10%' }}
        animate={{ x: '-10%' }}
        transition={{ duration: 10, ease: "linear" }}
      >
        <img
          src="https://images.unsplash.com/photo-1596404988899-73d81b4fec1b?auto=format&fit=crop&q=80&w=1920"
          alt="Street"
          className="w-[120%] h-full object-cover filter sepia-[50%] contrast-125"
        />
      </motion.div>

      {/* Dark gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />

      {/* Typography Sequence */}
      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.h2
          initial={{ opacity: 0, tracking: '0.5em' }}
          animate={{ opacity: 1, tracking: '0.2em' }}
          transition={{ duration: 2, delay: 0.5 }}
          className="text-amber-200/80 text-sm uppercase mb-4"
        >
          90s
        </motion.h2>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.5 }}
          className="font-serif text-5xl md:text-7xl text-amber-50 mb-12 drop-shadow-2xl"
        >
          THE SOUNDTRACK<br />OF A GENERATION
        </motion.h1>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 3.5 }}
          onClick={onComplete}
          className="group relative px-8 py-3 border border-white/20 text-white/80 hover:text-black overflow-hidden transition-colors"
        >
          <span className="relative z-10 text-xs tracking-[0.3em] uppercase">
            Press Play to Remember
          </span>

          <div className="absolute inset-0 bg-amber-200 transform scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500 ease-out z-0" />
        </motion.button>
      </div>

      {/* Fake Bus passing effect */}
      <motion.div
        className="absolute top-0 bottom-0 w-64 bg-black/80 blur-3xl pointer-events-none"
        initial={{ left: '-50%' }}
        animate={{ left: '150%' }}
        transition={{ duration: 6, ease: "linear", delay: 1 }}
      />

      {/* Random bus quote */}
      {quote && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 0.6, x: 0 }}
          transition={{ duration: 2, delay: 2.5 }}
          className="absolute bottom-16 right-8 md:right-16 z-20 transform rotate-[-4deg]"
        >
          <p
            className="font-sans font-black text-lg md:text-2xl text-yellow-400 uppercase tracking-widest drop-shadow-[0_2px_2px_rgba(220,38,38,0.8)]"
            style={{ WebkitTextStroke: '0.5px #dc2626' }}
          >
            "{quote?.text}"
          </p>

          <div className="mt-2 text-yellow-200/70 text-sm text-right">
            {quote.emoji} {quote.tag}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default function App() {
  const [hasStarted, setHasStarted] = useState(false);
  const [showMemories, setShowMemories] = useState(false);

  const playerState = useMusicPlayer(SONGS_DATA);

  const { favourites, toggleFavourite, isFavourite } = useFavourites();

  // Inject styles on mount
  useEffect(() => {
    injectStyles();
  }, []);

  const handleStart = () => {
    setHasStarted(true);
    // Slight delay before attempting to play to ensure transition finishes
    setTimeout(() => {
      playerState.play();
    }, 1000);
  };

  const handleSelectSong = (index) => {
    playerState.jumpToSong(index);
    setShowMemories(false);
  };

  return (
    <>
      <FilmOverlay />

      <AnimatePresence>
        {!hasStarted && (
          <BusIntro key="intro" onComplete={handleStart} />
        )}
      </AnimatePresence>

      {hasStarted && (
        <PlayerView
          playerState={playerState}
          onOpenMemories={() => setShowMemories(true)}
          isFavourite={isFavourite}
          onToggleFavourite={toggleFavourite}
        />
      )}

      <AnimatePresence>
        {showMemories && (
          <CollectionView
            songs={SONGS_DATA}
            onClose={() => setShowMemories(false)}
            onSelectSong={handleSelectSong}
            currentSongId={playerState.currentSong.id}
          />
        )}
      </AnimatePresence>
    </>
  );
}