import { Component } from '@angular/core';
import { TranslateService } from '../../core/services/translate';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UploaderService } from '../../core/services/uploader.service';
import { ToastController } from '@ionic/angular';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-update-user-info',
  templateUrl: './update-user-info.page.html',
  styleUrls: ['./update-user-info.page.scss'],
  standalone: false
})
export class UpdateUserInfoPage {
  currentLang: string;
  firstName: string = '';
  lastName: string = '';
  isLoading: boolean = false;
  uid: string = '';

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private uploaderService: UploaderService,
    private toastCtrl: ToastController
  ) {
    this.currentLang = this.translateService.getCurrentLanguage();
  }

  async ionViewWillEnter() {
    this.isLoading = true;
    try {
      const user = await firstValueFrom(this.authService.getCurrentUser());
      if (!user) {
        this.router.navigate(['/login']);
        return;
      }
      this.uid = user.uid;

      const profile = await this.uploaderService['queryService'].getUserProfile(this.uid);
      if (profile) {
        this.firstName = profile.firstName;
        this.lastName = profile.lastName;
      }
    } catch (error) {
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  setLanguage(lang: string) {
    this.translateService.setLanguage(lang);
    this.currentLang = lang;
  }

  t(key: string): string {
    return this.translateService.translate(key);
  }

  async updateProfile() {
    if (!this.firstName || !this.lastName) {
      const toast = await this.toastCtrl.create({
        message: this.t('UPDATE.FILL_FIELDS') || 'Por favor completa todos los campos',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    if (!this.uid) {
      const toast = await this.toastCtrl.create({
        message: 'UID no disponible. Vuelve a iniciar sesión.',
        duration: 2500,
        color: 'danger'
      });
      toast.present();
      return;
    }

    this.isLoading = true;
    try {
      await this.uploaderService.updateUserProfile(this.uid, this.firstName, this.lastName);

      const toast = await this.toastCtrl.create({
        message: this.t('UPDATE.SUCCESS') || 'Datos actualizados',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      this.router.navigate(['/home']);
    } catch (error: any) {
      const toast = await this.toastCtrl.create({
        message: error.message || this.t('UPDATE.ERROR') || 'Error al actualizar datos',
        duration: 2500,
        color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }

  cancelUpdate() {
    this.router.navigate(['/home']);
  }
}
