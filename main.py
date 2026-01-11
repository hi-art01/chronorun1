from __future__ import print_function

import os.path
import re

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/forms.body"]


def main():
    """Shows basic usage of the Forms API.
    Prints the title of the sample form.
    """
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_secrets_file(
                "client_secrets.json", SCOPES
            )
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open("token.json", "w") as token:
            token.write(creds.to_json())

    try:
        service = build("forms", "v1", credentials=creds)

        # Read the paragraph from the file
        with open("paragraph.txt", "r") as f:
            paragraph = f.read()

        # Split the paragraph into sentences using regex
        sentences = re.split(r'(?<=[.?!])\s+', paragraph)

        # Find the questions
        questions = [sentence.strip() for sentence in sentences if sentence.strip().endswith("?")]

        # Create a new form
        form = {"info": {"title": "Paragraph Form"}}
        created_form = service.forms().create(body=form).execute()

        # Add the questions to the form
        requests = []
        for i, question_text in enumerate(questions):
            requests.append(
                {
                    "createItem": {
                        "item": {
                            "title": question_text,
                            "questionItem": {"question": {"required": False}},
                        },
                        "location": {"index": i},
                    }
                }
            )

        if requests:
            update = {"requests": requests}
            service.forms().batchUpdate(
                formId=created_form["formId"], body=update
            ).execute()

        print(f"Created form with ID: {created_form['formId']}")

    except HttpError as err:
        print(err)


if __name__ == "__main__":
    main()
