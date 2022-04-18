import { AuthModel } from "src/app/modules/auth/_models/auth.model";

export class UserModel extends AuthModel {
  role: string;
  email: string;
  name: string;
  _id: string;
  profile_pic: any;
  mobileNumber: any;
  emailSettings: any;
  password: any;
  username: any;

  setUser(user: any) {
    this.role = user.role || '';
    this.email = user.email || '';
    this.name = user.name || '';
    this._id = user._id || '';
    this.mobileNumber = user.mobileNumber || 0;
    this.username = user.username || "";
    this.password = user.password|| "";

  }
  clearUser() {
    this.role = '';
    this.email = '';
    this.name = '';
    this._id = '';
    this.mobileNumber ;
    this.username = "";
   this.password = "";
  }
}