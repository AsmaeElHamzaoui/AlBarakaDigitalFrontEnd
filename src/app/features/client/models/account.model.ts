export interface Account {
  id: number;
  numeroCompte: string;
  balance: number;
  dateCreation: Date;
  actif: boolean;
}

export interface AccountRequestDTO {
  accountNumber: string;
  balance: number;
}

export interface AccountResponseDTO {
  id: number;
  accountNumber: string;
  balance: number;
  currency: string;
  creationDate: string;
  active: boolean;
  ownerEmail: string;
}
