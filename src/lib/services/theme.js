import { createApiRequest } from '../fetch';



// Define the ThemeServices object
const ThemeServices = {
    getColors: (page = 1, limit = 25) => createApiRequest(`theme/colors?limit=${limit}&page=${page}`),
    getFonts: (page = 1, limit = 25) => createApiRequest(`theme/fonts?limit=${limit}&page=${page}`),
    getVariables: (page = 1, limit = 25) => createApiRequest(`theme/variables?limit=${limit}&page=${page}`),
    getCss: () => createApiRequest('theme/css'),
    getAnimationsCss: async () => {
        const res = await createApiRequest('theme/css/animation');
        const { _id } = await window.autocode.makeApiRequest().project;
        return { css: res.css, _id };
    },
    getAnimationsNames: () => createApiRequest('theme/css/animation/names'),
    getStyle: () => createApiRequest('theme/style'),
    saveOrUpdateStyles: (styles) => createApiRequest('theme/style', 'POST', { styles }),
    saveOrUpdateAnimation: (animations) => createApiRequest('theme/animation', 'POST', { animations }),
    getPageCss: (type, _id) => createApiRequest(`${type}s/css/${_id}`),
    getIcons: (page = 1, limit = 25) => createApiRequest(`theme/icons?limit=${limit}&page=${page}`),
    addIcon: (obj) => createApiRequest('theme/icon', 'POST', obj),
    updateIcon: (_uid, obj) => createApiRequest(`theme/icon/${_uid}`, 'PUT', obj),
    deleteIcon: (_id) => createApiRequest(`theme/icon/${_id}`, 'DELETE'),
};

export default ThemeServices;