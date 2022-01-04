---
title: Designing workflows
---

The Knock workflow builder enables you to craft notification workflows that combine functions, channels, and conditional logic to determine which of your users to notify across which channels when a given event takes place in your product. 

In this page we'll walk you through (i) how to use the **workflow canvas** to build workflows that send cross-channel notifications and (ii) how to use the **template editor** to create the per-channel notifications sent by those workflows. 

## The workflow canvas

All Knock workflows consist of three basic parts: 
- A **trigger step** that starts the workflow
- **Channel steps** that send notifications to your configured channels
- **Function steps** that control the flow of the workflow and produce state for use in templates


### The trigger step
Every workflow starts with a trigger step. When you want to run a workflow, you send a notify call to the Knock API with an `actor`, a list of `recipients`, and a `data` payload with any information you want to use in the notification templates of the workflow. (More on this in [triggering workflows](/send-notifications/triggering-workflows).) When the workflow is triggered, it creates a workflow run for each of the `recipients` passed in the notify call. 

You won't actually need to do anything with this trigger step within the workflow builder of the Knock dashboard, but it's worth calling out that we automatically generate a sample notify call based on the variable data you add downstream in your workflow. This way you can see all of the `data` you need to pass in your trigger to populate the templates of the Knock workflow.   

### Channel steps

A channel step sends a notification to a recipient. Each channel has a notification template (designed by you in the Knock dashboard) which inserts the `data` from your notify call into a styled template for that step's given channel. We get into more detail on notification templates and how to design them further down in this guide. 

You can add any of the major channel types supported by Knock into your workflow. By default, we show all of our supported channel types, but you'll need to configure a provider with each channel before you can actually use them in a workflow. For more information on how to configure channels in your Knock account, see our [feature guide on adding your first channel](https://www.notion.so/knockapp/Adding-your-first-channel-fa911d650cd84b059f69b08302990a10).  

#### Trigger conditions

For each channel step, you can use trigger conditions to control whether the channel will be executed for a given recipient.

Some examples of triggers you can employ are:
- Only send an email if the in-app notification has not been opened or read
- Only send an email if the event payload indicates it should be sent via email
- Onle send a notification if the user has a specific custom property, e.g. plan_type = pro. 

### Function steps

A function is a step in a workflow that does something to the data being passed in your notify call. You can use functions by entering the workflow builder and adding function steps onto the canvas. 

We currently support the following functions:

- Batch (aggregate notify calls that have the same value for a specified batch key)
- Delay (wait an amount of time before proceeding to the next workflow step)

To learn more about functions and how to get the most out of them in the Knock dashboard, see our [feature guide](https://www.notion.so/knockapp/Workflow-functions-batch-and-delay-0cb7cbca246f44deb922aaade07ae846). 


## The template editor

Each channel step you add to a workflow will have its own notification template. This template is what determines what the notifications sent to your user look like for a given channel. 

In this section we'll walk through the key features of the Knock template editor and how you can use them to design your notifications. 

We'll cover:

- Inserting variables from your notify call into your notification template
- Using liquid syntax to add logic and control flow to your notification template
- How to preview and test your notification template

### Inserting variables into your notification template

To inject a variable into your notification template, enclose it with double curly braces: 
`{{ a_variable }}` . 

You can use curly braces to reference a number of different variable types: 

- **Data payload variables.** Variables sent in the `data` payload of your notify call are injected with curly braces and don't require a prefixed namespace.
- **User properties.** If you want to reference a user property, such as `name`, use the `actor` and `recipient` namespaces. This looks up the actor or a recipient of a given notification, and then finds the specified property for that user. Here's a code example where a recipient's name and plan are injected into a notification template:
    
    ```
    Hey there {{ recipient.name }},
    
    You just upgraded to the {{ recipient.plan }} plan. 
    
    Thanks, 
    The team @ Knock
    ``` 
- **Account and environment constants.** You can also set constants at an account or environment level in Knock for variables that won't change across your different notification workflows. (For more information see [Environments and variables](https://www.notion.so/Environments-and-variables-143018e41dd34848ba584a1f2f24f8d6).) Common use cases for constants include base URLs for routing (e.g. dashboard.knock.app v. dashboard.knock-dev.app) and product names. To access constants in your notification templates, use the `vars` namespace. Here's a code example of an action URL for an in-app feed notification that uses an environment constant: `{{ vars.app_url }}/page/{{ page_id }}`.
- **Workflow state variables.** There are a standard set of workflow state variables that are available on all workflow runs, but that you'll find especially useful if you start to work with batch functions. These variables are available on all workflows and keep track of the `activities` kept within the state of a given workflow run (i.e. the number of notify calls that workflow run has received.)

    - `total_activities` - The number of activities included within the batch. (An example: In the notification "Dennis Nedry left 8 comments for you", the `total_activities` count equals eight.)
    - `total_actors` - The number of unique actors that triggered activities included within the batch. (An example: In the notification "Dennis Nedry and two others left comments for you", the `total_actors` count equals three, Dennis plus the two others you mentioned in the notification.)
    - `activities` - A list of up to ten of the activity objects included within the batch, where each activity equals the state sent across in your notify call. The `activities` variable lists the *first* ten activity objects added to the batch. Each activity includes any data properties you sent along in the notify call, as well as any user properties for your actor and recipient(s). You can use the activities variable to create templates like this:
        
        ```
        {% for activity in activities %}
        <p>{{ activity.actor.name }} commented on {{ activity.pageName }} with:</p>
        
        <blockquote>
        {{ activity.content }}
        </blockquote>
        {% endfor %}
        ```
    - `actors` - A list of up to ten of the unique actors included within the batch, where each actor is a user object with the properties available on your Knock user schema. The `actors` variable lists the *first* ten actors added to the batch.
    - `timestamp` - The time in which the activity occurred, as an ISO-8601 datetime string. 

In addition to injecting custom variables, you'll also have access to data properties about the `recipient` (the user who
is receiving the message) as well as the `actor` (the user who performed the action that generated
the message.)

