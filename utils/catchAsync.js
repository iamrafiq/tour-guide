module.exports = (fn) => {
  /**
   *  fn is async funciton which returns Promise,
   *  if thre is an error inside async function which means Promise gets rejected
   *  when Promise gets rejected we can catch the error by calling function fn.
   */
  /**
   *  express will receive return (req, res, next) function
   * and call it when an user request for a route
   * inside this funciton, funcion fn is called, and function fn is a async fucnion which is waiting for called
   */
  /**
   * every funcion in toure controller with call by route is a middleware
   * so they recive req, res and next
   * when we called next(err), this will skill all other following middleware
   * will trigger error handeling middleware with four arguments (err,res,req,next)
   */
  return (req, res, next) => {
    fn(req, res, next).catch((err) => {
      console.log('CatchAsync: An error caught');
      next(err);
    });
  };
};
