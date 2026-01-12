import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  
  // Validation du montant (doit être > 0)
  static positiveAmount(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (value === null || value === undefined || value === '') {
        return null; // Laisser le validator 'required' gérer ce cas
      }
      
      const amount = parseFloat(value);
      
      if (isNaN(amount) || amount <= 0) {
        return { positiveAmount: { value: control.value } };
      }
      
      return null;
    };
  }

  // Validation du montant maximum
  static maxAmount(max: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (value === null || value === undefined || value === '') {
        return null;
      }
      
      const amount = parseFloat(value);
      
      if (isNaN(amount)) {
        return null;
      }
      
      if (amount > max) {
        return { maxAmount: { max, actual: amount } };
      }
      
      return null;
    };
  }

  // Validation du montant minimum
  static minAmount(min: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (value === null || value === undefined || value === '') {
        return null;
      }
      
      const amount = parseFloat(value);
      
      if (isNaN(amount)) {
        return null;
      }
      
      if (amount < min) {
        return { minAmount: { min, actual: amount } };
      }
      
      return null;
    };
  }

  // Validation du type de fichier
  static allowedFileTypes(allowedTypes: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      
      if (!file) {
        return null;
      }
      
      const fileType = file.type.toLowerCase();
      const fileName = file.name.toLowerCase();
      
      const isAllowed = allowedTypes.some(type => 
        fileType.includes(type) || fileName.endsWith(type)
      );
      
      if (!isAllowed) {
        return { 
          allowedFileTypes: { 
            allowed: allowedTypes, 
            actual: file.type 
          } 
        };
      }
      
      return null;
    };
  }

  // Validation de la taille du fichier (en Mo)
  static maxFileSize(maxSizeMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      
      if (!file) {
        return null;
      }
      
      const fileSizeMB = file.size / (1024 * 1024);
      
      if (fileSizeMB > maxSizeMB) {
        return { 
          maxFileSize: { 
            max: maxSizeMB, 
            actual: fileSizeMB.toFixed(2) 
          } 
        };
      }
      
      return null;
    };
  }

  // Validation du numéro de compte (format spécifique)
  static accountNumber(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }
      
      // Format: 12 chiffres minimum
      const accountPattern = /^\d{12,}$/;
      
      if (!accountPattern.test(value)) {
        return { accountNumber: { value: control.value } };
      }
      
      return null;
    };
  }

  // Validation de l'email (format renforcé)
  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }
      
      const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      
      if (!emailPattern.test(value)) {
        return { email: { value: control.value } };
      }
      
      return null;
    };
  }

  // Validation du mot de passe fort
  static strongPassword(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      
      if (!value) {
        return null;
      }
      
      const errors: any = {};
      
      // Au moins 8 caractères
      if (value.length < 8) {
        errors.minLength = true;
      }
      
      // Au moins une majuscule
      if (!/[A-Z]/.test(value)) {
        errors.uppercase = true;
      }
      
      // Au moins une minuscule
      if (!/[a-z]/.test(value)) {
        errors.lowercase = true;
      }
      
      // Au moins un chiffre
      if (!/\d/.test(value)) {
        errors.digit = true;
      }
      
      // Au moins un caractère spécial
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) {
        errors.specialChar = true;
      }
      
      return Object.keys(errors).length > 0 ? { strongPassword: errors } : null;
    };
  }

  // Validation de la confirmation du mot de passe
  static passwordMatch(passwordField: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const password = control.parent?.get(passwordField);
      const confirmPassword = control;
      
      if (!password || !confirmPassword) {
        return null;
      }
      
      if (password.value !== confirmPassword.value) {
        return { passwordMatch: true };
      }
      
      return null;
    };
  }
}