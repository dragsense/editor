import { fetcher } from '../fetch';

const SettingServices = {

    get: async function () {

        const response = await window.autocode.makeApiRequest();


        const project = response.project;
        const url = project.url + `/settings`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });
    },


}

export default SettingServices;