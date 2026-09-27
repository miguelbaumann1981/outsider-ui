import { Service } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Service()
export class HandleEditMode {
  private editMode$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  setEditMode(state: boolean): void {
    this.editMode$.next(state);
  }

  getEditMode(): Observable<boolean> {
    return this.editMode$;
  }
}
