import { distinctUntilChanged } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import Store from './store';

export default class Widget {
  constructor(container) {
    this.container = container;
    this.state = null;
    this.store = new Store();
    this.showList = this.showList.bind(this);
  }

  start() {
    this.store.state$.pipe(
      distinctUntilChanged(),
    ).subscribe((value) => {
      while (this.container.firstChild) {
        this.container.removeChild(this.container.firstChild);
      }
      this.showWidget();

      console.log(value.projects);

      this.state = value.projects;
      this.addStats(value.projects);
      value.projects.forEach((elem) => {
        if (elem.isCheck) this.addTasks(elem);
      });
    });
  }

  showWidget() {
    const widget = document.createElement('div');
    widget.classList.add('widget');
    widget.innerHTML = `
      <div class="stats">
        <p class="name">Stats</p>
        <div id="cont-stats" class="container">
            <div class="header">
                <div>Project</div>
                <div>Open</div>
            </div>
        </div>
      </div>
      <div class="tasks">
         <p class="name">Tasks</p>
         <div id="cont-tasks" class="container">
         </div>
      </div>
    `;
    this.container.appendChild(widget);
  }

  addStats(stats) {
    const list = document.createElement('div');
    list.classList.add('stats-list');

    stats.forEach((elem) => {
      const project = document.createElement('div');
      project.classList.add('project');
      const countTasks = elem.tasks.filter((t) => !t.isDone).length;
      project.innerHTML = `
        <div class="project-name">${elem.name}</div>
        <div class="project-tasks"><span>${countTasks}</span></div>
      `;

      list.appendChild(project);
    });
    document.getElementById('cont-stats').appendChild(list);
  }

  addTasks(project) {
    const tasks = document.createElement('div');
    tasks.classList.add('tasks-list');
    const name = document.createElement('div');
    name.classList.add('name');
    name.textContent = `Project: ${project.name}`;
    tasks.appendChild(name);

    project.tasks.forEach((e) => {
      const task = document.createElement('div');
      task.classList.add('task');
      let isDone;
      if (e.isDone) {
        isDone = '&#10004';
      } else {
        isDone = '&#9898';
      }

      task.innerHTML = `
        <div id="${e.id}" class="done">${isDone}</div>  
        <div class="tasks-name">${e.name}</div>
      `;
      tasks.appendChild(task);
    });

    document.getElementById('cont-tasks').appendChild(tasks);
    this.container.querySelector('.tasks-list .name').addEventListener('click', this.showList);
    fromEvent(document.querySelector('.widget'), 'click')
      .subscribe((event) => {
        if (event.target.classList.contains('done')) {
          this.store.check(event.target.id);
        } else if (event.target.classList.contains('project-name')) {
          this.store.choose(event.target.id);
        }
      });
  }

  showList() {
    const list = document.createElement('div');
    list.classList.add('list-projects');
    list.innerHTML = `
      <div class="first">Project: </div> 
      <div class="second"></div> 
    `;
    document.getElementById('cont-tasks').appendChild(list);
    this.state.forEach((elem) => {
      const name = document.createElement('div');
      name.classList.add('project-name');
      name.id = elem.id;
      name.textContent = elem.name;
      if (elem.isCheck) {
        document.querySelector('.first').insertAdjacentElement('beforeend', name);
        name.classList.add('choose');
      } else {
        document.querySelector('.second').insertAdjacentElement('beforeend', name);
      }
    });
  }
}
