import { fetcher } from '../fetch';



const ThemeServices = {

    getColors: async function (page = 1, limit = 25) {

        const response = await window.autocode.makeApiRequest();


        const project = response.project;
        const url = project.url + `/theme/colors?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });
    },


    getFonts: async function (page = 1, limit = 25) {

        const response = await window.autocode.makeApiRequest();



        const project = response.project;
        const url = project.url + `/theme/fonts?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });


    },


    getVariables: async function (page = 1, limit = 25) {

        const response = await window.autocode.makeApiRequest();

        const project = response.project;
        const url = project.url + `/theme/variables?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });
    },




    getCss: async function () {

        const response = await window.autocode.makeApiRequest();

        const project = response.project;

        const url = project.url + `/theme/css`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return await fetcher(`${sanitizedUrl}`, {
            method: 'GET',
            headers: { 'x-api-key': apikey },
        });
    },

    getAnimationsCss: async function () {

        const response = await window.autocode.makeApiRequest();

        const project = response.project;

        const url = project.url + `/theme/css/animation`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        const res = await fetcher(`${sanitizedUrl}`, {
            method: 'GET',
            headers: { 'x-api-key': apikey },
        });

        return ({ css: res.css, _id: project._id })
    },

    getAnimationsNames: async function () {

        const response = await window.autocode.makeApiRequest();
        const project = response.project;

        const url = project.url + `/theme/css/animation/names`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');
        console.log(sanitizedUrl)

        return await fetcher(`${sanitizedUrl}`, {
            method: 'GET',
            headers: { 'x-api-key': apikey },
        });

    },

    getStyle: async function () {

        const response = await window.autocode.makeApiRequest();

        const project = response.project;

        const url = project.url + `/theme/style`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return await fetcher(`${sanitizedUrl}`, {
            method: 'GET',
            headers: { 'x-api-key': apikey },
        });
    },

    saveOrUpdateStyles: async function (styles) {

        const response = await window.autocode.makeApiRequest();

        const project = response.project;

        const url = project.url + `/theme/style`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');


        return await fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apikey
            },
            body: JSON.stringify({ styles }),
        });


    },

    saveOrUpdateAnimation: async function (animations) {

        const response = await window.autocode.makeApiRequest();

        const project = response.project;

        const url = project.url + `/theme/animation`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return await fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ animations }),
        });


    },





    getPageCss: async function (type, _id) {

        const response = await window.autocode.makeApiRequest();


        const project = response.project;

        const url = project.url + `/${type}s/css/${_id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return await fetcher(`${sanitizedUrl}`, {
            method: 'GET',
            headers: { 'x-api-key': apikey },
        });
    },



    getIcons: async function (page = 1, limit = 25) {

        const response = await window.autocode.makeApiRequest();


        const project = response.project;
        const url = project.url + `/theme/icons?limit=${limit}&page=${page}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });

    },

    
    addIcon: async function (obj) {

        const response = await window.autocode.makeApiRequest();


        const project = response.project;
        const url = project.url + `/theme/icon`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });

    },
    updateIcon: async function (_uid, obj) {
        const response = await window.autocode.makeApiRequest();

        const project = response.project;

        const url = project.url + `/theme/icon/${_uid}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        

        return fetcher(`${sanitizedUrl}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify(obj),
        });
    },

    deleteIcon: async function (_id) {


        const response = await window.autocode.makeApiRequest();


        const project = response.project;
        const url = project.url + `/theme/icon/${_id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'DELETE',
            headers: { 'x-api-key': apikey },
        });

    },


}

export default ThemeServices;