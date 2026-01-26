import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OperationService } from '../../../services/operation.service';
import { OperationType } from '../../../models/operation-type.enum';

@Component({
  selector: 'app-operation-form',
  templateUrl: './operation-form.component.html',
})
export class OperationFormComponent implements OnInit {

  private fb = inject(FormBuilder);
  private operationService = inject(OperationService);

  operationForm!: FormGroup;
  OperationType = OperationType;

  ngOnInit(): void {
    this.operationForm = this.fb.group({
      type: [OperationType.DEPOSIT, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]],
      destinationAccountNumber: ['']
    });

    this.handleTypeChange();
  }

  private handleTypeChange(): void {
    this.operationForm.get('type')!.valueChanges.subscribe(type => {
      const destCtrl = this.operationForm.get('destinationAccountNumber');

      if (type === OperationType.TRANSFER) {
        destCtrl?.setValidators([Validators.required]);
      } else {
        destCtrl?.clearValidators();
        destCtrl?.setValue(null);
      }

      destCtrl?.updateValueAndValidity();
    });
  }

  submit(): void {
    if (this.operationForm.invalid) return;

    this.operationService.createOperation(this.operationForm.value)
      .subscribe({
        next: () => alert('Opération créée avec succès'),
        error: () => alert('Erreur lors de l’opération')
      });
  }
}
