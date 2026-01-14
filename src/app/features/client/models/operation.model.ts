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
  montant: number;
  description?: string;
  compteDestinataireNumero?: string;
}

export interface OperationResponseDTO {
  id: number;
  type: OperationType;
  montant: number;
  dateOperation: Date;
  statut: OperationStatus;
  description?: string;
  compteDestinataireNumero?: string;
  compteSourceNumero?: string;
  justificatifPath?: string;
}