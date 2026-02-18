// Fonction pour formater une date au format "1 janvier"
export function dateFormatter(isoDateString: string): string {
  const date = new Date(isoDateString);
  return date.toLocaleDateString('fr-FR', {
    month: 'long',
    day: 'numeric',
  });
}

// Fonction pour formater le statut d'une tâche en français
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

// Fonction pour afficher uniquement la première lettre du prénom et la première lettre du nom
export function getInitials(name: string): string {
  const names = name.split(' ');
  const initials = names.map((n) => n.charAt(0).toUpperCase()).join('');
  return initials;
}
