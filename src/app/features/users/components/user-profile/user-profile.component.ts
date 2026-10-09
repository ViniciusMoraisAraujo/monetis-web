import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { UsersStateService } from '../../services/users-state.service';

const USER_NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s\-_]+$/;

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  readonly usersState = inject(UsersStateService);

  readonly isEditing = signal<boolean>(false);
  readonly copyFeedback = signal<boolean>(false);
  readonly successMessage = signal<string | null>(null);

  readonly user = this.usersState.user;
  readonly isLoading = this.usersState.isLoading;
  readonly errorMessage = this.usersState.errorMessage;
  readonly fullName = this.usersState.fullName;
  readonly userInitial = this.usersState.userInitial;

  readonly userIdFromRoute = computed(() => {
    return this.route.snapshot.paramMap.get('id') || this.authService.currentUser()?.id || '';
  });

  readonly form = new FormGroup({
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(USER_NAME_PATTERN),
      ],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.maxLength(50),
        Validators.pattern(USER_NAME_PATTERN),
      ],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email, Validators.maxLength(100)],
    }),
  });

  ngOnInit(): void {
    const id = this.userIdFromRoute();
    if (id) {
      this.loadUserData(id);
    } else {
      const currentId = this.authService.currentUser()?.id;
      if (currentId) {
        this.router.navigate(['/Users', currentId], { replaceUrl: true });
      }
    }
  }

  async loadUserData(id: string): Promise<void> {
    await this.usersState.loadUser(id);
    const loaded = this.user();
    if (loaded) {
      this.form.patchValue({
        firstName: loaded.firstName,
        lastName: loaded.lastName,
        email: loaded.email,
      });
    }
  }

  onToggleEdit(): void {
    const current = this.user();
    if (!this.isEditing() && current) {
      this.form.setValue({
        firstName: current.firstName,
        lastName: current.lastName,
        email: current.email,
      });
    }
    this.isEditing.update((val) => !val);
    this.successMessage.set(null);
  }

  onCancelEdit(): void {
    this.isEditing.set(false);
    const current = this.user();
    if (current) {
      this.form.setValue({
        firstName: current.firstName,
        lastName: current.lastName,
        email: current.email,
      });
    }
  }

  async onSaveProfile(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const id = this.userIdFromRoute();
    if (!id) return;

    const success = await this.usersState.updateUser(id, this.form.getRawValue());
    if (success) {
      this.isEditing.set(false);
      this.successMessage.set('Dados cadastrais atualizados com sucesso.');
    }
  }

  async onCopyUserId(): Promise<void> {
    const id = this.user()?.id;
    if (!id || typeof navigator === 'undefined' || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(id);
      this.copyFeedback.set(true);
      setTimeout(() => this.copyFeedback.set(false), 2000);
    } catch {
      // Fallback gracioso
    }
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
