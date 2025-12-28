/**
 * Wraps an asynchronous function to catch any errors and pass them to the next middleware.
 * This eliminates the need for try-catch blocks in every controller.
 * @param {Function} fn - The async function to wrap
 * @returns {Function} - A new function that handles the error catching
 */
export default (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
};
