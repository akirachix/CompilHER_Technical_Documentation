# Frontend Mobile Documentation (Tahadhari App)

## 1. Overview

The `tahadhari` mobile client application is a utility built to serve as the critical edge runtime environment for security personnel operating within field sectors. 

### A. Target Audience & Persona
The application is engineered exclusively for **Field Rangers**. It addresses isolated, high-risk operational environments where low-bandwidth data transport or intermittent cellular connectivity often isolates teams from active operational hubs.

### B. Core Functional Capabilities

* **Live Patrol Maps**: Shows the exact patrol areas given to the Ranger by the Commander.
* **Easy Incident Reporting**: A simple, screen-by-screen form to fill out after finishing a patrol.
* **Secure Photo Uploads**: Uses the phone camera to snap and attach evidence pictures directly to the report.


## 2. Project Setup 

This explains how the project was started, how to run the mobile application, how to clone the repository, how to install the required packages, how to create the initial boilerplate, and how the code is organized.

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



# Project structure

The Tahadhari mobile application is built using Flutter to interact with the backend control panel using the Web API. The core architectural blocks and the pathways governing user movement across application contexts are mapped out in the structural trace below:

```text
  ┌────────────────┐
  │   Auth Flow    │
  └───────┬────────┘
          │
          ▼
  ┌────────────────┐
  │  Login Screen  │◄────────┐ (Invalid State / First Time)
  └───────┬────────┘         │
          │                  │
          ▼ (Valid Token)    │
  ┌────────────────┐         │
  │   Navigation   ├─────────┤ (Session Termination)
  └───────┬────────┘         │
          │                  │
          ├──────────────────┼──────────────────┐
          │                  │                  │
          ▼                  ▼                  ▼
  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐
  │   Home Map   │   │ Report Flow  │   │  Settings    │
  │  Dashboard   │   │     │   │           & Profile   │
  └──────┬───────┘   └──────┬───────┘   └──────┬───────┘
         │                  │                  │
         ▼                  │                  ▼
  ┌──────────────┐          │           ┌──────────────┐
  │ Assigned     │          │           │ Change       │
  │ Patrol Zone  │          │           │ Password     │
  └──────────────┘          │           └──────────────┘
                            ▼
                     ┌──────────────┐
                     │ 1st Screen   │ (Basic Info)
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ 2nd Screen   │ (Detailed Logs)
                     └──────┬───────┘
                            │
                            ▼
                     ┌──────────────┐
                     │ Camera Screen│ (Evidence Capture)
                     └──────────────┘
```

---


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

# Technology stack

Frameworks & Libraries used:

* **Flutter SDK :** 3.22.0 
* **Dart SDK :** 3.4.0
* **provider:** 6.1.2 
* **http:** 1.2.1 
* **image_picker:** 1.1.2 
* **shared_preferences:** 2.2.3 


---

##  Coding Standards & Best Practices

