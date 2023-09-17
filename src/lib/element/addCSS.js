import { nanoid } from "nanoid";
import { STYLE_STORE_NAME, updateData } from "../db";

/**
 * Add CSS rules for a new element to the global stylesheet.
 *
 * @param {Document} document - The document object.
 * @param {object} properties - The CSS properties to add.
 * @param {object} newElement - The new element to apply styles to.
 * @param {string} pageId - The ID of the page.
 */
const addCSS = async (document, properties, newElement, pageId) => {
    try {
        await createCSS(document, properties || {}, newElement, pageId);
        // Clear the style property to avoid potential memory leaks.
        newElement.style = undefined;
    } catch (e) {
        throw new Error(e?.message);
    }
};

/**
 * Create CSS rules and add them to the global stylesheet.
 *
 * @param {Document} document - The document object.
 * @param {object} properties - The CSS properties to add.
 * @param {object} newElement - The new element to apply styles to.
 * @param {string} pageId - The ID of the page.
 */
const createCSS = async (document, properties, newElement, pageId) => {
    const styleSheets = document.styleSheets;
    let sheet = null;

    // Find the global stylesheet by its ID.
    for (let i = 0; i < styleSheets.length; i++) {
        sheet = styleSheets[i];
        if (sheet.ownerNode.id === 'ac-stylesheet-global') {
            break;
        }
    }

    let cssRules = sheet.cssRules || sheet.rules;

    let cssText = '';
    for (const property in properties) {
        if (properties.hasOwnProperty(property)) {
            const value = properties[property].value;
            cssText += `${property}: ${value}; `;
        }
    }

    const selectorText = newElement.selector;
    newElement.style = undefined;

    // Insert the new CSS rule into the stylesheet.
    sheet.insertRule(`${selectorText} {${cssText}}`, cssRules.length);

    const id = nanoid(8);
    const style = {
        _uid: id,
        selectorText,
        type: newElement.tagName,
        style: {
            ['normal']: {
                ["root"]: {
                    properties
                }
            }
        }
    };
    newElement.styleUid = id;

    // Update the page's style data.
    await updateData(pageId, style, STYLE_STORE_NAME);
};

export default addCSS;
