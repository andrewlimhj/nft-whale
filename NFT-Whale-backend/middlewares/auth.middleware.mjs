const authMiddleware = (request, response, next) => {
  const { isLoggedIn, JWT } = request.cookies;

  if (isLoggedIn) {
    // request.user = user;
    next();
  } else {
    response.status(403).send('User not logged in!');
  }
};

export default authMiddleware;
