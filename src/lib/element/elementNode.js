import { message } from 'antd';
import { formatDate } from '../utils';

/**
 * Get the value of a state based on its key.
 *
 * @param {string[]} key - The key to access the state.
 * @param {object} states - The states object.
 * @returns {any} - The value of the state.
 */
export const getStateValue = (key, states) => {
  try {
    if (!states) {
      return "";
    }

    const stateRef = states[key[0]];

    if (!stateRef) {
      return "";
    }

    switch (stateRef.type) {
      case 'image':
        return {
          value: stateRef.src ? stateRef.src.src : './images/default/default-img.png',
          label: stateRef.src?.alt || 'image'
        };

      case 'video':
        return {
          value: stateRef.src ? stateRef.src.src : './images/default/default-poster.png',
          label: stateRef.src?.alt || 'video',
          srcs: stateRef.srcs
        };

      case 'audio':
        return {
          value: './audios/default/sample.mp3',
          srcs: stateRef.srcs
        };

      case 'images':
        if (key[1] && stateRef.states) {
          const index = isNaN(Number(key[1])) ? -1 : Number(key[1]);
          if (stateRef.states[index] !== undefined) {
            const value = stateRef.states[index];
            return {
              value: value.src || './images/default/default-img.png',
              label: value.alt || 'image'
            };
          }
        }
        return "";

      case 'array':
        if (key[1] && stateRef.states) {
          const index = isNaN(Number(key[1])) ? -1 : Number(key[1]);
          if (stateRef.states[index] !== undefined) {
            const value = stateRef.states[index].value?.split(":");
            return {
              value: value[0],
              label: value[1] || value[0]
            };
          }
        }
        return "";

      case 'object':
        return getStateValue([key[1]], stateRef.states);

      default:
        return stateRef.defaultValue !== undefined ? stateRef.defaultValue : "";
    }
  } catch (e) {
    message.error("Something went wrong.");
    return "";
  }
};


/**
 * Get values from states based on a key.
 *
 * @param {string[]} key - The key to access the states.
 * @param {object} states - The states object.
 * @returns {Array} - An array of values.
 */
export const getStateStates = (key, states) => {
  let values = [];

  try {
    if (!states) {
      return values;
    }

    const value = states[key[0]];

    if (!value) {
      return values;
    }

    if (value.type === 'array') {
      values = Object.values(value.states).flatMap((state) => {
        const val = state.value.split(":");
        return { label: val[0], value: val[1] || state.idx, key: val[1] || state.id };
      });
    }

    if (value.type === 'images') {
      values = Object.values(value.states).map((state) => {
        return { label: state.alt, value: state.src, key: state._id };
      });
    }

    // Add other conditions here for different state types if needed.

  } catch (e) {
    message.error("Something went wrong.");
  }

  return values;
};

/**
 * Get a state reference based on a key.
 *
 * @param {string[]} key - The key to access the state.
 * @param {object} states - The states object.
 * @returns {any} - The state reference or undefined if not found.
 */
export const getStateRef = (key, states) => {
  if (!states) {
    return undefined;
  }

  let value = states[key[0]];

  // If the state type is 'array' or 'images', return undefined.
  if (value.type === 'array' || value.type === 'images') {
    return undefined;
  }

  // If the state type is 'object' and it has 'states', access the nested state.
  if (value.type === 'object' && value.states) {
    value = value.states[key[1]];
  }

  return value;
};


/**
 * Get the default value for a given state key.
 *
 * @param {string[]} key - The key to access the state.
 * @param {object} states - The states object.
 * @returns {any} - The default value based on the state type.
 */
