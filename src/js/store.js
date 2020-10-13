import { Subject } from 'rxjs';
import { scan, share, startWith } from 'rxjs/operators';
import Actions from './actions';
import reduce from './reduce';

const initialState = {
  projects: [
    {
      name: 'Rest Backend',
      tasks: [{ name: 'Add Rest Backend', isDone: false, id: '1' }, { name: 'Remove Rest Backend', isDone: false, id: '2' }],
      isCheck: true,
      id: '1',
    },
    {
      name: 'Frontend',
      tasks: [{ name: 'Add Frontend', isDone: false, id: '1' }, { name: 'Remove Frontend', isDone: false, id: '2' }],
      isCheck: false,
      id: '2',
    },
    {
      name: 'Android App',
      tasks: [{ name: 'Add Android App', isDone: false, id: '1' }, { name: 'Remove Android App', isDone: false, id: '2' }],
      isCheck: false,
      id: '3',
    },
    {
      name: 'IOS App',
      tasks: [{ name: 'Add IOS App', isDone: false, id: '1' }, { name: 'Remove IOS App', isDone: false, id: '2' }],
      isCheck: false,
      id: '4',
    },
  ],
};

export default class Store {
  constructor() {
    this.actions$ = new Subject();
    this.state$ = this.actions$.asObservable().pipe(
      startWith({ type: '__INITIALIZATION__' }),
      scan((state, action) => reduce(state, action), initialState),
      share(),
    );
  }

  dispatch(type, payload = null) {
    this.actions$.next({ type, payload });
  }

  check(value = null) {
    this.dispatch(Actions.Check, value);
  }

  choose(value = null) {
    this.dispatch(Actions.Choose, value);
  }
}
