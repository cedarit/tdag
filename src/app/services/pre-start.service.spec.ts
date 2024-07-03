import { TestBed } from '@angular/core/testing';

import { PreStartService } from './pre-start.service';

describe('PreStartService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreStartService = TestBed.get(PreStartService);
    expect(service).toBeTruthy();
  });
});
