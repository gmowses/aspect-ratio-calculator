import { useState } from 'react'
import { Sun, Moon, Languages, RatioIcon } from 'lucide-react'

const translations = {
  en: {
    title: 'Aspect Ratio Calculator',
    subtitle: 'Calculate and convert aspect ratios. Input width or height, get the other dimension. Common presets included.',
    customRatio: 'Custom Ratio',
    width: 'Width (px)',
    height: 'Height (px)',
    ratioLabel: 'Ratio',
    presets: 'Common Presets',
    results: 'Results',
    gcd: 'Simplified ratio',
    decimal: 'Decimal',
    forWidth: 'Height for width',
    forHeight: 'Width for height',
    builtBy: 'Built by',
  },
  pt: {
    title: 'Calculadora de Aspect Ratio',
    subtitle: 'Calcule e converta proporcoes. Insira largura ou altura e obtenha a outra dimensao. Predefinicoes comuns inclusas.',
    customRatio: 'Proporcao Personalizada',
    width: 'Largura (px)',
    height: 'Altura (px)',
    ratioLabel: 'Proporcao',
    presets: 'Predefinicoes Comuns',
    results: 'Resultados',
    gcd: 'Proporcao simplificada',
    decimal: 'Decimal',
    forWidth: 'Altura para largura',
    forHeight: 'Largura para altura',
    builtBy: 'Criado por',
  },
} as const

type Lang = keyof typeof translations

const PRESETS: { name: string; w: number; h: number; desc: string }[] = [
  { name: '16:9', w: 16, h: 9, desc: 'HD/FHD/4K video, YouTube, modern displays' },
  { name: '4:3', w: 4, h: 3, desc: 'Traditional TV, old monitors, VGA' },
  { name: '1:1', w: 1, h: 1, desc: 'Square — Instagram post, avatar' },
  { name: '21:9', w: 21, h: 9, desc: 'Ultrawide cinema, 2560×1080' },
  { name: '9:16', w: 9, h: 16, desc: 'Portrait video — Reels, TikTok, Stories' },
  { name: '3:2', w: 3, h: 2, desc: '35mm film, most DSLR sensors' },
  { name: '2:1', w: 2, h: 1, desc: 'Univisium cinema' },
  { name: '4:5', w: 4, h: 5, desc: 'Instagram portrait post' },
  { name: '5:4', w: 5, h: 4, desc: 'Medium format, 1280×1024' },
  { name: '3:4', w: 3, h: 4, desc: 'iPad portrait' },
  { name: '2.39:1', w: 239, h: 100, desc: 'Anamorphic / CinemaScope' },
  { name: '1.85:1', w: 185, h: 100, desc: 'US theatrical widescreen' },
]

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b)
}

function simplify(w: number, h: number): string {
  if (w <= 0 || h <= 0 || isNaN(w) || isNaN(h)) return '—'
  const roundW = Math.round(w)
  const roundH = Math.round(h)
  const g = gcd(roundW, roundH)
  return `${roundW / g}:${roundH / g}`
}

