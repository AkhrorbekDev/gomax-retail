const TokenKey = "auth_token";
const UserName = "auth_user_name";
const UserRole = "auth_user_role";
const UserShop = "auth_user_shop";
const ClientId = "retail_client_id";
const ClientName = "retail_client_name";

const auth = {
  getToken: () => {
    return localStorage.getItem(TokenKey);
  },

  getName: () => {
    return localStorage.getItem(UserName);
  },

  getRole: () => {
    return localStorage.getItem(UserRole);
  },

  getClientName: () => {
    return localStorage.getItem(ClientName);
  },

  getShop: () => {
    return localStorage.getItem(UserShop);
  },

  getClientId: () => {
    return localStorage.getItem(ClientId);
  },

  setToken: token => {
    return localStorage.setItem(TokenKey, token);
  },

  setRole: role => {
    return localStorage.setItem(UserRole, role);
  },

  setClientData: data => {
    localStorage.setItem(ClientId, data.id);
    localStorage.setItem(ClientName, data.name);
  },

  setName: name => {
    // localStorage.setItem(ClientId, data.id);
    localStorage.setItem(UserName, name);
  },

  setShop: shop => {
    return localStorage.setItem(UserShop, shop);
  },
  removeClientData: () => {
    localStorage.removeItem(ClientId);
    return localStorage.removeItem(ClientName);
  },

  clearStorge: () => {
    localStorage.clear();
  }
};

export default auth;
