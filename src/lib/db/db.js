import { nanoid } from 'nanoid';



export const DB_NAME = 'ac_editor';
export const PAGE_STORE_NAME = 'pages_store';
export const UNDO_STORE_NAME = 'undo_store';
export const REDO_STORE_NAME = 'redo_store';
export const STYLE_STORE_NAME = 'styles_store';



/**
 * Opens the IndexedDB database.
 *
 * @returns {Promise<IDBDatabase>} Promise that resolves with the opened database.
 */
export const openDB = async () => {
    return new Promise((resolve, reject) => {
        // Check for browser support and get the IndexedDB instance.
        const indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;

        // If the browser doesn't support IndexedDB, reject the promise.
        if (!indexedDB) {
            reject("Your browser doesn't support a stable version of IndexedDB.");
        }

        // Attempt to open the database.
        const request = indexedDB.open(DB_NAME);

        // Event triggered when a version change transaction is needed.
        // Here we'll set up the object stores and their indexes.
        request.onupgradeneeded = () => {
            const db = request.result;
            
            // Create the PAGE_STORE_NAME object store and its index.
            const pageStore = db.createObjectStore(PAGE_STORE_NAME, { keyPath: '_id' });
            pageStore.createIndex('id', '_id');

            // Create the STYLE_STORE_NAME object store and its index.
            const styleStore = db.createObjectStore(STYLE_STORE_NAME, { keyPath: '_id' });
            styleStore.createIndex('id', '_id');

            // Create object stores for undo and redo operations.
            db.createObjectStore(UNDO_STORE_NAME, { autoIncrement: true });
            db.createObjectStore(REDO_STORE_NAME, { autoIncrement: true });
        };

        // Event triggered when the database is successfully opened.
        request.onsuccess = () => {
            resolve(request.result);
        };

        // Handle database open request errors.
        request.onerror = () => {
            reject(request.error);
        };
    });
};


/**
 * Store a page element in the database.
 * 
 * @param {Object} element - The element to store.
 * @param {string} [STORE=PAGE_STORE_NAME] - The name of the object store.
 */
export const storePage = async (element, STORE = PAGE_STORE_NAME) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE], 'readwrite');
        const store = transaction.objectStore(STORE);

        await store.put(element);
        await transaction.complete;
    } catch (error) {
        console.error("Error storing page:", error);
    }
};

/**
 * Update data for a specific key with new elements.
 * 
 * @param {string} key - The key for the data.
 * @param {Array} newElements - The new elements to store.
 * @param {string} [STORE=PAGE_STORE_NAME] - The name of the object store.
 * @returns {Promise<boolean>} - Promise that resolves with a success status.
 */
export const storeData = async (key, newElements, STORE = PAGE_STORE_NAME) => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDB();
            const transaction = db.transaction([STORE], 'readwrite');
            const store = transaction.objectStore(STORE);
            const cursorIndex = store.index("id");
            const range = IDBKeyRange.only(key);
            const request = cursorIndex.openCursor(range);

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const elements = cursor.value.elements || {};
                    const updatedElements = Object.assign({}, elements, ...newElements);
                    const updateData = { ...cursor.value, elements: updatedElements };
                    const updateRequest = cursor.update(updateData);

                    updateRequest.onsuccess = () => resolve(true);
                    updateRequest.onerror = () => reject(updateRequest.error);
                }
            };

            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * Delete page data for a specific key.
 * 
 * @param {string} key - The key for the data.
 * @param {string} [STORE=PAGE_STORE_NAME] - The name of the object store.
 * @returns {Promise<boolean>} - Promise that resolves with a success status.
 */
export const deletePageData = async (key, STORE = PAGE_STORE_NAME) => {
    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDB();
            const transaction = db.transaction([STORE], 'readwrite');
            const store = transaction.objectStore(STORE);
            const cursorIndex = store.index("id");
            const range = IDBKeyRange.only(key);
            const request = cursorIndex.openCursor(range);

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) cursor.delete();
                resolve(true);
            };

            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Clear all data from the specified store.
 * 
 * @param {string} [STORE=PAGE_STORE_NAME] - The name of the object store.
 */
