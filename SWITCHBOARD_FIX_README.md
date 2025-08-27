# Fix for ArgumentError in Integration Sources

## Problem Description

The Switchboard application was experiencing an `ArgumentError` in the integration sources module:

```
ArgumentError: the Access module supports only keyword lists (with atom keys), got: "parent"

If you want to search lists of tuples, use List.keyfind/3
```

### Stack Trace Analysis

The error occurred in the following call chain:
1. `Access.get/3` - Elixir's Access module received a string "parent" instead of expected keyword list
2. `Kernel.get_in/2` - Called Access.get/3 with incompatible data
3. `IntegrationSources.Actions.Helpers.safe_get_in/3` - Used get_in/2 without proper type checking
4. `IntegrationSources.Actions.Helpers.prepare_maybe_nil_string/2` - Called safe_get_in/3
5. `WorkflowsTriggerRehearsal.build_params/2` - Called prepare_maybe_nil_string/2 for actor field

## Root Cause

The issue was in the `safe_get_in/3` function in `IntegrationSources.Actions.Helpers`. This function was using Elixir's `get_in/2` function, which relies on the Access protocol. However, the envelope data structure contained a list of tuples like `[{"parent", value}]` rather than a keyword list with atom keys.

When `get_in/2` tried to access the path `["parent"]` on this data structure, it called `Access.get/3` with the string "parent", which caused the ArgumentError because Access expects atom keys in keyword lists.

## Solution

The fix involves replacing the unsafe `get_in/2` usage with a custom `safe_get_in/3` function that can handle multiple data structure types:

### Key Changes

1. **Enhanced `safe_get_in/3` function**: Now handles maps, keyword lists, and lists of tuples
2. **Type-safe value extraction**: Uses pattern matching and guards to safely extract values
3. **Graceful error handling**: Returns `nil` or default values instead of raising exceptions
4. **Backward compatibility**: Maintains the same function signature and behavior for valid cases

### Implementation Details

The new `safe_get_in/3` function:

- **Maps**: Handles both atom and string keys, with automatic conversion between them
- **Keyword lists**: Uses `Keyword.get/2` for proper keyword list access
- **Lists of tuples**: Uses `Enum.find/2` to locate tuples by key
- **Error recovery**: Catches `ArgumentError` and returns `nil` instead of crashing

### Files Modified

1. **`lib/integration_sources/actions/helpers.ex`**
   - Replaced `get_in/2` usage with custom `safe_get_in/3`
   - Added `safe_get_value/2` helper function
   - Enhanced `parse_variable/2` and `prepare_maybe_nil_string/2`

2. **`lib/integration_sources/actions/workflows_trigger_rehearsal.ex`**
   - Added error handling in `execute/2` function
   - Enhanced logging for debugging
   - Improved `build_params/2` function

## Testing

The fix includes comprehensive tests that verify:

- Handling of different data structure types
- Backward compatibility with existing code
- Proper error handling for edge cases
- The specific problematic case that caused the original error

## Deployment Notes

1. **Zero downtime**: This fix is backward compatible and won't break existing functionality
2. **Performance**: The new implementation has similar performance characteristics
3. **Monitoring**: Enhanced error logging will help identify similar issues in the future

## Prevention

To prevent similar issues in the future:

1. **Type checking**: Always validate data structure types before using Access protocol
2. **Safe accessors**: Use custom safe accessor functions for dynamic data structures
3. **Comprehensive testing**: Include tests for various data structure formats
4. **Error handling**: Implement graceful error handling with informative logging

## Usage Example

```elixir
# Before (would cause ArgumentError):
envelope = [{"parent", %{"user_id" => "123"}}]
get_in(envelope, ["parent", "user_id"])  # ArgumentError!

# After (works correctly):
envelope = [{"parent", %{"user_id" => "123"}}]
Helpers.safe_get_in(envelope, ["parent", "user_id"])  # Returns "123"
```

This fix resolves the Sentry issue SWITCHBOARD-3PK and prevents similar ArgumentError exceptions in the integration sources module.