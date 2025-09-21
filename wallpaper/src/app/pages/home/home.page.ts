import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '../../core/services/translate';
import { AuthService } from '../../core/services/auth.service';
import { ImagePickerService, PickedImage } from '../../core/services/filepicker.service';
import { SupabaseService } from '../../core/services/supabase.service';
import { Capacitor } from '@capacitor/core';
import { PreferencesService } from '../../core/services/preferences.service';
import { ToastController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: false
})
export class HomePage implements OnInit {
  currentLang: string;
  menuOpen = false;
  wallpapers: string[] = [];
  selectedWallpaper: string | null = null;
  private uid: string | null = null;

  constructor(
    private translateService: TranslateService,
    private router: Router,
    private authService: AuthService,
    private filePicker: ImagePickerService,
    private supabaseService: SupabaseService,
    private preferences: PreferencesService,
    private toastCtrl: ToastController 
  ) {
    this.currentLang = this.translateService.getCurrentLanguage();
  }

  async ngOnInit() {
    this.uid = await this.authService.getCurrentUid();
    if (this.uid) {
      await this.loadWallpapers();
    }
  }

  async loadWallpapers() {
    if (!this.uid) return;
    this.wallpapers = await this.supabaseService.getWallpapers(this.uid);
  }

  setLanguage(lang: string) {
    this.translateService.setLanguage(lang);
    this.currentLang = lang;
  }

  t(key: string): string {
    return this.translateService.translate(key);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  updateProfile() {
    this.router.navigate(['/update-user-info']);
  }

  async addWallpaper() {
    if (!this.uid) return;

    if (Capacitor.getPlatform() === 'web') {
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = 'image/*';
      fileInput.multiple = true;
      fileInput.onchange = async (event: any) => {
        const files: FileList = event.target.files;
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const uniqueFile = new File([file], `${uuidv4()}-${file.name}`, { type: file.type });
          const url = await this.supabaseService.uploadWallpaper(this.uid!, uniqueFile);
          if (url) this.wallpapers.push(url);
        }
        this.showToast('Wallpaper agregado');
      };
      fileInput.click();
    } else {
      const images: PickedImage[] = await this.filePicker.pickImages();
      if (!images || images.length === 0) return;

      for (const img of images) {
        const res = await fetch(img.data);
        const blob = await res.blob();
        const file = new File([blob], `${uuidv4()}-${img.name}`, { type: blob.type });
        const url = await this.supabaseService.uploadWallpaper(this.uid, file);
        if (url) this.wallpapers.push(url);
      }
      this.showToast('Wallpaper agregado');
    }
  }

  async logout() {
    await this.authService.logout();
    await this.preferences.remove('isLoggedIn');
    this.router.navigate(['/login']);
    this.showToast('Sesión cerrada');
  }

  async deleteWallpaper(url: string) {
    try {
      if (!this.uid) return;
      await this.supabaseService.deleteWallpaper(this.uid, url);
      this.wallpapers = this.wallpapers.filter(w => w !== url);
      this.selectedWallpaper = null;
      this.showToast('Wallpaper eliminado');
    } catch (error) {
      console.error('Error al eliminar wallpaper:', error);
      this.showToast('Error al eliminar');
    }
  }

  async applyWallpaper(url: string, type: number) {
    try {
      await this.supabaseService.setWallpaper(url, type);
      this.showToast('Wallpaper aplicado');
    } catch (err) {
      console.error(err);
      this.showToast('No se pudo aplicar wallpaper');
    }
  }

  selectWallpaper(url: string) {
    this.selectedWallpaper = url;
  }

  closeSelection() {
    this.selectedWallpaper = null;
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}
