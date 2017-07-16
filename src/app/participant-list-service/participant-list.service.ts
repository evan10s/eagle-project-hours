import { Injectable } from '@angular/core';

@Injectable()
export class ParticipantListService {
  public participantList : string[] = [];
  constructor() { }
  public addParticipant(name: string) {
    if(this.participantList.indexOf(name) === -1) {
      if (name.trim() !== "") {
        this.participantList.push(name);
      }
    }
  }

  public getParticipants(): string[] {
    return this.participantList;
  }

  public removeParticipant(name: string) {
    const index = this.participantList.indexOf(name);
    if (index >= 0) {
      this.participantList.splice(index,1);
    }
  }

}
