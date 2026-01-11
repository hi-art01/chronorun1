# Paragraph to Google Form

This web application allows you to paste a paragraph of text, and it will create a Google Form with the questions it finds in the text.

## Prerequisites

- Python 3.7+
- pip

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

1.  **Enable the Google Forms API.**
    - Go to the [Google Cloud Console](https://console.cloud.google.com/flows/enableapi?apiid=forms.googleapis.com).
    - Create a new project or select an existing one.
    - The Google Forms API will be automatically enabled.

2.  **Configure the OAuth consent screen.**
    - Follow the instructions [here](https://developers.google.com/workspace/guides/configure-oauth-consent).
    - For "User Type," select "Internal" if you are a Google Workspace user, otherwise select "External."

3.  **Create credentials for a web application.**
    - In the Google Cloud Console, go to the [Credentials page](https://console.cloud.google.com/apis/credentials).
    - Click "Create Credentials" and select "OAuth client ID."
    - Select "Web application" as the application type.
    - Add `http://localhost:5000/oauth2callback` and `http://127.0.0.1:5000/oauth2callback` to the "Authorized redirect URIs."
    - Click "Create."
    - Download the JSON file and save it as `client_secrets.json` in the root directory of this project.

## Running the Application

1.  Run the Flask application:
    ```bash
    python app.py
    ```

2.  Open your web browser and go to `http://localhost:5000`.

3.  The first time you use the application, you will be prompted to authorize access. Follow the on-screen instructions.

4.  Paste your paragraph into the text area and click "Create Form."

5.  Once the form is created, you will see a success message with the form ID.
