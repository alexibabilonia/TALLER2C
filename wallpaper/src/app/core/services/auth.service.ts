import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private auth: Auth) {}

  async register(email: string, password: string): Promise<User> {
    const cred = await createUserWithEmailAndPassword(this.auth, email, password);
    await Preferences.set({ key: 'user_uid', value: cred.user.uid });
    return cred.user;
  }

  async login(email: string, password: string): Promise<User> {
    const cred = await signInWithEmailAndPassword(this.auth, email, password);
    await Preferences.set({ key: 'user_uid', value: cred.user.uid });
    return cred.user;
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await Preferences.remove({ key: 'user_uid' });
  }

  async getCurrentUid(): Promise<string | null> {
    const { value } = await Preferences.get({ key: 'user_uid' });
    return value;
  }

  getCurrentUser(): Observable<User | null> {
    return new Observable(subscriber => {
      this.auth.onAuthStateChanged(user => subscriber.next(user));
    });
  }
}
