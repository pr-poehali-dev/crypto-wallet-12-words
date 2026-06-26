import { useState } from 'react';
import Icon from '@/components/ui/icon';

type TabId = 'home' | 'recovery' | 'balance' | 'security';

const ASSETS = [
  { sym: 'BTC', name: 'Bitcoin', amount: '0.8421', usd: 71284.5, change: +2.41, color: '#f7931a', icon: 'Bitcoin', dust: 59823.12 },
  { sym: 'ETH', name: 'Ethereum', amount: '12.084', usd: 3512.8, change: +1.12, color: '#627eea', icon: 'Gem', dust: 42438.69 },
  { sym: 'USDT', name: 'Tether', amount: '18 500', usd: 1.0, change: -0.01, color: '#26a17b', icon: 'DollarSign', dust: 18500.0 },
  { sym: 'SOL', name: 'Solana', amount: '210.5', usd: 178.32, change: +5.84, color: '#14f195', icon: 'Zap', dust: 37536.36 },
  { sym: 'TON', name: 'Toncoin', amount: '4 820', usd: 6.74, change: -1.23, color: '#0098ea', icon: 'Send', dust: 32486.8 },
];

const SEED = [
  'orbit', 'velvet', 'tunnel', 'harvest', 'crimson', 'nebula',
  'anchor', 'puzzle', 'meadow', 'quartz', 'silent', 'glacier',
];
const BACKUP_WORD = 'phoenix';

const ACTIVITY = [
  { type: 'in', asset: 'BTC', amount: '+0.1240', usd: '+8 479', from: 'bc1q...8f3a', time: '12:04' },
  { type: 'out', asset: 'ETH', amount: '-2.500', usd: '-8 782', from: '0x7a...91Bc', time: '09:51' },
  { type: 'in', asset: 'USDT', amount: '+5 000', usd: '+5 000', from: 'TJ9k...2pQa', time: 'вчера' },
  { type: 'out', asset: 'SOL', amount: '-18.40', usd: '-3 281', from: 'So11...32fX', time: 'вчера' },
];