export const clearStore = async (STORE = PAGE_STORE_NAME) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE], 'readwrite');
        const store = transaction.objectStore(STORE);

        await store.clear();
        await transaction.complete;
    } catch (error) {
        console.error("Error clearing the store:", error);
    }
};


/**
 * Retrieve all data associated with a given key from the specified store.
 * 
 * @param {string} key - The key for which data needs to be fetched.
 * @param {string} [STORE=PAGE_STORE_NAME] - The name of the object store.
 * @returns {Promise<Object|null>} - Promise that resolves with the data or null.
 */
export const getAllData = async (key, STORE = PAGE_STORE_NAME) => {
    // If key is not provided, exit early
    if (!key) return null;

    return new Promise(async (resolve, reject) => {
        try {
            // Initialize DB connection and get the specific object store
            const db = await openDB();
            const store = db.transaction(STORE).objectStore(STORE);
            
            // Request data for the given key from the indexed DB
            const request = store.index("id").get(key);

            // Handle successful data retrieval
            request.onsuccess = function (event) {
                const data = event.target.result;
                resolve(data || null);  // Resolve with data or null if not present
            };

            // Handle errors in data retrieval
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
};


/**
 * Retrieves all unique keys from the specified store.
 * 
 * @param {string} [STORE=PAGE_STORE_NAME] - The name of the object store.
 * @returns {Promise<Array>} - Promise that resolves with an array of unique keys.
 */
export const getAllKeys = async (STORE = PAGE_STORE_NAME) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Initialize DB connection and get the specific object store
            const db = await openDB();
            const store = db.transaction([STORE], 'readonly').objectStore(STORE);
            const index = store.index('type');
            
            // Request unique keys from the indexed DB
            const getRequest = index.openCursor(null, 'nextunique');
            const uniqueKeys = [];

            getRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const [, elementType] = cursor.key;
                    uniqueKeys.push(elementType);
                    cursor.continue();
                } else {
                    resolve(uniqueKeys);
                }
            };

            // Handle errors during the retrieval process
            getRequest.onerror = () => reject(getRequest.error);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Retrieves all CSS data from the specified store.
 * 
 * @param {string} [STORE=PAGE_STORE_NAME] - The name of the object store.
 * @returns {Promise<Array>} - Promise that resolves with an array of all records in the store.
 */
export const getAllCssData = async (STORE = PAGE_STORE_NAME) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Initialize DB connection and get the specific object store
            const db = await openDB();
            const store = db.transaction([STORE], 'readonly').objectStore(STORE);

            // Request all data from the indexed DB
            const request = store.getAll();

            request.onsuccess = (event) => {
                const records = event.target.result || [];
                resolve(records);
            };

    
         // Handle errors during the retrieval process
         request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Retrieves specific data based on a key and uid from the specified store.
 * 
 * @param {string|number} key - The key to search for in the database.
 * @param {string} _uid - The unique identifier to search within the retrieved data.
 * @param {string} [index='id'] - The index to use for the search. Defaults to 'id'.
 * @param {string} [STORE=PAGE_STORE_NAME] - The name of the object store.
 * @returns {Promise<object|null>} - Promise that resolves with the found data or null.
 */
export const getData = async (key, _uid, index = 'id', STORE = PAGE_STORE_NAME) => {
    // If there's no key provided, resolve with null
    if (!key) return Promise.resolve(null);

    return new Promise(async (resolve, reject) => {
        try {
            // Initialize DB connection and get the specific object store
            const db = await openDB();
            const store = db.transaction(STORE).objectStore(STORE);
            const request = store.index(index).get(key);

            request.onsuccess = async event => {
                const data = event.target.result;
                // Check if data exists and has the specified _uid
                if (data && data.elements[_uid]) {
                    resolve(data.elements[_uid]);
                } else {
                    resolve(null);
                }
            };

            // Handle errors during the retrieval process
            request.onerror = () => reject(request.error);
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Searches for data entries that match a provided text.
 * 
 * @param {string} searchText - The text to search for within the data store.
 * @param {number} limit - The maximum number of results to return.
 * @param {string} STORE - The name of the data store to search within.
 * @returns {Promise<object>} An object containing an array of results and the last result's key.
 */
export const searchData = async (searchText, limit = 25, STORE = PAGE_STORE_NAME) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Open a connection to the indexedDB
            const db = await openDB();
            const store = db.transaction(STORE).objectStore(STORE);
            const index = store.index('id');

            // Construct a range for the searchText. Using '\uffff' to ensure that all strings 
            // that start with lowerBound will fall into the range.
            const lowerBound = searchText.toLowerCase();
            const upperBound = lowerBound + '\uffff';
            const range = IDBKeyRange.bound(lowerBound, upperBound);

            // Open a cursor to traverse records in the store that match the range.
            const request = index.openCursor(range);

            let results = [];
            let count = 0;
            let lastResult = null;

            request.onsuccess = event => {
                const cursor = event.target.result;
                if (cursor) {
                    const record = cursor.value;
                    const title = record.name || record.tagName;

                    // If the record's title contains the searchText, add it to the results.
                    if (title.indexOf(searchText) > -1) {
                        results.push(record);
                        count++;
                        
                        if (count < limit) {
                            lastResult = cursor.key;
                            cursor.continue();
                        }
                    } else {
                        cursor.continue();
                    }
                } else {
                    // Once cursor traversal is complete, return the results.
                    resolve({ results, lastResult });
                }
            };

            request.onerror = event => {
                // In case of an error, reject the promise.
                reject(event.target.error);
            };

        } catch (error) {
            // Handle any unexpected error
            reject(error);
        }
    });
}

/**
 * Searches for a specific selector in the style store based on a provided key.
 * 
 * @param {string} key - The key to search for within the style store.
 * @returns {Promise<object|null>} The data object if found, null otherwise.
 */
export const searchSelector = async (key) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Open a connection to the indexedDB
            const db = await openDB();

            // Start a read transaction in the style store
            const store = db.transaction(STYLE_STORE_NAME).objectStore(STYLE_STORE_NAME);

            // Use the 'type' index to retrieve data by the provided key
            const index = store.index('type');
            const request = index.get(key);

            request.onsuccess = event => {
                // Return the found data, or null if no data is found
                const data = event.target.result;
                resolve(data || null);
            };

            request.onerror = () => {
                // In case of an error while fetching data, reject the promise
                reject(request.error);
            };

        } catch (error) {
            // Handle any unexpected errors and reject the promise
            reject(error);
        }
    });
}


