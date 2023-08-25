import { fetcher } from '../fetch';

const FormServices = {

 
    submit: async function(id, states) {

        const response = await window.autocode.makeApiRequest();


        const project = response.project;
        const url = `${project.url}/forms/submit/${id}`;
        const apikey = project.apikey;
        const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

        return fetcher(`${sanitizedUrl}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-api-key': apikey },
            body: JSON.stringify({ states }),
        });


    },
  
   
}

export default FormServices;