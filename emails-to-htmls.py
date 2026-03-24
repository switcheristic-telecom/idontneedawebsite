from lib import EmlParser

import os
import json

# from the path of the file
EMAILS_DIR = os.path.join(os.path.dirname(__file__), "data", "emails")


HTML_OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "public", "emails")
METADATA_JSON_OUTPUT_PATH = os.path.join(
    os.path.dirname(__file__), "public", "email-metadata.json"
)


def main():

    FILE_IGNORE = [".DS_Store", "labels.json"]
    EMAIL_METADATA_DICT = {}

    # iterate through the emails directory
    for email in os.listdir(EMAILS_DIR):
        if email in FILE_IGNORE:
            continue

        # id to the email (both for eml and json file)
        id = email.split(".")[0]
        print(id)
        if email.endswith(".eml"):
            f = open(os.path.join(EMAILS_DIR, email), "rb")
            html = EmlParser(f.read()).html
            if id not in EMAIL_METADATA_DICT:
                EMAIL_METADATA_DICT[id] = {}
            EMAIL_METADATA_DICT[id]["html"] = html
        if email.endswith(".json"):
            f = open(os.path.join(EMAILS_DIR, email), "r")
            metadata = f.read()
            if id not in EMAIL_METADATA_DICT:
                EMAIL_METADATA_DICT[id] = {}
            EMAIL_METADATA_DICT[id]["metadata"] = metadata

    # filter so that only emails with both html and metadata are included
    EMAIL_METADATA_DICT = {
        k: v for k, v in EMAIL_METADATA_DICT.items() if v.get("html") and "metadata" in v
    }

    # create the output directory if it does not exist
    if not os.path.exists(HTML_OUTPUT_DIR):
        os.makedirs(HTML_OUTPUT_DIR)

    EMAIL_METADATA_LIST = []
    # iterate through the dictionary and convert the metadata to a dictionary
    for k, v in EMAIL_METADATA_DICT.items():
        # save the html to a file
        html = v["html"]
        with open(os.path.join(HTML_OUTPUT_DIR, f"{k}.html"), "w") as f:
            f.write(html)

        # add the metadata to the list
        metadata = json.loads(v["metadata"])
        metadata["id"] = k
        EMAIL_METADATA_LIST.append(metadata)

    # save the metadata to a json file
    with open(METADATA_JSON_OUTPUT_PATH, "w") as f:
        json.dump(EMAIL_METADATA_LIST, f)


if __name__ == "__main__":
    main()
