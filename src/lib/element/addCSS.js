import { nanoid } from "nanoid";
import { STYLE_STORE_NAME, updateData } from "../db";



const addCSS = async (document, properties, newElement, pageId) => {
    try {
        await createCSS(document, properties || {}, newElement, pageId);
        newElement.style = undefined;

    } catch (e) {
        throw new Error(e?.message);
    }
}


const createCSS = async (document, properties, newElement, pageId) => {

    const styleSheets = document.styleSheets;
    let sheet = null;

    for (let i = 0; i < styleSheets.length; i++) {
        sheet = styleSheets[i];
        if (sheet.ownerNode.id === 'ac-stylesheet-global')
            break;
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
    }
    newElement.styleUid = id;
    await updateData(pageId, style, STYLE_STORE_NAME)


}



export default addCSS;