import { Component, EventEmitter, Input, OnInit, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OperationType } from '../../../models/operation-type.enum';
import { CustomValidators } from '../../../../../shared/validators/custom-validators';
import { LoadingSpinnerComponent } from '../../../../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-operation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoadingSpinnerComponent
  ],
  template: `
    <form [formGroup]="form" (ngSubmit)="submit()">

      <!-- Montant -->
      <div class="form-group">
        <label>Montant (DH)</label>
        <input
          type="number"
          formControlName="montant"
          class="form-control"
          [class.is-invalid]="isInvalid('montant')"
          placeholder="500.00"
        />
        <div class="error" *ngIf="isInvalid('montant')">
          {{ getError('montant') }}
        </div>
      </div>

      <!-- Compte bénéficiaire (Virement uniquement) -->
      <div class="form-group" *ngIf="operationType === 'VIREMENT'">
        <label>Compte bénéficiaire</label>
        <input
          type="text"
          formControlName="compteBeneficiaire"
          class="form-control"
          [class.is-invalid]="isInvalid('compteBeneficiaire')"
          placeholder="RIB ou numéro de compte"
        />
        <div class="error" *ngIf="isInvalid('compteBeneficiaire')">
          Champ obligatoire pour un virement
        </div>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label>Description (optionnel)</label>
        <textarea
          rows="3"
          class="form-control"
          formControlName="description"
        ></textarea>
      </div>

      <!-- Bouton -->
      <button class="btn btn-primary" [disabled]="loading">
        <app-loading-spinner *ngIf="loading" [isLoading]="true" size="small"></app-loading-spinner>
        <span *ngIf="!loading">Valider</span>
      </button>
    </form>
  `,
  styles: [`
    
    .form-group {
      margin-bottom: 1.5rem;
    }

    .form-control {
      width: 100%;
      padding: .75rem;
      border-radius: 8px;
      border: 2px solid #e0e0e0;
    }

    .form-control.is-invalid {
      border-color: #dc3545;
    }

    .error {
      font-size: .85rem;
      color: #dc3545;
      margin-top: .25rem;
    }

    button {
      margin-top: 1rem;
      padding: .75rem 1.5rem;
      border-radius: 8px;
      border: none;
      font-weight: 600;
    }
  `]
})
export class OperationFormComponent implements OnInit {

  private fb = inject(FormBuilder);

  @Input() operationType!: OperationType;
  @Input() loading = false;

  @Output() formSubmit = new EventEmitter<any>();

  form!: FormGroup;

  ngOnInit(): void {
    this.form = this.fb.group({
      montant: [
        '',
        [
          Validators.required,
          CustomValidators.positiveAmount(),
          CustomValidators.maxAmount(1_000_000)
        ]
      ],
      description: [''],
      compteBeneficiaire: ['']
    });

    if (this.operationType === OperationType.VIREMENT) {
      this.form.get('compteBeneficiaire')?.setValidators(Validators.required);
    }
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.formSubmit.emit({
      type: this.operationType,
      ...this.form.value
    });
  }

  isInvalid(field: string): boolean {
    const control = this.form.get(field);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  getError(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';

    if (control.errors['required']) {
      return 'Ce champ est obligatoire';
    }

    if (control.errors['positiveAmount']) {
      return 'Le montant doit être positif';
    }

    if (control.errors['maxAmount']) {
      return 'Montant trop élevé';
    }

    return 'Valeur invalide';
  }
}
