# Switchboard Batch Messages Endpoint Implementation Plan

## Overview

This document outlines the implementation plan for a new private endpoint in switchboard to retrieve multiple messages by their IDs for a single environment.

## Existing Pattern Analysis

Based on the OpenAPI specifications found in `data/specs/api/openapi.yml`, I can identify the following patterns:

### Single Message Endpoint Pattern

**Current single message fetch endpoint:**
```
GET /v1/messages/{message_id}
```

**Response:** Returns a single `Message` object with the following key fields:
- `id` (string): The message ID
- `environment` (string): The environment ID
- `recipient` (object): Recipient information
- `status` (string): Delivery status
- `data` (object): Message data
- `channel_id` (string): Channel ID
- `workflow` (string): Workflow key
- `created_at` (string): Creation timestamp
- `updated_at` (string): Update timestamp

### Existing Batch Endpoints Pattern

The API already has several batch endpoints:
- `GET /v1/messages/batch/content` - Batch content retrieval
- `POST /v1/messages/batch/seen` - Batch mark as seen
- `POST /v1/messages/batch/read` - Batch mark as read
- etc.

These use a `BatchMessagesStatusRequest` model with:
```json
{
  "message_ids": ["id1", "id2", "id3"]
}
```

## Proposed Implementation

### 1. New Endpoint Specification

**Endpoint:** `GET /v1/messages/batch`

**Query Parameters:**
- `message_ids` (required): Array of message IDs (max 50)
- `environment` (optional): Environment filter (for private endpoint security)

**Example Request:**
```
GET /v1/messages/batch?message_ids=msg1,msg2,msg3&environment=prod
```

### 2. Request/Response Models

**Request Model** (`BatchMessagesGetRequest`):
```json
{
  "message_ids": ["string"],  // max 50 items
  "environment": "string"     // optional environment filter
}
```

**Response Model** (`BatchMessagesGetResponse`):
```json
{
  "messages": [
    {
      "id": "string",
      "environment": "string",
      "recipient": { ... },
      "status": "string",
      "data": { ... },
      "channel_id": "string",
      "workflow": "string",
      "created_at": "string",
      "updated_at": "string"
      // ... other Message fields
    }
  ],
  "not_found": ["string"],    // IDs that weren't found
  "total_requested": "integer",
  "total_found": "integer"
}
```

### 3. Implementation Details

**Location in Switchboard:**
- Controller: `SwitchboardWeb.V1.MessageController`
- Action: `batch_get/2`
- Route: `GET /v1/messages/batch`

**Validation Requirements:**
- Maximum 50 message IDs per request
- All message IDs must belong to the same environment
- Message IDs must be valid format
- Environment parameter validation (if provided)

**Security Considerations:**
- This is a private endpoint - requires appropriate authentication
- Environment-level access control
- Rate limiting (suggest tier 4 like single message endpoint)

### 4. Error Handling

**Error Cases:**
- `400 Bad Request`: Invalid request parameters (too many IDs, invalid format)
- `401 Unauthorized`: Invalid authentication
- `403 Forbidden`: Access denied for environment
- `404 Not Found`: Some or all messages not found (still return partial results)
- `429 Too Many Requests`: Rate limit exceeded

**Partial Results:**
- Always return found messages even if some IDs are not found
- Include `not_found` array in response for missing IDs

### 5. Database Query Optimization

**Recommended Query Strategy:**
```elixir
# Efficient batch query with single database hit
def get_messages_batch(message_ids, environment \\ nil) do
  query = 
    from m in Message,
    where: m.id in ^message_ids,
    where: ^environment_filter(environment)

  messages = Repo.all(query)
  
  found_ids = MapSet.new(messages, & &1.id)
  not_found = Enum.reject(message_ids, &MapSet.member?(found_ids, &1))
  
  {messages, not_found}
end
```

### 6. Testing Strategy

**Unit Tests:**
- Controller tests for endpoint behavior
- Service tests for batch retrieval logic
- Validation tests for request parameters

**Integration Tests:**
- End-to-end API tests
- Database query performance tests
- Authentication and authorization tests

**Test Cases:**
1. **Happy Path**: Request 1-50 valid message IDs, all found
2. **Partial Results**: Some IDs found, some not found
3. **No Results**: None of the requested IDs found
4. **Validation Errors**: 
   - Too many IDs (>50)
   - Invalid ID format
   - Empty request
5. **Authorization**:
   - Valid private key access
   - Invalid authentication
   - Cross-environment access denial
6. **Edge Cases**:
   - Duplicate IDs in request
   - Very large message objects
   - Environment filtering

### 7. Performance Considerations

**Caching Strategy:**
- Consider Redis caching for frequently accessed messages
- Cache TTL based on message immutability after delivery

**Database Indexing:**
- Ensure efficient indexing on message ID and environment
- Consider composite indexes for common query patterns

**Memory Management:**
- Limit response size to prevent memory issues
- Consider pagination for very large result sets

### 8. OpenAPI Specification Updates

**New endpoint definition for `data/specs/api/openapi.yml`:**

```yaml
/v1/messages/batch:
  get:
    callbacks: {}
    description: Retrieves multiple messages by their IDs for a single environment. Maximum 50 messages per request.
    operationId: getBatchMessages
    parameters:
      - description: Array of message IDs to retrieve (max 50)
        in: query
        name: message_ids
        required: true
        schema:
          type: array
          items:
            type: string
          maxItems: 50
          example: ["msg1", "msg2", "msg3"]
      - description: Environment filter for additional security
        in: query
        name: environment
        required: false
        schema:
          type: string
          example: "production"
    responses:
      "200":
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/BatchMessagesGetResponse'
        description: OK
      "400":
        description: Bad Request - Invalid parameters
      "401":
        description: Unauthorized
      "403":
        description: Forbidden
    summary: Get batch messages
    tags:
      - Messages
    x-ratelimit-tier: 4
    x-retention-policy: true
    x-private-endpoint: true
```

### 9. Stainless Configuration Updates

**Updates needed in `data/specs/api/stainless.yml`:**

```yaml
messages:
  methods:
    # ... existing methods ...
    batch_get:
      endpoint: get /v1/messages/batch
      private: true
```

## Implementation Checklist

- [ ] Create new controller action in `SwitchboardWeb.V1.MessageController`
- [ ] Implement batch retrieval service logic
- [ ] Add request/response validation schemas
- [ ] Update OpenAPI specifications
- [ ] Update Stainless configuration
- [ ] Add comprehensive test coverage
- [ ] Implement rate limiting
- [ ] Add monitoring and logging
- [ ] Update API documentation
- [ ] Performance testing and optimization

## Next Steps

1. **Create the endpoint implementation** in the actual switchboard codebase
2. **Add the OpenAPI specification** to make it available in the API docs
3. **Implement comprehensive tests** covering all edge cases
4. **Add monitoring** for performance and usage tracking
5. **Update documentation** with usage examples

This implementation follows the established patterns in the Knock API while providing the efficient batch retrieval functionality requested.