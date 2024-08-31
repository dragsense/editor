
import { storePage, STYLE_STORE_NAME, clearStore, getAllData, PAGE_STORE_NAME } from './db';
import { fetcher } from "../fetch";


/**
 * Utility to sanitize URLs by removing extra forward slashes.
 */
const sanitizeUrl = (baseUrl) => baseUrl.replace(/([^:]\/)\/+/g, '$1');


/**
 * Loads a specific page's data including styles and elements.
 *
 * @param {string} page - The name or identifier of the page.
 * @param {string} type - The type or category of the page.
 * @param {Function} dispatch - The dispatcher function to update the state/store.
 * @param {boolean} clear - Determines if previous data should be cleared before loading. Default is true.
 * @throws {Error} Throws an error if the project is not found.
 */
export const loadPage = async (page, type, dispatch, clear = true) => {
    try {
        // Make the API request to retrieve project details.
        const response = await window.autocode.makeApiRequest();

        // Destructure the project from the response.
        const { project } = response;

        // If the project is not available, throw an error.
        if (!project) {
            throw new Error("Project Not Found.");
        }

        // Load styles and elements for the specified page and type.
        await loadStyles(project, page, type, dispatch, clear);
        await loadElements(project, page, type, dispatch, clear);
    } catch (error) {
        // Handle the error as needed. This could be dispatching to a reducer, console logging, or other error handling mechanisms.
        console.error("Error loading the page:", error.message);
        throw error;  // Re-throwing the error to handle it further up the call chain if needed.
    }
};


/**
 * Loads a specific page's elements without styles.
 *
 * @param {string} page - The name or identifier of the page.
 * @param {string} type - The type or category of the page.
 * @param {Function} dispatch - The dispatcher function to update the state/store.
 * @param {boolean} clear - Determines if previous data should be cleared before loading. Default is true.
 * @throws {Error} Throws an error if the project is not found.
 */
export const loadWithoutStyle = async (page, type, dispatch, clear = true) => {
    try {
        // Make the API request to retrieve project details.
        const response = await window.autocode.makeApiRequest();

        // Destructure the project from the response.
        const { project } = response;

        // If the project is not available, throw an error.
        if (!project) {
            throw new Error("Project Not Found.");
        }

        // Load elements for the specified page and type.
        await loadElements(project, page, type, dispatch, clear);
    } catch (error) {
        // Handle the error as needed. This could be dispatching to a reducer, console logging, or other error handling mechanisms.
        console.error("Error loading the page without style:", error.message);
        throw error;  // Re-throwing the error to handle it further up the call chain if needed.
    }
};


/**
 * Loads elements data from a specified URL, processes the chunks of data from the stream, 
 * parses JSON data, and stores the elements.
 * 
 * @param {Object} project - The project data containing API details.
 * @param {Object} page - The page data, specifically needs the page's ID.
 * @param {string} type - Type of the page.
 * @param {Function} dispatch - A dispatcher function to send actions to a reducer.
 * @param {boolean} clear - Flag to clear the store before storing new data. Defaults to false.
 */
export const loadElements = async (project, page, type, dispatch, clear = false) => {
    // Construct the URL for fetching the elements.
    const url = `${project.url}/${type}s/elements/${page._id}`;
    const sanitizedUrl = sanitizeUrl(url);

    // Create a readable stream for processing chunks of data.
    const stream = new ReadableStream({
        start(controller) {
            fetch(sanitizedUrl, {
                headers: {
                    'ngrok-skip-browser-warning': true,
                    'x-api-key': project.apikey
                }
            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    // Recursive function to process and decode chunks.
                    function processChunk(chunk) {
                        const decodedChunk = decoder.decode(chunk.value, { stream: true });
                        controller.enqueue(decodedChunk);

                        if (chunk.done) {
                            controller.close();
                            return;
                        }

                        reader.read().then(processChunk);
                    }

                    reader.read().then(processChunk);
                })
                .catch(error => {
                    controller.error(error);
                    dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });
                });
        }
    }, { readableStrategy: { highWaterMark: 1 } });

    // Create a transform stream to parse JSON chunks and enqueue them.
    const jsonStream = new TransformStream({
        start(controller) {
            this.buffer = '';
        },
        transform(chunk, controller) {
            this.buffer += chunk;
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                const parsedData = JSON.parse(line);
                controller.enqueue(parsedData);
            }
        },
        flush(controller) {
            if (this.buffer) {
                const parsedData = JSON.parse(this.buffer);
                controller.enqueue(parsedData);
            }
        }
    });

    const reader = stream.pipeThrough(jsonStream).getReader();
    if (clear) clearStore();

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
      
        await storePage(value);
    }
}



