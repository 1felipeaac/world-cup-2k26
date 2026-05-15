const modules = import.meta.glob('../assets/teams/*.png', { eager: true });

export const teamLogos = Object.entries(modules).reduce((acc, [path, module]) => {
  
  const fileNameWithExt = path.split('/').pop() || '';
  
  const teamKey = fileNameWithExt
    .replace('.png', '')
    .replace('-national-team', '');

  acc[teamKey] = (module as any).default;
  
  return acc;
}, {} as Record<string, string>);


export function getTeamLogo(teamName: string): string {

  const key = teamName.toLowerCase();
  return teamLogos[key] || ''; 
}