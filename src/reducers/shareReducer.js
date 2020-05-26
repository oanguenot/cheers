import { SET_BUBBLE } from "../actions/shareAction";

const initialShareState = {
    bubble: null,
};

const shareReducer = (state = initialShareState, action) => {
    switch (action.type) {
        case SET_BUBBLE:
            return { ...state, bubble: action.payload.bubble };
        default:
            return state;
    }
};

export { shareReducer, initialShareState };