The custom variables will be passed to the template via the `notify` call when triggering the workflow.

### Adding control flow and iteration to your template with liquid

The Knock template editor uses Liquid tags to create the logic and control flow for notification templates. To learn more about Liquid, you can check out [its documentation](https://shopify.github.io/liquid/basics/introduction/).  

Here are a few Liquid tag types that are commonly used in Knock notification templates. 

- **If and else-if statements.** For when you want to show different copy depending on a user property or a data variable from your notify call. In the example below, we show different copy depending on whether a batch of comments includes one or many comments.
    
    ```
    {% if total_activities > 1 %} 
      {{ actor.name }} left {{ total_activities }} comments on {{ page_name }}
    {% else %}
      {{ actor.name}} left a comment on {{ page_name }}.  
      > {{ comment_body }}
    {% endif %}
    ```
    
- **For loops.** You can use Liquid's `for...in...` tag to iterate over a list of items. We can add this to our example from above to iterate over the comments in a batch and add each one to our notification.
    
    ```
    {% if total_activities > 1 %} 
      {{ actor.name}} left {{ total_activities }} comments on {{ page_name }}
    	
    	{% for activity in activities %}
    	> {{ activity.comment_body }}
    	{% endfor %}	
    
    {% else %}
      {{ actor.name}} left a comment on {{ page_name }}.  
      > {{ comment_body }}
    {% endif %}
    ```
    

There are also a number of [Liquid filters](/send-notifications/reference-liquid-helpers) you can use to mutate the variables you pass into a notification template. Here's an example that uses the `split` and `first` filters to pull the first name for a given user. 

```
You've been invited by {{ actor.name | split: " " | first }} to 
join {{ account_name }} on Knock.
```

To learn more about the variables, Liquid keywords, and other helper functions available to you in the Knock template editor, check out our [liquid helper reference](/send-notifications/reference-liquid-helpers). 

### Previewing and testing your notification template

Once you've finished editing your notification template, you can click "preview" in the top-left corner of the editor to enter preview mode. 

Your notification preview is populated with the data available in the lefthand variable explorer pane. You can use the actor and recipient dropdowns to change the user data used in your preview, and you can click on any of your data variables to edit their preview value. 

To test your notification, click "save" and navigate back to the workflow canvas by clicking the back arrow in the top-left corner. You can run actual notification tests by clicking "Run a test" in the top-right corner. Just choose your actor and recipient, provide and notify call data that you'd like included in your test, and click "Run test". 

All test runner notifications are tracked under "Messages" and have a source of "Test runner" to distinguish them from notifications you've triggered via the Knock API.

## Up next

Once you've created a workflow, the next step is to trigger that workflow from your backend with a `notify` call.
