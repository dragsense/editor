

export function isEmpty(value) {

  if (!value)
    return true;

  return Object.keys(value).length === 0
    && value.constructor === Object;
}

export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}


export function debounce(func, wait) {
  let timeoutId;
  return function (...args) {
    const context = this;
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, wait);
  };
}


export function formatDate(dateString, format) {
  const date = new Date(dateString);

  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = new Intl.DateTimeFormat('en-US', options).format(date);

  if (format === 'YYYY-MM-DD') {
    return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3-$1-$2');
  } else if (format === 'MM/DD/YYYY') {
    return formattedDate;
  } else if (format === 'DD/MM/YYYY') {
    return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$2/$1/$3');
  } else if (format === 'YYYY/MM/DD') {
    return formattedDate.replace(/(\d{2})\/(\d{2})\/(\d{4})/, '$3/$1/$2');
  } else if (format === 'Month D, YYYY') {
    const options = { month: 'long', day: 'numeric', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else if (format === 'D MMM, YYYY') {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else if (format === 'MMMM DD, YYYY') {
    const options = { month: 'long', day: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else if (format === 'DD MMM, YYYY') {
    const options = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Intl.DateTimeFormat('en-US', options).format(date);
  } else {
    return formattedDate;
  }
}

export function rgbToHex(color) {
  const hexRegex = /^#(?:[0-9a-fA-F]{3}){1,2}$/; // Regex to match hexadecimal color format
  const rgbRegex = /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/; // Regex to match RGB color format

  // Check if color is already in hexadecimal format
  if (hexRegex.test(color)) {
    return color;
  }

  // Check if color is in RGB format
  const rgbMatch = rgbRegex.exec(color);
  if (rgbMatch) {
    const r = parseInt(rgbMatch[1]);
    const g = parseInt(rgbMatch[2]);
    const b = parseInt(rgbMatch[3]);
    const hexValue = ((r << 16) | (g << 8) | b).toString(16);
    return '#' + ('000000' + hexValue).slice(-6);
  }

  // If color is not in either format, return null
  return null;
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