'use strict';

class Github {
  constructor() {
    this.clientId = 'ef71f8b813962bf9cf27';
    this.clientSecret = '7c80df143bdb8d297a0f3aeb8d651f443dfae729';
  }

  async getUser(userName) {
    const data = await fetch(`https://api.github.com/users/${userName}?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
    const profile = await data.json();
    return profile;
  }

  async getUsersRepos(userName) {
    const data = await fetch(`https://api.github.com/users/${userName}/repos?sort=created&direction=desc&per_page=5&page=1?client_id=${this.clientId}&client_secret=${this.clientSecret}`);
    const repos = await data.json();
    repos.forEach((repo) => {
      console.log(repo.name);
      console.log(repo.url);
      console.log(repo.pushed_at);
    });
    return repos;
  }

}

class UI {
  constructor() {
    this.profile = document.querySelector('.profile');
  }

  showProfile(user) {
    this.profile.innerHTML = `
      <div class="card card-body mb-3">
        <div class="row">
          <div class="col-md-3">
            <img class="img-fluid mb-2" src="${user.avatar_url}">
            <a href="${user.html_url}" target="_blank" class="btn btn-primary btn-block mb-4">View Profile</a>
          </div>
          <div class="col-md-9">
            <span class="badge badge-primary">Public Repos: ${user.public_repos}</span>
            <span class="badge badge-secondary">Public Gists: ${user.public_gists}</span>
            <span class="badge badge-success">Followers: ${user.followers}</span>
            <span class="badge badge-info">Following: ${user.following}</span>
            <br><br>
            <ul class="list-group">
              <li class="list-group-item">Company: ${user.company}</li>
              <li class="list-group-item">Website/Blog: ${user.blog}</li>
              <li class="list-group-item">Location: ${user.location}</li>
              <li class="list-group-item">Member Since: ${user.created_at}</li>
            </ul>
          </div>
        </div>
      </div>
      <h3 class="page-heading mb-3">Latest Repos</h3>
      <div class="repos">
        <ul class="list-group">
          <li class="list-group-item">Name: ${repo.name}, url: ${repo.url}, date: ${repo.pushed_at}.</li>
          <li class="list-group-item">Name: ${repo.name}, url: ${repo.url}, date: ${repo.pushed_at}.</li>
          <li class="list-group-item">Name: ${repo.name}, url: ${repo.url}, date: ${repo.pushed_at}.</li>
          <li class="list-group-item">Name: ${repo.name}, url: ${repo.url}, date: ${repo.pushed_at}.</li>
          <li class="list-group-item">Name: ${repo.name}, url: ${repo.url}, date: ${repo.pushed_at}.</li>
        </ul>     
      </div>
    `
  }

  showAlert(message, className) {
    this.clearAlert();
    const div = document.createElement('div');
    div.className = className;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector('.searchContainer');
    const search = document.querySelector('.search');
    container.insertBefore(div, search);

    setTimeout(() => {
      this.clearAlert();
    }, 2000)
  }

  clearAlert() {
    const alertBlock = document.querySelector('.alert');
    if(alertBlock) {
      alertBlock.remove();
    }
  }

  clearProfile() {
    this.profile.innerHTML = '';
  }
}

const github = new Github;
const ui = new UI;

const debounce = (fn, delay=500) => {
    let timeoutId;

    return (...args) => {
        // cancel the previous timer
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        // setup a new timer
        timeoutId = setTimeout(() => {
            fn.apply(null, args);
        }, delay);
    };
};

const searchUser = document.querySelector('.searchUser');

const getUser = debounce((userText) => {
  github.getUser(userText)
    .then (github.getUsersRepos(userText))
    .then(data => {
	  if(data.message === 'Not Found') {
	  // показувати помилку
	  ui.showAlert('User not found', 'alert alert-danger');
	  } else {
	  ui.showProfile(data);
	  }
    });
});

searchUser.addEventListener('keyup', (e) => {
  const userText = e.target.value;

  if(userText.trim() !== '') {
    getUser(userText);
  } else {
    // очистити інпут пошуку
    ui.clearProfile();
  }
})