export const getStates = (key, states) => {
  try {
    if (!states) {
      return "";
    }

    const stateRef = states[key[0]];

    if (!stateRef) {
      return "";
    }

    switch (stateRef.type) {
      case 'image':
        return {
          value: stateRef.src?.src || './images/default/default-img.png',
          label: stateRef.src?.alt || 'image'
        };

      case 'video':
        return {
          value: stateRef.src?.src || './images/default/default-poster.png',
          label: stateRef.src?.alt || 'video',
          srcs: stateRef.srcs
        };

      case 'audio':
        return {
          value: './audios/default/sample.mp3',
          srcs: stateRef.srcs
        };

      case 'images':
        if (stateRef.states && key[1]) {
          const index = isNaN(Number(key[1])) ? -1 : Number(key[1]);
          if (stateRef.states[index] !== undefined) {
            const value = stateRef.states[index];
            return {
              value: value.src || './images/default/default-img.png',
              label: value.alt || 'image'
            };
          }
        } else if (stateRef.states) {
          return Object.values(stateRef.states).map((value) => ({
            label: value.alt,
            value: value.src,
            key: value._id
          }));
        }
        return "";

      case 'array':
        if (stateRef.states && key[1]) {
          const index = isNaN(Number(key[1])) ? -1 : Number(key[1]);
          if (stateRef.states[index] !== undefined) {
            const value = stateRef.states[index].value?.split(":");
            return {
              value: value[0],
              label: value[1] || value[0]
            };
          }
        } else if (stateRef.states) {
          return Object.values(stateRef.states).flatMap((value, index) => {
            const val = value.value.split(":");
            return {
              label: val[0],
              value: val[1] || value.idx,
              key: val[1] || value.id
            };
          });
        }
        return "";

      case 'object':
        return getStateValue([key[1]], stateRef.states);

      default:
        return stateRef.defaultValue !== undefined ? stateRef.defaultValue : "";
    }
  } catch (e) {
    console.error("Something went wrong.", e);
    return "";
  }
};




/**
 * Update the value of a state based on provided parameters.
 *
 * @param {object} elem - The element containing key and value expressions.
 * @param {string} withValue - The value to substitute for '[withkey]' in expressions.
 * @param {object} states - The states object.
 * @param {any} value - The value to update the state with.
 * @param {string} updateKey - The key to update in the state (default is 'defaultValue').
 * @returns {boolean} - True if the update was successful, false otherwise.
 */
export const updateStateValue = (elem, withValue, states, value, updateKey = "defaultValue") => {
  const key = elem.key;
  const expression = elem.value;

  let stateRef = getStateRef(key, states);

  if (!stateRef) {
    return false;
  }

  try {
    let val = '';

    if (expression) {
      let original = expression.replace(/\[withkey]/g, withValue);
      original = original.replace(/\[value]/g, value);
      original = original.replace(/\[key]/g, stateRef[updateKey]);

      val = eval(original);
    } else {
      val = value;
    }

    // Ensure the updated value is within the min and max limits.
    if (val >= stateRef.max && updateKey !== 'max') {
      val = stateRef.max;
    } else if (val <= stateRef.min && updateKey !== 'min') {
      val = stateRef.min;
    }

    // Update the state with the new value.
    stateRef[updateKey] = val;
    return true;
  } catch (e) {
    message.error(e.message);
    return false;
  }
};


/**
 * Generate a cascading menu structure based on element states.
 *
 * @param {object} elementStates - The states of elements.
 * @param {string} type - The type for the root item.
 * @param {string} value - The value for the root item.
 * @returns {Array} - An array representing the cascading menu structure.
 */
export const generateCascader = (elementStates, type, value) => {
  const cascader = Object.values(elementStates).map((state) => {
    let children = null;

    if (state.states) {
      state.type = state.type || 'array';
      children = Object.keys(state.states).map((key) => ({
        label: key.toUpperCase(),
        value: key,
      }));
    }

    return {
      label: state.key.toUpperCase(),
      value: state.key,
      type: state.type,
      children,
    };
  });

  return [{ label: type, value, type, children: cascader }];
};


/**
 * Generate a cascading menu structure for collection states.
 *
 * @param {object} elementStates - The collection states.
 * @param {string} type - The type for the root item.
 * @param {string} value - The value for the root item.
 * @returns {Array} - An array representing the cascading menu structure.
 */
