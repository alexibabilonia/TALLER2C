import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { TranslateService } from '../../core/services/translate';
import { AuthService } from '../../core/services/auth.service';
import { PreferencesService } from '../../core/services/preferences.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  isLoading = false;

  constructor(
    private translateService: TranslateService,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private preferences: PreferencesService
  ) {}

  ionViewWillEnter() {
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

  async login() {
    if (!this.email || !this.password) {
      const toast = await this.toastCtrl.create({
        message: this.t('LOGIN.FILL_FIELDS') || 'Por favor ingresa email y contraseña',
        duration: 2000,
        color: 'warning'
      });
      toast.present();
      return;
    }

    this.isLoading = true;

    try {
      await this.authService.login(this.email, this.password);
      await this.preferences.set('isLoggedIn', 'true');
      this.router.navigate(['/home']);
    } catch (error: any) {
      let msg = '';
      switch (error.code) {
        case 'auth/user-not-found':
          msg = this.t('LOGIN.USER_NOT_FOUND') || 'Usuario no encontrado';
          break;
        case 'auth/wrong-password':
          msg = this.t('LOGIN.WRONG_PASSWORD') || 'Contraseña incorrecta';
          break;
        case 'auth/invalid-email':
          msg = this.t('LOGIN.INVALID_EMAIL') || 'Correo inválido';
          break;
        case 'auth/invalid-credential':
          msg = this.t('LOGIN.INVALID_CREDENTIAL') || 'Credencial inválida';
          break;
        case 'auth/user-disabled':
          msg = this.t('LOGIN.USER_DISABLED') || 'Cuenta deshabilitada';
          break;
        default:
          msg = error.message || this.t('LOGIN.ERROR') || 'Error al iniciar sesión';
          break;
      }

      const toast = await this.toastCtrl.create({
        message: msg,
        duration: 2500,
        color: 'danger'
      });
      toast.present();
    } finally {
      this.isLoading = false;
    }
  }
}
