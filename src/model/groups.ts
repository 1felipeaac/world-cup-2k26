import type { Group } from "./tournament";
import { Teams } from "./teams";

const createGroup = (
    id: number, 
    name: string, 
    teams: Group['teams'], 
    matches: Group['matches']
    ): Group => ({
        id,
        name,
        teams,
        matches
});

const teamMap = Object.fromEntries(Teams.map(t => [t.name.toLowerCase(), t]));

export const Groups: Group[] = [
    createGroup(1, "Grupo A", [
        teamMap["mexico"],
        teamMap["áfrica do sul"],
        teamMap["coréia do sul"],
        teamMap["república tcheca"]
    ], []),
    createGroup(2, "Grupo B", [
        teamMap["canadá"],
        teamMap["bósnia e herzegovina"],
        teamMap["catar"],
        teamMap["suíça"]
    ], []),
    createGroup(3, "Grupo C", [
        teamMap["brasil"],
        teamMap["marrocos"],
        teamMap["haiti"],
        teamMap["escócia"]
    ], []),
    createGroup(4, "Grupo D", [
        teamMap["estados unidos"],
        teamMap["paraguai"],
        teamMap["austrália"],
        teamMap["turquia"]
    ], []),
    createGroup(5, "Grupo E", [
        teamMap["alemanha"],
        teamMap["curaçao"],
        teamMap["costa do marfim"],
        teamMap["equador"]
    ], []),
    createGroup(6, "Grupo F", [
        teamMap["holanda"],
        teamMap["japão"],
        teamMap["suécia"],
        teamMap["tunísia"]
    ], []),
    createGroup(7, "Grupo G", [
        teamMap["belgica"],
        teamMap["egito"],
        teamMap["iran"],
        teamMap["nova zelândia"]
    ], []),
    createGroup(8, "Grupo H", [ 
        teamMap["espanha"],
        teamMap["cabo verde"],
        teamMap["arábia saudita"],
        teamMap["uruguai"]
    ], []),
    createGroup(9, "Grupo I", [
        teamMap["frança"],
        teamMap["senegal"],
        teamMap["iraque"],
        teamMap["noruega"]
    ], []),
    createGroup(10, "Grupo J", [
        teamMap["argentina"],
        teamMap["argélia"],
        teamMap["austria"],
        teamMap["jordânia"]
    ], []),
    createGroup(11, "Grupo K", [
        teamMap["portugal"],
        teamMap["congo"],
        teamMap["uzbequistão"],
        teamMap["colômbia"]
    ], []),
    createGroup(12, "Grupo L", [
        teamMap["inglaterra"],
        teamMap["croácia"],
        teamMap["gana"],
        teamMap["panamá"]
    ], []),
];