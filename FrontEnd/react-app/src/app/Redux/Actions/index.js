export const UpdateSiteSettingsKeyword = 'UpdateSiteSettingsKeyword';


export function UpdateSiteSettings(content){
    return{
        type: UpdateSiteSettingsKeyword,
        payload: content
    };
}