export const generateCascaderCollStates = (elementStates, type, value) => {
  const states = Object.entries(elementStates).map(([key, value]) => {
    if (key === 'states') {
      return generateCascader(value, 'STATES', key)[0];
    }

    const state = {
      label: key.toUpperCase(),
      value: key,
      type: key === 'documents' ? 'array' : undefined,
      children: null,
    };

    return state;
  });

  return [{ label: type, value, type, children: states }];
};


export const defaultDoc = [
  { label: '_ID', value: '_id' },
  { label: 'NAME', value: 'name' },
  {
    label: 'SLUG', value: 'slug',
  },
  {
    label: 'URL', value: 'url',
  },
  {
    label: 'TITLE', value: 'title',
  },
  {
    label: 'DESC', value: 'desc',
  },
  {
    label: 'EXCERPT', value: 'excerpt',
  },
  {
    label: 'IMAGE', value: 'image',
  },
]

export const pageSetting =
  [
    { label: '_ID', value: '_id' },
    { label: 'NAME', value: 'name' },
    {
      label: 'SLUG', value: 'slug',
    },
    {
      label: 'CREATOR', value: 'creator',
    },
    {
      label: 'URL', value: 'url',
    },
    {
      label: 'CREATED AT', value: 'createdAt',
      children: [
        { label: "YYYY-MM-DD", value: "YYYY-MM-DD" },
        { label: "MM/DD/YYYY", value: "MM/DD/YYYY" },
        { label: "DD/MM/YYYY", value: "DD/MM/YYYY" },
        { label: "YYYY/MM/DD", value: "YYYY/MM/DD" },
        { label: "Month D, YYYY", value: "MMMM D, YYYY" },
        { label: "D MMM, YYYY", value: "D MMM, YYYY" },
        { label: "MMMM DD, YYYY", value: "MMMM DD, YYYY" },
        { label: "DD MMM, YYYY", value: "DD MMM, YYYY" },

      ]
    },
    {
      label: 'SETTING', value: 'SETTING',
      children: [
        {
          label: 'TITLE', value: 'title',
        },
        {
          label: 'DESC', value: 'desc',
        },
        {
          label: 'EXCERPT', value: 'excerpt',
        },
        {
          label: 'CONTENT', value: 'content',
        },
        {
          label: 'IMAGE', value: 'image',
        },
        {
          label: 'STATUS', value: 'status',
        }
      ]
    }

  ];


/**
 * Generate cascading relations states for a collection.
 *
 * @param {object} collection - The collection object containing relationships.
 * @returns {Array} - An array representing the cascading relations states.
 */
export const generateCascadeRelationsStates = async (collection) => {
  let tempStates = [];
  let relStates = [];

  if (collection.populatedRelationships) {
    await Promise.all(collection.populatedRelationships.map(async (relation) => {
      const current = generateCascader(
        relation.states || {},
        relation.name.toUpperCase(),
        relation._id
      );
      tempStates = [...tempStates, ...current];
    }));

    relStates = [
      {
        label: 'POPULATED',
        value: 'POPULATED',
        children: [...tempStates],
      },
      {
        type: 'array',
        label: 'RELATIONSHIPS',
        value: 'RELATIONSHIPS',
        children: collection.populatedRelationships.map((rel) => ({
          label: rel.name.toUpperCase(),
          value: rel._id,
          type: 'relations',
        })),
      },
      {
        type: 'array',
        label: 'PAGES',
        value: 'PAGES',
        children: [{ label: 'INDEX', value: 'index' }],
      },
    ];
  }

  return relStates;
};


/**
 * Get a range of page numbers for pagination.
 *
 * @param {number} currentPage - The current page number.
 * @param {number} totalPages - The total number of pages.
 * @param {object} pagination - Pagination configuration.
 * @returns {Array} - An array of page numbers and ellipsis.
 */
