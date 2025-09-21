import { Injectable } from '@angular/core';
import { Firestore, doc, setDoc, getDoc, updateDoc } from '@angular/fire/firestore';

export interface UserProfile {
  uid: string;
  firstName: string;
  lastName: string;
}

@Injectable({
  providedIn: 'root'
})
export class QueryService {
  constructor(private firestore: Firestore) {}

  async addUserProfile(user: UserProfile): Promise<void> {
    const docRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(docRef, {
      firstName: user.firstName,
      lastName: user.lastName
    });
  }

  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const docRef = doc(this.firestore, `users/${uid}`);
    const snapshot = await getDoc(docRef);

    if (snapshot.exists()) {
      const data = snapshot.data() as any;
      return {
        uid,
        firstName: data.firstName,
        lastName: data.lastName
      };
    }

    return null;
  }

  async updateUserProfile(uid: string, updates: Partial<Omit<UserProfile, 'uid'>>): Promise<void> {
    const docRef = doc(this.firestore, `users/${uid}`);
    await updateDoc(docRef, updates);
  }
}
