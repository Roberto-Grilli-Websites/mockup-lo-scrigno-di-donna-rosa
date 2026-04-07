import { useState, useRef, useEffect } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import {
  Star, MapPin, Phone, Clock, ChevronDown,
  ChevronLeft, ChevronRight, Menu, X, UtensilsCrossed
} from 'lucide-react'

// ─── DATA ────────────────────────────────────────────────────────────────────

const MENU_ITEMS = [
  {
    id: 1,
    categoria: 'Primi',
    nome: 'Spaghetti ai Ricci di Mare',
    descrizione: 'Ricci freschi del Mediterraneo, aglio, olio e.v.o., prezzemolo. Il mare in un piatto.',
    prezzo: '€ 22',
    img: 'https://images.unsplash.com/photo-1551183053-bf91798d792f?w=600&q=80&fit=crop',
  },
  {
    id: 2,
    categoria: 'Primi',
    nome: 'Linguine all\'Astice',
    descrizione: 'Astice fresco di giornata, pomodorini pachino, basilico, sfumato con vino bianco.',
    prezzo: '€ 28',
    img: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80&fit=crop',
  },
  {
    id: 3,
    categoria: 'Primi',
    nome: 'Spaghetti allo Scoglio',
    descrizione: 'Cozze, vongole, gamberi e calamari. Brodetto profumato, pasta trafilata al bronzo.',
    prezzo: '€ 20',
    img: 'https://images.unsplash.com/photo-1473093295043-cdd812d0e601?w=600&q=80&fit=crop',
  },
  {
    id: 4,
    categoria: 'Secondi',
    nome: 'Frittura di Paranza',
    descrizione: 'Pescato del giorno: triglie, merluzzetti, gamberi e calamari. Fritti in olio fresco.',
    prezzo: '€ 18',
    img: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&q=80&fit=crop',
  },
  {
    id: 5,
    categoria: 'Antipasti',
    nome: 'Caponata della Casa',
    descrizione: 'Ricetta di Donna Rosa: melanzane, olive, capperi, sedano e pomodoro in agrodolce.',
    prezzo: '€ 10',
    img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80&fit=crop',
  },
  {
    id: 6,
    categoria: 'Antipasti',
    nome: 'Polpo all\'Insalata',
    descrizione: 'Polpo verace scottato, patate, sedano, olive di Castelvetrano, olio nuovo.',
    prezzo: '€ 14',
    img: 'https://images.unsplash.com/photo-1559847844-5315695dadae?w=600&q=80&fit=crop',
  },
]

const CATEGORIE = ['Tutti', 'Antipasti', 'Primi', 'Secondi']

const REVIEWS = [
  {
    id: 1,
    nome: 'Brad Colosimo',
    stelle: 5,
    testo: 'Incredible food. This is the place you come to in Palermo if you want fine dining but also with the love and care of a family restaurant. No shortcuts — all feels like "home made", highest quality cuisine.',
    avatar: 'BC',
  },
  {
    id: 2,
    nome: 'Danilo Friddura',
    stelle: 5,
    testo: 'Per me il migliore ristorante di tutta Palermo e non solo. Un posto fino, elegante, ma allo stesso tempo familiare. Non esistono posti così.',
    avatar: 'DF',
  },
  {
    id: 3,
    nome: 'Lyle Pitzel',
    stelle: 5,
    testo: 'One of the best tastes in Europe without the hefty price. Very kind and accommodating, with a true interest in their patrons. A wonderful surprise.',
    avatar: 'LP',
  },
  {
    id: 4,
    nome: 'Chiara Ceccherini',
    stelle: 5,
    testo: 'Sublime! Abbiamo mangiato benissimo. Bucatini alle sarde meravigliosi, tonno ai profumi mediterranei buonissimo e cassata favolosa! Tutto accompagnato dalla gentilezza del proprietario.',
    avatar: 'CC',
  },
  {
    id: 5,
    nome: 'Matt Longo',
    stelle: 5,
    testo: 'If you are reading this… go here now! This is your spot if you want the best pasta and seafood in all of Palermo. A family owned restaurant that makes you feel like you\'re one of their own.',
    avatar: 'ML',
  },
  {
    id: 6,
    nome: 'Virginia Silva',
    stelle: 5,
    testo: 'Luogo magico, cibo sublime, proprietari accoglienti e tanto amorevoli. Mimmo e sua moglie ci hanno fatto sentire a casa. Un\'esperienza che non dimenticheremo.',
    avatar: 'VS',
  },
]