### A. Naming Conventions & Code Style
We strictly enforced the official [Dart Style Guide](https://dart.dev) rules. 

* **Classes and Extensions:**  use `UpperCamelCase`.
  ```dart
  class SecurityService { ... } // Correct
  class security_service { ... } // Incorrect
  ```
* **Directories and Files:**  use lower-case names separated by underscores (`snake_case`).
  ```text
  lib/screens/login/forgot_password.dart // Correct
  lib/screens/login/forgotPassword.dart  // Incorrect
  ```
* **Variables, Parameters, and Object Instances:**  use `lowerCamelCase`.
  ```dart
  final String sessionToken;
  ```

1. **Zero Logic in Views (`lib/screens/`):** Widgetsonly manage declarative layout painting and user animation triggers.
2. **Immutability in Models (`lib/models/`):** All attributes inside data model definitions are marked as `final`. Used  `factory` initialization blocks to handle server serialization protocols cleanly:
   ```dart
   class ReportModel {
     final String reportId;
     final String title;

     ReportModel({required this.reportId, required this.title});

     factory ReportModel.fromJson(Map<String, dynamic> json) {
       return ReportModel(
         reportId: json['id'] ?? '',
         title: json['title'] ?? '',
       );
     }
   }
   ```
3. **Business Logic (`lib/view_model/`):** Used explicit state container updates to manage local memory states.

### B. Resource Management & Performance Constraints

* **Asynchronous Guard Rails:** Every single asynchronous backend operation (`async/await`) must run within an enclosed `try/catch` structural safety block.  
  ```dart
  try {
    final response = await _apiClient.get(ApiEndpoints.baseUrl);
    // Process response data...
  } catch (error) {
    _logger.severe('Network handshake failure trace: \$error');
  }
  ```



## 3.Core Components
This section outlines how the application manages routing context transitions, handles network requests, controls authentication, and coordinates background data operations.

### A. Routing & Navigation
The app manages layout transitions via a unified, named routing table located in the root entry file.

* **Target File:** `lib/main.dart`
```dart
import 'package:flutter/material.dart';
import 'screens/login/login.dart';
import 'screens/login/redirect.dart';
import 'screens/home/home.dart';
import 'screens/reports/first_screen.dart';

void main() => runApp(const TahadhariApp());

class TahadhariApp extends StatelessWidget {
  const TahadhariApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Tahadhari Mobile',
      initialRoute: '/redirect',
      routes: {
        '/redirect': (context) => const RedirectScreen(),
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/report-step1': (context) => const FirstReportScreen(),
      },
    );
  }
}
```

### B. Core API & Network Service
A central service component handles low-level HTTP client mutations and maps header variables cleanly before shipping packets to the backend framework.

* **Target File:** `lib/services/api_service.dart`
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class ApiService {
  final String _baseUrl = 'https://your-production-domain.com';

  // Universal post helper mapping headers cleanly
  Future<http.Response> postRequest(String endpoint, Map<String, dynamic> body, {String? token}) async {
    final url = Uri.parse('\(_baseUrl\)endpoint');
    final Map<String, String> headers = {
      'Content-Type': 'application/json',
      if (token != null) 'Authorization': 'Bearer \$token',
    };

    return await http.post(
      url,
      headers: headers,
      body: jsonEncode(body),
    );
  }
}
```

### C. Authentication Service
This layer checks invitation parameters, stores active token strings onto local device disk space, and flags state alterations.

* **Target File:** `lib/services/auth_service.dart`
```dart
import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'api_service.dart';

class AuthService {
  final ApiService _apiService = ApiService();

  Future<bool> loginUser(String email, String password) async {
    final response = await _apiService.postRequest('/users/login', {
      'email': email,
      'password': password,
    });

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final prefs = await SharedPreferences.getInstance();
      // Safely cache token mapping locally
      await prefs.setString('access_token', data['access_token'] ?? '');
      return true;
    }
    return false;
  }
}
```

### D. Sync & Report State Service
This sub-component structures your multi-screen layout report arrays into an object before initiating final backend API synchronization handshakes.

* **Target File:** `lib/view_model/report_provider.dart`
```dart
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class ReportProvider extends ChangeNotifier {
  final ApiService _apiService = ApiService();
  
  // Local state container variables
  String _incidentTitle = '';
  String _description = '';

  void updateStepOne(String title, String desc) {
    _incidentTitle = title;
    _description = desc;
    notifyListeners(); // Updates active UI views immediately
  }

  Future<bool> syncReportToBackend(String userToken) async {
    final payload = {
      'title': _incidentTitle,
      'description': _description,
    };

    final response = await _apiService.postRequest(
      '/assignments/deploy', 
      payload, 
      token: userToken
    );
    
    return response.statusCode == 201;
  }
}

```



---

## 4. Security Measures

The application secures mobile network traffic and profile access through a multi-stage authentication handshake at the API perimeter. 

### A. Multi-Factor Authentication (MFA) Login Sequence
Rangers cannot access the core application layout using standard password credentials alone. The authentication pipeline requires a secondary validation code token to complete the state handshake.

```text
 ┌───────────────┐     POST /login      ┌───────────────┐
 │ Password Auth │─────────────────────►│ Return Token  │
 └───────────────┘                      └───────┬───────┘
                                                │
                                                ▼
 ┌───────────────┐   POST /login/mfa    ┌───────────────┐
 │ Active State  │◄─────────────────────│ Validate Code │
 └───────────────┘                      └───────────────┘
