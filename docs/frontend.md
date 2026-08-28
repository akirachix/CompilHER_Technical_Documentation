## Project Setup

This explains how the project was started, how to run the informational website and dashboard, how to clone the repository, how to install the required packages, how to create the initial boilerplate, how the code is organized.

The project contains two primary user-facing areas:

| Area                      | Purpose               |
| ----------                | --------------------- |
| Informational website     | Presents the project purpose features and public information           |
|Dashboard                  | Provides authenticated commanders access to application data and management features                 |

### Install the required tools

Install Git, Node.js, and npm and confirm that the tools are available before continuing.


| Package installation      |  Confirm Installation             |
| ----------                | --------------------- |
| npm install     | npm --version          |
|node install     |  node --version                 |

### Clone the repository
```bash
git clone https://github.com/akirachix/-Compil-HER_Informational_Website.git
git clone https://github.com/akirachix/Compil-HER_Dashboard.git
```
### Move into the project folder
```bash
cd Compil-HER_Dashboard
cd -Compil-HER_Informational_Website
```

### Install project dependencies
Install all packages listed in package.json.
```bash
npm install
```
### Create the boilerplate for the project
The boilerplate provides the initial application entry point, source directory, build configuration, and package scripts. 
```bash
npm create next-app@latest Compil-HER_Dashboard
npm create next-app@latest -Compil-HER_Informational_Website

```

### Setup command summary

|  Step | Command | Result |
| -------- | -------- | -------- |
| Clone | git clone repository-url | Downloads the repository|
| Enter repository| cd project-folder |Sets the working directory|
| Install packages | npm install | Installs dependencies|
| Create boilerplate |npm create next-app@latest <folder-name> | Creates the initial React structure|
| Start development | npm run dev | Runs the local development server.|

## Code Structure
### Overview
The application is organized by responsibility. 

 **Core Configuration Files**

* *package.json*: Manages project dependencies and scripts.eslint.
* *config.mjs*: Configures linting rules to maintain code quality
* *..gitignore*: Specifies files and folders for Git to ignore.
* *env.local* : Stores local environment variables securely.

 **Shared Directories**

* *components*: Houses reusable UI building blocks shared across different pages.

* *public*: Stores static assets such as images, logos, and custom fonts.
* *node_modules*: Contains all installed third-party npm packages.

**The root Directory**

This folder handles the application's routing, layouts, and global styles.

* *layout.jsx & page.jsx*: The main entry points defining the global layout and the landing/home page of the site.
* *globals.css*: Contains global styles applied across the entire application.

### Main directory Structure

**Dashboard**
```text
app/
├── (Auth)/
│   └── login/
│       ├── login.css
│       └── page.jsx
├── dashboard/
│   ├── data-analytics/
│   │   ├── data-analytics.css
│   │   ├── incident-distribution.jsx
│   │   ├── incidents-area.jsx
│   │   ├── incidents-trend.jsx
│   │   └── page.jsx
│   ├── home-page/
│   │   ├── home-page.css
│   │   └── page.jsx
│   ├── HotSpot-Prediction/
│   │   ├── Hotspot-Prediction.css
│   │   └── page.jsx
│   ├── incident-report/
│   │   ├── incident.css
│   │   └── page.jsx
│   ├── manage-rangers/
│   │   ├── manage-rangers.css
│   │   └── page.jsx
│   ├── patrol-logs/
│   │   ├── page.jsx
│   │   └── patrol-logs.css
│   ├── settings/
│   │   ├── change-pass.jsx
│   │   ├── notification.jsx
│   │   ├── page.jsx
│   │   ├── preferences.jsx
│   │   └── settings.css
│   ├── layout.css
│   ├── layout.jsx
│   └── page.jsx
├── favicon.ico
├── globals.css
├── layout.jsx
└── page.jsx
```
---


**Informational Website**
```text
├── public/              # Static assets (images, icons)
├── src/
│   ├── components/      # Reusable layout UI blocks
│   │   ├── Navbar.jsx   # Global responsive navigation header
│   │   ├── Footer.jsx   # Global navigation and resource footer
│   │   └── Card.jsx     # Reusable layout blocks for services and teams
│   ├── pages/           # Application entry points and route mappings
│   │   ├── index.jsx    # Home view
│   │   ├── about.jsx    # Project background and team profile view
│   │   └── services.jsx # Detailed system service breakdowns
│   └── styles/          # Global stylesheets and Tailwind configurations

```
---

### Environment variables
A **.env** file is used to **store sensitive data and configuration settings** outside of the main source code. It keeps private credentials like database passwords, API keys and encryption secrets out of the source code so they aren't accidentally shared or pushed to public repositories like GitHub.

It allows you to easily change settings depending on where the app is running without changing the code itself. The file is named .env.local. Next.js automatically detects this file and loads its variables into process.env. This file is automatically ignored by Git  so the private keys remain safe on your local machine.

## Informational Website
### 1. Landing Page

Introduces the project and directs visitors to the main areas of the website.

### 2. Services

Explains the services provided by the project.

### 3. About Us

Presents background information about the project and its team or organization.


## Dashboard
### 1. Commander Login
Authenticates commanders before they access dashboard features.

**Sample Request**
```
{
    "email": "admin12@example.com",
    "password" : "Password123@"
}
```

![Login Screen](assets/frontend-web/login.png)


**Sample Response**
```
{
    "code": 123456,
    "mfa_token": "afeghftsesatuyrtd:vghxgxz:rwdytyfhfx"
}
```

![mfa Screen](assets/frontend-web/mfa.png)


**Sample Response**
```
{
    "access_token": "ERQWEFHGCE:VCFDXZC:GRATHGF",
    "role": "Commander"
}
```


### 2. Ranger Onboarding
After successful authentication, the application redirects the commander to the dashboard.
The commander can add or register rangers and records their onboarding information.

![ranger onboarding Screen](assets/frontend-web/manage.png)

### 3. View Hotspot grids
Displays hotspot grid information for monitoring and operational planning. The sqaures are gridded by 1km. 

![hotspot Screen](assets/frontend-web/route.png)

### 4. Patrol route assignment
Assigns patrol routes to rangers or patrol teams based on risk levels and priority.

![route Screen](assets/frontend-web/grid.png)

### 5. View Reports
The commander is able to view reports submitted by rangers. Filter by date, severity and status.

![reports Screen](assets/frontend-web/logs.png)

![reports Screen](assets/frontend-web/reports.png)

### 5. View KPIs
Displays key performance indicators used to monitor project performance.

![dashboard Screen](assets/frontend-web/dashbaord.png)


## Website and dashboard distinction

|  Feature | Informational website | Dashboard |
| -------- | -------- | -------- |
| Main purpose| Explains the project and its features | Provides application functionality|
| Access| Public |Requires authentication|
| Layout |Website navigation and marketing content | Sidebar, header, and application content|
| Data |General public information| User-specific and restricted data|

## Code Standards
* **Components**: Always use functional components for consistency and performance.
* **Naming**:
camelCase for variables and functions
PascalCase for component names
SCREAMING_SNAKE_CASE for constants
* **Files**: One component per file. Group by feature/module for maintainability.
* **Testing**: Use Jest, playwright and React Testing Library for unit tests; add tests for each new component or logic.
**Styling**: Tailwind CSS only. Avoid inline styles unless absolutely necessary.
* **Accessibility**: All UI should meet WCAG AA standards. Use semantic HTML and aria attributes.