/**
 * Loads styles data from a specified URL, processes the chunks of data from the stream, 
 * parses JSON data, and stores the styles.
 * 
 * @param {Object} project - The project data containing API details.
 * @param {Object} page - The page data, specifically needs the page's ID.
 * @param {string} type - Type of the page.
 * @param {Function} dispatch - A dispatcher function to send actions to a reducer.
 * @param {boolean} clear - Flag to clear the store before storing new data. Defaults to false.
 */
export const loadStyles = async (project, page, type, dispatch, clear = false) => {
    // Construct the URL for fetching the styles.
    const url = `${project.url}/${type}s/style/${page._id}`;
    const sanitizedUrl = sanitizeUrl(url);

    // Create a readable stream for processing chunks of data.
    const stream = new ReadableStream({
        start(controller) {
            fetch(sanitizedUrl, {
                headers: {
                    'ngrok-skip-browser-warning': true,
                    'x-api-key': project.apikey
                }
            })
                .then(response => {

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();
 
                    // Recursive function to process and decode chunks.
                    function processChunk(chunk) {

                        const decodedChunk = decoder.decode(chunk.value, { stream: true });
                        controller.enqueue(decodedChunk);
  
                        if (chunk.done) {
                            controller.close();
                            return;
                        } 

                        reader.read().then(processChunk);
                    }

                    reader.read().then(processChunk);
                })
                .catch(error => {
                    controller.error(error);
                    dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });
                });
        }
    }, { readableStrategy: { highWaterMark: 1 } });

    // Create a transform stream to parse JSON chunks and enqueue them.
    const jsonStream = new TransformStream({
        start(controller) {
            this.buffer = '';
        },
        transform(chunk, controller) {
            this.buffer += chunk;
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                const parsedData = JSON.parse(line);
                controller.enqueue(parsedData);
            }
        },
        flush(controller) {
            if (this.buffer) {
                const parsedData = JSON.parse(this.buffer);
                controller.enqueue(parsedData);
            }
        }
    });

    const reader = stream.pipeThrough(jsonStream).getReader();

    if (clear) clearStore(STYLE_STORE_NAME);

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await storePage(value, STYLE_STORE_NAME);
    }
} 
 

/**
 * Loads global styles from a specified URL, processes the chunks of data from the stream, 
 * parses the JSON data, and stores the styles in the global style store.
 * 
 * @param {Function} dispatch - A dispatcher function to send actions to a reducer.
 * @param {boolean} clear - Flag to clear the global styles store before storing new data. Defaults to false.
 */
export const loadGlobalStyles = async (dispatch, clear = false) => {
    const response = await window.autocode.makeApiRequest();
    const project = response?.project;
  
    if (!project) { 
        throw new Error("Project Not Found.");
        return;      
    }    
  
    // Construct the URL for fetching global styles.
    const url = `${project.url}/theme/style/${project._id}`;
    const sanitizedUrl = sanitizeUrl(url);

    // Create a readable stream for processing chunks of data.
    const stream = new ReadableStream({
        start(controller) {
            fetch(sanitizedUrl, {
                headers: {
                    'ngrok-skip-browser-warning': true,
                    'x-api-key': project.apikey
                }
            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    // Recursive function to process and decode chunks.
                    function processChunk(chunk) {
                        const decodedChunk = decoder.decode(chunk.value, { stream: true });
                        controller.enqueue(decodedChunk);
                        if (chunk.done) {
                            controller.close();
                            return;
                        }
                        reader.read().then(processChunk);
                    }

                    reader.read().then(processChunk);
                })
                .catch(error => {
                    controller.error(error);
                    dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });
                });
        }
    }, { readableStrategy: { highWaterMark: 1 } });

    // Create a transform stream to parse JSON chunks and enqueue them.
    const jsonStream = new TransformStream({
        start(controller) {
            this.buffer = '';
        },
        transform(chunk, controller) {
            this.buffer += chunk;
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                const parsedData = JSON.parse(line);
                controller.enqueue(parsedData);
            }
        },
        flush(controller) {
            if (this.buffer) {
                const parsedData = JSON.parse(this.buffer);
                controller.enqueue(parsedData);
            }
        }
    });

    const reader = stream.pipeThrough(jsonStream).getReader();

    if (clear) clearStore(STYLE_STORE_NAME);

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await storePage(value, STYLE_STORE_NAME);
    }  
}    
    
   
/**
 * Loads animation styles from a specified URL, processes the chunks of data from the stream, 
 * parses the JSON data, and stores the animation styles in the style store.
 * 
 * @param {Function} dispatch - A dispatcher function to send actions to a reducer.
 * @param {boolean} clear - Flag to clear the styles store before storing new data. Defaults to false.
 */
