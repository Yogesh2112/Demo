import TutorialsDisplay from "./TutorialsDisplay";
import LocaleContext from "./localeContextProvider";
import React, { useContext } from "react";

function TutorialsPage() {
  const { locale } = useContext(LocaleContext);
  return (
    <div
      className="tutorial-container"
      style={{ width: "1200px", margin: "auto" }}
    >
      <TutorialsDisplay locale={locale} />
    </div>
  );
}

export default TutorialsPage;
