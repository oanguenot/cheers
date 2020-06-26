import { SET_BUBBLE } from "../actions/bubbleAction";

const initialBubbleState = {
    bubble: null,
};

const bubbleReducer = (state = initialBubbleState, action) => {
    console.log(`model::reduce ${action.type}`);

    switch (action.type) {
        case SET_BUBBLE:
            return { ...state, bubble: action.payload.bubble };
        default:
            return state;
    }
};

export { bubbleReducer, initialBubbleState };
