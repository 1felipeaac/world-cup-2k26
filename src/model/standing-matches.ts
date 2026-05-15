import { Groups } from "./groups";
import { Teams } from "./teams";
import { TournamentStage, type Match } from "./tournament";

const normalize = (str: string) => 
  str.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();

const teamMap = Object.fromEntries(Teams.map(t => [normalize(t.name), t]));
const groupMap = Object.fromEntries(Groups.map(g => [normalize(g.name), g]));

export const StandingMatches: Match[] = [
  {
    id: 1,
    groupId: groupMap[normalize('Grupo A')]?.id,
    homeTeamId: { ...teamMap[normalize('México')] }.id,
    awayTeamId: { ...teamMap[normalize('África do Sul')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-11T16:00:00Z"), 
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 2,
    groupId: groupMap[normalize('Grupo A')]?.id,
    homeTeamId: { ...teamMap[normalize('Coréia do Sul')] }.id,
    awayTeamId: { ...teamMap[normalize('Republica Tcheca')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-11T23:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 3,
    groupId: groupMap[normalize('Grupo B')]?.id,
    homeTeamId: { ...teamMap[normalize('Canadá')] }.id,
    awayTeamId: { ...teamMap[normalize('Bósnia')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-12T16:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 4,
    groupId: groupMap[normalize('Grupo B')]?.id,
    homeTeamId: { ...teamMap[normalize('Catar')] }.id,
    awayTeamId: { ...teamMap[normalize('Suíça')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-13T16:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 5,
    groupId: groupMap[normalize('Grupo C')]?.id,
    homeTeamId: { ...teamMap[normalize('Brasil')] }.id,
    awayTeamId: { ...teamMap[normalize('Marrocos')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-13T19:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 6,
    groupId: groupMap[normalize('Grupo C')]?.id,
    homeTeamId: { ...teamMap[normalize('Haiti')] }.id,
    awayTeamId: { ...teamMap[normalize('Escócia')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-13T22:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 7,
    groupId: groupMap[normalize('Grupo D')]?.id,
    homeTeamId: { ...teamMap[normalize('Estados Unidos')] }.id,
    awayTeamId: { ...teamMap[normalize('Paraguai')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-12T22:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 8,
    groupId: groupMap[normalize('Grupo D')]?.id,
    homeTeamId: { ...teamMap[normalize('Austrália')] }.id,
    awayTeamId: { ...teamMap[normalize('Turquia')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-14T01:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 9,
    groupId: groupMap[normalize('Grupo E')]?.id,
    homeTeamId: { ...teamMap[normalize('Alemanha')] }.id,
    awayTeamId: { ...teamMap[normalize('Curaçao')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-14T14:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 10,
    groupId: groupMap[normalize('Grupo E')]?.id,
    homeTeamId: { ...teamMap[normalize('Costa do Marfim')] }.id,
    awayTeamId: { ...teamMap[normalize('Equador')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-14T20:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 11,
    groupId: groupMap[normalize('Grupo F')]?.id,
    homeTeamId: { ...teamMap[normalize('Holanda')] }.id,
    awayTeamId: { ...teamMap[normalize('Japão')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-14T17:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 12,
    groupId: groupMap[normalize('Grupo F')]?.id,
    homeTeamId: { ...teamMap[normalize('Suécia')] }.id,
    awayTeamId: { ...teamMap[normalize('Tunísia')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-14T23:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 13,
    groupId: groupMap[normalize('Grupo G')]?.id,
    homeTeamId: { ...teamMap[normalize('Bélgica')] }.id,
    awayTeamId: { ...teamMap[normalize('Egito')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-15T16:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 14,
    groupId: groupMap[normalize('Grupo G')]?.id,
    homeTeamId: { ...teamMap[normalize('Iran')] }.id,
    awayTeamId: { ...teamMap[normalize('Nova Zelândia')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-15T22:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 15,
    groupId: groupMap[normalize('Grupo H')]?.id,
    homeTeamId: { ...teamMap[normalize('Espanha')] }.id,
    awayTeamId: { ...teamMap[normalize('Cabo Verde')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-15T13:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 16,
    groupId: groupMap[normalize('Grupo H')]?.id,
    homeTeamId: { ...teamMap[normalize('Arábia Saudita')] }.id,
    awayTeamId: { ...teamMap[normalize('Uruguai')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-15T19:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 17,
    groupId: groupMap[normalize('Grupo I')]?.id,
    homeTeamId: { ...teamMap[normalize('Espanha')] }.id,
    awayTeamId: { ...teamMap[normalize('Cabo Verde')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-15T13:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
  {
    id: 18,
    groupId: groupMap[normalize('Grupo I')]?.id,
    homeTeamId: { ...teamMap[normalize('Arábia Saudita')] }.id,
    awayTeamId: { ...teamMap[normalize('Uruguai')] }.id,
    homeTeamGoals: 0,
    awayTeamGoals: 0,
    date: new Date("2026-06-15T19:00:00Z"),
    stage: TournamentStage.GROUP_STAGE,
    round: 1
  },
];
