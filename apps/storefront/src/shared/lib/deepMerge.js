/**
 * Simple deep merge for configuration objects
 * @param {Object} target - The base object (fallback)
 * @param {Object} source - The overlay object (API or Mock data)
 * @returns {Object} A new merged object
 */
export const deepMerge = (target, source) => {
  if (!source) return target;
  
  const output = { ...target };
  
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach(key => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, { [key]: source[key] });
        } else {
          output[key] = deepMerge(target[key], source[key]);
        }
      } else if (source[key] !== null && source[key] !== undefined) {
        Object.assign(output, { [key]: source[key] });
      }
    });
  }
  
  return output;
};

function isObject(item) {
  return (item && typeof item === 'object' && !Array.isArray(item));
}
