export class User {
  public nombre: string;
  public email: string;
  public uid: string;

  constructor(obj: DataObj) {
    this.nombre = obj && obj.nombre || null;
    this.email = obj && obj.uid || null;
    this.uid = obj && obj.email || null;
  }
}

interface DataObj {
  uid: string;
  email: string;
  nombre: string;
}
