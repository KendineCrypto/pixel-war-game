import { Team } from '../types';

export const TEAM_COLORS: Record<Team, string> = {
  blue: '#007BFF',
  pink: '#FF69B4',
  orange: '#FFA500',
  purple: '#800080',
  green: '#28A745',
};

export const TEAM_NAMES: Record<Team, string> = {
  blue: 'Blue',
  pink: 'Pink',
  orange: 'Orange',
  purple: 'Purple',
  green: 'Green',
};

export const TEAM_EMOJIS: Record<Team, string> = {
  blue: '🟦',
  pink: '🟥',
  orange: '🟧',
  purple: '🟪',
  green: '��',
};

export const getTeamColor = (team: Team): string => {
  return TEAM_COLORS[team] || '#808080';
};

export const getTeamName = (team: Team): string => {
  return TEAM_NAMES[team] || 'Unknown Team';
};

export const getTeamEmoji = (team: Team): string => {
  return TEAM_EMOJIS[team] || '❓';
};

export const getDarkerColor = (color: string, factor: number = 0.8): string => {
  const hex = color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  return `#${Math.round(r * factor).toString(16).padStart(2, '0')}${Math.round(g * factor).toString(16).padStart(2, '0')}${Math.round(b * factor).toString(16).padStart(2, '0')}`;
}; 