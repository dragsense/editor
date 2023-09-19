import { createApiRequest } from '../fetch';



// Define the ThemeServices object
const ThemeServices = {
    getColors: async (page = 1, limit = 25) => await createApiRequest(`theme/colors?limit=${limit}&page=${page}`),
    getFonts: async (page = 1, limit = 25) => await  createApiRequest(`theme/fonts?limit=${limit}&page=${page}`),
    getVariables: async (page = 1, limit = 25) => await  createApiRequest(`theme/variables?limit=${limit}&page=${page}`),
    getCss: async () => createApiRequest('theme/css'),
    getAnimationsCss: async () => {
        const res = await createApiRequest('theme/css/animation');
        const { _id } = await window.autocode.makeApiRequest().project;
        return { css: res.css, _id };
    },
    getAnimationsNames: async () => createApiRequest('theme/css/animation/names'),
    getStyle: async () => createApiRequest('theme/style'),
    saveOrUpdateStyles: async (styles) => createApiRequest('theme/style', 'POST', { styles }),
    saveOrUpdateAnimation: async (animations) => createApiRequest('theme/animation', 'POST', { animations }),
    getPageCss: async (type, _id) => createApiRequest(`${type}s/css/${_id}`),
    getIcons: async (page = 1, limit = 25) => createApiRequest(`theme/icons?limit=${limit}&page=${page}`),
    addIcon: async (obj) => createApiRequest('theme/icon', 'POST', obj),
    updateIcon: async (_uid, obj) => createApiRequest(`theme/icon/${_uid}`, 'PUT', obj),
    deleteIcon: async (_id) => createApiRequest(`theme/icon/${_id}`, 'DELETE'),
};

export default ThemeServices;