# Solitud: Isolated User Script Execution Proof of Concept

## Overview

**Solitud** is a proof-of-concept API project designed to safely execute user-defined validation scripts in a secure, isolated environment. It leverages [isolated-vm](https://github.com/laverdet/isolated-vm) to sandbox user code, preventing malicious access to the host system. This project demonstrates how to store, retrieve, and run user-provided validation logic against arbitrary request objects, with strong validation and security controls.

## Features
- **/config**: Save a user-defined validation script (config) with a unique name.
- **/api/:name**: Retrieve and execute a saved config, validating a user-provided object against the stored script.
- **Sandboxed Execution**: All user scripts are run in a memory-limited, isolated VM context.
- **Script Validation**: Scripts are checked for dangerous patterns before execution.
- **Custom Validation Logic**: Users can define their own validation logic as JavaScript functions.

## How It Works
1. **Save Config**: POST to `/config` with a config object containing a name and a `customValidation` function as a string.
2. **Run Config**: POST to `/api/:name` with a request body. The server retrieves the config by name and runs the validation function against the provided object in isolation.

## API Endpoints

- Base URL: `https://solitud.onrender.com`

### 1. Save Config
- **Endpoint:** `POST /config`
- **Body:**
  ```json
  {
    "name": "myConfigName",
    "customValidation": "function({body}) { return { isValid: body.age > 18, message: body.age > 18 ? 'OK' : 'Too young' }; }"
  }
  ```
- **Response:**
  - `200 OK` with success message, or error if validation fails.

### 2. Run Config
- **Endpoint:** `POST /api/:name`
- **Params:**
  - `name`: The name of the config to use.
- **Body:**
  ```json
  {
    "request": {
      "age": 21
    }
  }
  ```
- **Response:**
  - The result of the validation function, e.g. `{ "isValid": true, "message": "OK" }`

## Example Usage

1. **Save a Config:**
   ```bash
   curl -X POST http://localhost:3000/config \
     -H 'Content-Type: application/json' \
     -d '{
       "name": "ageCheck",
       "customValidation": "function({body}) { return { isValid: body.age > 18, message: body.age > 18 ? 'OK' : 'Too young' }; }"
     }'
   ```

2. **Run the Config:**
   ```bash
   curl -X POST http://localhost:3000/api/ageCheck \
     -H 'Content-Type: application/json' \
     -d '{ "request": { "age": 17 } }'
   # Response: { "isValid": false, "message": "Too young" }
   ```

## Security Considerations
- **Sandboxing:** All user scripts are executed in a memory-limited, isolated-vm context.
- **Script Validation:** Scripts are checked for forbidden patterns (e.g., `process`, `require`, `global`, `eval`, etc.) before being accepted.
- **No File/Process Access:** User code cannot access the filesystem, environment variables, or Node.js internals.
- **Timeouts:** Script execution is time-limited to prevent infinite loops.

## Development & Running Locally

1. **Install dependencies:**
   ```bash
   npm install
   ```
2. **Start the server:**
   ```bash
   npm run start:dev
   ```
3. **API will be available at:** `http://localhost:3000` or `https://solitud.onrender.com`

## Project Structure
- `src/app.controller.ts` — API endpoints
- `src/app.service.ts` — Business logic and sandbox integration
- `src/common/sandbox/ivm.ts` — Isolated-vm sandbox wrapper
- `src/common/types/config.dto.ts` — Config DTO definition
- `src/common/errors/errors.ts` — Custom error classes

## Extending This Project
- Add persistent storage for configs (currently in-memory only).
- Enhance script validation for more complex threat detection.
- Add authentication/authorization for config management.
- Support more complex validation workflows.

## Disclaimer
This project is a proof of concept and **not production-ready**. Do not use as-is for untrusted user code in production environments without further hardening and review.
