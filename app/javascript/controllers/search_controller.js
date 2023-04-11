// app/javascript/controllers/search_controller.js
import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]
  searchTimer = null;
  wasKeyDown = false;

  connect() {
    console.log("Search controller connected");
    this.inputTarget.addEventListener("input", this.handleInput.bind(this));
    this.inputTarget.addEventListener("blur", this.handleBlur.bind(this));
    this.inputTarget.addEventListener("keydown", this.handleKeyDown.bind(this));
  }

  handleInput(event) {
    const query = this.inputTarget.value.trim();
    if (query.length < 3) {
      this.resultsTarget.innerHTML = "";
      return;
    }

    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const url = `/posts?search=${encodeURIComponent(query)}&format=html`;
      fetch(url)
        .then(response => response.text())
        .then(html => this.resultsTarget.innerHTML = html);
    }, 500);
  }

  handleBlur(event) {
    const query = this.inputTarget.value.trim();
    if (query.length < 3 || this.wasKeyDown) {
      return;
    }

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

  handleKeyDown(event) {
    if (event.key === "Enter") {
      const query = this.inputTarget.value.trim();
      if (query.length < 3) {
        return;
      }

      this.wasKeyDown = true;

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
