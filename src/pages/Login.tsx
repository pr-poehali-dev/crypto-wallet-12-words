import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';

const CORRECT_SEED = [
  'orbit', 'velvet', 'tunnel', 'harvest', 'crimson', 'nebula',
  'anchor', 'puzzle', 'meadow', 'quartz', 'silent', 'glacier',
];

export default function Login({ onLogin }: { onLogin: () => void }) {
  const [words, setWords] = useState<string[]>(Array(12).fill(''));
  const [error, setError] = useState('');
  const refs = useRef<(HTMLInputElement | null)[]>([]);

  function handleWordChange(i: number, val: string) {
    const trimmed = val.trim();
    if (trimmed.includes(' ')) {
      const parts = trimmed.split(/\s+/).filter(Boolean);
      const newWords = [...words];
      parts.forEach((p, j) => { if (i + j < 12) newWords[i + j] = p; });
      setWords(newWords);
      const next = Math.min(i + parts.length, 11);
      refs.current[next]?.focus();
    } else {
      const updated = [...words];
      updated[i] = val;
      setWords(updated);
    }
    setError('');
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === ' ' || e.key === 'Tab' || e.key === 'Enter') {
      if (words[i].trim().length > 0 && i < 11) {
        e.preventDefault();
        refs.current[i + 1]?.focus();
      }
    }
    if (e.key === 'Backspace' && words[i] === '' && i > 0) {
      e.preventDefault();
      refs.current[i - 1]?.focus();
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const filled = words.map((w) => w.trim().toLowerCase());
    if (!filled.every((w) => w.length > 0)) { setError('Заполните все 12 слов'); return; }
    const correct = filled.every((w, i) => w === CORRECT_SEED[i]);
    if (!correct) { setError('Неверная seed-фраза. Проверьте слова и попробуйте снова.'); return; }
    onLogin();
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-10 scan">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 h-96 w-96 rounded-full bg-emerald-500/5 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-emerald-500/4 blur-3xl" />
      </div>

      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        <div className="flex flex-col items-center mb-8">
          <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center glow-emerald mb-4">
            <Icon name="Hexagon" className="text-emerald-400" size={28} />
          </div>
          <h1 className="font-mono font-extrabold text-2xl tracking-tight">VAULT<span className="text-emerald-400">.13</span></h1>
          <p className="text-sm text-muted-foreground mt-1">мультивалютный кошелёк</p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-2xl p-6 space-y-5">
          <div>
            <h2 className="font-bold text-lg">Восстановление доступа</h2>
            <p className="text-sm text-muted-foreground mt-1">Введите 12 кодовых слов вашей seed-фразы в правильном порядке.</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {words.map((w, i) => (
              <div key={i} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 focus-within:border-emerald-500/40 transition-colors">
                <span className="font-mono text-[11px] text-emerald-400/60 w-4 shrink-0">{String(i + 1).padStart(2, '0')}</span>
                <input
                  ref={(el) => { refs.current[i] = el; }}
                  value={w}
                  onChange={(e) => handleWordChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onPaste={i === 0 ? (e) => {
                    const text = e.clipboardData.getData('text');
                    const parts = text.trim().split(/\s+/);
                    if (parts.length > 1) {
                      e.preventDefault();
                      const newWords = Array(12).fill('');
                      parts.slice(0, 12).forEach((p, j) => { newWords[j] = p; });
                      setWords(newWords);
                      refs.current[Math.min(parts.length, 11)]?.focus();
                    }
                  } : undefined}
                  className="bg-transparent outline-none text-sm font-mono w-full text-foreground placeholder:text-white/15"
                  placeholder="слово"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              <Icon name="CircleX" size={15} /> {error}
            </div>
          )}

          <button type="submit" className="w-full flex items-center justify-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-xl py-3 font-medium transition-colors">
            <Icon name="LogIn" size={17} /> Войти в кошелёк
          </button>

          <p className="text-center text-[11px] text-muted-foreground font-mono">
            Вы можете вставить всю фразу сразу в первое поле
          </p>
        </form>
      </div>
    </div>
  );
}
