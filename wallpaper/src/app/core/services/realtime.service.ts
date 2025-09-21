import { Injectable } from '@angular/core';
import { Database, ref, set, onValue } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealtimeService {
  constructor(private db: Database) {}

  setUserStatus(userId: string, status: string) {
    const userRef = ref(this.db, 'status/' + userId);
    set(userRef, { status });
  }

  getUserStatus(userId: string): Observable<string> {
    const userRef = ref(this.db, 'status/' + userId);
    return new Observable(observer => {
      onValue(userRef, snapshot => {
        observer.next(snapshot.val()?.status || '');
      });
    });
  }
}
