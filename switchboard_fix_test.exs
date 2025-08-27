# Test file to verify the fix works correctly
# This demonstrates the fix for the ArgumentError in integration sources

defmodule IntegrationSources.Actions.HelpersTest do
  use ExUnit.Case, async: true

  alias IntegrationSources.Actions.Helpers

  describe "safe_get_in/3" do
    test "handles maps with atom keys" do
      data = %{parent: %{child: "value"}}
      assert Helpers.safe_get_in(data, [:parent, :child]) == "value"
    end

    test "handles maps with string keys" do
      data = %{"parent" => %{"child" => "value"}}
      assert Helpers.safe_get_in(data, ["parent", "child"]) == "value"
    end

    test "handles mixed key types" do
      data = %{parent: %{"child" => "value"}}
      assert Helpers.safe_get_in(data, [:parent, "child"]) == "value"
    end

    test "handles keyword lists" do
      data = [parent: [child: "value"]]
      assert Helpers.safe_get_in(data, [:parent, :child]) == "value"
    end

    test "handles list of tuples (the problematic case)" do
      # This is the case that was causing the ArgumentError
      data = [{"parent", %{"child" => "value"}}]
      assert Helpers.safe_get_in(data, ["parent", "child"]) == "value"
    end

    test "returns default for missing keys" do
      data = %{parent: %{}}
      assert Helpers.safe_get_in(data, [:parent, :missing], "default") == "default"
    end

    test "returns nil for missing keys without default" do
      data = %{parent: %{}}
      assert Helpers.safe_get_in(data, [:parent, :missing]) == nil
    end

    test "handles deeply nested structures" do
      data = %{
        level1: %{
          "level2" => [
            {"level3", %{level4: "deep_value"}}
          ]
        }
      }
      
      # This would have caused ArgumentError before the fix
      assert Helpers.safe_get_in(data, [:level1, "level2", "level3", :level4]) == "deep_value"
    end
  end

  describe "prepare_maybe_nil_string/2" do
    test "handles simple string fields" do
      envelope = %{"actor" => "user123"}
      assert Helpers.prepare_maybe_nil_string("actor", envelope) == "user123"
    end

    test "handles nested path fields" do
      envelope = %{"parent" => %{"actor" => "user123"}}
      assert Helpers.prepare_maybe_nil_string("parent.actor", envelope) == "user123"
    end

    test "handles the problematic case from the error" do
      # This simulates the envelope structure that was causing the ArgumentError
      envelope = [{"parent", %{"actor" => "user123"}}]
      assert Helpers.prepare_maybe_nil_string("parent.actor", envelope) == "user123"
    end

    test "returns nil for missing fields" do
      envelope = %{}
      assert Helpers.prepare_maybe_nil_string("missing", envelope) == nil
    end

    test "converts non-string values to strings" do
      envelope = %{"count" => 42}
      assert Helpers.prepare_maybe_nil_string("count", envelope) == "42"
    end
  end
end

# Test for the WorkflowsTriggerRehearsal module
defmodule IntegrationSources.Actions.WorkflowsTriggerRehearsalTest do
  use ExUnit.Case, async: true

  alias IntegrationSources.Actions.Action.Switchboard.Config.EventActionMappings.Actions.WorkflowsTriggerRehearsal

  describe "build_params/2" do
    test "successfully builds params with the fixed implementation" do
      action = %{
        actor: "parent.user_id",
        recipients: "recipients",
        data: "event_data",
        tenant: "tenant_id"
      }

      # This envelope structure was causing the original ArgumentError
      envelope = [
        {"parent", %{"user_id" => "user123"}},
        {"recipients", "recipient456"},
        {"event_data", %{"type" => "test"}},
        {"tenant_id", "tenant789"}
      ]

      # This should no longer raise ArgumentError
      assert {:ok, params} = WorkflowsTriggerRehearsal.execute(action, envelope)
      
      assert params.actor == "user123"
      assert params.recipients == "recipient456"
      assert params.data == %{"type" => "test"}
      assert params.tenant == "tenant789"
    end

    test "handles missing fields gracefully" do
      action = %{
        actor: "missing_field",
        recipients: "recipients",
        data: "event_data",
        tenant: "tenant_id"
      }

      envelope = [
        {"recipients", "recipient456"},
        {"event_data", %{"type" => "test"}},
        {"tenant_id", "tenant789"}
      ]

      assert {:ok, params} = WorkflowsTriggerRehearsal.execute(action, envelope)
      
      assert params.actor == nil
      assert params.recipients == "recipient456"
    end
  end
end