from flask import Flask, render_template, request, redirect, session, url_for
import os
import google.oauth2.credentials
import google_auth_oauthlib.flow
from googleapiclient.discovery import build
import re

app = Flask(__name__)
app.secret_key = os.urandom(24)

# This variable specifies the name of a file that contains the OAuth 2.0
# client secret information for your application.
CLIENT_SECRETS_FILE = "client_secrets.json"

# This OAuth 2.0 access scope allows for full read/write access to the
# authenticated user's account and requires requests to use an SSL connection.
SCOPES = ["https://www.googleapis.com/auth/forms.body"]
API_SERVICE_NAME = "forms"
API_VERSION = "v1"

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/authorize")
def authorize():
    # Create a flow instance to manage the OAuth 2.0 Authorization Grant Flow steps.
    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES
    )

    # The URI created here must exactly match one of the authorized redirect URIs
    # for the OAuth 2.0 client, which you configured in the API Console. If this
    # value doesn't match an authorized URI, you will get a 'redirect_uri_mismatch'
    # error.
    flow.redirect_uri = url_for("oauth2callback", _external=True)

    authorization_url, state = flow.authorization_url(
        # Enable offline access so that you can refresh an access token without
        # re-prompting the user for permission. Recommended for web server apps.
        access_type="offline",
        # Enable incremental authorization. Recommended as a best practice.
        include_granted_scopes="true",
    )

    # Store the state so the callback can verify the auth server response.
    session["state"] = state

    return redirect(authorization_url)


@app.route("/oauth2callback")
def oauth2callback():
    # Specify the state when creating the flow in the callback so that it can
    # verified in the authorization server response.
    state = session["state"]

    flow = google_auth_oauthlib.flow.Flow.from_client_secrets_file(
        CLIENT_SECRETS_FILE, scopes=SCOPES, state=state
    )
    flow.redirect_uri = url_for("oauth2callback", _external=True)

    # Use the authorization server's response to fetch the OAuth 2.0 tokens.
    authorization_response = request.url
    flow.fetch_token(authorization_response=authorization_response)

    # Store credentials in the session.
    # ACTION ITEM: In a production app, you likely want to save these
    #              credentials in a persistent database instead.
    credentials = flow.credentials
    session["credentials"] = {
        "token": credentials.token,
        "refresh_token": credentials.refresh_token,
        "token_uri": credentials.token_uri,
        "client_id": credentials.client_id,
        "client_secret": credentials.client_secret,
        "scopes": credentials.scopes,
    }

    return redirect(url_for("index"))


@app.route("/create_form", methods=["POST"])
def create_form():
    paragraph = request.form["paragraph"]

    credentials = session.get("credentials")
    if not credentials:
        return redirect(url_for("authorize"))

    try:
        creds = google.oauth2.credentials.Credentials(**credentials)
        service = build(API_SERVICE_NAME, API_VERSION, credentials=creds)
    except Exception as e:
        # If credentials are invalid, redirect to authorize
        return redirect(url_for("authorize"))

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

    return f"Created form with ID: {created_form['formId']}"

if __name__ == "__main__":
    # When running locally, disable OAuthlib's HTTPs verification.
    # ACTION ITEM for developers:
    #     When running in production *do not* leave this option enabled.
    os.environ["OAUTHLIB_INSECURE_TRANSPORT"] = "1"
    app.run(debug=True)
