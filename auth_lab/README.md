# AuthLab — Login, Registration & Logout Virtual Experiment

A guided virtual lab for a Full Stack Development college project. It teaches authentication and sessions through an experiment guide, an interactive flow simulation, and a working Django account flow.

The interface uses Somaiya’s Power Red (`#B7202E`), Vitality Red (`#ED1C24`), grey, and white palette. The Somaiya Vidyavihar logo is included with permission and links to the K J Somaiya School of Engineering website.

## Features

- Virtual lab sections: Aim, Theory, Procedure, Simulation, Observations, Assignment, References, and Feedback
- Interactive JavaScript simulator tracing registration, login, protected-page access, and logout
- Django registration using the built-in `UserCreationForm`
- Django authentication, session management, and a `login_required` profile page
- CSRF-protected POST forms and Django password hashing
- SQLite database for local development

## Run locally

Requires Python 3.10 or newer.

```bash
cd auth_lab
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\\Scripts\\activate
python -m pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

Open <http://127.0.0.1:8000/>. Create an account, view your protected profile, and log out. The simulator can be used without registering.

## Project structure

```text
config/          Django project settings and root URLs
accounts/        Views, URLs, templates, CSS, and JavaScript
 templates/      Shared base layout
```

## Before deployment

This starter configuration is for local development. Set `DEBUG=False`, use a secret key from the environment, configure allowed hosts, and use HTTPS and secure cookie settings before deploying publicly. The feedback form currently provides a confirmation message; it does not persist feedback to the database yet.
