
import { storeData, storePage, STYLE_STORE_NAME, clearStore, getAllData, getAllCssData } from './db';
import { fetcher } from "../fetch";


export const loadPage = async (page, type, dispatch, clear = true) => {

    const response = await window.autocode.makeApiRequest();

    const project = response.project;
    await loadStyles(project, page, type, dispatch, clear)
    await loadElements(project, page, type, dispatch, clear);


}

export const loadWithoutStyle = async (page, type, dispatch, clear = true) => {

    const response = await window.autocode.makeApiRequest();
    const project = response.project;
    await loadElements(project, page, type, dispatch, clear);


}

export const loadElements = async (project, page, type, dispatch, clear) => {


    const url = `${project.url}/${type}s/elements/${page._id}`;
    const apikey = project.apikey;
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');


    const stream = new ReadableStream({
        start(controller) {
            fetch(`${sanitizedUrl}`, {
                headers: { 'x-api-key': apikey },

            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

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
    await (async function () {

        if (clear)
            clearStore();

        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                break;
            }
            await storePage(value);
        }


    })();


}


export const loadStyles = async (project, page, type, dispatch, clear) => {

    const url = `${project.url}/${type}s/style/${page._id}`;
    const apikey = project.apikey;
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');



    const stream = new ReadableStream({
        start(controller) {
            fetch(`${sanitizedUrl}`, {
                headers: { 'x-api-key': apikey },

            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

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
    await (async function () {
        if (clear)
            clearStore(STYLE_STORE_NAME);

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            await storePage(value, STYLE_STORE_NAME);

        }

    })();


}

export const loadGlobalStyles = async (dispatch, clear) => {

    const response = await window.autocode.makeApiRequest();

    const project = response.project;
    const url = `${project.url}/theme/style/${project._id}`;
    const apikey = project.apikey;
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

    const stream = new ReadableStream({
        start(controller) {
            fetch(`${sanitizedUrl}`, {
                headers: { 'x-api-key': apikey },

            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

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
    await (async function () {
        if (clear)
            clearStore(STYLE_STORE_NAME);

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }
            console.log(value)

            await storePage(value, STYLE_STORE_NAME);


        }

    })();


}

export const loadAnimationStyles = async (dispatch, clear) => {


    const response = await window.autocode.makeApiRequest();

    const project = response.project;
    const url = `${project.url}/theme/animation/${project._id}`;
    const apikey = project.apikey;
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');


    const stream = new ReadableStream({
        start(controller) {
            fetch(`${sanitizedUrl}`, {
                headers: { 'x-api-key': apikey },

            })
                .then(response => {
                    const reader = response.body.getReader();
                    const decoder = new TextDecoder();

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
    await (async function () {
        if (clear)
            clearStore(STYLE_STORE_NAME);

        while (true) {
            const { done, value } = await reader.read();

            if (done) {
                break;
            }


            await storePage(value, STYLE_STORE_NAME);


        }

    })();


}





export const savePage = async (page, type, dispatch) => {


    const response = await window.autocode.makeApiRequest();

    const project = response.project;
    let url = `${project.url}/${type}s/elements/${page._id}`;
    const apikey = project.apikey;
    let sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');


    let data = await getAllData(page._id);


    if (!data) {
        dispatch({ type: 'error', error: 'Something went wrong.' });
        return;
    }

    let elements = {};

    if (data.elements && typeof data.elements === 'object') {
        elements = Object.keys(data.elements).reduce((filteredElements, key) => {
            const element = data.elements[key];
            if (!element.deleted) {
                filteredElements[key] = element;
            }
            return filteredElements;
        }, {});
    }
    const components = data.components || [];
    const forms = data.forms || [];
    const collStates = data.collStates;



    await fetcher(`${sanitizedUrl}`, {
        method: 'POST',
        headers: { 'x-api-key': apikey, 'Content-Type': 'application/json', },
        body: JSON.stringify({ elements, collStates, components, forms, updater: project.creator })
    });


    data = await getAllData(page._id, STYLE_STORE_NAME);

    if (!data) {
        return;
    }



    url = `${project.url}/${type}s/style/${page._id}`;
    sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

    let styles = data.elements || {};

    if (styles && typeof styles === 'object') {
        styles = Object.keys(data.elements).reduce((filteredElements, key) => {
            const element = data.elements[key];
            if (!element.deleted) {
                filteredElements[key] = element;
            }
            return filteredElements;
        }, {});
    }

    await fetcher(`${sanitizedUrl}`, {
        method: 'POST',
        headers: { 'x-api-key': apikey, 'Content-Type': 'application/json', },
        body: JSON.stringify({ styles, updater: project.creator })
    });




}

export const saveStyle = async (page, type) => {




    const data = await getAllData(page._id, STYLE_STORE_NAME);

    if (!data) {
        return;
    }

    const response = await window.autocode.makeApiRequest();
    const project = response.project;
    const apikey = project.apikey;
    const url = `${project.url}/theme/${type}/${page._id}`;
    const sanitizedUrl = url.replace(/([^:]\/)\/+/g, '$1');

    let styles = data.elements || {};

    if (styles && typeof styles === 'object') {
        styles = Object.keys(data.elements).reduce((filteredElements, key) => {
            const element = data.elements[key];
            if (!element.deleted) {
                filteredElements[key] = element;
            }
            return filteredElements;
        }, {});
    }

    await fetcher(`${sanitizedUrl}`, {
        method: 'POST',
        headers: { 'x-api-key': apikey, 'Content-Type': 'application/json', },
        body: JSON.stringify({ styles })
    });




}
