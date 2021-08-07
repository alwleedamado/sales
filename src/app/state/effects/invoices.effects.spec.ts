import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable } from 'rxjs';

import { InvoicesEffects } from './invoices.effects';

describe('InvoicesEffects', () => {
  let actions$: Observable<any>;
  let effects: InvoicesEffects;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        InvoicesEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.inject(InvoicesEffects);
  });

  it('should be created', () => {
    expect(effects).toBeTruthy();
  });
});
