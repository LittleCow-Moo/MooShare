# MooShare

MooShare is an open-source file sharing platform designed for effortless sharing. It also supports integration with ShareX, a popular screen capture and file sharing tool.

## How It Works

1. **Upload**: Easily upload files to MooShare.
2. **Share**: Copy and send the shareable link to recipients.
3. **Download**: Recipients click the link to download the files.

# Installation

1. Clone the repository.
2. `npm i` to install dependencies.
3. Create the following example `.env` file:

```env
BaseLink="http://[Domain]:[Port]" # You can remove :[Port] if you are using 80 port
Port=80 # Change port here if you want
```

4. Adjust the settings in the `.env` file as needed.
5. `node .` to start the application.

## ShareX Integration

MooShare seamlessly integrates with ShareX for convenient file uploads. To configure ShareX with MooShare, follow these steps:

1. Download and install [ShareX](https://getsharex.com/) if you haven't already.
2. Create the following example `.sxcu` file:

```json
{
  "Version": "14.0.0",
  "Name": "MooShare",
  "DestinationType": "ImageUploader, TextUploader, FileUploader",
  "RequestMethod": "POST",
  "RequestURL": "http://[BaseLink from .env here]/upload?sharex=1",
  "Body": "MultipartFormData",
  "FileFormName": "files",
  "URL": "{response}",
  "ErrorMessage": "{response}"
}
```

3. Adjust the settings in the `.sxcu` file as needed.
4. Start using ShareX to capture and upload files directly to MooShare.

# Contributing

Contributions are welcome! Feel free to create issues and pull requests.
