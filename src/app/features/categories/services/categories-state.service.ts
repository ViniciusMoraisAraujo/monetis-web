import { inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ApiError } from '../../../core/models/api-error.model';
import {
  CategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '../models/category.model';
import { CategoriesApiService } from './categories-api.service';

@Injectable({
  providedIn: 'root',
})
export class CategoriesStateService {
  private readonly api = inject(CategoriesApiService);

  readonly categories = signal<CategoryResponse[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly errorMessage = signal<string | null>(null);

  async loadCategories(): Promise<void> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const categories = await firstValueFrom(this.api.getAll());
      this.categories.set(categories);
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Falha ao carregar categorias');
    } finally {
      this.isLoading.set(false);
    }
  }

  async createCategory(request: CreateCategoryRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      const created = await firstValueFrom(this.api.create(request));
      this.categories.update((cats) => [...cats, created]);
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Falha ao criar categoria');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async updateCategory(id: string, request: UpdateCategoryRequest): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.api.update(id, request));
      const updated = await firstValueFrom(this.api.getById(id));
      this.categories.update((cats) => cats.map((c) => (c.id === id ? updated : c)));
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Falha ao atualizar categoria');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  async deleteCategory(id: string): Promise<boolean> {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    try {
      await firstValueFrom(this.api.delete(id));
      this.categories.update((cats) => cats.filter((c) => c.id !== id));
      return true;
    } catch (error) {
      const apiError = error as ApiError;
      this.errorMessage.set(apiError.message || 'Falha ao excluir categoria');
      return false;
    } finally {
      this.isLoading.set(false);
    }
  }

  clearError(): void {
    this.errorMessage.set(null);
  }
}
