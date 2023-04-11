import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["input", "results"]

  connect() {
    console.log("Search controller connected")
  }

  search(event) {
    const query = this.inputTarget.value

    if (query.length < 3) {
      this.resultsTarget.innerHTML = ""
      return
    }

    const url = `/posts?search=${encodeURIComponent(query)}&format=html`
    fetch(url)
      .then(response => response.text())
      .then(html => this.resultsTarget.innerHTML = html)
  }
}
