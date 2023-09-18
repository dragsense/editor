import { createApiRequest } from '../fetch';

// Define MediaServices as an object to hold all media related functions
const MediaServices = {

    // Function to get a specific media by id
    get: (id) => createApiRequest(`media/${id}`),

    // Function to get all media of a specific type, with pagination
    getAll: (type, page, limit = 25) => createApiRequest(`media?type=${type}&limit=${limit}&page=${page}`),

    // Function to search for media by type and name
    search: (type, search) => createApiRequest(`media?name=${search}&type=${type}&limit=25&page=1`),

    // Function to prepare the upload of a new media
    prepareUpload: async (type) => {
        const response = await window.autocode.makeApiRequest();

        const project = response?.project;

        if (!project) {
            throw new Error("Project Not Found.");
        }

        const url = project.url + `/media?type=${type}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return { sanitizedUrl, apikey };
    },

    // Function to upload a new media
    upload: async (type, formData, onProgress) => {

        const { sanitizedUrl, apikey } = await prepareUpload(type)
        
        return await fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
            body: formData,
            onProgress: ({ total, loaded }) => {
                if (onProgress) {
                    const progress = Math.round((loaded / total) * 100);
                    onProgress({ percent: progress });
                }
            }
        });
    },

    // Function to update a specific media
    update: (id, states) => createApiRequest(`media${id !== -1 ? '/' + id : ''}`, 'PUT', states),

    // Function to delete a specific media
    delete: (id) => createApiRequest(`media/${id}`, 'DELETE'),

}

// Export MediaServices as the default export
export default MediaServices;