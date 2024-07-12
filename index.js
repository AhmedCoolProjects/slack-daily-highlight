const express = require("express");
const { App } = require("@slack/bolt");
require("dotenv").config();

const app = express();
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
});

const HIGHLIGHT_TEMPLATE = `
**Yesterday I worked on**:
- 
- 

**Today I'm planning to work on**:
- 
- 
`;

const CHANNEL_ID = "C079WLW1WHY";

app.get("/", (req, res) => {
  res.send(`Hello from Ahmed BARGADY! ${process.env.SLACK_BOT_TOKEN}`);
  console.log("TOKEN", process.env.SLACK_BOT_TOKEN);
});

app.get("/api/send-reminder", async (req, res) => {
  try {
    await slackApp.client.chat.postMessage({
      token: process.env.SLACK_BOT_TOKEN,
      channel: CHANNEL_ID,
      text: `<!channel> Good morning! Please remember to write your highlights for today's work.\n\n${HIGHLIGHT_TEMPLATE}`,
    });
    console.log("Reminder sent");
    res.status(200).send("Reminder sent");
  } catch (error) {
    console.error("Error sending reminder:", error);
    res.status(500).send("Error sending reminder");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server is running on port http://localhost:${port}`);
  try {
    await slackApp.start(port + 1);
    console.log("⚡️ Bolt app is running!");
  } catch (error) {
    console.error("Unable to start Bolt app", error);
  }
});
