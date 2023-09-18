import { createApiRequest } from '../fetch';



// This object provides a method to fetch the settings of the project
// It uses the createApiRequest function to send the request
const SettingServices = {

    // This method fetches the settings of the project
    get: () => createApiRequest('settings')
  

}

export default SettingServices;