import { supabase } from '../supabaseClient';
import { LeaderboardEntry, PaintPayload, Pixel, Team } from '../types';
import { getTeamColor } from './colors';

// Mock user for development
interface User {
  id: string;
  team: Team | null;
}

const mockUser: User = {
  id: 'mock-user-id',
  team: null
};

// Canvas verilerini getir
export const getCanvas = async (): Promise<Pixel[]> => {
  const { data, error } = await supabase
    .from('pixels')
    .select('x, y, team:team_name, last_painted_at:updated_at');
  
  if (error) {
    console.error('Detailed error fetching canvas:', JSON.stringify(error, null, 2));
    throw error;
  }
  
  return data || [];
};

// Piksel boyama
export const paintPixel = async (payload: PaintPayload): Promise<Pixel> => {
  const { data, error } = await supabase
    .from('pixels')
    .upsert({ 
      x: payload.x, 
      y: payload.y, 
      team_name: payload.team 
    }, {
      onConflict: 'x, y'
    })
    .select()
    .single();

  if (error) {
    console.error('Error painting pixel:', error);
    throw error;
  }
  
  return data;
};

// Liderlik tablosu
export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const { data: pixels, error } = await supabase.from('pixels').select('team:team_name');

  if (error) {
    console.error('Error fetching leaderboard data:', error);
    throw error;
  }

  if (!pixels) {
    return [];
  }

  const teamCounts = pixels.reduce((acc, pixel) => {
    const team = pixel.team as Team;
    acc[team] = (acc[team] || 0) + 1;
    return acc;
  }, {} as Record<Team, number>);

  const teams: Team[] = ['blue', 'pink', 'orange', 'purple', 'green'];
  
  return teams.map(team => ({
    team,
    count: teamCounts[team] || 0,
    color: getTeamColor(team)
  })).sort((a, b) => b.count - a.count);
};

// Takım seçimi
export const selectTeam = async (team: Team): Promise<boolean> => {
  // Mock implementation
  mockUser.team = team;
  return true;
};

// Kullanıcı bilgileri
export const getMe = async (): Promise<User> => {
  return mockUser;
}; 