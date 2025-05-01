import locales from "locale-codes";
import Table from "./Table";

const LocaleTable = () => {
  const rows = locales.all.map((locale) => {
    const localeName = locale.location
      ? `${locale.name}, ${locale.location}`
      : locale.name;
    return [locale.tag, localeName];
  });

  const headers = ["Locale tag", "Language name"];

  return <Table headers={headers} rows={rows} />;
};

export default LocaleTable;
