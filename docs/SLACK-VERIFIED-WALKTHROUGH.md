# Slack verified walkthrough

Verified privately in the `dsec` workspace on November 20, 2026. The app was not submitted to the Slack Marketplace.

## Three steps

1. In Slack **Your Apps**, choose **Create an App → Paste a manifest**. Select all sample JSON and replace it with `public/slack-app-manifest.json`.
2. Select the workspace and choose **Create and Install**. The manifest requests only the `commands` scope. Store the signing secret as the protected `SLACK_SIGNING_SECRET` runtime variable; never place it in source or a guide.
3. Type `/leaaid start 1`. Continue with `/leaaid answer A`, `B`, `C`, or `D`; use `/leaaid status` to resume.

## Acceptance evidence

- `/leaaid start 1` returned Module 1, Decision 1.
- `/leaaid answer C` was validated against the authored answer key and advanced to Decision 2.
- `/leaaid status` returned the same Decision 2.
- Responses were marked **Only visible to you**.
- Invalid or missing signing configuration failed closed.

## Remove

Uninstall or delete the Slack app from its app settings, remove `SLACK_SIGNING_SECRET` from the Sites environment, and redeploy the current Site version. Deletion is irreversible and should be confirmed at the time it is performed.
