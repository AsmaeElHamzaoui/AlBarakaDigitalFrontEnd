import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

export interface ErrorMessage {
  title: string;
  message: string;
  type: 'error' | 'warning' | 'info';
}

@Injectable({
  providedIn: 'root'
})
export class ErrorHandlerService {
  
  // Gérer les erreurs HTTP
  handleHttpError(error: HttpErrorResponse): ErrorMessage {
    let errorMessage: ErrorMessage = {
      title: 'Erreur',
      message: 'Une erreur est survenue',
      type: 'error'
    };

    if (error.error instanceof ErrorEvent) {
      // Erreur côté client
      errorMessage.message = `Erreur: ${error.error.message}`;
    } else {
      // Erreur côté serveur
      switch (error.status) {
        case 400:
          errorMessage.title = 'Requête invalide';
          errorMessage.message = error.error?.message || 'Les données envoyées sont invalides';
          break;
        
        case 401:
          errorMessage.title = 'Non authentifié';
          errorMessage.message = 'Votre session a expiré. Veuillez vous reconnecter.';
          break;
        
        case 403:
          errorMessage.title = 'Accès refusé';
          errorMessage.message = 'Vous n\'avez pas les permissions nécessaires pour cette action';
          break;
        
        case 404:
          errorMessage.title = 'Non trouvé';
          errorMessage.message = 'La ressource demandée n\'existe pas';
          break;
        
        case 409:
          errorMessage.title = 'Conflit';
          errorMessage.message = error.error?.message || 'Cette ressource existe déjà';
          break;
        
        case 500:
          errorMessage.title = 'Erreur serveur';
          errorMessage.message = 'Une erreur interne est survenue. Veuillez réessayer plus tard.';
          break;
        
        default:
          errorMessage.message = error.error?.message || `Erreur ${error.status}: ${error.statusText}`;
      }
    }

    console.error('Erreur HTTP:', error);
    return errorMessage;
  }

  // Gérer les erreurs de validation
  handleValidationError(fieldErrors: { [key: string]: string[] }): string {
    const errors = Object.entries(fieldErrors)
      .map(([field, messages]) => `${field}: ${messages.join(', ')}`)
      .join('\n');
    
    return errors || 'Erreur de validation';
  }

  // Afficher un message de succès
  getSuccessMessage(action: string): ErrorMessage {
    return {
      title: 'Succès',
      message: `${action} effectuée avec succès`,
      type: 'info'
    };
  }
}
