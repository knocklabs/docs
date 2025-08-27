# Fix for IntegrationSources.Actions.Helpers
# This file contains the corrected safe_get_in/3 function to handle the ArgumentError

defmodule IntegrationSources.Actions.Helpers do
  @moduledoc """
  Helper functions for integration source actions.
  Fixed to handle non-keyword list data structures properly.
  """

  @doc """
  Safely gets a value from a nested data structure using a path.
  
  This function handles cases where the data structure might not support
  the Access protocol for all path elements, preventing ArgumentError
  when encountering strings in paths.
  
  ## Parameters
  
  - `accessible`: The data structure to traverse
  - `path`: A list representing the path to the desired value
  - `default`: The default value to return if the path is not found (optional)
  
  ## Examples
  
      iex> safe_get_in(%{parent: %{child: "value"}}, [:parent, :child])
      "value"
      
      iex> safe_get_in([{"parent", %{child: "value"}}], ["parent", "child"])
      "value"
      
      iex> safe_get_in(%{}, [:nonexistent], "default")
      "default"
  """
  def safe_get_in(accessible, path, default \\ nil)

  def safe_get_in(accessible, [], _default), do: accessible

  def safe_get_in(accessible, [key | rest], default) do
    case safe_get_value(accessible, key) do
      nil -> default
      value -> safe_get_in(value, rest, default)
    end
  end

  # Private function to safely get a value from different data structures
  defp safe_get_value(data, key) when is_map(data) do
    # Handle maps with atom or string keys
    cond do
      Map.has_key?(data, key) -> Map.get(data, key)
      is_binary(key) and Map.has_key?(data, String.to_existing_atom(key)) -> 
        Map.get(data, String.to_existing_atom(key))
      is_atom(key) and Map.has_key?(data, Atom.to_string(key)) -> 
        Map.get(data, Atom.to_string(key))
      true -> nil
    end
  rescue
    ArgumentError -> nil
  end

  defp safe_get_value(data, key) when is_list(data) do
    # Handle keyword lists and lists of tuples
    cond do
      Keyword.keyword?(data) -> Keyword.get(data, key)
      true -> 
        # Handle list of tuples like [{"parent", value}]
        case Enum.find(data, fn
          {k, _v} when k == key -> true
          _ -> false
        end) do
          {_k, v} -> v
          _ -> nil
        end
    end
  end

  defp safe_get_value(_data, _key), do: nil

  @doc """
  Parses a variable from the envelope data safely.
  
  This function handles the case where the field might contain a path
  that needs to be traversed safely through the envelope data.
  """
  def parse_variable(field, envelope) when is_binary(field) do
    # If field is a simple string, try to get it directly
    case safe_get_in(envelope, [field]) do
      nil -> 
        # Try parsing as a path (e.g., "parent.child")
        path = String.split(field, ".")
        safe_get_in(envelope, path)
      value -> value
    end
  end

  def parse_variable(field, _envelope), do: field

  @doc """
  Prepares a maybe nil string value from the envelope.
  
  This is the function that was causing the original error.
  Now it uses safe_get_in to prevent ArgumentError.
  """
  def prepare_maybe_nil_string(field, envelope) do
    case parse_variable(field, envelope) do
      nil -> nil
      value when is_binary(value) -> value
      value -> to_string(value)
    end
  end
end