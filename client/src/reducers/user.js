export const CLEAR_USER = "CLEAR_USER";
export const SET_USER = "SET_USER";

const clearUser = () => ({ type: CLEAR_USER });

const setUser = (id, email, password) => ({
  type: SET_USER,
  user: { id, email, password },
});

export const handleLogOut = () => {
  return (dispatch) => {
    dispatch(clearUser());
    localStorage.removeItem("token");
  };
};

export const handleLogIn = async (email, password) => {
  return (dispatch) => {
    const res = await logIn(email, password);

    if (res) {
      console.log(setUser(res.user.id, email, password));

      dispatch(setUser(res.user.id, email, password));
      localStorage.setItem("token", res.token);
    }
  };
};

export const handleSignUp = async (email, password) => {
  return (dispatch) => {
    const res = await createAccount(email, password);

    if (res) {
      dispatch(setUser(res.user.id, email, password));
      console.log(user);
      localStorage.setItem("token", res.token);
    }
  };
};

export const userReducer = (user, action) => {
  switch (action.type) {
    case CLEAR_USER:
      return {};

    case SET_USER:
      return action.user;

    default:
      return {};
  }
};

export const UserContext = React.createContext();




