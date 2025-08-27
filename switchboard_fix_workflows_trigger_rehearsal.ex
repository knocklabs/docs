# Fix for IntegrationSources.Actions.WorkflowsTriggerRehearsal
# This file shows the corrected usage in the WorkflowsTriggerRehearsal module

defmodule IntegrationSources.Actions.Action.Switchboard.Config.EventActionMappings.Actions.WorkflowsTriggerRehearsal do
  @moduledoc """
  Action for triggering workflow rehearsals.
  Fixed to handle envelope data structures that may not support Access protocol.
  """

  alias IntegrationSources.Actions.Helpers

  @doc """
  Executes the workflow trigger rehearsal action.
  """
  def execute(action, envelope) do
    try do
      params = build_params(action, envelope)
      # Continue with the rest of the execution logic
      {:ok, params}
    rescue
      ArgumentError = e ->
        # Log the error with more context
        require Logger
        Logger.error("ArgumentError in WorkflowsTriggerRehearsal.execute/2: #{inspect(e)}")
        Logger.error("Action: #{inspect(action)}")
        Logger.error("Envelope structure: #{inspect(envelope, limit: :infinity)}")
        
        # Return a more descriptive error
        {:error, "Failed to parse action parameters: #{Exception.message(e)}"}
    end
  end

  @doc """
  Builds parameters for the workflow trigger rehearsal.
  
  This function now uses the improved safe_get_in function to handle
  various data structure types without causing ArgumentError.
  """
  def build_params(action, envelope) do
    %{
      # Use the fixed prepare_maybe_nil_string function
      actor: Helpers.prepare_maybe_nil_string(action.actor, envelope),
      # Add other parameters as needed
      recipients: Helpers.prepare_maybe_nil_string(action.recipients, envelope),
      data: prepare_data(action.data, envelope),
      tenant: Helpers.prepare_maybe_nil_string(action.tenant, envelope)
    }
  end

  # Helper function to prepare data payload
  defp prepare_data(data_field, envelope) when is_binary(data_field) do
    case Helpers.parse_variable(data_field, envelope) do
      nil -> %{}
      value when is_map(value) -> value
      value -> %{data: value}
    end
  end

  defp prepare_data(data_field, _envelope) when is_map(data_field), do: data_field
  defp prepare_data(_data_field, _envelope), do: %{}
end