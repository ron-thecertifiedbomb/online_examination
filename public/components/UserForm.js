// UserForm.js
class UserForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute("title") || "User Form";

    this.shadowRoot.innerHTML = `
      <style>
        /* Container styles */
        form {
          display: flex;
          flex-direction: column;
          gap: 1em;
          max-width: 400px;
          margin: 2em auto;
          padding: 1.5em;
          border: 1px solid #dee2e6;
          border-radius: 0.5em;
          background-color: #f8f9fa;
          font-family: 'PT Sans', sans-serif;
        }

        h2 {
          margin-bottom: 1em;
          font-size: 1.75rem;
          color: #2b2d42;
          text-align: center;
        }

        label {
          font-size: 1rem;
          margin-bottom: 0.25em;
          color: #333;
        }

        input {
          padding: 0.5em;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 0.25em;
          width: 100%;
        }

        button {
          padding: 0.75em;
          font-size: 1rem;
          background-color: #06d6a0;
          color: #fff;
          border: none;
          border-radius: 0.25em;
          cursor: pointer;
          transition: background-color 0.2s ease;
        }

        button:hover {
          background-color: #05b385;
        }
      </style>

      <form>
        <h2>${title}</h2>
        <label for="name">Name</label>
        <input type="text" id="name" name="name" placeholder="Enter your name" required />

        <label for="email">Email</label>
        <input type="email" id="email" name="email" placeholder="Enter your email" required />

        <button type="submit">Submit</button>
      </form>
    `;

    // Optional: handle form submission
    const form = this.shadowRoot.querySelector("form");
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = this.shadowRoot.querySelector("#name").value;
      const email = this.shadowRoot.querySelector("#email").value;
      console.log("Form submitted:", { name, email });

      alert(`Form submitted:\nName: ${name}\nEmail: ${email}`);
      form.reset();
    });
  }
}

// Define the custom element
customElements.define("csl-user-form", UserForm);
