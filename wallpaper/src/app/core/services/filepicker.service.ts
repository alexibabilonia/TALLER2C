import { Injectable } from '@angular/core';
import { FilePicker } from '@capawesome/capacitor-file-picker';

export interface PickedImage {
  name: string;
  mimeType: string;
  data: string;
}

@Injectable({
  providedIn: 'root'
})
export class ImagePickerService {
  private permissionsGranted = false;

  constructor() {}

  private async ensurePermissions(): Promise<void> {
    if (this.permissionsGranted) return;

    try {
      await FilePicker.checkPermissions();
      this.permissionsGranted = true;
    } catch (e) {
      await FilePicker.requestPermissions();
      this.permissionsGranted = true;
    }
  }

  async pickImages(): Promise<PickedImage[]> {
    await this.ensurePermissions();

    const result: any = await FilePicker.pickImages();
    if (!result.files || result.files.length === 0) return [];

    return result.files.map((f: any) => ({
      name: f.name,
      mimeType: f.mimeType,
      data: f.data
    }));
  }

  toFormData(image: PickedImage): FormData {
    const formData = new FormData();
    if (!image.data) return formData;

    const byteString = atob(image.data.split(',')[1] || '');
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([ab], { type: image.mimeType });
    const file = new File([blob], image.name, { type: image.mimeType });
    formData.append('file', file, image.name);

    return formData;
  }
}