/**
 * Updates specific data based on a key in the specified store. If the data does not exist,
 * it creates a new entry with the provided key and element.
 * 
 * @param {string} key - The key of the data to be updated.
 * @param {object} element - The data to be updated or added.
 * @param {string} [STORE=PAGE_STORE_NAME] - The store to interact with.
 * @returns {Promise<boolean>} Returns true if the update or add operation was successful.
 */
export const updateData = async (key, element, STORE = PAGE_STORE_NAME) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Open a connection to the indexedDB
            const db = await openDB();

            // Start a read-write transaction in the specified store
            const transaction = db.transaction([STORE], 'readwrite');
            const store = transaction.objectStore(STORE);

            // Use the 'id' index to retrieve data by the provided key
            const cursorIndex = store.index("id");
            const range = IDBKeyRange.only(key);
            const request = cursorIndex.openCursor(range);

            request.onsuccess = event => {
                const cursor = event.target.result;

                if (cursor) {
                    // Update existing data
                    const elements = cursor.value.elements || {};
                    elements[element._uid] = element;

                    const updateRequest = cursor.update({ ...cursor.value, elements });

                    updateRequest.onsuccess = () => resolve(true);
                    updateRequest.onerror = () => reject(updateRequest.error);
                } else {
                    // Create new data if not existing
                    const addRequest = store.add({ _id: key, elements: { [element._uid]: element } });

                    addRequest.onsuccess = () => resolve(true);
                    addRequest.onerror = () => reject(addRequest.error);
                }
            };

            request.onerror = () => reject(request.error);
        } catch (error) {
            // Handle any unexpected errors and reject the promise
            reject(error);
        }
    });
}