const GALLERY_IMGS = [
  { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80&fit=crop', alt: 'Interno del ristorante', tall: true },
  { src: 'https://images.unsplash.com/photo-1551183053-bf91798d792f?w=600&q=80&fit=crop', alt: 'Pasta fresca', tall: false },
  { src: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&q=80&fit=crop', alt: 'Vino siciliano', tall: false },
  { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&fit=crop', alt: 'Atmosfera serale', tall: true },
  { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80&fit=crop', alt: 'Piatto di pesce', tall: false },
  { src: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?w=600&q=80&fit=crop', alt: 'Dessert siciliano', tall: false },
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
}

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12 } },
}

function AnimSection({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  return (
    <motion.div
      ref={ref}
      variants={stagger}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  )
}

function StarRow({ n }: { n: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: n }).map((_, i) => (
        <Star key={i} size={14} className="fill-gold-500 text-gold-500" />
      ))}
    </div>
  )
}

// ─── NAVBAR ──────────────────────────────────────────────────────────────────

function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const links = [
    { label: 'La Storia', href: '#storia' },
    { label: 'Menu', href: '#menu' },
    { label: 'Galleria', href: '#galleria' },
    { label: 'Recensioni', href: '#recensioni' },
    { label: 'Contatti', href: '#contatti' },
  ]

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-dark-900/95 backdrop-blur-sm shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <a href="#top" className="flex items-center gap-2">
          <UtensilsCrossed size={20} className="text-gold-500" />
          <span className="font-serif text-cream-100 text-lg tracking-wide hidden sm:block">
            Lo Scrigno
          </span>
        </a>

        {/* Desktop links */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-cream-300 hover:text-gold-400 text-sm tracking-widest uppercase font-light transition-colors duration-200"
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <a
          href="#contatti"
          className="hidden md:inline-flex items-center gap-2 border border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-dark-900 text-xs tracking-widest uppercase px-5 py-2.5 transition-all duration-300 font-medium"
        >
          Prenota
        </a>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden text-cream-200 p-1"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-800/98 backdrop-blur-sm border-t border-dark-600"
          >
            <nav className="flex flex-col py-4">
              {links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="text-cream-200 hover:text-gold-400 text-sm tracking-widest uppercase px-6 py-3 transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <a
                href="#contatti"
                onClick={() => setOpen(false)}
                className="mx-6 mt-3 border border-gold-500 text-gold-400 text-sm tracking-widest uppercase px-5 py-2.5 text-center transition-colors"
              >
                Prenota
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

// ─── HERO ────────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section id="top" className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
      {/* BG image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=80&fit=crop"
          alt="Ristorante Lo Scrigno di Donna Rosa"
          className="w-full h-full object-cover scale-105"
          style={{ animation: 'slowZoom 20s ease-in-out infinite alternate' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-dark-900/70 via-dark-900/50 to-dark-900/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.5em' }}
          animate={{ opacity: 1, letterSpacing: '0.35em' }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="text-gold-400 text-xs md:text-sm uppercase tracking-widest2 mb-6 font-light"
        >
          Palermo · Dal 1912 · Cucina Siciliana
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-cream-100 text-5xl md:text-7xl lg:text-8xl leading-tight mb-4"
        >
          Lo Scrigno
          <br />
          <span className="italic text-gold-400">di Donna Rosa</span>
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 1.1 }}
          className="w-24 h-px bg-gold-500 mx-auto my-6"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="text-cream-300 text-base md:text-lg font-light tracking-wide max-w-xl mx-auto"
        >
          Pesce fresco del Mediterraneo, pasta fatta in casa,
          <br className="hidden md:block" /> il calore di una famiglia siciliana.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
        >
          <a
            href="#menu"
            className="bg-gold-500 hover:bg-gold-600 text-dark-900 text-sm tracking-widest uppercase px-8 py-4 font-medium transition-all duration-300 hover:shadow-lg hover:shadow-gold-500/20"
          >
            Scopri il Menu
          </a>
          <a
            href="#contatti"
            className="border border-cream-200/40 text-cream-200 hover:border-gold-400 hover:text-gold-400 text-sm tracking-widest uppercase px-8 py-4 font-light transition-all duration-300"
          >
            Prenota un Tavolo
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
      >
        <ChevronDown size={20} className="text-gold-400/60" />
      </motion.div>

      <style>{`
        @keyframes slowZoom {
          from { transform: scale(1.05); }
          to   { transform: scale(1.12); }
        }
      `}</style>
    </section>
  )
}

// ─── STORIA ──────────────────────────────────────────────────────────────────

function Storia() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  return (
    <section id="storia" className="py-28 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
        {/* Image */}
        <motion.div
          ref={ref}
          initial={{ opacity: 0, x: -50 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.9, ease: 'easeOut' }}
          className="relative"
        >
          <img
            src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800&q=80&fit=crop"
            alt="L'atmosfera de Lo Scrigno"
            className="w-full h-[500px] object-cover"
          />
          <div className="absolute -bottom-6 -right-6 bg-dark-900 text-cream-100 px-8 py-6 hidden md:block">
            <div className="font-serif text-5xl text-gold-400 font-bold">112</div>
            <div className="text-xs tracking-widest uppercase text-cream-300 mt-1">Anni di Tradizione</div>
          </div>
        </motion.div>

        {/* Text */}
        <AnimSection>
          <motion.p variants={fadeUp} className="text-gold-500 text-xs tracking-widest2 uppercase mb-4">
            La nostra storia
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-4xl md:text-5xl text-dark-900 leading-tight mb-6">
            Una famiglia,
            <br />
            <span className="italic text-gold-600">una passione.</span>
          </motion.h2>
          <motion.div variants={fadeUp} className="w-12 h-px bg-gold-500 mb-8" />
          <motion.p variants={fadeUp} className="text-dark-500 leading-relaxed mb-6 text-[15px]">
            Dal 1912, tre generazioni di una stessa famiglia portano avanti l'amore per la cucina siciliana autentica. Mimmo accoglie ogni ospite come si fa in casa propria: con un sorriso, un consiglio sul menu, e la certezza che il pesce del giorno è arrivato stamattina.
          </motion.p>
          <motion.p variants={fadeUp} className="text-dark-500 leading-relaxed mb-10 text-[15px]">
            "Lo Scrigno" è questo: un tesoro nascosto nel cuore di Palermo, a due passi dal Politeama, dove la cucina non è mai standardizzata. Ogni piatto è pensato, ogni ingrediente scelto con cura. Come lo farebbe tua nonna, ma con la tecnica di uno chef.
          </motion.p>
          <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
            {[
              { n: '100%', label: 'Pesce fresco' },
              { n: 'Fatta in casa', label: 'Pasta e pane' },
              { n: 'Familiare', label: 'Atmosfera' },
            ].map((item) => (
              <div key={item.label} className="border-l-2 border-gold-500 pl-4">
                <div className="font-serif text-dark-900 font-semibold text-lg">{item.n}</div>
                <div className="text-dark-500 text-xs mt-0.5">{item.label}</div>
              </div>
            ))}
          </motion.div>
        </AnimSection>
      </div>
    </section>
  )
}

