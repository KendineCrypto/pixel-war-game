import { create } from 'zustand';
import { LeaderboardEntry, Pixel, Team } from '../types';
import { paintPixel as apiPaintPixel, getCanvas, getLeaderboard } from '../utils/api';

interface GameState {
  selectedTeam: Team | null;
  lastPaintTime: number | null;
  pixels: Pixel[];
  canvasSize: { width: number; height: number };
  isTeamSelectorOpen: boolean;
  isPaintModalOpen: boolean;
  selectedPixel: { x: number; y: number } | null;
  leaderboard: LeaderboardEntry[];
  isInitialized: boolean;
  
  // Actions
  initializeGame: () => Promise<void>;
  selectTeam: (team: Team) => void;
  setPixels: (pixels: Pixel[]) => void;
  setPixel: (pixel: Pixel) => void;
  openTeamSelector: () => void;
  closeTeamSelector: () => void;
  openPaintModal: (x: number, y: number) => void;
  closePaintModal: () => void;
  paintPixel: (x: number, y: number) => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  canPaint: () => boolean;
  getTimeUntilNextPaint: () => number;
}

const COOLDOWN_TIME = 15 * 1000; // 5 minutes in milliseconds
const LOCAL_TEAM_KEY = 'pixelwar_selected_team';
const LOCAL_PAINT_TIME_KEY = 'pixelwar_last_paint_time';

function loadInitialTeam(): Team | null {
  const t = localStorage.getItem(LOCAL_TEAM_KEY);
  return t === null ? null : (t as Team);
}
function loadInitialPaintTime(): number | null {
  const t = localStorage.getItem(LOCAL_PAINT_TIME_KEY);
  return t === null ? null : Number(t);
}

export const useGameStore = create<GameState>((set, get) => ({
  // Initial state
  selectedTeam: loadInitialTeam(),
  lastPaintTime: loadInitialPaintTime(),
  pixels: [],
  canvasSize: { width: 100, height: 100 },
  isTeamSelectorOpen: false,
  isPaintModalOpen: false,
  selectedPixel: null,
  leaderboard: [],
  isInitialized: false,

  // Actions
  initializeGame: async () => {
    try {
      const initialPixels = await getCanvas();
      set({ pixels: initialPixels });
      await get().loadLeaderboard();
      
      // Otomatik olarak bir takım seçili değilse, seçim ekranını aç
      if (!get().selectedTeam) {
        set({ isTeamSelectorOpen: true });
      }
    } catch (error) {
      console.error('Failed to initialize game:', error);
    } finally {
      set({ isInitialized: true });
    }
  },
  
  setPixels: (pixels: Pixel[]) => set({ pixels }),

  setPixel: (pixel: Pixel) => {
    set(state => ({
      pixels: state.pixels.filter(p => !(p.x === pixel.x && p.y === pixel.y)).concat(pixel)
    }));
  },

  selectTeam: (team: Team) => {
    localStorage.setItem(LOCAL_TEAM_KEY, team);
    set({ selectedTeam: team, isTeamSelectorOpen: false });
  },

  openTeamSelector: () => set({ isTeamSelectorOpen: true }),
  closeTeamSelector: () => set({ isTeamSelectorOpen: false }),

  openPaintModal: (x: number, y: number) => {
    if (!get().selectedTeam) {
      set({ isTeamSelectorOpen: true });
      return;
    }
    if (!get().canPaint()) {
      // Belki bir bildirim gösterilir.
      console.log("Cooldown aktif.");
      return;
    }
    set({ isPaintModalOpen: true, selectedPixel: { x, y } });
  },

  closePaintModal: () => set({ isPaintModalOpen: false, selectedPixel: null }),

  paintPixel: async (x: number, y: number) => {
    const { selectedTeam } = get();
    if (!selectedTeam || !get().canPaint()) return;

    console.log(`Attempting to paint pixel (${x}, ${y}) with team ${selectedTeam}`);

    try {
      // API'ye gönder, ama cevabını beklemeden UI'ı güncelle (İyimser Güncelleme)
      const newPixel: Pixel = {
        x,
        y,
        team: selectedTeam,
        last_painted_at: new Date().toISOString()
      };
      get().setPixel(newPixel);

      // Modal'ı hemen kapat ve bekleme süresini başlat
      const now = Date.now();
      localStorage.setItem(LOCAL_PAINT_TIME_KEY, String(now));
      set({ 
        lastPaintTime: now,
        isPaintModalOpen: false,
        selectedPixel: null 
      });

      // Arka planda API isteğini yap ve liderlik tablosunu sessizce güncelle
      await apiPaintPixel({ x, y, team: selectedTeam });
      get().loadLeaderboard();

    } catch (error) {
      console.error('Failed to paint pixel in store:', error);
      // Hata durumunda, iyimser güncellemeyi geri almak için bir mantık eklenebilir.
    }
  },

  loadLeaderboard: async () => {
    try {
      const leaderboard = await getLeaderboard();
      set({ leaderboard });
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
    }
  },

  canPaint: () => {
    const { lastPaintTime } = get();
    if (!lastPaintTime) return true;
    return (Date.now() - lastPaintTime) >= COOLDOWN_TIME;
  },

  getTimeUntilNextPaint: () => {
    const { lastPaintTime } = get();
    if (!lastPaintTime) return 0;
    const timeRemaining = COOLDOWN_TIME - (Date.now() - lastPaintTime);
    return Math.max(0, timeRemaining);
  }
})); 