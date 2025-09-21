import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { TranslateService } from './translate';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading: HTMLIonLoadingElement | null = null;

  constructor(
    private loadingCtrl: LoadingController,
    private translate: TranslateService
  ) {}

  async show() {
    if (this.loading) return;

    const message = this.translate.translate('LOADING') || 'Cargando...';

    this.loading = await this.loadingCtrl.create({
      spinner: null,
      cssClass: 'custom-loading',
      message: `
        <div class="spinner-overlay">
          <ion-spinner name="crescent"></ion-spinner>
          <p>${message}</p>
        </div>
      `,
      backdropDismiss: false,
      showBackdrop: true
    });

    await this.loading.present();
  }

  async hide() {
    if (this.loading) {
      await this.loading.dismiss();
      this.loading = null;
    }
  }
}