/* export const updateStyleData = async (selector, key, deleted = false) => {

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();

        const transaction = db.transaction([STYLE_STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STYLE_STORE_NAME);
        const cursorIndex = objectStore.index("type");

        const range = IDBKeyRange.only(key);

        const request = cursorIndex.openCursor(range);


        request.onsuccess = (event) => {

            const cursor = event.target.result;
            if (cursor) {
                const selectors = cursor.value.selectors || {};
                if (deleted) {

                    if (selectors[selector.selectorText])
                        selectors[selector.selectorText].deleted = true;

                    const updateRequest = cursor.update({ ...cursor.value });
                    updateRequest.onsuccess = () => {
                        resolve(true);
                    };
                    updateRequest.onerror = () => {
                        reject(updateRequest.error);
                    };

                } else {
                    selectors[selector.selectorText] = {
                        selectorText: selector.selectorText,
                        properties: selector.properties,
                        className: selector.className,

                    };
                    const updateRequest = cursor.update({ ...cursor.value });
                    updateRequest.onsuccess = () => {
                        resolve(true);
                    };
                    updateRequest.onerror = () => {
                        reject(updateRequest.error);
                    };
                }

            } else if (!deleted) {
                // Add new data if not found
                const _uid = nanoid(8);

                const addRequest = objectStore.add({
                    selectors:
                    {
                        [selector.selectorText]: {
                            selectorText: selector.selectorText,
                            properties: selector.properties,
                            className: selector.className,

                        }
                    },
                    type: selector.type,
                    elementType: selector.elementType,
                    _uid
                });

                addRequest.onsuccess = () => {


                    resolve(true);
                };

                addRequest.onerror = () => {
                    reject(addRequest.error);
                };
            }
        };


        request.onerror = () => {
            reject(request.error);
        };

    });
};

export const deleteStyleData = async (key) => {

    return await new Promise(async (resolve, reject) => {

        const db = await openDB();

        const transaction = db.transaction([STYLE_STORE_NAME], 'readwrite');
        const objectStore = transaction.objectStore(STYLE_STORE_NAME);
        const cursorIndex = objectStore.index("type");

        const range = IDBKeyRange.only(key);

        const request = cursorIndex.openCursor(range);

        request.onsuccess = (event) => {

            const cursor = event.target.result;
            if (cursor) {
                const _uid = nanoid(8);

                const result = { ...cursor.value, _uid }
                cursor.delete();
                resolve(result);

            } else
                resolve({});

        };

        request.onerror = () => {
            reject(request.error);
        };

    });
}; */


/**
 * Deletes specific data based on a key and uid from the specified store.
 * 
 * @param {string} key - The main key of the data to be deleted.
 * @param {string} _uid - The unique id of the element within the main data that needs to be deleted.
 * @param {string} [STORE=PAGE_STORE_NAME] - The store from which the data will be deleted.
 * 
 * @returns {Promise<boolean>} - A promise that resolves with a boolean indicating whether the delete was successful.
 */
