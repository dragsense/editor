import { message } from 'antd';

export const getStateValue = (key, states) => {
  let defaultValue = "";

  try {


    if (!states)
      return defaultValue;

    let stateRef = states[key[0]];

    if (!stateRef)
      return defaultValue;


    if (stateRef.type == 'image') {
      defaultValue = {
        value: stateRef.src ? stateRef.src.src : './images/default/default-img.png',
        label: stateRef.src?.alt || 'image'
      }
    }
    else
      if (stateRef.type == 'video') {
        defaultValue = {
          value: stateRef.src ? stateRef.src.src : './images/default/default-poster.png',
          label: stateRef.src?.alt || 'video', srcs: stateRef.srcs
        }
      } else
        if (stateRef.type == 'audio') {
          defaultValue = {
            value: './audios/default/sample.mp3', srcs: stateRef.srcs
          }
        }
        else
          if (stateRef.type == 'images') {
            if (key[1] && stateRef.states) {
              const index = Number(key[1]) !== NaN ? Number(key[1]) : -1;
              defaultValue = (stateRef.states[index] !== undefined ? stateRef.states[index].src : "")
              if (stateRef.states[index] !== undefined) {
                const value = stateRef.states[index]
                defaultValue = {
                  value: value.src || './images/default/default-img.png',
                  label: value.alt || 'image'
                }
              }
            }
          } else
            if (stateRef.type == 'array') {
              if (key[1] && stateRef.states) {
                const index = Number(key[1]) !== NaN ? Number(key[1]) : -1;
                if (stateRef.states[index] !== undefined) {
                  const value = stateRef.states[index].value?.split(":")
                  defaultValue = {
                    value: value[0],
                    label: value[1] || value[0]
                  }
                }
              }
            }
            else
              if (stateRef.type == 'object') {

                defaultValue = getStateValue([key[1]], stateRef.states)


              } else
                defaultValue = (stateRef.defaultValue !== undefined ? stateRef.defaultValue : "");


  } catch (e) {
    message.error("Some thing went wrong.");
  }

  return defaultValue;

}

export const getStateStates = (key, states) => {
  let values = [];

  try {

    if (!states)
      return values;

    const value = states[key[0]];
    if (!value)
      return values;

    // if (value.type == 'arraylength') {
    //   const defaultValue = (value.defaultValue !== undefined ? value.defaultValue : 0);
    //   values = Array.from({ length: parseInt(defaultValue) }, (_, index) => {
    //     return { label: `${value.text || "Item"} ${index}`, value: index }
    //   })
    // }


    if (value.type == 'array') {
      values = Object.values(value.states).flatMap((value, index) => {
        const v = value;
        const val = v.value.split(":");
        return { label: val[0], value: val[1] ? val[1] : v.idx }
      })
    }

    if (value.type == 'images') {
      values = Object.values(value.states).map((value) => {
        return { label: value.alt, value: value.src }
      })
    }



  } catch (e) {
    message.error("Some thing went wrong.");
  }

  return values;

}

export const getStateRef = (key, states) => {

  if (!states)
    return undefined;

  let value = states[key[0]];
  return value;
}



export const updateStateValue = (elem, withValue, states, value, updateKey = "defaultValue") => {


  const key = elem.key;
  const expression = elem.value;



  let stateRef = getStateRef(key, states);

  if (!stateRef)
    return false;

  try {

    let val = '';

    if (expression) {
      let orignal = expression.replace(/\[withkey]/g, withValue);
      orignal = orignal.replace(/\[value]/g, value);
      orignal = orignal.replace(/\[key]/g, stateRef.defaultValue);
      val = eval(orignal);
    } else
      val = value;

    if (val >= stateRef.max && updateKey !== 'max')
      val = stateRef.max;
    else
      if (val <= stateRef.min && updateKey !== 'min')
        val = stateRef.min;


    // if (stateRef.type == 'array')
    //   val = val.split(',')

    if (key[1])
      stateRef.states[key[1]] = val;
    else
      stateRef[updateKey] = val;

  } catch (e) {
    message.error(e.message);
  }



}



export const generateCascader = (elementStates, type, value) => {



  const states = Object.values(elementStates).map(state => {
    let children = null;
    if (state.states) {
      state.type = state.type || 'array';
      children = Object.keys(state.states).map((key, index) => {
        return {
          label: key.toUpperCase(), value: key
        }
      });
    } else
      children = undefined;

    return {
      label: state.key.toUpperCase(), value: state.key, type: state.type, children
    }
  });

  return [{ label: type, value: value, type: type, children: states }]
}

export const generateCascaderCollStates = (elementStates, type, value) => {

  const states = Object.entries(elementStates).map(([key, value]) => {
    let children = null;
    const state = { key: key.toUpperCase(), value: key }
    if (key == 'documents') {
      state.type = 'array';
    }
    if (key == 'states') {
      return generateCascader(value, 'STATES', key)[0];
    }

    return {
      label: state.key.toUpperCase(), value: state.value, type: state.type, children
    }
  });

  return [{ label: type, value: value, type: type, children: states }]
}


export const getPaginationRange = (currentPage, totalPages, pagination) => {
  let leftRangeLength = pagination.leftRange || 1;
  let rightRangeLength = pagination.rightRange || 1;
  const rangeSize = pagination.nearRange || 2;

  const dots = pagination.dots || "...";

  let start = Math.max(currentPage - rangeSize, 1);
  let end = Math.min(currentPage + rangeSize, totalPages);




  if (leftRangeLength > totalPages) {
    leftRangeLength = totalPages;
    rightRangeLength = 0;
  }

  if (rightRangeLength + leftRangeLength > totalPages) {
    rightRangeLength = totalPages - leftRangeLength;
  }


  if (start === 1) {
    end = Math.min(start + rangeSize * 2, totalPages);
  } else if (end === totalPages) {
    start = Math.max(end - rangeSize * 2, 1);
  }

  const leftRange = [];
  const rightRange = [];

  for (let i = 1; i <= leftRangeLength; i++) {
    leftRange.push(i);
  }

  if (start > leftRangeLength + 1) {
    leftRange.push(dots);
  }

  if (end < totalPages - rightRangeLength) {
    rightRange.push(dots);
  }

  for (let i = totalPages - rightRangeLength + 1; i <= totalPages; i++) {
    rightRange.push(i);
  }

  const nearbyRange = [];

  const startIndex = start > leftRangeLength ? start : leftRangeLength + 1;

  const endIndex = end < totalPages - rightRangeLength + 1 ? end : end - rightRangeLength;
  for (let i = startIndex; i <= endIndex; i++) {
    nearbyRange.push(i);
  }

  return [...leftRange, ...nearbyRange, ...rightRange];
};

