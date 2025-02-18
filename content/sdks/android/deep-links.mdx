---
title: Handling deep links
description: Usage guides to help you get started with deep linking in the Android Knock SDK.
section: SDKs
---

**Note:** We Recommend taking advantage of our [KnockMessagingService & KnockActivity](/sdks/android/reference#knockmessagingservice--knockactivity) to make handling deep links simpler.

## 1. Define URL Schemes:

- In Xcode, navigate to your app target's **Info** tab.
- Add a new URL type under **URL Types** with a unique scheme.

<Image
  src="/images/xcode-project-info.png"
  alt="Xcode Project Info"
  className="rounded-md mx-auto border border-gray-200"
  width={1020}
  height={802}
/>

## 2. Include a deep link in your Knock message payload:

- In your message payload that you send to Knock, include a property with a value of your deep link. The name of the property doesn't matter, so long as you know beforehand what it will be called.
- This can also be done in your Knock Dashboard in your [Payload overrides](/integrations/push/overview#push-overrides).

<Image
  src="/images/deep-link-payload-override.png"
  alt="Deep link payload override"
  className="rounded-md mx-auto border border-gray-200"
  width={500}
  height={507}
/>

## 3. Handle Incoming URLs:

```kotlin
class MainActivity: KnockActivity() {
  override fun onKnockPushNotificationTappedInBackGround(intent: Intent) {
    super.onKnockPushNotificationTappedInBackGround(intent)

    intent?.extras?.getString("link")?.let { deepLink ->
        // Handle your deep link routing here
    }
  }

  override fun onKnockPushNotificationTappedInForeground(message: RemoteMessage) {
      super.onKnockPushNotificationTappedInForeground(message)

      remoteMessage.data.isNotEmpty().let {
          val deepLink = remoteMessage.data["link"]
          deepLink?.let {
            // Handle your deep link routing here
          }
      }
  }
}
```
