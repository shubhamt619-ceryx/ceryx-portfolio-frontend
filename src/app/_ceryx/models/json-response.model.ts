export class JsonResponseModel {
       success: boolean;
       statusCode: string;
       message: string;
       data: any;
       errors: {};
       traceId:string;
 
       setJson(json: any) {
        this.success = json.success || false;
        this.statusCode = json.statusCode || "";
        this.message = json.message || "";
        this.data = json.data || {};
        this.errors = json.errors || {};
        this.traceId = json.traceId || "";
 
      }
}
