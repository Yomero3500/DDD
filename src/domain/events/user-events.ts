export interface DomainEvent {
  eventId: string;
  occurredOn: Date;
  eventType: string;
}

export class UserRegisteredEvent implements DomainEvent {
  eventId: string;
  occurredOn: Date;
  eventType: string = 'UserRegisteredEvent';
  
  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly username: string
  ) {
    this.eventId = Math.random().toString(36).substring(2, 9);
    this.occurredOn = new Date();
  }
}

export class UserLoggedInEvent implements DomainEvent {
  eventId: string;
  occurredOn: Date;
  eventType: string = 'UserLoggedInEvent';
  
  constructor(
    public readonly userId: string,
    public readonly timestamp: Date
  ) {
    this.eventId = Math.random().toString(36).substring(2, 9);
    this.occurredOn = new Date();
  }
}

export class RoleChangedEvent implements DomainEvent {
  eventId: string;
  occurredOn: Date;
  eventType: string = 'RoleChangedEvent';
  
  constructor(
    public readonly userId: string,
    public readonly oldRole: string,
    public readonly newRole: string
  ) {
    this.eventId = Math.random().toString(36).substring(2, 9);
    this.occurredOn = new Date();
  }
}
