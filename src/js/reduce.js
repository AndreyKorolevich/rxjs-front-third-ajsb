import {Actions} from './actions';

export const reduce = (state, action) => {
  console.log(state)
  switch (action.type) {
    case Actions.Check:
      return {...state, counter: state.counter};
    case Actions.Choose:
      return {
        ...state,
        projects: [
          ...state.projects,
          state.projects[0]: {
            ...state.projects[0],
            isCheck: false
          }
        ]
      };
    default:
      return state;
  }
};
