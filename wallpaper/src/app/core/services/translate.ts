import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class TranslateService {
  private currentLangSubject = new BehaviorSubject<string>('en');
  currentLang$ = this.currentLangSubject.asObservable();

  constructor() {
    this.initLanguage();
  }

  private async initLanguage() {
    const { value } = await Preferences.get({ key: 'app_language' });
    if (value) {
      this.currentLangSubject.next(value);
      return;
    }

    const deviceLang = navigator.language || (navigator as any).userLanguage || 'en';
    let lang = deviceLang.split('-')[0];
    if (lang !== 'es' && lang !== 'en') {
      lang = 'en';
    }

    this.currentLangSubject.next(lang);
    await Preferences.set({ key: 'app_language', value: lang });
  }

  async setLanguage(lang: string) {
    if (lang !== 'es' && lang !== 'en') {
      lang = 'en';
    }

    this.currentLangSubject.next(lang);
    await Preferences.set({ key: 'app_language', value: lang });
  }

  getCurrentLanguage(): string {
    return this.currentLangSubject.value;
  }

  translate(key: string): string {
    const translations: any = {
      es: {
        'LOGIN.TITLE': 'Bienvenido',
        'LOGIN.EMAIL': 'Correo electrónico',
        'LOGIN.PASSWORD': 'Contraseña',
        'LOGIN.SUBMIT': 'Iniciar Sesión',
        'LOGIN.REGISTER': 'Registrarse',
        'LOGIN.FILL_FIELDS':'Por favor ingresa email y contraseña',
        'REGISTER.TITLE': 'Registro',
        'REGISTER.FIRSTNAME': 'Nombre',
        'REGISTER.LASTNAME': 'Apellido',
        'REGISTER.EMAIL': 'Correo electrónico',
        'REGISTER.PASSWORD': 'Contraseña',
        'REGISTER.SUBMIT': 'Registrarse',
        'REGISTER.CANCEL': 'Cancelar',
        'LANGUAGE.CURRENT': 'Idioma actual',
        'LOADING.TEXT': 'Cargando...',
        'HOME.TITLE': 'Mis Wallpapers',
        'HOME.EMPTY': 'No hay wallpapers aún',
        'HOME.UPDATE': 'Actualizar Datos',
        'HOME.ADD': 'Agregar Wallpaper',
        'HOME.LOGOUT': 'Cerrar Sesión',
        'UPDATE.TITLE': 'Actualizar Datos',
        'UPDATE.FIRSTNAME': 'Nombre',
        'UPDATE.LASTNAME': 'Apellido',
        'UPDATE.SUBMIT': 'Actualizar',
        'UPDATE.SUCCESS': 'Datos actualizados',
        'UPDATE.CURRENT_LANG': 'Idioma actual',
        'UPDATE.CANCEL': 'Cancelar',
        'UPDATE.LOADING': 'Actualizando',
        'UPDATE.FILL_FIELDS': 'Por favor completa todos los campos',
        'UPDATE.ERROR': 'Error al actualizar datos',
        'REGISTER.FILL_FIELDS': "Por favor completa todos los campos",
        'REGISTER.SUCCESS' : "Registro exitoso",
        'REGISTER.ERROR' : "Error en el registro",
        'REGISTER.EMAIL_IN_USE': 'Este correo ya está registrado',
        'REGISTER.INVALID_EMAIL' : "Correo inválido",
        'REGISTER.WEAK_PASSWORD' : "La contraseña es muy débil",
        'LOGIN.USER_NOT_FOUND' : "Usuario no encontrado",
        'LOGIN.WRONG_PASSWORD' : "Contraseña incorrecta",
        'LOGIN.INVALID_CREDENTIAL' : "Credencial inválida",
        'LOGIN.USER_DISABLED' : "Cuenta deshabilitadal",
        'LOGIN.INVALID_EMAIL' : "Correo inválido"
      },
      en: {
        'LOGIN.TITLE': 'Welcome',
        'LOGIN.EMAIL': 'Email',
        'LOGIN.PASSWORD': 'Password',
        'LOGIN.SUBMIT': 'Login',
        'LOGIN.REGISTER': 'Register',
        'LOGIN.FILL_FIELDS':'Please enter email and password',
        'REGISTER.TITLE': 'Register',
        'REGISTER.FIRSTNAME': 'First Name',
        'REGISTER.LASTNAME': 'Last Name',
        'REGISTER.EMAIL': 'Email',
        'REGISTER.PASSWORD': 'Password',
        'REGISTER.SUBMIT': 'Register',
        'REGISTER.CANCEL': 'Cancel',
        'LANGUAGE.CURRENT': 'Current language',
        'LOADING.TEXT': 'Loading...',
        'HOME.TITLE': 'My Wallpapers',
        'HOME.EMPTY': 'No wallpapers yet',
        'HOME.UPDATE': 'Update Profile',
        'HOME.ADD': 'Add Wallpaper',
        'HOME.LOGOUT': 'Logout',
        'UPDATE.TITLE': 'Update Profile',
        'UPDATE.FIRSTNAME': 'First Name',
        'UPDATE.LASTNAME': 'Last Name',
        'UPDATE.SUBMIT': 'Update',
        'UPDATE.SUCCESS': 'Profile updated',
        'UPDATE.CURRENT_LANG': 'Current language',
        'UPDATE.CANCEL': 'Cancel',
        'UPDATE.LOADING': 'Updating',
        'UPDATE.FILL_FIELDS': 'Please complete all fields',
        'UPDATE.ERROR': 'Error updating data',
        'REGISTER.FILL_FIELDS': "Please fill in all fields",
        'REGISTER.SUCCESS' : "Successful registration",
        'REGISTER.ERROR' : "Registration error",
        'REGISTER.EMAIL_IN_USE': "This email is already registered",
        'REGISTER.INVALID_EMAIL' : "Invalid email",
        'REGISTER.WEAK_PASSWORD' : "The password is very weak",
        'LOGIN.USER_NOT_FOUND' : "User not found",
        'LOGIN.WRONG_PASSWORD' : "Incorrect password",
        'LOGIN.INVALID_CREDENTIAL' : "Invalid credential",
        'LOGIN.USER_DISABLED' : "Disabled account",
        'LOGIN.INVALID_EMAIL' : "Invalid email"
      }
    };

    const lang = this.getCurrentLanguage();
    return translations[lang][key] || key;
  }
}
