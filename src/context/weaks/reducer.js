export const initialState = {
    weeks: [],
    loading: false,
    error: null,
};

export const weeksReducer = (state, action) => {
    switch (action.type) {
        case "WEEKS_LOADING":
            return { ...state, loading: true, error: null };

        case "WEEKS_SUCCESS":
            return { ...state, loading: false, weeks: action.payload };

        case "WEEKS_ERROR":
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