export const getPaginationRange = (currentPage, totalPages, pagination) => {
  const leftRangeLength = Math.min(pagination.leftRange || 1, totalPages);
  const rightRangeLength = Math.min(pagination.rightRange || 1, totalPages);
  const rangeSize = pagination.nearRange || 2;
  const dots = pagination.dots || "...";

  let start = Math.max(currentPage - rangeSize, 1);
  let end = Math.min(currentPage + rangeSize, totalPages);

  if (leftRangeLength + rightRangeLength >= totalPages) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  if (start <= leftRangeLength) {
    end = Math.min(start + rangeSize * 2, totalPages);
  } else if (end >= totalPages - rightRangeLength + 1) {
    start = Math.max(end - rangeSize * 2, 1);
  }

  const leftRange = Array.from({ length: leftRangeLength }, (_, index) => index + 1);
  const rightRange = Array.from({ length: rightRangeLength }, (_, index) => totalPages - index);

  const nearbyRange = Array.from({ length: end - start + 1 }, (_, index) => start + index);

  if (start > leftRangeLength + 1) {
    leftRange.push(dots);
  }

  if (end < totalPages - rightRangeLength) {
    rightRange.unshift(dots);
  }

  return [...leftRange, ...nearbyRange, ...rightRange];
};



/**
 * Get a value from a nested object based on a key array.
 *
 * @param {Array} key - The key array to access the value.
 * @param {object} setting - The settings object.
 * @returns {object|null} - The value based on the key or null if not found.
 */
export const getPageValue = (key, setting) => {
  // Remove 'POPULATED' if it's the first element in the key array
  if (key[0] === 'POPULATED') key.shift();

  if (key[0] === 'states') {
    const modifiedKey = [...key];
    modifiedKey.shift();
    return getStateValue(modifiedKey, setting.states);
  } else if (key[0] === 'RELATIONSHIPS' && setting.relationships) {
    return setting.relationships[key[1]] || null;
  } else if (key[0] === 'SETTING') {
    const _setting = setting.setting;
    if (!_setting) return null;

    if (key[1] === 'image') {
      const image = _setting['populatedImage'];
      return {
        value: image?.src || '/images/default/default-img.png',
        label: image === undefined ? `[featured image]` : image?.alt || 'Featured Image',
      };
    } else if (key[1] === 'status') {
      const status = _setting[key[1]];
      return {
        value: status || `[page status]`,
        label: status || `[page status]`,
      };
    } else {
      return {
        value: _setting[key[1]] || `[page ${key[1]}]`,
        label: _setting[key[1]] || `[page ${key[1]}]`,
      };
    }
  } else if (key[0] === 'creator') {
    const creator = setting[key[0]] || {};
    return {
      value: creator._id || '',
      label: creator.name || 'Unknown',
    };
  } else if (key[0] === 'createdAt') {
    const createdAt = setting[key[0]];
    return createdAt ? formatDate(createdAt, key[1]) : `[page ${key[1]}]`;
  } else if (key[1] === 'NEXTDOCUMNET' || key[1] === 'PREVDOCUMNET') {
    const doc = setting[key[1]] || {};
    if (!doc) {
      return {
        value: `[document ${key[2]}]`,
        label: `[document ${key[2]}]`,
      };
    }

    if (key[2] === 'image') {
      const image = doc['populatedImage'];
      return {
        value: image?.src || '/images/default/default-img.png',
        label: image === undefined ? `[featured image]` : image?.alt || 'Featured Image',
      };
    } else {
      return {
        value: doc[key[2]] || `[document ${key[2]}]`,
        label: doc[key[2]] || `[document ${key[2]}]`,
      };
    }
  } else {
    return {
      value: setting[key[0]] || `[page ${key[0]}]`,
      label: setting[key[0]] || `[page ${key[0]}]`,
    };
  }
};


/**
 * Get an array of page states based on documents and a type.
 *
 * @param {Array} docs - The array of documents.
 * @param {string} type - The type for the page states.
 * @returns {Array} - An array of page states objects.
 */
export const getPageStates = (docs, type) => {
  if (docs?.length > 0) {
    return docs.map((value) => ({
      type,
      label: value.name,
      value: value._id,
      key: value._id,
      ...value,
      setting: value.setting,
    }));
  } else {
    return [
      {
        label: '[Relation]',
        value: '',
      },
    ];
  }
};



