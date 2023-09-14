import { fetcher } from '../fetch';

const FormServices = {

 
    submit: async function(id, states) {

        const response = await window.autocode.makeApiRequest();


        const project = response?.project;

        if (!project) {
            throw new Error("Project Not Found.");
            return;
        }

        const url = `${project.url}/forms/submit/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
             headers: { 'ngrok-skip-browser-warning': true, 'x-api-key': apikey },
            body: states,
        });


    },
  
   
}

export default FormServices;