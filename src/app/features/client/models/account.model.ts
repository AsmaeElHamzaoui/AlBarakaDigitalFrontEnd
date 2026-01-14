export interface Account {
  id: number;
  numeroCompte: string;
  solde: number;
  devise: string;
  dateCreation: Date;
  actif: boolean;
}

export interface AccountRequestDTO {
  numeroCompte: string;
  devise: string;
  soldeInitial: number;
}

export interface AccountResponseDTO {
  id: number;
  numeroCompte: string;
  solde: number;
  devise: string;
  dateCreation: Date;
  actif: boolean;
  ownerEmail: string;
}
