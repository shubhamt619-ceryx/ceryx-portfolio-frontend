import { AuthModel } from "src/app/modules/auth/_models/auth.model";

export class UserModel extends AuthModel {
       role: string;
       email: string;
       name: string;
       _id: number;
 
       setUser(user: any) {
        this.role = user.role || '';
        this.email = user.email || '';
        this.name = user.name || '';
        this._id = user._id || 0;
      }
}