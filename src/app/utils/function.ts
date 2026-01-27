export function dateFormatter(isoDateString: string): string {
  const date = new Date(isoDateString);
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    day: 'numeric',
  });
}

export function taskStatusFormatter(status: string): string {
  switch (status) {
    case 'TODO':
      return 'À faire';
    case 'IN_PROGRESS':
      return 'En cours';
    case 'DONE':
      return 'Terminé';
    default:
      return 'Inconnu';
  }
}
