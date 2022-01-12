---
title: "Reference: liquid helpers"
---

This is a reference of common Knock variables, Liquid syntax, and Knock-specific liquid helpers that you can use within the Knock template editor. 


## Common Knock variables
When you build workflows in Knock, we auto-generate certain pieces of state (as a result of batch functions and other workflow steps) that you can use to control the copy you display to your end users in your notification templates. 

| Variable           | Description                                                                                                                                                                                                                          |
|--------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `actor`            | User schema properties of the actor that triggered the workflow.                                                                                                                                                                     |
| `actors`           | A list of up to 10 of the unique actors included within the batch, where each actor is a user object with the properties available on your Knock user schema.                                                                        |
| `recipient`        | User schema properties of the actor that triggered the workflow.                                                                                                                                                                     |
| `activities`       | A list of the activity objects included within the batch, where each activity equals the state sent across in your notify call, and also includes the actor who performed the message and a timestamp of when the activity occurred. |
| `vars`             | Account and environment specific variables.                                                                                                                                                                                          |
| `total_activities` | The count of activities associated with a workflow run.                                                                                                                                                                              |
| `total_actors`     | The count of unique actors associated with a workflow run.                                                                                                                                                                           |
| `timestamp`        | The time in which the activity occurred, as an ISO-8601 datetime string.                                                                                                                                                             |



## Common Liquid keywords
The Knock template editor uses Liquid syntax for control flow and variable declaration. Here are a few of the most common Liquid keywords our customers use within Knock. For a complete reference guide we recommend the excellent [Liquid documentation](https://shopify.github.io/liquid/). 

| Keyword         | Description                                                                                             |
|-----------------|---------------------------------------------------------------------------------------------------------|
| `{{ }}`         | Denotes rendering output of an object or variable.                                                      |
| `{% %}`         | Denotes logic and control flow.                                                                         |
| `if/else/elsif` | Conditional branching.                                                                                  |
| `case/when`     | Creates a switch statement to execute a particular block of code when a variable has a specified value. |
| `and/or`        | Add additional conditions to a tag.                                                                     |
| `for`           | Repeatedly executes a block of code.                                                                    |
| `assign`        | Creates a new named variable.                                                                           |
| `capture`       | Captures the string inside of the opening and closing tags and assigns it to a variable.                |

## Knock-specific Liquid helpers

| Helper             | Description               | Example     |
|--------------------|---------------------------|-------------|
| `timezone`         | Takes an ISO 8601 timestamp and returns it in the [IANA tz  database timezone](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) provided. | <code>{{timestamp &#124; timezone: "America/New_York"}}</code> |
| `format_number`    | Takes an integer and formats it to the local number format of the `locale` provided to format_number helper.                                                                                       | <code>{{ 10000 &#124; format_number: "en-US" }}</code>                   |
| `currency`         | Takes an integer and returns a USD formatted value with two decimal points. You can pass a currency type and a `locale` through to the currency helper to tell it which currency to use.  | <code>{{ 10 &#124; currency: “GBP”, locale: “en-GB” }}</code>            |
| `rounded_currency` | Takes an integer and returns a USD formatted value rounded to nearest whole number. \n You can pass a currency type and a `locale` through to the currency helper to tell it which currency to use. | <code>{{ 10.99 &#124; rounded_currency: “GBP”, locale: “en-GB” }}</code> |
| `json`             | Takes a value and returns as a formatted JSON strong.                                                                                                                                                                    | <code>{{ recipient &#124; json }}</code>                                 |
| `pluralize`        | Takes an integer and a pluralize helper with two strings. If the integer is one, the helper returns the first string. If the helper is greater than one, it returns the second string.                                   | <code>{{ total_actors &#124; pluralize: "user", "users" }}</code>         |
| `titlecase`        | Takes a string and reformats it into Title case.                                                                                                                                                                         | <code>{{ project_name &#124; titlecase }}</code>                         |
| `md5`              | Takes a string and returns an md5 hash.                                                                                                                                                                                  | <code>{{ recipient.id &#124; md5 }}</code>                               |
| `sha256`           | Takes a string and returns an sha256 hash.                                                                                                                                                                               | <code>{{ recipient.id &#124; sha256 }}</code>                            |
| `hmac_sha256`      | Takes a string and returns an hmac hash given a key provided to hmac_sha256 helper.                                                                                                                                      | <code>{{ recipient.id &#124; hmac_sha256: "some-key" }}</code>           |

### Localization parameters
A few of Knock's Liquid helpers (such as `currency` and `format_number`) take an optional locale parameter to format the output of the helper into a localized format. You can find a list of supported locales below. If we're missing a locale that you'd like us to support, please [reach out](mailto:support@knock.app). 

**Supported locales:** `af`, `ar`, `az`, `be`, `bg`, `bn`, `bs`, `ca`, `cs`, `cy`, `da`, `de`, `el,` `en`, `eo`, `es`, `et`, `eu`, `fa`, `fi`, `fr`, `gl`, `he`, `hi`, `hr`, `hu`, `id`, `is`, `it`, `ja`, `ka`, `km`, `kn`, `ko`, `lb`, `lo`, `lt`, `lv`, `mk`, `ml`, `mn`, `mr`, `ms`, `nb`, `ne`, `nl`, `nn`, `or`, `pa`, `pl`, `pt`, `rm`, `ro`, `ru`, `sk`, `sl`, `sq`, `sr`, `sw`, `ta`, `te`, `th`, `tr`, `tt`, `ug`, `ur`, `uz`, `vi`, `wo`, `zh`
