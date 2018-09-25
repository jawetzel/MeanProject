import { combineReducers } from "redux";
import SiteSettings from "./SiteSettings";

const rootReducer = combineReducers({
    SiteSettings: SiteSettings,
});
export default rootReducer;