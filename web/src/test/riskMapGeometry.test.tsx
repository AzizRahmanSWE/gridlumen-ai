import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { RiskMap } from "../components/operations/RiskMap";
import { CANONICAL_GEOJSON } from "../lib/fixtures/canonicalData";

describe("RiskMap geometry rendering", () => {
  it("renders all eight zone polygons with updated screening map label", () => {
    render(
      <RiskMap
        geojson={CANONICAL_GEOJSON.storm}
        selectedZoneId="cooksville-central"
        onSelectZone={() => {}}
      />,
    );

    expect(
      screen.getByRole("img", {
        name: /Mississauga public screening geography map/i,
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Cooksville Central, Critical risk\. Select zone\./i),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/Meadowvale North, Critical risk\. Select zone\./i),
    ).toBeInTheDocument();
  });

  it("invokes onSelectZone when a map polygon is clicked", () => {
    const onSelectZone = vi.fn();
    render(
      <RiskMap
        geojson={CANONICAL_GEOJSON.storm}
        selectedZoneId="cooksville-central"
        onSelectZone={onSelectZone}
      />,
    );

    fireEvent.click(screen.getByLabelText(/Port Credit East, Critical risk\. Select zone\./i));
    expect(onSelectZone).toHaveBeenCalledWith("port-credit-east");
  });
});
