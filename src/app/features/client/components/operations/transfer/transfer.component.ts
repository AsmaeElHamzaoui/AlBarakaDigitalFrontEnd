import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { OperationService } from '../../../services/operation.service';
import { DocumentService } from '../../../services/document.service';
import { OperationType } from '../../../models/operation-type.enum';
import { CustomValidators } from '../../../../../shared/validators/custom-validators';
import { AlertComponent } from '../../../../../shared/components/alert/alert.component';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-transfer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AlertComponent, LoadingSpinnerComponent],
  template: `
    <div class="transfer-container">
      <h1>🔄 Effectuer un virement</h1>

      <app-alert 
        *ngIf="showSuccess"
        type="success"
        title="Virement créé"
        [message]="successMessage"
        [dismissible]="false">
      </app-alert>

      <app-alert 
        *ngIf="showError"
        type="error"
        [message]="errorMessage"
        [dismissible]="true"
        (closed)="showError = false">
      </app-alert>

      <div class="transfer-card">
        <form [formGroup]="transferForm" (ngSubmit)="onSubmit()">
          <!-- Compte destinataire -->
          <div class="form-group">
            <label for="compteDestinataire">
              Numéro de compte destinataire
              <span class="required">*</span>
            </label>
            <input 
              type="text" 
              id="compteDestinataire"
              formControlName="compteDestinataireNumero"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('compteDestinataireNumero')"
              placeholder="123456789012"
              maxlength="20"
            />
            <div class="error-message" *ngIf="isFieldInvalid('compteDestinataireNumero')">
              {{ getFieldError('compteDestinataireNumero') }}
            </div>
          </div>

          <!-- Montant -->
          <div class="form-group">
            <label for="montant">Montant (DH)</label>
            <input 
              type="number" 
              id="montant"
              formControlName="montant"
              class="form-control"
              [class.is-invalid]="isFieldInvalid('montant')"
              placeholder="1000.00"
              step="0.01"
            />
            <div class="error-message" *ngIf="isFieldInvalid('montant')">
              {{ getFieldError('montant') }}
            </div>
          </div>

          <!-- Description -->
          <div class="form-group">
            <label for="description">Motif du virement (optionnel)</label>
            <textarea 
              id="description"
              formControlName="description"
              class="form-control"
              rows="3"
              placeholder="Ex: Paiement facture, Remboursement..."
            ></textarea>
          </div>

          <!-- Upload justificatif si montant > 10000 -->
          <div class="form-group" *ngIf="requiresDocument">
            <label for="justificatif">
              Justificatif (obligatoire pour montants > 10 000 DH)
              <span class="required">*</span>
            </label>
            <input 
              type="file" 
              id="justificatif"
              (change)="onFileSelected($event)"
              class="form-control"
              accept=".pdf,.jpg,.jpeg,.png"
            />
            <div class="file-info">
              Formats acceptés: PDF, JPG, PNG (max 5 Mo)
            </div>
            <div class="error-message" *ngIf="fileError">
              {{ fileError }}
            </div>
          </div>

          <!-- Info message -->
          <div class="info-message" *ngIf="requiresDocument">
            ⚠️ Pour les montants supérieurs à 10 000 DH, un justificatif est obligatoire.
            Votre opération sera en attente de validation par un agent bancaire.
          </div>

          <!-- Boutons -->
          <div class="form-actions">
            <button 
              type="button" 
              class="btn btn-secondary"
              (click)="cancel()"
              [disabled]="isLoading"
            >
              Annuler
            </button>
            <button 
              type="submit" 
              class="btn btn-primary"
              [disabled]="isLoading || (requiresDocument && !selectedFile)"
            >
              <app-loading-spinner 
                *ngIf="isLoading" 
                [isLoading]="true" 
                size="small">
              </app-loading-spinner>
              <span *ngIf="!isLoading">Effectuer le virement</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .transfer-container {
      padding: 2rem;
      max-width: 700px;
      margin: 0 auto;

      h1 {
        margin-bottom: 2rem;
        color: #333;
      }
    }

    .transfer-card {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    }

    .form-group {
      margin-bottom: 1.5rem;

      label {
        display: block;
        margin-bottom: 0.5rem;
        color: #333;
        font-weight: 500;

        .required {
          color: #dc3545;
        }
      }

      .form-control {
        width: 100%;
        padding: 0.75rem;
        border: 2px solid #e0e0e0;
        border-radius: 8px;
        font-size: 1rem;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          border-color: #17a2b8;
          box-shadow: 0 0 0 3px rgba(23, 162, 184, 0.1);
        }

        &.is-invalid {
          border-color: #dc3545;
        }
      }

      textarea.form-control {
        resize: vertical;
      }

      .error-message {
        color: #dc3545;
        font-size: 0.85rem;
        margin-top: 0.5rem;
      }

      .file-info {
        font-size: 0.85rem;
        color: #666;
        margin-top: 0.5rem;
      }
    }

    .info-message {
      background: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 1rem;
      margin-bottom: 1.5rem;
      border-radius: 4px;
      color: #856404;
      font-size: 0.9rem;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;

      .btn {
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &.btn-secondary {
          background: #6c757d;
          color: white;

          &:hover:not(:disabled) {
            background: #5a6268;
          }
        }

        &.btn-primary {
          background: #17a2b8;
          color: white;

          &:hover:not(:disabled) {
            background: #138496;
          }
        }

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }
    }
  `]
})
export class TransferComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private operationService = inject(OperationService);
  private documentService = inject(DocumentService);

  transferForm!: FormGroup;
  isLoading = false;
  showSuccess = false;
  showError = false;
  successMessage = '';
  errorMessage = '';
  selectedFile: File | null = null;
  fileError = '';

  get requiresDocument(): boolean {
    const montant = this.transferForm?.get('montant')?.value;
    return montant && montant > 10000;
  }

  ngOnInit(): void {
    this.transferForm = this.fb.group({
      compteDestinataireNumero: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.pattern(/^\d+$/)
      ]],
      montant: ['', [
        Validators.required,
        CustomValidators.positiveAmount(),
        CustomValidators.maxAmount(1000000)
      ]],
      description: ['']
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
      const maxSize = 5 * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        this.fileError = 'Type de fichier non autorisé. Utilisez PDF, JPG ou PNG.';
        this.selectedFile = null;
        return;
      }

      if (file.size > maxSize) {
        this.fileError = 'Fichier trop volumineux. Taille maximale: 5 Mo.';
        this.selectedFile = null;
        return;
      }

      this.selectedFile = file;
      this.fileError = '';
    }
  }

  onSubmit(): void {
    if (this.transferForm.invalid) {
      this.markFormGroupTouched(this.transferForm);
      return;
    }

    if (this.requiresDocument && !this.selectedFile) {
      this.fileError = 'Un justificatif est obligatoire pour ce montant';
      return;
    }

    this.isLoading = true;
    this.showError = false;
    this.showSuccess = false;

    const operationRequest = {
      type: OperationType.VIREMENT,
      montant: this.transferForm.value.montant,
      description: this.transferForm.value.description || undefined,
      compteDestinataireNumero: this.transferForm.value.compteDestinataireNumero
    };

    this.operationService.createOperation(operationRequest).subscribe({
      next: (operation) => {
        if (this.selectedFile) {
          this.uploadDocument(operation.id);
        } else {
          this.handleSuccess();
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = this.getErrorMessage(error);
      }
    });
  }

  uploadDocument(operationId: number): void {
    if (!this.selectedFile) {
      this.handleSuccess();
      return;
    }

    this.documentService.uploadDocument(operationId, this.selectedFile).subscribe({
      next: () => {
        this.handleSuccess();
      },
      error: (error) => {
        this.isLoading = false;
        this.showError = true;
        this.errorMessage = 'Virement créé mais erreur lors de l\'upload du justificatif';
        console.error(error);
      }
    });
  }

  handleSuccess(): void {
    this.isLoading = false;
    this.showSuccess = true;
    this.successMessage = this.requiresDocument
      ? 'Virement créé avec succès. Votre opération est en attente de validation.'
      : 'Virement effectué avec succès !';

    setTimeout(() => {
      this.router.navigate(['/client/operations']);
    }, 2000);
  }

  getErrorMessage(error: any): string {
    if (error.status === 400) {
      return error.error?.message || 'Solde insuffisant ou compte destinataire invalide';
    }
    if (error.status === 404) {
      return 'Compte destinataire introuvable';
    }
    return 'Une erreur est survenue lors de la création du virement';
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.transferForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  getFieldError(fieldName: string): string {
    const field = this.transferForm.get(fieldName);

    if (field?.hasError('required')) {
      return 'Ce champ est obligatoire';
    }
    if (field?.hasError('minlength')) {
      return 'Le numéro de compte doit contenir au moins 12 chiffres';
    }
    if (field?.hasError('pattern')) {
      return 'Le numéro de compte ne doit contenir que des chiffres';
    }
    if (field?.hasError('positiveAmount')) {
      return 'Le montant doit être supérieur à 0';
    }
    if (field?.hasError('maxAmount')) {
      return 'Montant maximum: 1 000 000 DH';
    }

    return '';
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }

  cancel(): void {
    this.router.navigate(['/client/dashboard']);
  }
}
