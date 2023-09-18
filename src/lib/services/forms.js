import { createApiRequest } from '../fetch';

// FormServices object to handle form related operations
const FormServices = {
    // Function to submit form data
    submit: (formId, formStates) => createApiRequest(`forms/submit/${formId}`, 'POST', formStates, false)
}

export default FormServices;