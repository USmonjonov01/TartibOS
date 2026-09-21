export const initialState = {
    goals: [],
    loading: false,
    error: null,
};

export const goalReducer = (state, action) => {
    switch (action.type) {
        case "GOAL_LOADING":
            return { ...state, loading: true, error: null };
        case "GOAL_SUCCESS":
            return { ...state, loading: false, goals: action.payload };
        case "GOAL_RESET":
            return initialState;
        case "GOAL_ERROR":
            return { ...state, loading: false, error: action.payload };
        default:
            return state;
    }
};