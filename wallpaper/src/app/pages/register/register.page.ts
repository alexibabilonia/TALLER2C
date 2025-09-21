import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '../../core/services/translate';
import { AuthService } from '../../core/services/auth.service';
import { QueryService } from '../../core/services/query.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: false
})
export class RegisterPage {
  firstName = '';
  lastName = '';
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private toastCtrl: ToastController,
    private authService: AuthService,
    private queryService: QueryService
  ) {}

  ionViewWillEnter() {
    this.firstName = '';
    this.lastName = '';
    this.email = '';
    this.password = '';
  }

  setLanguage(lang: string) {
    this.translateService.setLanguage(lang);
  }

  get currentLang() {
    return this.translateService.getCurrentLanguage();
  }

  t(key: string) {
    return this.translateService.translate(key);
  }

  async register() {
    if (!this.firstName || !this.lastName || !this.email || !this.password) {
      const toast = await this.toastCtrl.create({
        message: this.t('REGISTER.FILL_FIELDS') || 'Por favor completa todos los campos',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    this.isLoading = true;

    try {
      const user = await this.authService.register(this.email, this.password);

      await this.queryService.addUserProfile({
        uid: user.uid,
        firstName: this.firstName,
        lastName: this.lastName
      });

      await this.authService.logout();
      this.isLoading = false;

      const toast = await this.toastCtrl.create({
        message: this.t('REGISTER.SUCCESS') || 'Registro exitoso',
        duration: 2000,
        color: 'success'
      });
      toast.present();

      this.router.navigate(['/login']);
    } catch (error: any) {
      this.isLoading = false;

      let errorMessage = this.t('REGISTER.ERROR') || 'Error en el registro';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = this.t('REGISTER.EMAIL_IN_USE') || 'Este correo ya está registrado';
          break;
        case 'auth/weak-password':
          errorMessage = this.t('REGISTER.WEAK_PASSWORD') || 'La contraseña es demasiado débil';
          break;
        case 'auth/invalid-email':
          errorMessage = this.t('REGISTER.INVALID_EMAIL') || 'Correo inválido';
          break;
        default:
          errorMessage = error.message || errorMessage;
          break;
      }

      const toast = await this.toastCtrl.create({
        message: errorMessage,
        duration: 3000,
        color: 'danger'
      });
      toast.present();
    }
  }
}
