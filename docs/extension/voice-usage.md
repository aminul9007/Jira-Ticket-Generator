# Voice Usage

## Requirements

- Chrome or Edge (Web Speech API)
- Microphone permission when prompted
- Network connection (Chrome uses cloud speech recognition)

## Workflow

1. Open the extension popup
2. Click **🎤 Start Recording**
3. Describe the bug clearly
4. Click **Stop Recording** or wait for auto-stop after silence
5. Edit the transcript if needed
6. Click **Generate Ticket**

Voice does **not** auto-generate tickets — you always review before creating in Jira.

## Live transcript

The description field updates in real time while you speak.

## Voice settings

Configure in **⚙ Settings → Voice Settings**:

| Setting | Purpose |
|---------|---------|
| Language | Speech recognition locale (`en-US` or `en-GB`) |
| Auto Stop | Stops recording after N seconds of silence |

## Unsupported browsers

Firefox and Safari show:

> Voice input is not supported in this browser.

Use typed input instead.

## Tips for fast reporting

- State page, action, and expected vs actual result in one breath
- Keep the popup open while recording — closing it stops the session
- Minimum 10 characters required before generating
