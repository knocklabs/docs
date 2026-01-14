Updating [https://docs.knock.app/getting-started/what-is-knock](https://docs.knock.app/getting-started/what-is-knock)

# What is Knock?

Learn more about what Knock does and how it helps power your product messaging.

Knock is product and customer messaging infrastructure. You can use Knock to power all of your product's messaging needs, including transactional messaging, lifecycle marketing, one-time announcements, and in-product messaging, without the effort of building and maintaining your own in-house messaging system.

In this overview, we'll cover the foundational concepts of Knock. Knock is designed to be used collaboratively by engineering, product, and growth teams. It's quick for developers to implement, and simple for non-technical roles to manage.

## Sending messages with Knock

Knock enables three core messaging experiences:

- **Workflows.** Transactional and lifecycle messaging flows that respond to user actions and events.
- **Broadcasts.** One-time messages sent to groups of users for announcements, updates, and campaigns.
- **Guides.** In-app lifecycle messaging that helps users discover features and complete key actions.

### Workflows

Workflows enable you to model complex messaging flows across channels using a variety of logical function steps while respecting a user's individual preferences. Workflows power both transactional messaging (such as order confirmations, password resets, and account updates) and lifecycle messaging (such as onboarding sequences, engagement campaigns, and retention flows).  
![An image of a workflow diagram][image1]  
Your application can trigger workflows using our REST API, any one of our [available SDKs](https://docs.knock.app/developer-tools/sdks), or by integrating a CDP like Segment as an event source. You can use the dropdown menu on the code sample below to look at a sample in your language of choice:

- API call

```py
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
    key="new-comment",
    recipients=["1", "2"],
    data={"project_name": "My Project"},
    actor="3",
    cancellation_key="cancel_123",
    tenant="jurassic_world_employees"
)
```

- Source event

```py

```

- Schedule

```py

```

- Audience membership

```py

```

### Broadcasts

Broadcasts enable you to send one-time messages to groups of users for communications that aren't triggered by individual user actions. Unlike workflows that are event-driven, broadcasts are initiated directly from the Knock dashboard and can target specific audiences you’ve created in Knock.

**\[broadcast-editor.png\]![][image2]**

Broadcasts are perfect for:

- Product announcements and feature releases.
- Marketing campaigns and promotional messages.
- System maintenance notifications.
- Company updates and newsletters.
- Time-sensitive alerts and emergency communications.

### Guides

Guides power in-app lifecycle messaging using your own components and design system. Unlike traditional messaging that happens outside your app, guides appear contextually within your product interface to provide timely, relevant guidance.

**\[guides-editor.png\]![][image3]**

Guides enable you to:

- Create interactive onboarding flows.
- Highlight new features and updates.
- Guide users through complex workflows.
- Drive adoption of key product features.
- Provide contextual help and tips.

## Mapping your data into Knock

### Users

In most cases, recipients are users in your application. As you trigger workflows for recipients, Knock creates a cache of the data needed to notify them on different platforms, such as an email address, phone number, avatar URL, or push token. Knock also stores custom properties you pass from your application to customize their notifications, such as a plan type, user role, or timezone.

An object used to create a User

```javascript
{
	// Id is a required prop
	id: "1",
	// Knock also supports default props for common channels
	name: "John Hammond",
	email: "hammondj@ingen.net",
	phone_number: "555-555-5555",
	avatar: "https://ingen.net/headshots/hammondj.jpg",
	timezone: "America/Costa_Rica"
	// You can add as many custom props as needed. These will be
	// merged onto the top-level User object
	properties: {
		"title": "CEO",
		"planType": "allAccess",
		"userType": "admin"
	}
}
```

### Audiences

Audiences are defined user segments that can be used to target workflows, guides, and broadcasts. You can build static audiences by manually adding users via a reverse ETL source such as Hightouch or Census, a CSV upload, the API, or manually in the Knock dashboard, or you can build dynamic audiences with a set of query rules on top of the user data in Knock.

### Tenants

Tenants represent accounts, organizations, or workspaces your users belong to. They allow you to map your product’s structure into Knock to power tenant-specific features like branding or preferences.

### Objects

Objects allow you to map custom entities into your project and relate them to users with a subscription. They can help you ensure Knock always has the most up-to-date information required to send your notifications, and they enable you to send notifications to non-user recipients.

## Channels

Channels in Knock represent a specific provider you have configured to send messages. You can include channel steps in your workflows or use them in broadcasts to send messages with the providers you already use in production. Knock supports the following channel types and providers:

- Email
- SMS
- Push
- Chat
- In-app

A message that is generated as a part of a workflow or broadcast is called a Message, and Knock enables you to define dynamic message templates using a combination of a drag-and-drop editor and the Liquid templating language.

This helps product and marketing teams standardize on one templating system instead of using different templating languages for different providers. It also has the added benefit of lifting these messages out of your codebase so you can iterate quickly on customer communications without a developer.

## Functions

Each workflow can combine multiple function steps to model complex logic that creates better notification experiences. You can combine the following function steps with any number of channel steps to create personalized notifications for your users:

- Batch
- Delay
- Branch
- Throttle
- Fetch
- Trigger workflow

In addition to combining channel steps and function steps to create complex workflows, you can augment these steps with additional logic based on the user recipient, inputs from your application, or the status of previous workflow steps. These are called step conditions.

## Step conditions

Step conditions exist across both channel and function steps, and they allow you to conditionally execute steps based on trigger payload data, user properties, or the status of previous steps

**Examples**:

- Only send an email message if an in-app message has not been seen
- Only send an in-app notification if recipient.plan \=== "pro"
- Only execute a delay step if delay \=== true in the trigger payload

In addition to giving your technical and non-technical users the ability to construct these workflows via a drag-and-drop editor, Knock also enables your users to exercise control over their own notification experience using a flexible preferences model.

## Preferences

In Knock, each workflow run and broadcast is executed on behalf of a recipient, and each recipient can specify their preferences to receive messages across a number of different criteria: channel types, individual workflows, workflow categories, and broadcast types.  
![An image of a preference set][image4]  
Application developers have control over how these preference sets are presented to the user and which options to surface, but Knock enforces these preferences during every workflow run and broadcast automatically.

You can learn more about how to set a user's preferences in our [preferences overview](https://docs.knock.app/preferences/overview).

## Next steps

Now that you understand some of the core concepts of Knock, you can either start building with Knock or explore some of the more advanced features Knock offers.

### Build something

If you want to start by adding Knock to your existing system, you can check out our quick start guide to implement your first workflow. This quick start will help you integrate Knock with your backend codebase.

- [Quick start guide](https://docs.knock.app/getting-started/quick-start/general)
- [React quick start](https://docs.knock.app/getting-started/quick-start/react)
- [Next.js quick start](https://docs.knock.app/getting-started/quick-start/nextjs)

If you want to keep learning about Knock using a curated example application, check out our catalog of [examples apps](https://docs.knock.app/getting-started/example-apps). Here are some recommendations:

- [In-app feed & toasts](https://github.com/knocklabs/in-app-notifications-example-nextjs)
- [SlackKit example](https://github.com/knocklabs/slack-kit-example)
- [iOS example](https://github.com/knocklabs/ios-example-app)

### Keep learning

While workflows, broadcasts, and guides are at the heart of Knock, our goal is to build a complete messaging system for our customers. Here is an overview of some of the more-advanced features that we provide.

#### UI components

Knock provides developers with React components like \<NotificationFeed/\> and \<SlackAuthButton/\> to use in their applications. You can read more about building in-app UI with Knock for both web and mobile [here](https://docs.knock.app/in-app-ui/overview).

#### Advanced concepts

There is a lot more to learn about Knock, and our [concepts overview page](https://docs.knock.app/concepts/overview) is a good place to start. Here are use cases our customers commonly solve with Knock:

- Powering [translation and localization](https://docs.knock.app/concepts/translations) and managing timezone-aware delivery.
- Creating advanced messaging logic using [subscriptions](https://docs.knock.app/concepts/subscriptions) and [schedules](https://docs.knock.app/concepts/schedules).
- Integrating Knock with your application's data model, using [tenants](https://docs.knock.app/concepts/tenants) and [objects](https://docs.knock.app/concepts/objects) to power customized experiences.
- Using [the template editor](https://docs.knock.app/designing-workflows/template-editor/overview) to standardize messaging templates across providers.

#### Developer tools

Knock is a developer-first platform, with both [environment](https://docs.knock.app/concepts/environments) and [commit models](https://docs.knock.app/concepts/commits). If you want to work with Knock resources in code, you can use our [Management API](https://docs.knock.app/developer-tools/management-api) or [CLI](https://docs.knock.app/developer-tools/knock-cli).

Knock also supports an [MCP](https://docs.knock.app/developer-tools/mcp-server) server, which allows you to work with Knock resources in your IDE, entirely using natural language. Our MCP server is a great way to migrate from a legacy system to Knock, or to make updates across many Knock resources at once.

Once you're sending messages through Knock, we offer observability tools like [workflow run logs](https://docs.knock.app/send-notifications/debugging-workflows) (to examine all steps of workflow execution in your dashboard) and data streaming into a monitoring system like Datadog with [extensions](https://docs.knock.app/integrations/extensions/overview).
