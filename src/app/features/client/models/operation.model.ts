import { OperationType, OperationStatus } from './operation-type.enum';

export interface Operation {
  id: number;
  type: OperationType;
  montant: number;
  dateOperation: Date;
  statut: OperationStatus;
  description?: string;
  compteDestinataireNumero?: string;
  justificatifPath?: string;
}

export interface OperationRequestDTO {
  type: OperationType;
  amount: number;
  destinationAccountNumber?: string; // optionnel
}


export interface OperationResponseDTO {
  id: number;
  type: OperationType;
  amount: number;
  status: OperationStatus;
  createdAt: string;
  accountSource: string;
  accountDestination?: string;
}
