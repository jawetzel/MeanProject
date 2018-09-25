import {UpdateSiteSettingsKeyword} from "../Actions/index";

export const defaultSiteSettings = {
    sessionToken: null,
    roles: [],
    toastType: '', toastTitle: '', toastBody: '', toastTimeout: 3
};

export default function (state = defaultSiteSettings, action) {
    switch(action.type){
        case UpdateSiteSettingsKeyword:{
            return action.payload;
        }
        default:
            return state;
    }
}
