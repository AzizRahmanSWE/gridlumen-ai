import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../App";
import { MANDATORY_DISCLAIMER } from "../data/types";
import {
  CANONICAL_GEOJSON,
  CANONICAL_SUMMARIES,
} from "../lib/fixtures/canonicalData";
import type { AllScenariosData } from "../lib/scenarioData";

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

describe("App integration (recording layout)", () => {
  it("defaults to storm with Cooksville Central and storm KPIs", () => {
    render(<App preloaded={preloaded} />);

    expect(screen.getByRole("heading", { name: /Cooksville Central/i })).toBeInTheDocument();
    const detailPanel = screen.getByLabelText(/Details for Cooksville Central/i);
    expect(within(detailPanel).getByText("87")).toBeInTheDocument();

    const kpiSection = screen.getByLabelText(/Scenario KPIs/i);
    expect(within(kpiSection).getByText("3")).toBeInTheDocument();
  });

  it("shows prototype disclaimer and data status chips above the map", () => {
    render(<App preloaded={preloaded} />);

    expect(
      screen.getAllByText(new RegExp(MANDATORY_DISCLAIMER.slice(0, 40))).length,
    ).toBeGreaterThan(0);
    expect(screen.getByLabelText(/Data status/i)).toHaveTextContent(/Public geography/i);
    expect(screen.getByLabelText(/Data status/i)).toHaveTextContent(
      /Representative risk values/i,
    );
  });

  it("switches scenario via HeroControls and updates detail panel", () => {
    render(<App preloaded={preloaded} />);

    fireEvent.click(
      screen.getByRole("button", { name: /Heatwave \+ Evening EV Demand/i }),
    );

    expect(
      screen.getByRole("heading", { name: /Meadowvale North/i }),
    ).toBeInTheDocument();
    const meadowPanel = screen.getByLabelText(/Details for Meadowvale North/i);
    expect(within(meadowPanel).getByText("91")).toBeInTheDocument();
  });

  it("selects zone from intervention queue beneath the map", () => {
    render(<App preloaded={preloaded} />);

    const queue = screen.getByRole("table");
    const portCreditRow = within(queue).getByRole("button", {
      name: /3\. Port Credit East/i,
    });
    fireEvent.click(portCreditRow);

    expect(
      screen.getByRole("heading", { name: /Port Credit East/i }),
    ).toBeInTheDocument();
  });

  it("opens secured utility layer modal from HeroControls", () => {
    render(<App preloaded={preloaded} />);

    fireEvent.click(
      screen.getByRole("button", { name: /Secured Utility Layer/i }),
    );
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveTextContent(/generalized neighbourhood risk zones/i);
  });

  it("does not duplicate scenario selectors", () => {
    render(<App preloaded={preloaded} />);

    const controls = screen.getByLabelText(/Scenario controls/i);
    const scenarioToggles = within(controls)
      .getAllByRole("button")
      .filter((btn) => btn.hasAttribute("aria-pressed"));
    expect(scenarioToggles).toHaveLength(3);
    expect(screen.queryByRole("group", { name: /Scenario selection/i })).toBeNull();
  });
});
