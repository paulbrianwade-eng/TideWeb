import type { ReactNode } from 'react';
import { CalendarDays, Home, Library, User, TrendingUp } from 'lucide-react';
import { Logo } from './ui';

export type Screen = 'today' | 'week' | 'progress' | 'library' | 'profile';

export const NAV_ITEMS: { id: Screen; label: string; icon: typeof Home }[] = [
  { id: 'today', label: 'Hoy', icon: Home },
  { id: 'week', label: 'Semana', icon: CalendarDays },
  { id: 'progress', label: 'Progreso', icon: TrendingUp },
  { id: 'library', label: 'Biblioteca', icon: Library },
  { id: 'profile', label: 'Perfil', icon: User },
];

export const AppShell = ({
  screen,
  onNavigate,
  children,
  /** Las pantallas con hero manejan su propio header y padding superior. */
  bleed = false,
}: {
  screen: Screen;
  onNavigate: (s: Screen) => void;
  children: ReactNode;
  bleed?: boolean;
}) => (
  <div className="min-h-[100dvh] bg-brand lg:flex">
    {!bleed && (
      <header className="sticky top-0 z-30 border-b border-white/20 bg-brand pt-[env(safe-area-inset-top)] text-white backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-5 py-3">
          <Logo compact light />
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label="Abrir perfil"
            className="grid h-11 w-11 place-items-center rounded-full border border-white/30 bg-white text-brand transition-colors duration-200 hover:bg-lime hover:text-brand-dark"
          >
            <User className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      </header>
    )}

    <nav
      aria-label="Navegación principal"
      className="hidden w-56 shrink-0 border-r border-white/20 bg-[#103f9f] p-5 text-white lg:flex lg:flex-col lg:gap-1"
    >
      <div className="mb-8">
        <Logo compact light />
        <p className="label mt-3 leading-relaxed text-white/65">
          HYROX
          <br />
          Training Journal
        </p>
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = screen === item.id;
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onNavigate(item.id)}
            aria-current={active ? 'page' : undefined}
            className={`flex items-center gap-3 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200 ${
              active ? 'bg-lime text-brand-dark' : 'text-white/75 hover:bg-white/10 hover:text-white'
            }`}
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
            {item.label}
          </button>
        );
      })}
      <div className="mt-auto pt-4">
        <button
          type="button"
          onClick={() => onNavigate('profile')}
          className={`flex w-full items-center gap-3 rounded-full px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.1em] transition-all duration-200 ${
            screen === 'profile' ? 'bg-lime text-brand-dark' : 'text-white/75 hover:bg-white/10 hover:text-white'
          }`}
        >
          <User className="h-4 w-4" aria-hidden="true" />
          Perfil
        </button>
      </div>
    </nav>

    <main className={`mx-auto w-full flex-1 bg-brand pb-28 lg:pb-12 ${bleed ? 'max-w-2xl' : 'max-w-2xl px-5 pt-5 lg:my-8 lg:px-8 lg:pt-8'}`}>
      {children}
    </main>

    <nav
      aria-label="Navegación principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_28px_rgba(8,37,91,0.12)] backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = screen === item.id;
          return (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`flex min-h-14 w-full flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 ${
                  active ? 'text-brand' : 'text-muted'
                }`}
              >
                <Icon className="h-5 w-5" aria-hidden="true" strokeWidth={active ? 2.4 : 1.7} />
                {item.label}
                <span
                  aria-hidden="true"
                  className={`h-1 w-4 rounded-full ${active ? 'bg-lime' : 'bg-transparent'}`}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  </div>
);
