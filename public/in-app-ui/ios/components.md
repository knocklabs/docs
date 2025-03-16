---
title: "Swift SDK pre-built components"
description: "How to use Knock's UI components in your iOS application."
section: Building in-app UI
---

## KnockInAppFeedView

### Overview

<Image
  src="/images/ios-in-app-feed.png"
  alt="Component UI Example"
  width={1300}
  height={798}
  className="rounded-md mx-auto border border-gray-200"
/>

`KnockInAppFeedView` is a SwiftUI view that renders the in-app notifications feed using data from `KnockInAppFeedViewModel`. It provides a customizable and interactive user interface for displaying notifications.

<Callout
  emoji="⚠️"
  text={
    <>
      <span className="font-bold">Initializing the Feed.</span> Please remember
      that you will still need to initialize the <code>feedManager</code>{" "}
      manually before displaying this component. Check out our{" "}
      <a href="/sdks/ios/reference#feedmanager">
        FeedManager documentation for more information.
      </a>{" "}
      See below for an example of how to initialize the <code>feedManager</code>{" "}
      .
    </>
  }
/>

### Properties

<Attributes>
  <Attribute
    name="theme"
    type="InAppFeedTheme"
    description="Defines the appearance of the feed view and its components."
  />
</Attributes>

### Customization

You can customize almost every aspect of the UI of the `KnockInAppFeedView` using our customizable themes.

### Using UIKit

If you are using UIKit, use `InAppFeedViewController`.

See below for an example of how to use this component.

### Examples

#### SwiftUI

```swift
@EnvironmentObject var viewModel: Knock.InAppFeedViewModel = .init()

init() {
   Task {
        if Knock.shared.feedManager == nil {
            Knock.shared.feedManager = try? await Knock.FeedManager(feedId: "ad06b085-54e2-4fb0-b6e7-050338851868")
            await viewModel.connectFeedAndObserveNewMessages()
        }
    }
}

KnockInAppFeedView(theme: KnockInAppFeedTheme(titleString: "Notifications"))
    .environmentObject(viewModel)
    .onReceive(viewModel.didTapFeedItemButtonPublisher) { actionString in
        print("Button with action \(actionString) was tapped.")
    }
    .onReceive(viewModel.didTapFeedItemRowPublisher) { item in
        print("Row item was tapped")
    }
```

#### UIKit

```swift
class MyViewController: InAppFeedViewController {
    init() {
        self.viewModel = Knock.InAppFeedViewModel()
        self.theme: Knock.InAppFeedTheme = .init()
    }

    override func viewDidLoad() {
        Task {
            if Knock.shared.feedManager == nil {
                Knock.shared.feedManager = try? await Knock.FeedManager(feedId: "ad06b085-54e2-4fb0-b6e7-050338851868")
                await viewModel.connectFeedAndObserveNewMessages()
            }
        }
        super.viewDidLoad()
    }
}
```

## InAppFeedNotificationIconButton

### Overview

`InAppFeedNotificationIconButton` is a SwiftUI view that renders a bell icon button to your application that shows the current count of unread or unseen notifications. This can be used to open your NotificationFeed.

### Properties

<Attributes>
  <Attribute
    name="theme"
    type="InAppFeedNotificationIconButtonTheme"
    description="Defines the appearance of the feed view and its components."
  />
  <Attribute
    name="action"
    type="() -> Void"
    description="A callback to alert you when user taps on the button."
  />
</Attributes>

### Examples

```swift
    TestParentView()
        .sheet(isPresented: $showingSheet) {
            Knock.InAppFeedView()
                .environmentObject(feedViewModel)
        }
        .toolbar {
            Knock.InAppFeedNotificationIconButton() {
                showingSheet.toggle()
            }
            .environmentObject(feedViewModel)
        }
```