// ─── MENU ────────────────────────────────────────────────────────────────────

function MenuSection() {
  const [cat, setCat] = useState('Tutti')

  const filtered = cat === 'Tutti' ? MENU_ITEMS : MENU_ITEMS.filter((m) => m.categoria === cat)

  return (
    <section id="menu" className="py-28 bg-dark-800">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <AnimSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-gold-400 text-xs tracking-widest2 uppercase mb-4">
            I nostri piatti
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-cream-100 text-4xl md:text-5xl">
            Cucina Siciliana
            <span className="italic text-gold-400"> Autentica</span>
          </motion.h2>
          <motion.p variants={fadeUp} className="text-cream-300/60 mt-4 max-w-md mx-auto text-sm font-light">
            Ogni giorno il menu segue il pescato. Alcune specialità potrebbero variare.
          </motion.p>
        </AnimSection>

        {/* Filter tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {CATEGORIE.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-xs tracking-widest uppercase px-5 py-2.5 border transition-all duration-300 ${
                cat === c
                  ? 'bg-gold-500 border-gold-500 text-dark-900 font-medium'
                  : 'border-cream-200/20 text-cream-300/60 hover:border-gold-500/50 hover:text-cream-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Grid */}
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="group bg-dark-700 overflow-hidden cursor-default"
              >
                <div className="relative overflow-hidden h-52">
                  <img
                    src={item.img}
                    alt={item.nome}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-[10px] tracking-widest uppercase bg-gold-500 text-dark-900 px-2.5 py-1 font-medium">
                    {item.categoria}
                  </span>
                  <span className="absolute bottom-3 right-3 font-serif text-cream-100 text-lg font-semibold">
                    {item.prezzo}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-serif text-cream-100 text-xl mb-2">{item.nome}</h3>
                  <p className="text-cream-300/50 text-sm leading-relaxed font-light">{item.descrizione}</p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className="text-center mt-12">
          <a
            href="#contatti"
            className="inline-flex items-center gap-2 border border-gold-500/50 text-gold-400 hover:bg-gold-500 hover:text-dark-900 text-xs tracking-widest uppercase px-8 py-3.5 transition-all duration-300"
          >
            Prenota il tuo tavolo
          </a>
        </div>
      </div>
    </section>
  )
}

