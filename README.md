# Paragraph to Google Form

This script reads a paragraph from a text file, extracts questions from it, and then uses the Google Forms API to create a new Google Form with those questions.

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

3.  **Create credentials for a desktop application.**
    - Follow the instructions [here](https://developers.google.com/workspace/forms/api/quickstart/python#authorize_credentials_for_a_desktop_application).
    - Download the JSON file and save it as `client_secrets.json` in the root directory of this project.

## Running the Script

1.  Add the paragraph you want to convert to a Google Form in the `paragraph.txt` file.

2.  Run the script:
    ```bash
    python main.py
    ```

3.  The first time you run the script, you will be prompted to authorize access. Follow the on-screen instructions.

4.  Once the script has run successfully, it will print the ID of the newly created form.
