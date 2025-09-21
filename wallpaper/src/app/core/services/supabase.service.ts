import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';
import { WallpaperPlugin } from 'capacitor-wallpaper';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      'https://ysjlpwdtmlnmlshlsrzj.supabase.co',
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlzamxwd2R0bWxubWxzaGxzcnpqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg0MjEyNzQsImV4cCI6MjA3Mzk5NzI3NH0.MOTkQSZfB2WqkQLoHqMORWwBHFgqgjyGDHkK_rl5Tl4'
    );
  }

  async uploadWallpaper(uid: string, file: File): Promise<string | null> {
    try {
      const uniqueName = `${uuidv4()}-${file.name}`;
      const path = `${uid}/${uniqueName}`;
      const { error: uploadError } = await this.supabase.storage
        .from('wallpapers')
        .upload(path, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: publicData } = this.supabase.storage
        .from('wallpapers')
        .getPublicUrl(path);

      return publicData.publicUrl;
    } catch (err) {
      console.error('Error al subir wallpaper:', err);
      return null;
    }
  }

  async getWallpapers(uid: string): Promise<string[]> {
    try {
      const { data: files, error } = await this.supabase.storage
        .from('wallpapers')
        .list(uid);

      if (error || !files) throw error;

      return files.map(file => {
        const { data: publicData } = this.supabase.storage
          .from('wallpapers')
          .getPublicUrl(`${uid}/${file.name}`);
        return publicData.publicUrl;
      });
    } catch (err) {
      console.error('Error al obtener wallpapers:', err);
      return [];
    }
  }

  async deleteWallpaper(uid: string, fileName: string): Promise<boolean> {
    try {
      const { error } = await this.supabase.storage
        .from('wallpapers')
        .remove([`${uid}/${fileName}`]);

      if (error) throw error;
      return true;
    } catch (err) {
      console.error('Error al eliminar wallpaper:', err);
      return false;
    }
  }

  async setWallpaper(url: string, type: number = 1): Promise<void> {
    try {
      await WallpaperPlugin.setWallpaper({ url, type });
      console.log('Wallpaper aplicado');
    } catch (err) {
      console.error('Error al aplicar wallpaper:', err);
    }
  }

  async clearWallpaper(type: number = 1): Promise<void> {
    try {
      await WallpaperPlugin.clearWallpaper({ type });
      console.log('Wallpaper eliminado');
    } catch (err) {
      console.error('Error al eliminar wallpaper:', err);
    }
  }

  async cancelWallpaper(): Promise<void> {
    try {
      await WallpaperPlugin.cancel();
      console.log('Acción cancelada');
    } catch (err) {
      console.error('Error al cancelar acción:', err);
    }
  }
}
