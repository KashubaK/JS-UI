# Rendering elements

## Login form example

```ts
import { parent, App, View } from 'js-ui';
import { div, h1, form, input, label, button } from 'js-ui/elements';

const app = new App('#root', LoginCardView);

class LoginCardView implements View {
  username = '';
  password = '';

  loading = false;
  failed = false;
  success = false;

  constructor() {
    const proxy = new Proxy()

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleUserChange(e: ChangeEvent<HTMLInputElement>): void {
    this.username = e.target.value;
  }

  handlePasswordChange(e: ChangeEvent<HTMLInputElement>): void {
    this.password = e.target.value;
  }

  async handleFormSubmit(event: SubmitEvent): Promise<void> {
    this.failed = false;
    this.success = false;
    this.loading = true;

    const response = await fetch('/user/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username: this.username, password: this.password }),
    });

    this.loading = false;

    const user = (await response.json()).user;

    if (!user) {
      this.failed = true;
      return;
    }

    this.success = true;
  }

  heading = h1(() => {
    let content = `Hello, ${this.username}!`;

    if (this.loading) content = 'Pushing bits...';
    if (this.failed) content = 'Try again.';
    if (this.success) content = 'Welcome!';

    return { innerText: content };
  });

  usernameInput = input(() => ({ value: this.username, onchange: this.handleUserChange })),
  usernameField = parent(
    div({ className: 'Field' }),
    [
      label('Username'),
      this.usernameInput,
    ],
  );

  passwordInput = input(() => ({ value: this.password, onchange: this.handlePasswordChange }));
  passwordField = parent(
    div({ className: 'Field' }),
    [
      label('Password'),
      this.passwordInput,
    ],
  );

  loginForm = parent(
    form({ onsubmit: this.handleFormSubmit }),
    [this.usernameField, this.passwordField, button('Submit', { type: 'submit' })],
  );

  render() {
    return (
      parent(
        div({ class: 'FormContainer' }),
        [
          this.heading,
          this.form,
        ],
      )
    );
  }
}