export const loadAnimationStyles = async (dispatch, clear = false) => {
    // Make an API request to fetch the project details.
    const response = await window.autocode.makeApiRequest();
    const project = response?.project;

    if (!project) {
        throw new Error("Project Not Found.");
        return;
    }

    // Construct the URL for fetching animation styles.
    const url = `${project.url}/theme/animation/${project._id}`;
    const sanitizedUrl = sanitizeUrl(url);

    // Create a readable stream for processing chunks of data.
    const stream = new ReadableStream({
        start(controller) {
            fetch(sanitizedUrl, {
                headers: {
                    'ngrok-skip-browser-warning': true,
                    'x-api-key': project.apikey
                }
            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

                    // Recursive function to process and decode chunks.
                    function processChunk(chunk) {
                        const decodedChunk = decoder.decode(chunk.value, { stream: true });
                        controller.enqueue(decodedChunk);
                        if (chunk.done) {
                            controller.close();
                            return;
                        }
                        reader.read().then(processChunk);
                    }

                    reader.read().then(processChunk);
                })
                .catch(error => {
                    controller.error(error);
                    dispatch({ type: 'error', error: error?.message || 'Something went wrong.' });
                });
        }
    }, { readableStrategy: { highWaterMark: 1 } });

    // Create a transform stream to parse JSON chunks and enqueue them.
    const jsonStream = new TransformStream({
        start(controller) {
            this.buffer = '';
        },
        transform(chunk, controller) {
            this.buffer += chunk;
            const lines = this.buffer.split('\n');
            this.buffer = lines.pop();

            for (const line of lines) {
                const parsedData = JSON.parse(line);
                controller.enqueue(parsedData);
            }
        },
        flush(controller) {
            if (this.buffer) {
                const parsedData = JSON.parse(this.buffer);
                controller.enqueue(parsedData);
            }
        }
    });

    const reader = stream.pipeThrough(jsonStream).getReader();

    if (clear) clearStore(STYLE_STORE_NAME);

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        await storePage(value, STYLE_STORE_NAME);
    }
}


/**
 * Publishes a page using a POST request to a specified URL.
 * 
 * @param {Object} page - The page object to be published.
 * @param {string} type - The type of the page (e.g., 'page', 'component').
 * @param {Function} dispatch - A dispatcher function to send actions to a reducer.
 */
export const publishPage = async (page, type, dispatch) => {
    // Make an API request to fetch the project details.
    const response = await window.autocode.makeApiRequest();
    const project = response?.project;

    if (!project) {
        throw new Error("Project Not Found.");
    }

    const { apikey, creator } = project;

    // Construct the URL for publishing.
    const url = `${project.url}/${type}s/publish/${page._id}`;
    const sanitizedUrl = sanitizeUrl(url);

    try {
        // Send a POST request to publish the page.
        await fetcher(sanitizedUrl, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': true,
                'x-api-key': apikey,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ updater: creator })
        });
    } catch (e) {
        dispatch({ type: 'error', error: e?.message || 'Something went wrong.' });

    }

}

/**
 * Restores a page using a POST request to a specified URL.
 * 
 * @param {Object} page - The page object to be restored.
 * @param {string} type - The type of the page (e.g., 'page', 'component').
 * @param {Function} dispatch - A dispatcher function to send actions to a reducer.
 */
export const restorePage = async (page, type, dispatch, callback) => {
    try {
      // Make an API request to fetch the project details.
      const response = await window.autocode.makeApiRequest();
      const project = response?.project;
  
      if (!project) {
        throw new Error("Project Not Found.");
      }
  
      const { apikey, creator } = project;
  
      // Construct the URL for restoring the page.
      const url = `${project.url}/${type}s/restore/${page._id}`;
      const sanitizedUrl = sanitizeUrl(url);
  
      // Send a POST request to restore the page.
      await fetcher(sanitizedUrl, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": true,
          "x-api-key": apikey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ updater: creator }),
      });
  
      // Call the callback if the restore is successful
      if (callback) {
        await callback();
      }
    } catch (e) {
      dispatch({
        type: "error",
        error: e?.message || "Something went wrong.",
      });
      throw e; // Re-throw the error to be caught in the outer try-catch
    }
  };