export const deleteData = async (key, _uid, STORE = PAGE_STORE_NAME) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Open database
            const db = await openDB();
            // Create a readwrite transaction on the specified store
            const transaction = db.transaction([STORE], 'readwrite');
            const objectStore = transaction.objectStore(STORE);
            const cursorIndex = objectStore.index("id");
            const range = IDBKeyRange.only(key);

            const request = cursorIndex.openCursor(range);

            request.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const elements = cursor.value.elements || {};
                    if (elements[_uid]) {
                        delete elements[_uid];
                        const updateRequest = cursor.update({ ...cursor.value, elements });

                        updateRequest.onsuccess = () => {
                            resolve(true);
                        };

                        updateRequest.onerror = () => {
                            reject(updateRequest.error);
                        };
                    } else {
                        resolve(false);
                    }
                } else {
                    resolve(false);
                }
            };

            request.onerror = () => {
                reject(request.error);
            };
        } catch (error) {
            reject(error);
        }
    });
};

/**
 * Store a single action in the database.
 * 
 * @param {object} action - The action to be stored.
 * @param {string} STORE - The store in which the action will be stored.
 */
export const storeAction = async (action, STORE) => {
    try {
        const db = await openDB();
        const transaction = db.transaction([STORE], 'readwrite');
        const store = transaction.objectStore(STORE);

        store.add(action);
        await transaction.complete;
    } catch (error) {
        console.error("Error storing action:", error);
    }
};

/**
 * Store multiple actions in the database.
 * 
 * @param {Array} actions - The list of actions to be stored.
 * @param {string} STORE - The store in which the actions will be stored.
 */
export const storeActions = async (actions, STORE) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE, 'readwrite');
        const store = transaction.objectStore(STORE);

        actions.forEach((action) => {
            store.add(action);
        });

        await transaction.complete;
    } catch (error) {
        console.error("Error storing actions:", error);
    }
};

/**
 * Retrieve the latest action from the database.
 * 
 * @param {string} STORE - The store from which the action will be retrieved.
 * @returns {Promise<object>} - A promise that resolves with the latest action.
 */
export const getAction = async (STORE) => {

    return new Promise(async (resolve, reject) => {
        try {
            const db = await openDB();
            const transaction = db.transaction(STORE, 'readonly');
            const store = transaction.objectStore(STORE);

            const mainRequest = store.getAllKeys();

            mainRequest.onsuccess = (event) => {
                const items = event.target.result;

                if (items.length <= 0) {
                    resolve(null);
                } else {
                    const lastKey = items[items.length - 1];

                    const request = store.get(lastKey);

                    request.onsuccess = (event) => {
                        const item = event.target.result;
                        resolve(item);
                    };

                    request.onerror = () => {
                        reject(request.error);
                    };
                }
            };

            mainRequest.onerror = () => {
                reject(mainRequest.error);
            };
        } catch (error) {
            reject(error);
        }
    });
};
/**
 * Delete the latest action from the database.
 * 
 * @param {string} STORE - The store from which the action will be deleted.
 * @returns {Promise<void>} - A promise that resolves when the action has been deleted.
 */
export const deleteAction = async (STORE) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE, 'readwrite');
        const store = transaction.objectStore(STORE);
        const mainRequest = await store.getAllKeys();
        const lastKey = mainRequest[mainRequest.length - 1];
        await store.delete(lastKey);
    } catch (error) {
        console.error("Error deleting action:", error);
    }
};

/**
 * Retrieve all actions from the database.
 * 
 * @param {string} STORE - The store from which the actions will be retrieved.
 * @returns {Promise<Array>} - A promise that resolves with the list of actions.
 */
export const getAllActions = async (STORE) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE, 'readonly');
        const store = transaction.objectStore(STORE);
        const actions = await store.getAll();
        return actions;
    } catch (error) {
        console.error("Error retrieving all actions:", error);
    }
};

/**
 * Delete all actions from the database.
 * 
 * @param {string} STORE - The store from which all actions will be deleted.
 * @returns {Promise<void>} - A promise that resolves when all actions have been deleted.
 */
export const deleteAllActions = async (STORE) => {
    try {
        const db = await openDB();
        const transaction = db.transaction(STORE, 'readwrite');
        const store = transaction.objectStore(STORE);
        await store.clear();
    } catch (error) {
        console.error("Error deleting all actions:", error);
    }
};
