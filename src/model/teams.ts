import { getTeamLogo } from "../utils/logos";
import type { Stats, Team } from "../types/tournament";

const initialStats: Stats = {wins: 0, losses: 0, draws: 0, goalsFor: 0, goalsAgainst: 0, goalDifference: 0, points: 0}

const createTeam = (id: number, name: string, logoKey: string): Team => ({
    id,
    name,
    logoUrl: getTeamLogo(logoKey),
    stats: { ...initialStats }
});

export const Teams: Team[] = [
    createTeam(1, "Mexico", "mexico"),
    createTeam(2, "África do Sul", "south-africa"),
    createTeam(3, "Coréia do Sul", "south-korea"),
    createTeam(4, "República Tcheca", "czech-republic"),
    createTeam(5, "Canadá", "canada"),
    createTeam(6, "Bósnia e Herzegovina", "bosnia-and-herzegovina"),
    createTeam(7, "Catar", "qatar"),
    createTeam(8, "Suíça", "switzerland"),
    createTeam(9, "Brasil", "brazil"),
    createTeam(10, "Marrocos", "morocco"),
    createTeam(11, "Haiti", "haiti"),
    createTeam(12, "Escócia", "scotland"),
    createTeam(13, "Estados Unidos", "usa"),
    createTeam(14, "Paraguai", "paraguay"),
    createTeam(15, "Austrália", "australia"),
    createTeam(16, "Turquia", "turkey"),
    createTeam(17, "Alemanha", "germany"),
    createTeam(18, "Curaçao", "curacao"),
    createTeam(19, "Costa do Marfim", "cote-d-ivoire"),
    createTeam(20,"Equador", "ecuador"),
    createTeam(21, "Holanda", "dutch"),
    createTeam(22, "Japão", "japan"),
    createTeam(23, "Suécia", "sweden"),
    createTeam(24, "Tunísia", "tunisia"),
    createTeam(25, "Belgica", "belgium"),
    createTeam(26, "Egito", "egypt"),
    createTeam(27, "Iran", "iran"),
    createTeam(28, "Nova Zelândia", "new-zealand"),
    createTeam(29, "Espanha", "spain"),
    createTeam(30, "Cabo Verde", "cabo-verde"),
    createTeam(31, "Arábia Saudita", "saudi-arabia"),
    createTeam(32, "Uruguai", "uruguay"),
    createTeam(33, "França", "france"),
    createTeam(34, "Senegal", "senegal"),
    createTeam(35, "Iraque", "iraq"),
    createTeam(36, "Noruega", "norway"),
    createTeam(37, "Argentina", "argentina"),
    createTeam(38, "Argélia", "algeria"),
    createTeam(39, "Austria", "austria"),
    createTeam(40, "Jordânia", "jordan"),
    createTeam(41, "Portugal", "portuguese"),
    createTeam(42, "Congo", "congo-dr"),
    createTeam(43, "Uzbequistão", "uzbekistan"),
    createTeam(44, "Colômbia", "colombia"),
    createTeam(45, "Inglaterra", "england"),
    createTeam(46, "Croácia", "croatia"),
    createTeam(47, "Gana", "ghana"),
    createTeam(48, "Panamá", "panama")
]