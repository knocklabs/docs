import { div } from "";
import Table from "./Table";

const DataSyncTable = () => (
  <Table
    headers={["Name", "Type", "Description"]}
    rows={[
      [
        "message_id",
        "string",
        "The unique identifier for this message and the primary key for this table",
      ],
      ["account_id", "string", "The UUID of the message's account"],
      ["environment_id", "string", "The UUID of the message's environment"],
      ["environment_name", "string", "The name of the message's environment"],
      ["environment_slug", "string", "The slug of the message's environment"],
      [
        "channel_id",
        "string",
        "The UUID of the channel the message was sent on",
      ],
      [
        "channel_key",
        "string",
        "The unique key of the channel the message was sent on",
      ],
      [
        "channel_name",
        "string",
        "The name of the channel the message was sent on",
      ],
      [
        "channel_provider",
        "string",
        "The provider for the channel the message was sent on",
      ],
      ["channel_type", "string", "The type of channel the message was sent on"],
      [
        "workflow_id",
        "string",
        "The UUID of the version of the workflow that the message belongs to",
      ],
      [
        "workflow_key",
        "string",
        "The unique key of the workflow the message belongs to",
      ],
      [
        "step_ref",
        "string",
        "The reference of the step on the workflow that the message belongs to",
      ],
      ["recipient_id", "string", "The ID of the recipient for the message"],
      [
        "recipient_type",
        "string",
        <div>
          The{" "}
          <a
            target="_blank"
            href="https://docs.knock.app/send-and-manage-data/recipients"
          >
            type of recipient for the message
          </a>
          , can be a user or an object
        </div>,
      ],
      ["tenant_id", "string", "The tenant associated with this message"],
      [
        "exec_mode",
        "string",
        <div>
          The execution mode of the workflow. Possible values are:
          <ul>
            <li>
              <code>trigger</code> - from the API
            </li>
            <li>
              <code>rehearse</code> - test run
            </li>
            <li>
              <code>rehearse_step</code> - test run a single step
            </li>
            <li>
              <code>integration</code> - from an event integration source
            </li>
            <li>
              <code>scheduled</code> - previously scheduled execution
            </li>
          </ul>
        </div>,
      ],
      [
        "message_status",
        "string",
        <div>
          The latest{" "}
          <a
            target="_blank"
            href="https://docs.knock.app/send-notifications/message-statuses#delivery-status"
          >
            delivery status of a message
          </a>
          .
        </div>,
      ],
      [
        "inserted_at",
        "timestamp",
        "The timestamp of when the message was created",
      ],
      [
        "updated_at",
        "timestamp",
        "The timestamp of when the message was last updated",
      ],
      [
        "archived_at",
        "timestamp",
        "The timestamp of when the message was archived",
      ],
      ["seen_at", "timestamp", "The timestamp of when the message was seen"],
      ["read_at", "timestamp", "The timestamp of when the message was read"],
      [
        "clicked_at",
        "timestamp",
        "The timestamp of when a link in the message was clicked",
      ],
      [
        "interacted_at",
        "timestamp",
        "The timestamp of when the message was interacted with",
      ],
      [
        "has_been_seen",
        "integer (0 = false, 1 = true)",
        "Whether the message has been seen",
      ],
      [
        "has_been_read",
        "integer (0 = false, 1 = true)",
        "Whether the message has been read",
      ],
      [
        "has_been_clicked",
        "integer (0 = false, 1 = true)",
        "Whether a link in the message has been clicked",
      ],
      [
        "has_been_interacted",
        "integer (0 = false, 1 = true)",
        "Whether the message has been interacted with",
      ],
      [
        "has_been_archived",
        "integer (0 = false, 1 = true)",
        "Whether the message has been archived",
      ],
    ]}
  />
);

export default DataSyncTable;
