export  interface Event {
	id: any;
  title: string;
  description: string;
  date: Date,
  location: string;
  imageUrl: string;
  isActive: boolean;
  participants: string[]; // Array des IDs des utilisateurs participants
  maxParticipants?: number; // Nombre maximum de participants (optionnel)
}