export default function AspectRatioCalculator() {
  const [lang, setLang] = useState<Lang>(() => navigator.language.startsWith('pt') ? 'pt' : 'en')
  const [dark, setDark] = useState(() => window.matchMedia('(prefers-color-scheme: dark)').matches)
  const [ratioW, setRatioW] = useState(16)
  const [ratioH, setRatioH] = useState(9)
  const [widthInput, setWidthInput] = useState('1920')
  const [heightInput, setHeightInput] = useState('1080')

  const t = translations[lang]

  const toggleDark = () => {
    setDark(d => {
      document.documentElement.classList.toggle('dark', !d)
      return !d
    })
  }

  const applyPreset = (w: number, h: number) => {
    setRatioW(w)
    setRatioH(h)
    setWidthInput('1920')
    setHeightInput(String(Math.round(1920 * h / w)))
  }

  const handleWidthChange = (val: string) => {
    setWidthInput(val)
    const n = parseFloat(val)
    if (!isNaN(n) && n > 0 && ratioW > 0) {
      setHeightInput(String(Math.round(n * ratioH / ratioW)))
    }
  }

  const handleHeightChange = (val: string) => {
    setHeightInput(val)
    const n = parseFloat(val)
    if (!isNaN(n) && n > 0 && ratioH > 0) {
      setWidthInput(String(Math.round(n * ratioW / ratioH)))
    }
  }

  const handleRatioChange = (field: 'w' | 'h', val: string) => {
    const n = parseFloat(val)
    if (field === 'w') {
      setRatioW(isNaN(n) ? 0 : n)
      const w = parseFloat(widthInput)
      if (!isNaN(w) && !isNaN(n) && n > 0 && ratioH > 0) {
        setHeightInput(String(Math.round(w * ratioH / n)))
      }
    } else {
      setRatioH(isNaN(n) ? 0 : n)
      const w = parseFloat(widthInput)
      if (!isNaN(w) && !isNaN(n) && n > 0 && ratioW > 0) {
        setHeightInput(String(Math.round(w * n / ratioW)))
      }
    }
  }

  const w = parseFloat(widthInput)
  const h = parseFloat(heightInput)
  const decimalRatio = ratioW && ratioH ? (ratioW / ratioH).toFixed(4) : '—'
  const simplifiedRatio = simplify(ratioW, ratioH)

  // Preview box
  const previewW = 280
  const previewH = ratioW && ratioH ? Math.round(previewW * ratioH / ratioW) : 160
  const clampedH = Math.min(previewH, 300)

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#09090b] text-zinc-900 dark:text-zinc-100 transition-colors">
      <header className="border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <RatioIcon size={18} className="text-white" />
            </div>
            <span className="font-semibold">Aspect Ratio Calculator</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setLang(l => l === 'en' ? 'pt' : 'en')} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <Languages size={14} />
              {lang.toUpperCase()}
            </button>
            <button onClick={toggleDark} className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <a href="https://github.com/gmowses/aspect-ratio-calculator" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 px-6 py-10">
        <div className="max-w-5xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl font-bold">{t.title}</h1>
            <p className="mt-2 text-zinc-500 dark:text-zinc-400">{t.subtitle}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Calculator */}
            <div className="space-y-6">
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-5">
                <h2 className="font-semibold">{t.customRatio}</h2>

                <div className="flex items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-zinc-400">W</label>
                    <input
                      type="number"
                      value={ratioW}
                      onChange={e => handleRatioChange('w', e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 font-mono text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <span className="text-2xl font-bold text-zinc-400 mt-4">:</span>
                  <div className="flex-1 space-y-1">
                    <label className="text-xs text-zinc-400">H</label>
                    <input
                      type="number"
                      value={ratioH}
                      onChange={e => handleRatioChange('h', e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 font-mono text-xl font-bold text-center focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">{t.width}</label>
                    <input
                      type="number"
                      value={widthInput}
                      onChange={e => handleWidthChange(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">{t.height}</label>
                    <input
                      type="number"
                      value={heightInput}
                      onChange={e => handleHeightChange(e.target.value)}
                      className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800/50 px-3 py-2 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-zinc-400">{t.gcd}</p>
                    <p className="font-mono text-lg font-bold text-teal-600 dark:text-teal-400">{simplifiedRatio}</p>
                  </div>
                  <div className="rounded-lg bg-zinc-50 dark:bg-zinc-800/30 border border-zinc-200 dark:border-zinc-800 px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-zinc-400">{t.decimal}</p>
                    <p className="font-mono text-lg font-bold text-teal-600 dark:text-teal-400">{decimalRatio}</p>
                  </div>
                </div>
              </div>

              {/* Visual preview */}
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
                <h2 className="font-semibold">{t.results}</h2>
                <div className="flex items-center justify-center py-4">
                  <div
                    className="rounded-lg bg-teal-500/20 border-2 border-teal-500 flex items-center justify-center font-mono text-sm font-bold text-teal-700 dark:text-teal-300 transition-all duration-300"
                    style={{ width: `${previewW}px`, height: `${clampedH}px` }}
                  >
                    {isNaN(w) || isNaN(h) ? '' : `${w} × ${h}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Presets */}
            <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-6 space-y-4">
              <h2 className="font-semibold">{t.presets}</h2>
              <div className="space-y-2">
                {PRESETS.map(p => {
                  const isActive = ratioW === p.w && ratioH === p.h
                  const previewPH = Math.round(80 * p.h / p.w)
                  return (
                    <button
                      key={p.name}
                      onClick={() => applyPreset(p.w, p.h)}
                      className={`w-full text-left rounded-lg border px-4 py-3 flex items-center gap-4 transition-colors ${isActive ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-300 dark:border-teal-700' : 'border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800/50'}`}
                    >
                      <div
                        className={`shrink-0 rounded border-2 ${isActive ? 'border-teal-500 bg-teal-500/20' : 'border-zinc-400 dark:border-zinc-600'}`}
                        style={{ width: '80px', height: `${Math.min(previewPH, 60)}px` }}
                      />
                      <div>
                        <div className={`font-mono font-bold text-sm ${isActive ? 'text-teal-600 dark:text-teal-400' : ''}`}>{p.name}</div>
                        <div className="text-xs text-zinc-400">{p.desc}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-zinc-400">
          <span>{t.builtBy} <a href="https://github.com/gmowses" className="text-zinc-600 dark:text-zinc-300 hover:text-teal-500 transition-colors">Gabriel Mowses</a></span>
          <span>MIT License</span>
        </div>
      </footer>
    </div>
  )
}
