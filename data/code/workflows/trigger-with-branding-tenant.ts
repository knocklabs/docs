const languages = {
  javascript: `
import { Knock } from "@knocklabs/node";
const knock = new Knock(process.env.KNOCK_API_KEY);

await knock.workflows.trigger("reservation-reminder-email", {
  data: {
    reservationId: reservation.id
  },
  recipients: reservation_guest_ids,
  tenant: "black-lodge"
});
    `,
  python: `
from knockapi import Knock
client = Knock(api_key="sk_12345")

client.workflows.trigger(
  key="reservation-reminder-email",
  data={
      "reservation_id": reservation.id
  },
  recipients=reservation_guest_ids,
  tenant="black-lodge"
)
  `,
  ruby: `
require "knock"
Knock.key = "sk_12345"

Knock::Workflows.trigger(
  key: "reservation-reminder-email",
  recipients: reservation_guest_ids,
  data: {
    "reservation_id": reservation.id
  },
  tenant: "black-lodge"
)
  `,
  csharp: `
var knockClient = new KnockClient(
  new KnockOptions { ApiKey = "sk_12345" });

var workflowTriggerOpts = new TriggerWorkflow {
  Data = new Dictionary<string, object>{
    {"reservation_id", reservation.Id}
  },
  Recipients = reservationGuestIds,
  Tenant = "black-lodge"
};

var result = await knockClient.Workflows.Trigger("reservation-reminder-email", workflowTriggerOpts)
  `,
  elixir: `
knock_client = MyApp.Knock.client()

Knock.Workflows.trigger("reservation-reminder-email", %{
  data: %{
    reservation_id: reservation.id
  },
  recipients: reservation_guest_ids,
  tenant: "black-lodge"
})
  `,
  php: `
use Knock\\KnockSdk\\Client;

$client = new Client('sk_12345');

$client->workflows()->trigger('reservation-reminder-email', [
  'data' => [
    'reservation_id' => $reservation()->id()
  ],
  'recipients' => $reservationGuestIds,
  'tenant' => "black-lodge"
]);
  `,
  go: `
ctx := context.Background()
knockClient, _ := knock.NewClient(knock.WithAccessToken("sk_12345"))

request := &knock.TriggerWorkflowRequest{
  Workflow:   "reservation-reminder-email",
  Data: map[string]interface{}{
      "reservation_id": reservation.ID
  },
  Tenant: "black-lodge"
}

for _, r := range reservationGuestIds {
  request.AddRecipientByID(r)
}

result, _ := knockClient.Workflows.Trigger(ctx, request, nil)
  `,
  java: `
import app.knock.api.KnockClient;
import app.knock.api.model.*;

KnockClient client = KnockClient.builder()
  .apiKey("sk_12345")
  .build();

WorkflowTriggerRequest workflowTrigger = WorkflowTriggerRequest.builder()
  .key("reservation-reminder-email")
  .recipients(reservationGuestIds)
  .data("reservation_id", reservation.getId())
  .tenant("black-lodge")
  .build();

WorkflowTriggerResponse result = client.workflows().trigger(workflowTrigger);
  `,
};

export default languages;