```

1. **Stage 1 (Identity Initiation):** The app transmits user credentials to the `/users/login` endpoint. If correct, the backend freezes the session state and returns a transient `mfa_token`.
2. **Stage 2 (Verification Handshake):** The app traps the user on an input verification overlay. The user enters their temporary code string, which is dispatched alongside the `mfa_token` to `/users/login/mfa` to unlock the global application context.

### B. Code Implementation: Secure MFA Pipeline
This service component manages the two-step login sequence, passing token properties securely across the asynchronous execution layers:

* **Target File:** `lib/services/auth_service.dart`
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class AuthService {
  final String _baseUrl = 'https://your-production-domain.com';

  // Step 1: Submit email and password to receive transient MFA token
  Future<String?> initiateLogin(String email, String password) async {
    final response = await http.post(
      Uri.parse('\$_baseUrl/users/login'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({'email': email, 'password': password}),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      return data['mfa_token']; // Returns the tracking token key string
    }
    return null;
  }

  // Step 2: Validate the MFA code to obtain final session access keys
  Future<bool> verifyMfaCode(String mfaToken, String code) async {
    final response = await http.post(
      Uri.parse('\$_baseUrl/users/login/mfa'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'mfa_token': mfaToken,
        'code': code,
      }),
    );

    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      final prefs = await SharedPreferences.getInstance();
      
      // Serialize access and refresh credentials securely to local disk
      await prefs.setString('access_token', data['access_token'] ?? '');
      await prefs.setString('refresh_token', data['refresh_token'] ?? '');
      return true;
    }
    return false;
  }
}
```

### C. Session Token 
Once verified, session token vectors are serialized directly into the device's persistent cache using `shared_preferences`. 


## 5. Troubleshooting

This section details common development compilation blocks and backend connection hurdles along with direct instructions to resolve them.

### A. Network Connection Timed Out (`SocketException`)
* **The Issue:** The mobile application fails to connect to the backend server and throws a network timeout or connection refused error during login or onboarding loops.
* **The Cause:** If you are running the app on a local Android Emulator, using `localhost` or `127.0.0.1` as your base URL will point back to the emulator's internal loopback interface, not your host computer's backend instance.
* **The Solution:** Open your development setup file (`lib/constants/api_endpoints.dart`) and swap out the address parameters:
    * **Android Emulator Target:** Update the string value to use the special loopback IP alias `http://10.0.2.2:8000`.
    * **iOS Simulator Target:** Update the string value to use your machine's literal local network network IP address (e.g., `http://192.168.1.5:8000`).

### B. State Not Updating in UI Views (`Provider Exception`)
* **The Issue:** Data inputs typed into forms or multi-screen wizards (like entering text inside the report screen) are entirely lost when navigating across pages, or the UI fails to change.
* **The Cause:** This happens if you instantiate a completely new provider memory object context directly inside the layout widget instead of calling the active root parent tree instance.
* **The Solution:** Ensure you are accessing the shared runtime instance through your build context parameter:
    ```dart
    // Correct Implementation: Fetches the active context without rebuilding the widget tree
    final reportProvider = Provider.of<ReportProvider>(context, listen: false);
    ```

### C. Missing Build Artifacts or Broken Dependencies
* **The Issue:** The development editor flags numerous file layout lines as missing or throws complex file compilation errors right after pulling updates from the code repository.
* **The Cause:** Local machine indices are out of sync with the pinned library versions inside your central configuration manifest file (`pubspec.yaml`).
* **The Solution:** Force a complete purge of your machine's local asset index layers by running this execution loop inside your project terminal window:
    ```bash
    flutter clean
    flutter pub get
    ```

### D. App Crashes When Opening Phone Camera System
* **The Issue:** Clicking the camera activation tool inside the Post-Patrol report screen causes an immediate runtime application execution crash on physical hardware targets.
* **The Cause:** Missing device hardware privacy declarations inside your platform-specific native operating system build configuration trees.
* **The Solution:** Verify that hardware permissions parameters are declared inside your project settings configurations:
    * **Android Verification:** Open `android/app/src/main/AndroidManifest.xml` and confirm this variable line exists:
      ```xml
      <uses-permission android:name="android.permission.CAMERA" />
      ```
    * **iOS Verification:** Open `ios/Runner/Info.plist` and confirm the permission key block is appended:
      ```xml
      <key>NSCameraUsageDescription</key>
      <string>Tahadhari requires camera access to attach incident evidence photos.</string>
      ```



## 6. Ranger Onboarding Flows

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
