import { readOpenApiSpec, readStainlessSpec } from "../../lib/openApiSpec";
import ApiReference from "../../components/ApiReference/ApiReference";

function ApiReferenceNew({ openApiSpec, stainlessSpec }) {
  return (
    <ApiReference openApiSpec={openApiSpec} stainlessSpec={stainlessSpec} />
  );
}

export async function getStaticProps() {
  const openApiSpec = await readOpenApiSpec();
  const stainlessSpec = await readStainlessSpec();

  return { props: { openApiSpec, stainlessSpec } };
}

export default ApiReferenceNew;