// ─── GALLERIA ────────────────────────────────────────────────────────────────

function Galleria() {
  return (
    <section id="galleria" className="py-28 bg-cream-100">
      <div className="max-w-7xl mx-auto px-6">
        <AnimSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-gold-600 text-xs tracking-widest2 uppercase mb-4">
            Galleria
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-dark-900 text-4xl md:text-5xl">
            Atmosfera &amp; <span className="italic text-gold-600">Sapori</span>
          </motion.h2>
        </AnimSection>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {GALLERY_IMGS.map((img, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: i * 0.08 }}
              className={`overflow-hidden group ${img.tall ? 'row-span-2' : ''}`}
            >
              <img
                src={img.src}
                alt={img.alt}
                className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${
                  img.tall ? 'h-full min-h-[400px]' : 'h-48 md:h-56'
                }`}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── RECENSIONI ──────────────────────────────────────────────────────────────

function Recensioni() {
  const [idx, setIdx] = useState(0)

  const prev = () => setIdx((i) => (i - 1 + REVIEWS.length) % REVIEWS.length)
  const next = () => setIdx((i) => (i + 1) % REVIEWS.length)

  // Show 1 on mobile, 3 on desktop
  const visible = [
    REVIEWS[idx % REVIEWS.length],
    REVIEWS[(idx + 1) % REVIEWS.length],
    REVIEWS[(idx + 2) % REVIEWS.length],
  ]

  return (
    <section id="recensioni" className="py-28 bg-dark-900 relative overflow-hidden">
      {/* Decorative */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-gold-500/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Header */}
        <AnimSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-gold-400 text-xs tracking-widest2 uppercase mb-4">
            Cosa dicono di noi
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-cream-100 text-4xl md:text-5xl">
            Le Parole dei
            <span className="italic text-gold-400"> Nostri Ospiti</span>
          </motion.h2>

          {/* Google rating */}
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mt-6">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => <Star key={i} size={18} className="fill-gold-500 text-gold-500" />)}
            </div>
            <span className="font-serif text-cream-100 text-2xl font-semibold">4.7</span>
            <span className="text-cream-300/50 text-sm">su Google Maps</span>
          </motion.div>
        </AnimSection>

        {/* Carousel */}
        <div className="relative">
          <div className="grid md:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {visible.map((r, i) => (
                <motion.div
                  key={r.id + '-' + i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className={`bg-dark-700 border border-dark-600 p-8 ${i > 0 ? 'hidden md:block' : ''}`}
                >
                  <StarRow n={r.stelle} />
                  <p className="text-cream-200/80 text-sm leading-relaxed mt-4 mb-6 font-light italic">
                    "{r.testo}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center text-gold-400 text-xs font-semibold">
                      {r.avatar}
                    </div>
                    <span className="text-cream-300 text-sm font-medium">{r.nome}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <button
              onClick={prev}
              className="w-10 h-10 border border-cream-200/20 text-cream-300 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-all duration-200"
              aria-label="Precedente"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                    i === idx ? 'bg-gold-500 w-6' : 'bg-cream-200/20'
                  }`}
                />
              ))}
            </div>
            <button
              onClick={next}
              className="w-10 h-10 border border-cream-200/20 text-cream-300 hover:border-gold-400 hover:text-gold-400 flex items-center justify-center transition-all duration-200"
              aria-label="Successivo"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── CONTATTI ────────────────────────────────────────────────────────────────

