import { Injectable } from '@angular/core';
import { QueryService } from './query.service';

@Injectable({
  providedIn: 'root'
})
export class UploaderService {
  constructor(private queryService: QueryService) {}

  /**
   * Actualiza el perfil de usuario:
   * @param uid UID del usuario
   * @param firstName Nuevo nombre
   * @param lastName Nuevo apellido
   */
  async updateUserProfile(uid: string, firstName: string, lastName: string): Promise<void> {
    if (!uid) throw new Error('UID no proporcionado');
    if (!firstName || !lastName) throw new Error('Nombre o apellido inválido');

    await this.queryService.updateUserProfile(uid, { firstName, lastName });
  }
}
