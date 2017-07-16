import { TestBed, inject } from '@angular/core/testing';

import { ParticipantListService } from './participant-list.service';

describe('ParticipantListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ParticipantListService]
    });
  });

  it('should be created', inject([ParticipantListService], (service: ParticipantListService) => {
    expect(service).toBeTruthy();
  }));
});