function Contatti() {
  const orari = [
    { g: 'Martedì – Venerdì', h: '12:30 – 15:00 · 19:30 – 23:00' },
    { g: 'Sabato', h: '12:30 – 15:30 · 19:30 – 23:30' },
    { g: 'Domenica', h: '12:30 – 15:30' },
    { g: 'Lunedì', h: 'Chiuso' },
  ]

  return (
    <section id="contatti" className="py-28 bg-cream-50">
      <div className="max-w-7xl mx-auto px-6">
        <AnimSection className="text-center mb-16">
          <motion.p variants={fadeUp} className="text-gold-600 text-xs tracking-widest2 uppercase mb-4">
            Vieni a trovarci
          </motion.p>
          <motion.h2 variants={fadeUp} className="font-serif text-dark-900 text-4xl md:text-5xl">
            Dove Siamo
          </motion.h2>
        </AnimSection>

        <div className="grid md:grid-cols-2 gap-16 items-start">
          {/* Info */}
          <AnimSection>
            <motion.div variants={fadeUp} className="space-y-8">
              <div className="flex gap-4">
                <MapPin size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-dark-900 font-medium mb-1">Indirizzo</div>
                  <div className="text-dark-500 text-sm leading-relaxed">
                    Via Principe di Belmonte, 34<br />
                    90139 Palermo (PA)<br />
                    <span className="text-dark-400 text-xs">Zona Politeama · Centro Storico</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <Phone size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-dark-900 font-medium mb-1">Telefono</div>
                  <a href="tel:+390916123456" className="text-dark-500 text-sm hover:text-gold-600 transition-colors">
                    +39 091 612 3456
                  </a>
                  <div className="text-dark-400 text-xs mt-0.5">Consigliamo la prenotazione</div>
                </div>
              </div>

              <div className="flex gap-4">
                <Clock size={20} className="text-gold-500 flex-shrink-0 mt-0.5" />
                <div>
                  <div className="text-dark-900 font-medium mb-3">Orari</div>
                  <div className="space-y-2">
                    {orari.map((o) => (
                      <div key={o.g} className="flex justify-between text-sm gap-4">
                        <span className="text-dark-900 font-light">{o.g}</span>
                        <span className={`text-right ${o.h === 'Chiuso' ? 'text-dark-400' : 'text-dark-500'}`}>
                          {o.h}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div variants={fadeUp} className="mt-10">
              <a
                href="tel:+390916123456"
                className="inline-flex items-center gap-3 bg-dark-900 hover:bg-dark-700 text-cream-100 text-sm tracking-widest uppercase px-8 py-4 transition-all duration-300"
              >
                <Phone size={16} />
                Chiama per prenotare
              </a>
            </motion.div>
          </AnimSection>

          {/* Map placeholder */}
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative h-96 overflow-hidden"
          >
            <iframe
              title="Mappa Lo Scrigno di Donna Rosa"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3165.4!2d13.3596!3d38.1158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1319efa59af63d47%3A0x8871699ce8a4987f!2sLo%20Scrigno%20di%20Donna%20Rosa!5e0!3m2!1sit!2sit!4v1700000000000"
            />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────

function Footer() {
  return (
    <footer className="bg-dark-900 text-cream-300/50 py-10 border-t border-dark-600">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-xs tracking-wide">
        <div className="flex items-center gap-2 text-cream-200">
          <UtensilsCrossed size={16} className="text-gold-500" />
          <span className="font-serif text-base tracking-wide">Lo Scrigno di Donna Rosa</span>
        </div>
        <p>© {new Date().getFullYear()} Lo Scrigno di Donna Rosa · Via Principe di Belmonte, 34 · Palermo</p>
        <p>P.IVA 01234567890</p>
      </div>
    </footer>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Storia />
        <MenuSection />
        <Galleria />
        <Recensioni />
        <Contatti />
      </main>
      <Footer />
    </>
  )
}
