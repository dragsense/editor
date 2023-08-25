import { fetcher } from '../fetch';

const DocumentServices = {


    get: async function (collectionId, id, _form = false) {

        const response = await window.autocode.makeApiRequest();


        const project = response.project;
        const url = project.url + `/documents/${collectionId}/${id}?form=${_form}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey, "origin": 'http://localhost:3000' },
        });
    },

    getAll: async function (collectionId, page, limit, form=false) {

        const response = await window.autocode.makeApiRequest();

    
        const project = response.project;
        const url = project.url + `/documents/${collectionId}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}?form=${form}&limit=${limit}&page=${page}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });
    },

    
    getAllFilteredDocuments: async function (collectionId, states, page = 1, limit=25, sortBy = 'createdAt', sort="acs") {

        const response = await window.autocode.makeApiRequest();

        const project = response.project;
        const url = project.url + `/documents/collection/${collectionId}/document?limit=${limit}&page=${page}&sortBy=${sortBy+":"+sort}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({...states})
        });
    },

    
    getFilteredDocuments: async function (collectionId, states) {

        const response = await window.autocode.makeApiRequest();


        const project = response.project;
        const url = project.url + `/documents/collection/${collectionId}/document`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({...states})
        });
    },


    searchWithFilters: async function (collectionId, search, states, page = 1, limit=25, sortBy = 'createdAt', sort="acs") {

        const response = await window.autocode.makeApiRequest();

        const project = response.project;
        const url = project.url + `/documents/collection/${collectionId}/document/?search=${search}?limit=${limit}&page=${page}&sortBy=${sortBy+":"+sort}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({...states})
        });
    },

    

    search: async function (collectionId, search, form=false) {

        const response = await window.autocode.makeApiRequest();




        const project = response.project;
        const url = project.url + `/documents/${collectionId}?name=${search}&limit=${25}&page=${1}&form=${form}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'Get',
            headers: { 'x-api-key': apikey },
        });

    },


 
}

export default DocumentServices;