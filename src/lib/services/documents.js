// Importing necessary functions from fetch.js
import { createApiRequest } from '../fetch';

// Defining DocumentServices object to hold all document related services
const DocumentServices = {

    // Function to get a specific document
    get: async (collectionId, id, _form = false) => await createApiRequest(`documents/${collectionId}/${id}?form=${_form}`),

    // Function to get all documents
    getAll: async (collectionId, page, limit, form=false) => await createApiRequest(`documents/${collectionId}?form=${form}&limit=${limit}&page=${page}`),

    // Function to get all filtered documents
    getAllFilteredDocuments: async (collectionId, states, page = 1, limit=25, sortBy = 'createdAt', sort="acs") => await createApiRequest(`documents/collection/${collectionId}/document?limit=${limit}&page=${page}&sortBy=${sortBy+":"+sort}`, 'PUT', {...states}),

    // Function to get filtered documents
    getFilteredDocuments: async (collectionId, states) => await createApiRequest(`documents/collection/${collectionId}/document`, 'POST', {...states}),

    // Function to search with filters
    searchWithFilters: async (collectionId, search, states, page = 1, limit=25, sortBy = 'createdAt', sort="acs") => await createApiRequest(`documents/collection/${collectionId}/document/?name=${search}&limit=${limit}&page=${page}&sortBy=${sortBy+":"+sort}`, 'PUT', {...states}),

    // Function to search
    search: async (collectionId, search, form=false) => await createApiRequest(`documents/${collectionId}?name=${search}&limit=${25}&page=${1}&form=${form}`),

}

export default DocumentServices;