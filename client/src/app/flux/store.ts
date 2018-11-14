import { StoreModule } from "@ngrx/store";
import { adminReducer } from "./admin";

export default StoreModule.forRoot({
  admin: adminReducer
});
