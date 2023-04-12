import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]

  searchTimer = null;
  wasKeyDown = false;
  eventListenersAdded = false;
  prevQuery = null;

  connect() {
    // add event listeners for input, blur, and keydown events
    if (!this.eventListenersAdded) {
      this.inputTarget.addEventListener("input", this.handleInput.bind(this));
      this.inputTarget.addEventListener("blur", this.handleBlur.bind(this));
      this.inputTarget.addEventListener("keydown", this.handleKeyDown.bind(this));
      this.eventListenersAdded = true;
    }
  }

  // handle input event
  handleInput(event) {
    event.preventDefault();
    const query = this.inputTarget.value.trim();
    // check if the current query matches the previous one
    if (query === this.prevQuery) {
      return;
    }
    // update previous query
    this.prevQuery = query;

    // fetch posts if query length is less than 3 characters
    if (query.length < 3) {
      this.fetchPosts();
      return;
    }

    clearTimeout(this.searchTimer);
    // wait 500ms before fetching posts
    this.searchTimer = setTimeout(() => {
      const url = `/posts?search=${encodeURIComponent(query)}&format=html`;
      fetch(url)
        .then(response => response.text())
        .then(html => {
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, "text/html");
          const posts = doc.querySelectorAll('.card');
          // clear previous results and add new results
          this.resultsTarget.innerHTML = '';
          posts.forEach((post) => {
            this.resultsTarget.insertAdjacentHTML('beforeend', post.outerHTML);
          });
        });
    }, 500);
  }

  // handle blur event
  handleBlur(event) {
    const query = this.inputTarget.value.trim();
    if (query.length < 3 || (this.wasKeyDown && this.lastQuery === query)) {
      return;
    }
    this.wasKeyDown = true;
    this.lastQuery = query;
  
    const searchUrl = `/search_analytics`;
    const token = document.querySelector("[name=csrf-token]").content;
    fetch(searchUrl, {
      method: "POST",
      body: JSON.stringify({ query }),
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-Token": token,
      },
      credentials: "same-origin",
    });
  }

  // fetch all posts
  fetchPosts() {
    const url = "/posts?format=html";
    fetch(url)
      .then(response => response.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, "text/html");
        const posts = doc.querySelectorAll('.card');
        // clear previous results and add new results
        this.resultsTarget.innerHTML = '';
        posts.forEach((post) => {
          this.resultsTarget.insertAdjacentHTML('beforeend', post.outerHTML);
        });
      });
  }

  // handle keydown event
  handleKeyDown(event) {
    if (event.key === "Enter") {
      const query = this.inputTarget.value.trim();
      // do not record query if length is less than 3 characters or if it was already recorded
      if (query.length < 3 || (this.wasKeyDown && this.lastQuery === query)) {
        return;
      }
      // set wasKeyDown to true and lastQuery to the current query
      this.wasKeyDown = true;
      this.lastQuery = query;

      // send query to the server to record it
      const searchUrl = `/search_analytics`;
      const token = document.querySelector("[name=csrf-token]").content;
      fetch(searchUrl, {
        method: "POST",
        body: JSON.stringify({ query }),
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-Token": token,
        },
        credentials: "same-origin",
      });
    }
  }
}
