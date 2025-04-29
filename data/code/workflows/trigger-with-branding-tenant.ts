const languages = {
  node: `
import Knock from "@knocklabs/node";
const knock = new Knock({ bearerToken: process.env.KNOCK_API_KEY });

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
require "knockapi"

knock = Knockapi::Client.new(bearer_token: "sk_12345")

knock.workflows.trigger("reservation-reminder-email",
  recipients: reservation_guest_ids,
  data: {
    reservation_id: reservation.id
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
import (
	"context"

	"github.com/knocklabs/knock-go"
	"github.com/knocklabs/knock-go/option"
	"github.com/knocklabs/knock-go/param"
)
ctx := context.Background()
knockClient := knock.NewClient(option.WithBearerToken("sk_12345"))

params := knock.WorkflowTriggerParams{
  Data: map[string]interface{}{
    "reservation_id": reservation.ID
  },
  Tenant: "black-lodge",
  Recipients: make([]knock.RecipientRequestUnionParam, len(reservationGuestIds)),
}

for i, r := range reservationGuestIds {
  params.Recipients[i] = r
}

result, _ := knockClient.Workflows.Trigger(ctx, "reservation-reminder-email", params)
  `,
  java: `
import app.knock.api.client.KnockClient;
import app.knock.api.client.okhttp.KnockOkHttpClient;
import app.knock.api.models.workflows.WorkflowTriggerParams;

KnockClient client = KnockOkHttpClient.builder()
    .bearerToken("sk_12345")
    .build();

var result = client.workflows().trigger(
    WorkflowTriggerParams.builder()
        .key("reservation-reminder-email")
        .recipients(reservationGuestIds)
        .data(data -> {
            data.put("reservation_id", reservation.getId());
            return data;
        })
        .tenant("black-lodge")
        .build()
);
  `,
};

export default languages;
