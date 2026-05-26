import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { OperationsWorkspace } from "../components/operations/OperationsWorkspace";
import {
  CANONICAL_GEOJSON,
  CANONICAL_SUMMARIES,
} from "../lib/fixtures/canonicalData";
import type { AllScenariosData } from "../lib/scenarioData";
import { MANDATORY_DISCLAIMER } from "../data/types";

const preloaded: AllScenariosData = {
  normal: {
    summary: CANONICAL_SUMMARIES.normal,
    geojson: CANONICAL_GEOJSON.normal,
  },
  storm: {
    summary: CANONICAL_SUMMARIES.storm,
    geojson: CANONICAL_GEOJSON.storm,
  },
  heatwave_ev: {
    summary: CANONICAL_SUMMARIES.heatwave_ev,
    geojson: CANONICAL_GEOJSON.heatwave_ev,
  },
};

describe("OperationsWorkspace", () => {
  it("shows prototype disclaimer", () => {
    render(
      <OperationsWorkspace preloaded={preloaded} initialScenario="storm" />,
    );
    expect(screen.getAllByText(new RegExp(MANDATORY_DISCLAIMER.slice(0, 30))).length).toBeGreaterThan(0);
  });

  it("switches scenarios and updates zone detail", () => {
    render(
      <OperationsWorkspace preloaded={preloaded} initialScenario="storm" />,
    );

    expect(screen.getByRole("heading", { name: /Cooksville Central/i })).toBeInTheDocument();
    const detailPanel = screen.getByLabelText(/Details for Cooksville Central/i);
    expect(within(detailPanel).getByText("87")).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /Heatwave \+ Evening EV Demand/i }),
    );

    expect(
      screen.getByRole("heading", { name: /Meadowvale North/i }),
    ).toBeInTheDocument();
    const meadowPanel = screen.getByLabelText(/Details for Meadowvale North/i);
    expect(within(meadowPanel).getByText("91")).toBeInTheDocument();
  });

  it("selects zone from intervention queue row", () => {
    render(
      <OperationsWorkspace preloaded={preloaded} initialScenario="storm" />,
    );

    const queue = screen.getByRole("table");
    const portCreditRow = within(queue).getByRole("button", {
      name: /3\. Port Credit East/i,
    });
    fireEvent.click(portCreditRow);

    expect(
      screen.getByRole("heading", { name: /Port Credit East/i }),
    ).toBeInTheDocument();
    const portPanel = screen.getByLabelText(/Details for Port Credit East/i);
    expect(within(portPanel).getByText("78")).toBeInTheDocument();
  });

  it("opens secured utility layer modal without asset data", () => {
    render(
      <OperationsWorkspace preloaded={preloaded} initialScenario="storm" />,
    );

    fireEvent.click(screen.getByRole("button", { name: /Secured layer/i }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(/generalized neighbourhood risk zones/i);
    expect(dialog).not.toHaveTextContent(/transformer_id/i);
    expect(dialog).not.toHaveTextContent(/feeder_id/i);
  });

  it("renders map zones with risk labels", () => {
    render(
      <OperationsWorkspace preloaded={preloaded} initialScenario="storm" />,
    );
    const map = screen.getByRole("img", {
      name: /Mississauga public screening geography map/i,
    });
    expect(
      within(map).getByLabelText(/Cooksville Central, Critical risk\. Select zone/i),
    ).toBeInTheDocument();
  });

  it("places intervention queue below the map in the left column", () => {
    render(
      <OperationsWorkspace preloaded={preloaded} initialScenario="storm" />,
    );

    const mapSection = screen.getByLabelText(/Risk map and intervention queue/i);
    const map = within(mapSection).getByRole("img", {
      name: /Mississauga public screening geography map/i,
    });
    const queue = within(mapSection).getByRole("table");

    expect(
      map.compareDocumentPosition(queue) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });
});
