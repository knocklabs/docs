import { OpenAPIV3 } from "@scalar/openapi-types";
import { PropertyRow } from "../SchemaProperties/PropertyRow";
import SchemaProperty from "../SchemaProperties/SchemaProperty";

type Props = {
  parameters: OpenAPIV3.ParameterObject[];
};

const OperationParameters = ({ parameters }: Props) => {
  return (
    <PropertyRow.Wrapper>
      {parameters.map((parameter) => {
        const schema = parameter.schema as OpenAPIV3.SchemaObject;
        const mergedSchema = {
          ...schema,
          description: parameter.description,
        };

        return (
          <SchemaProperty
            key={parameter.name}
            name={parameter.name}
            schema={mergedSchema}
          />
        );
      })}
    </PropertyRow.Wrapper>
  );
};

export default OperationParameters;
