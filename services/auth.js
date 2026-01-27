async function register(email, password) {
  const user = await User.create({ email, password });
  return user;
}

async function login(email, password) {
  const user = await User.findOne({ email });
  return user;
}

module.exports = { register, login };