/**
 * Utility to filter non-deleted elements from the data.
 */
const filterDeletedElements = (data) => {
    return Object.keys(data).reduce((filtered, key) => {
        const element = data[key];
        if (!element.deleted) filtered[key] = element;
        return filtered;
    }, {});
};

/**
 * Handles the data fetching and saving process.
 */
const fetchDataAndSave = async (type, endpoint, pageId, project, dispatch) => {


    const { apikey, creator, url } = project;

    const apiUrl = `${url}/${type}s/${endpoint}/${pageId}`;
    const sanitizedUrl = sanitizeUrl(apiUrl);

    let data = await getAllData(pageId, endpoint === "elements" ? PAGE_STORE_NAME : STYLE_STORE_NAME);

    if (!data || !data.elements) {
        dispatch({ type: 'error', error: 'Data or elements are missing.' });
        return;
    }
    
    // If the endpoint is "elements", check if data.elements[0] exists properly
    if (endpoint === "elements") {
        if (!data.elements.hasOwnProperty(0) || !data.elements[0]) {
            dispatch({ type: 'error', error: 'The first element is undefined.' });
            return;
        }
    }
    let payload = {

        updater: creator
    };

    let elements = {};
    if (typeof data.elements === 'object') {


        elements = filterDeletedElements(data.elements || {});
    }
        

    if (endpoint === "elements") {
        payload._elements = elements;
        payload._components = data.components || [];
        payload._forms = data.forms || [];
        payload._states = data.states;
        payload._events = data.events;
        payload._collStates = data.collStates;

    } else
        payload._styles = elements;


    await fetcher(sanitizedUrl, {
        method: 'POST',
        headers: {
            'ngrok-skip-browser-warning': true,
            'x-api-key': apikey,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });
};

/**
 * savePage - Asynchronously saves a page's content and style to a specified project URL.
 *
 * @param {Object} page - The page object.
 * @param {String} type - The type of the content to be saved.
 * @param {Function} dispatch - A function to dispatch actions.
 * 
 * @returns {Promise<void>} - A promise that resolves when the saving operation is complete.
 */
export const savePage = async (page, type, dispatch) => {
    try {
        // Fetch the project details.
        const { project } = await window.autocode.makeApiRequest();

        if (!project) {
            throw new Error("Project Not Found.");
        }


        // Fetch, process, and save element data.
        await fetchDataAndSave(type, "elements", page._id, project, dispatch);

        // Fetch, process, and save style data.
        await fetchDataAndSave(type, "styles", page._id, project, dispatch);

    } catch (error) {
        // Dispatch a general error if something unexpected happens.
        dispatch({ type: 'error', error: error.message || 'Unexpected error occurred.' });
    }
}

/**
 * Save styles for a page.
 *
 * @param {object} page - The page object.
 * @param {string} type - The type of style to save.
 * @returns {Promise<void>} - A promise that resolves when the saving operation is complete.
 */
export const saveStyle = async (page, type) => {
    try {
        // Fetch data.
        const data = await getAllData(page._id, STYLE_STORE_NAME);

        // If data is not available, return.
        if (!data) {
            return;
        }

        // Fetch project information.
        const response = await window.autocode.makeApiRequest();
        const project = response?.project;

        // If the project is not found, throw an error.
        if (!project) {
            throw new Error("Project Not Found.");
        }

        // Extract API key and URL from the project.
        const { apikey, url } = project;

        // Sanitize the URL.
        const sanitizedUrl = sanitizeUrl(`${url}/theme/${type}/${page._id}`);

        // Filter deleted elements.
        const styles = filterDeletedElements(data.elements || {});

        // Make a POST request to save styles.
        await fetcher(sanitizedUrl, {
            method: 'POST',
            headers: {
                'ngrok-skip-browser-warning': true,
                'x-api-key': apikey,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ styles }),
        });
    } catch (error) {
        // Handle errors gracefully, e.g., log the error and show a user-friendly message.
        console.error("Error while saving style:", error);
    }
};