export default function Index() {
  const [tab, setTab] = useState<TabId>('home');
  const [revealSeed, setRevealSeed] = useState(false);
  const totalUsd = ASSETS.reduce((s, a) => s + a.dust, 0);

  const tabs: { id: TabId; label: string; icon: string }[] = [
    { id: 'home', label: 'Главная', icon: 'LayoutDashboard' },
    { id: 'balance', label: 'Баланс', icon: 'Wallet' },
    { id: 'recovery', label: 'Восстановление', icon: 'KeyRound' },
    { id: 'security', label: 'Безопасность', icon: 'ShieldCheck' },
  ];

  return (
    <div className="min-h-screen scan text-foreground">
      <div className="border-b border-white/5 overflow-hidden bg-black/40 py-2">
        <div className="flex w-max animate-ticker font-mono text-xs">
          {[...ASSETS, ...ASSETS].map((a, i) => (
            <span key={i} className="px-6 whitespace-nowrap text-muted-foreground">
              <span className="text-foreground font-bold">{a.sym}</span>{' '}
              ${a.usd.toLocaleString()}{' '}
              <span className={a.change >= 0 ? 'text-emerald-400' : 'text-red-400'}>
                {a.change >= 0 ? '▲' : '▼'} {Math.abs(a.change)}%
              </span>
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <header className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center glow-emerald">
              <Icon name="Hexagon" className="text-emerald-400" size={22} />
            </div>
            <div>
              <h1 className="font-mono font-extrabold tracking-tight text-lg leading-none">VAULT<span className="text-emerald-400">.13</span></h1>
              <p className="text-[11px] text-muted-foreground font-mono">мультивалютный кошелёк</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-2 glass rounded-lg px-3 py-1.5 font-mono text-xs">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse-glow" />
              синхронизировано
            </div>
            <button className="h-9 w-9 glass rounded-lg flex items-center justify-center hover:border-emerald-500/40 transition-colors">
              <Icon name="Bell" size={16} />
            </button>
          </div>
        </header>

        <nav className="flex gap-1 p-1 glass rounded-xl mb-6 overflow-x-auto">
          {tabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                tab === t.id
                  ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'
                  : 'text-muted-foreground hover:text-foreground border border-transparent'
              }`}
            >
              <Icon name={t.icon} size={16} />
              {t.label}
            </button>
          ))}
        </nav>

        {tab === 'home' && <HomeTab totalUsd={totalUsd} />}
        {tab === 'balance' && <BalanceTab />}
        {tab === 'recovery' && (
          <RecoveryTab revealSeed={revealSeed} setRevealSeed={setRevealSeed} />
        )}
        {tab === 'security' && <SecurityTab />}
      </div>

      <footer className="text-center text-[11px] text-muted-foreground font-mono py-6">
        VAULT.13 · некастодиальный кошелёк · демонстрационная версия
      </footer>
    </div>
  );
}

function StatCard({ label, value, sub, icon, accent }: { label: string; value: string; sub: string; icon: string; accent?: boolean }) {
  return (
    <div className={`glass rounded-xl p-4 ${accent ? 'glow-emerald' : ''}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] uppercase tracking-wider text-muted-foreground font-mono">{label}</span>
        <Icon name={icon} size={15} className={accent ? 'text-emerald-400' : 'text-muted-foreground'} />
      </div>
      <div className="font-mono font-bold text-xl">{value}</div>
      <div className="text-xs text-muted-foreground mt-0.5">{sub}</div>
    </div>
  );
}

function HomeTab({ totalUsd }: { totalUsd: number }) {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 glass rounded-2xl p-6 relative overflow-hidden glow-emerald">
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-emerald-500/10 blur-2xl" />
          <p className="text-sm text-muted-foreground font-mono">Общий баланс</p>
          <div className="flex items-end gap-3 mt-1">
            <span className="font-mono font-extrabold text-4xl sm:text-5xl text-glow">
              ${totalUsd.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-emerald-400 font-mono text-sm mb-2 flex items-center gap-1">
              <Icon name="TrendingUp" size={15} /> +3.18%
            </span>
          </div>
          <div className="flex flex-wrap gap-2 mt-5">
            {[
              { l: 'Отправить', i: 'ArrowUpRight' },
              { l: 'Получить', i: 'ArrowDownLeft' },
              { l: 'Обмен', i: 'ArrowLeftRight' },
              { l: 'Купить', i: 'Plus' },
            ].map((b) => (
              <button key={b.l} className="flex items-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg px-4 py-2 text-sm font-medium transition-colors">
                <Icon name={b.i} size={15} /> {b.l}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
          <StatCard label="активов" value="5" sub="в кошельке" icon="Coins" />
          <StatCard label="за 24ч" value="+$2 184" sub="прибыль" icon="LineChart" accent />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider">Распределение</h3>
            <Icon name="PieChart" size={16} className="text-emerald-400" />
          </div>
          <div className="flex h-3 rounded-full overflow-hidden mb-4">
            {ASSETS.map((a) => (
              <div key={a.sym} style={{ width: `${(a.dust / 190785) * 100}%`, background: a.color }} />
            ))}
          </div>
          <div className="space-y-2">
            {ASSETS.map((a) => (
              <div key={a.sym} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 font-mono">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: a.color }} />
                  {a.sym}
                </span>
                <span className="font-mono text-muted-foreground">
                  ${a.dust.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-mono font-bold text-sm uppercase tracking-wider">Активность</h3>
            <Icon name="Activity" size={16} className="text-emerald-400" />
          </div>
          <div className="space-y-1">
            {ACTIVITY.map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${t.type === 'in' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'}`}>
                  <Icon name={t.type === 'in' ? 'ArrowDownLeft' : 'ArrowUpRight'} size={15} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium">{t.type === 'in' ? 'Получено' : 'Отправлено'} {t.asset}</div>
                  <div className="text-[11px] text-muted-foreground font-mono truncate">{t.from} · {t.time}</div>
                </div>
                <div className={`font-mono text-sm text-right ${t.type === 'in' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {t.amount}
                  <div className="text-[11px] text-muted-foreground">{t.usd} $</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function BalanceTab() {
  return (
    <div className="space-y-3 animate-fade-in">
      {ASSETS.map((a, i) => (
        <div
          key={a.sym}
          style={{ animationDelay: `${i * 60}ms` }}
          className="glass rounded-xl p-4 flex items-center gap-4 hover:border-emerald-500/30 transition-colors animate-fade-in"
        >
          <div className="h-11 w-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${a.color}22`, color: a.color }}>
            <Icon name={a.icon} size={20} fallback="Coins" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold flex items-center gap-2">
              {a.name}
              <span className="text-[10px] font-mono text-muted-foreground border border-white/10 rounded px-1.5 py-0.5">{a.sym}</span>
            </div>
            <div className="text-xs text-muted-foreground font-mono">${a.usd.toLocaleString()} / монета</div>
          </div>
          <div className="text-right">
            <div className="font-mono font-bold">{a.amount} {a.sym}</div>
            <div className="text-xs text-muted-foreground font-mono">
              ${a.dust.toLocaleString('ru-RU', { maximumFractionDigits: 0 })}
            </div>
          </div>
          <div className={`font-mono text-xs w-16 text-right ${a.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            {a.change >= 0 ? '+' : ''}{a.change}%
          </div>
        </div>
      ))}
      <button className="w-full glass rounded-xl p-4 flex items-center justify-center gap-2 text-muted-foreground hover:text-emerald-300 hover:border-emerald-500/30 transition-colors font-medium text-sm">
        <Icon name="Plus" size={16} /> Добавить токен
      </button>
    </div>
  );
}

function RecoveryTab({ revealSeed, setRevealSeed }: { revealSeed: boolean; setRevealSeed: (v: boolean) => void }) {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="glass rounded-2xl p-5 border-amber-500/20">
        <div className="flex gap-3">
          <Icon name="TriangleAlert" className="text-amber-400 shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-bold text-sm">Секретная фраза восстановления</h3>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              Запишите 12 кодовых слов и сохраните запасное 13-е отдельно. Любой, кто знает фразу, получит полный доступ к средствам. Никому её не показывайте.
            </p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-5 relative">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-mono font-bold text-sm uppercase tracking-wider">12 кодовых слов</h3>
          <button
            onClick={() => setRevealSeed(!revealSeed)}
            className="flex items-center gap-2 text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5"
          >
            <Icon name={revealSeed ? 'EyeOff' : 'Eye'} size={14} />
            {revealSeed ? 'Скрыть' : 'Показать'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SEED.map((w, i) => (
            <div
              key={i}
              style={{ animationDelay: `${i * 40}ms` }}
              className={`flex items-center gap-2 rounded-lg border px-3 py-2.5 font-mono text-sm transition-all ${
                revealSeed
                  ? 'bg-white/[0.03] border-emerald-500/20 animate-flip-in'
                  : 'bg-white/[0.02] border-white/5'
              }`}
            >
              <span className="text-[11px] text-emerald-400/60 w-5">{String(i + 1).padStart(2, '0')}</span>
              <span className={revealSeed ? '' : 'blur-sm select-none'}>
                {revealSeed ? w : 'xxxxxx'}
              </span>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="LifeBuoy" size={15} className="text-amber-400" />
            <span className="font-mono text-xs uppercase tracking-wider text-amber-300">Запасное 13-е слово</span>
          </div>
          <div className={`flex items-center gap-2 rounded-lg border px-3 py-3 font-mono text-sm ${revealSeed ? 'bg-amber-500/5 border-amber-500/30' : 'bg-white/[0.02] border-white/5'}`}>
            <span className="text-[11px] text-amber-400/70 w-5">13</span>
            <span className={revealSeed ? 'text-amber-200 font-bold' : 'blur-sm select-none'}>
              {revealSeed ? BACKUP_WORD : 'xxxxxxx'}
            </span>
            <Icon name="ShieldQuestion" size={14} className="ml-auto text-muted-foreground" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-2">
            Используется как резервный ключ, если основная фраза скомпрометирована.
          </p>
        </div>

        <div className="flex gap-2 mt-5">
          <button className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg py-2.5 text-sm font-medium transition-colors">
            <Icon name="Copy" size={15} /> Скопировать
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 glass hover:border-emerald-500/30 rounded-lg py-2.5 text-sm font-medium transition-colors">
            <Icon name="Download" size={15} /> Сохранить файл
          </button>
        </div>
      </div>
    </div>
  );
}

function SecurityTab() {
  const items = [
    { label: 'Резервная фраза сохранена', state: true, icon: 'FileKey' },
    { label: 'Запасное 13-е слово создано', state: true, icon: 'LifeBuoy' },
    { label: 'PIN-код активирован', state: true, icon: 'LockKeyhole' },
    { label: 'Биометрия', state: false, icon: 'Fingerprint' },
    { label: '2FA-аутентификация', state: false, icon: 'Smartphone' },
  ];
  const score = Math.round((items.filter((i) => i.state).length / items.length) * 100);

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="glass rounded-2xl p-6 glow-emerald flex items-center gap-6">
        <div className="relative h-24 w-24 shrink-0">
          <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
            <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="8" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#10b981" strokeWidth="8" strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 264} 264`} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-mono font-extrabold text-2xl text-glow">{score}</span>
            <span className="text-[10px] text-muted-foreground">/ 100</span>
          </div>
        </div>
        <div>
          <h3 className="font-bold text-lg">Защита кошелька</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Хороший уровень. Включите биометрию и 2FA для максимальной безопасности.
          </p>
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h3 className="font-mono font-bold text-sm uppercase tracking-wider mb-4">Параметры защиты</h3>
        <div className="space-y-1">
          {items.map((it) => (
            <div key={it.label} className="flex items-center gap-3 py-3 border-b border-white/5 last:border-0">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${it.state ? 'bg-emerald-500/15 text-emerald-400' : 'bg-white/5 text-muted-foreground'}`}>
                <Icon name={it.icon} size={17} />
              </div>
              <span className="flex-1 text-sm font-medium">{it.label}</span>
              {it.state ? (
                <span className="flex items-center gap-1.5 text-xs font-mono text-emerald-400">
                  <Icon name="CircleCheck" size={14} /> вкл
                </span>
              ) : (
                <button className="text-xs font-medium text-emerald-300 bg-emerald-500/10 border border-emerald-500/30 rounded-lg px-3 py-1.5">
                  Включить
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <StatCard label="последний вход" value="12:04" sub="Россия · Chrome" icon="MapPin" />
        <StatCard label="активных сессий" value="2" sub="устройства" icon="MonitorSmartphone" />
      </div>
    </div>
  );
}
