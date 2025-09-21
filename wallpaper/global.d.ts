declare module 'capacitor-wallpaper' {
  export interface WallpaperPlugin {
    echo(options: { value: string }): Promise<{ value: string }>;
    setWallpaper(options: { url: string, type?: number }): Promise<void>;
    clearWallpaper(options?: { type?: number }): Promise<void>;
    cancel(): Promise<void>;
  }

  export const WallpaperPlugin: WallpaperPlugin;
}
