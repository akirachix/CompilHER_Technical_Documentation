# Project Setup (Mobile Application)

This explains how the project was started, how to run the mobile application, how to clone the repository, how to install the required packages, how to create the initial boilerplate, and how the code is organized.

The project contains two primary user-facing areas:

| Area                                | Purpose                                                                                                            |
| :---------------------------------- | :----------------------------------------------------------------------------------------------------------------- |
| **Mobile App (Ranger Portal)**      | Provides on-duty field rangers with localized maps, assigned patrol sectors, and incident reporting toolkits.      |
| **Mobile App (Settings & Profile)** | Allows rangers to manage authentication state, adjust push alert parameters, and modify secure access credentials. |

---

## Install the required tools

Install Git, Flutter SDK, and Android Studio, and confirm that the tools are available before continuing.

| Package Installation / Setup         | Confirm Installation |
| :----------------------------------- | :------------------- |
| **Flutter SDK installation**         | `flutter --version`  |
| **Environment configuration doctor** | `flutter doctor`     |

### Setup command summary

| Step               | Command                          | Result                                          |
| :----------------- | :------------------------------- | :---------------------------------------------- |
| Clone              | `git clone repository-url`       | Downloads the repository                        |
| Enter repository   | `cd COMPIL-HER_MOBILE/tahadhari` | Sets the working directory                      |
| Install packages   | `flutter pub get`                | Installs dependencies                           |
| Create boilerplate | `flutter create .`               | Creates the initial Flutter structure           |
| Start development  | `flutter run`                    | Runs the app on a connected emulator or device. |

## Main Directory Structure

### Mobile Application (Flutter Architecture)

```text
tahadhari/
├── ios/
├── lib/
│   ├── models/
│   │   ├── auth_exception.dart
│   │   ├── login_response.dart
│   │   ├── report.dart
│   │   ├── token_response.dart
│   │   └── user.dart
│   ├── screens/
│   │   ├── home/
│   │   ├── login/
│   │   │   ├── forgot_password.dart
│   │   │   ├── login.dart
│   │   │   ├── redirect.dart
│   │   │   └── sign_up.dart
│   │   ├── reports/
│   │   │   ├── first_screen.dart
│   │   │   └── second_screen.dart
│   │   ├── set_password/
│   │   ├── settings/
│   │   ├── view_assignment/
│   │   └── camera.dart
│   ├── services/
│   ├── view_model/
│   └── main.dart
└── linux/
```

## Ranger Onboarding Flows

### 1. Ranger Onboarding via Invitation (Android App)

- **Onboarding Workflow:**
  1. **Admin Creation:** The Commander creates the Ranger profile from the backend panel using the Ranger's initial email and a temporary baseline password.

### API Endpoint:

  ```http
     POST /api/v1/users/register

  ```

### Sample request

```json
{
  "first_name": "string",
  "last_name": "string",
  "role": "Ranger",
  "email": "user@example.com",
  "phone": "stringstri",
  "password": "stringst"
}
```

2. **Invitation Link:** The system sends an activation link containing a verification token to the Ranger.

### Sample request

```json
{
  "token": "stringstringstringstringstringstringstri",
  "new_password": "stringst"
}
```

3. **First-Time Sign-In:** The Ranger enters the link and their pre-configured email and the temporary password provided by the Commander to verify identity.

![First-Time Sign-In Screen](assets/signIn/s5.png), ![First-Time Sign-In Screen](assets/signIn/s3.png)

4. **Password Reset Force:** Upon successful validation, the app forces a redirection to a secure password modification screen.

![Password Modification Screen](assets/signIn/s4.png)

## 2. Authentication & Security

### A. Login User

```http
POST /api/v1/users/login
```

#### Sample Request:

```json
{
  "email": "user@example.com",
  "password": "Password123@"
}
```

#### Sample Response:

```json
{
  "message": "Login initiated. MFA code required.",
  "mfa_token": "mfa_stage_token_abc123"
}
```

---

### B. Verify Login MFA

```http
POST /api/v1/users/login/mfa
```

#### Sample Request:

```json
{
  "mfa_token": "mfa_stage_token_abc123",
  "code": "123456"
}
```

#### Sample Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsIn...",
  "refresh_token": "rfr_eyJhbGciOiJIUzI1NiIsIn...",
  "expires_in": 3600
}
```

---

### C. Refresh Login Session

```http
POST /api/v1/users/refresh
```

#### Sample Request:

```json
{
  "refresh_token": "rfr_eyJhbGciOiJIUzI1NiIsIn..."
}
```

#### Sample Response:

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInNew...",
  "expires_in": 3600
}
```

---

### D. Logout User

```http
POST /api/v1/users/logout
```

#### Sample Request Headers:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsIn...
```

#### Sample Response (200 OK):

```json
{
  "status": "success",
  "message": "Session successfully terminated."
}
```

---

### E. Change My Password

```http
PATCH /api/v1/users/me/change-password
```

##### Sample Request:

```json
{
  "old_password": "CurrentPassword123!",
  "new_password": "BrandNewPassword456!"
}
```

---

## 4. First Steps After Login

- **Rangers:**
  - View the assigned patrol areas directly on the dashboard map allocated by the Commander.

  ![First-Time Sign-In Screen](assets/signIn/map1.png), ![First-Time Sign-In Screen](assets/signIn/map2.png)

  ![First-Time Sign-In Screen](assets/signIn/report1.png), ![First-Time Sign-In Screen](assets/signIn/report2.png)


  - Access and fill out field incident or completion reports upon concluding a patrol assignment.
  ![First-Time Sign-In Screen](assets/signIn/settings.png)
