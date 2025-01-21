
  export class Customer {
    public customerId: string;
    public fullName: string;
    public birthDate: string;
    public isActive: boolean;
    public addresses: Address[];
    public contacts: Contact[];

    constructor (dto:{ customerId: string, fullName: string, birthDate: string, isActive: boolean, addresses: Address[], contacts: Contact[]}) {
      Object.assign(this, dto);
    }

  }
  
  export class Address {
    public street: string;
    public postalCode: string;
    public neighborhood: string;
    public number: string;
    public city: string;
    public complement?: string;

    constructor(dto: {street: string, postalCode: string, neighborhood: string, number: string, city: string, complement?: string}) {
      Object.assign(this, dto);
    }
    
  }
  export class Contact {
    public email: string;
    public phone: string;
    public isPrimary: boolean;
    constructor (dto: {email: string, phone: string, isPrimary: boolean}) {
      Object.assign(this, dto);
    }
  }