export const initialState = {
    user: null,
    loading: false,
    error: null,
};

export const userReducer = (state, action) => {
    switch (action.type) {
        case "AUTH_LOADING":
            return { ...state, loading: true, error: null };

        case "AUTH_SUCCESS":
            return { ...state, loading: false, user: action.payload, error: null };

        case "AUTH_ERROR":
            return { ...state, loading: false, error: action.payload };

        case "AUTH_LOGOUT":
            return { ...state, user: null, error: null };

        case "AUTH_CLEAR_ERROR":
            return { ...state, error: null };

        default:
            return state;
    }
};
