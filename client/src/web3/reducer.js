export const Web3Reducer = (state, action) => {
    console.log("entro");
    switch (action.type) {
        case "SET_LOADING":
            console.log("SET_LOADING");
            return {
                ...state,
                loading: action.payload,
            };
        case "SET_NETWORK_ID":
            console.log("SET_NETWORK_ID");
            return {
                ...state,
                networkId: action.payload,
            };
        case "SET_CONTRACTS":
            console.log("SET_CONTRACTS");
            return {
                ...state,
                contracts: action.payload,
            };
        case "SET_ACCOUNT":
            console.log("SET_ACCOUNT");
            return {
                ...state,
                account: action.payload,
            };
        case "CLEAR_STATE":
            console.log("CLEAR_STATE");
            return action.payload;
        default:
            console.log("default");
            return state;
  }
};
