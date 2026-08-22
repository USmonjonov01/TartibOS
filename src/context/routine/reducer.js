export const initialState = {
    routines: [],
    loading: false,
    error: null,
};

export const routineReducer = (state, action) => {
    switch (action.type) {
        case "ROUTINE_LOADING":
            return { ...state, loading: true, error: null };

        case "ROUTINE_SUCCESS":
            return { ...state, loading: false, routines: action.payload };

        case "ROUTINE_ERROR":
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
