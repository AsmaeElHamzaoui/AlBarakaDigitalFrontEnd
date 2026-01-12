import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Role } from '../../core/models/role.enum';

@Directive({
  selector: '[appRoleVisibility]',
  standalone: true
})
export class RoleVisibilityDirective implements OnInit {
  private authService = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private viewContainer = inject(ViewContainerRef);

  @Input() appRoleVisibility: Role | Role[] = [];

  ngOnInit(): void {
    this.updateView();
  }

  private updateView(): void {
    const userRole = this.authService.getUserRole();
    
    if (!userRole) {
      this.viewContainer.clear();
      return;
    }

    const allowedRoles = Array.isArray(this.appRoleVisibility) 
      ? this.appRoleVisibility 
      : [this.appRoleVisibility];

    if (allowedRoles.includes(userRole)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}