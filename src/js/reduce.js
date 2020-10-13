import Actions from './actions';

const reduce = (state, action) => {
  console.log(state, action.payload);
  switch (action.type) {
    case Actions.Check:
      return {
        projects: state.projects.map((e) => {
          if (e.id === action.payload[0]) {
            return {
              ...e,
              tasks: e.tasks.map((t) => {
                if (t.id === action.payload[1]) {
                  return {
                    ...t,
                    isDone: !t.isDone,
                  };
                }
                return t;
              }),
            };
          }
          return e;
        }),
      };
    case Actions.Choose:
      return {
        projects: state.projects.map((e) => {
          if (e.id === action.payload) {
            return {
              ...e,
              isCheck: !e.isCheck,
            };
          } if (e.isCheck && e.id !== action.payload) {
            return {
              ...e,
              isCheck: !e.isCheck,
            };
          }
          return e;
        }),
      };
    default:
      return state;
  }
};

export default reduce;
