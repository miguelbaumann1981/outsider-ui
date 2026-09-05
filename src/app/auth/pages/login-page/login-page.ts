import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { IconEmail } from '@/shared/components/icon-email/icon-email';
import { IconPassword } from '@/shared/components/icon-password/icon-password';
import es from '@/i18n/es.json';
import { form, FormField, FormRoot, required, email, schema } from '@angular/forms/signals';
import { ToastrService } from 'ngx-toastr';
import { LoginFormModel } from '@/auth/interfaces';
import { NgClass } from '@angular/common';
import { AuthService } from '@/auth/services';
import { catchError, delay } from 'rxjs';
import { environment } from '@envs/environment.development';

@Component({
  selector: 'out-login-page',
  imports: [ReactiveFormsModule, IconEmail, IconPassword, FormField, FormRoot, NgClass],
  templateUrl: './login-page.html',
})
export class LoginPage {
  protected readonly i18n = es;
  private authService = inject(AuthService);
  formBuilder = inject(FormBuilder);
  router = inject(Router);
  toastr = inject(ToastrService);

  minLengthPassword: number = 6;

  isLoading = signal(false);
  showPassword = signal(false);

  loginModel = signal<LoginFormModel>({
    email: 'mayte@test.com',
    password: 'Aa1@11',
  });

  loginSchema = schema<LoginFormModel>((path) => {
    required(path.email, { message: this.i18n.auth.validations.emailRequired });
    email(path.email, { message: this.i18n.auth.validations.emailPattern });
    required(path.password, { message: this.i18n.auth.validations.passwordRequired });
  });
  readonly loginForm = form(this.loginModel, this.loginSchema);

  showTooltip = signal(false);

  onSubmit(event: Event): void {
    if (this.loginForm().invalid()) {
      return;
    }

    this.isLoading.set(true);
    event.preventDefault();
    const { email, password } = this.loginModel();

    this.authService
      .login(email, password)
      .pipe(
        delay(1500),
        catchError((error) => {
          this.isLoading.set(false);
          this.toastr.error(
            this.i18n.auth.errors.errorAccessSubtitle,
            this.i18n.auth.errors.errorAccessTitle,
            {
              timeOut: 5000,
              closeButton: true,
            },
          );

          throw error;
        }),
      )
      .subscribe({
        next: (isLogged: boolean) => {
          if (isLogged) {
            if (environment.appIsActive) {
              this.router.navigate(['/admin/']);
            } else {
              this.router.navigate(['/admin/prod']);
            }
            return;
          }
        },
        complete: () => {
          this.isLoading.set(false);
          this.toastr.success(
            this.i18n.auth.success.accessSubtitle,
            this.i18n.auth.success.accessTitle,
            {
              timeOut: 3000,
              closeButton: true,
            },
          );
        },
      });
  }

  togglePassword(): void {
    this.showPassword.update((value) => !value);

    if (this.showPassword()) {
      setTimeout(() => {
        this.showPassword.set(false);
      }, 5000);
    }
  }
}
