import { h } from "preact";
import { assertEquals } from "@std/assert";
import { render } from "@testing-library/preact";

import "../utilities/test_dom.ts";
import Header from "./header.tsx";

Deno.test("Should render", () => {
  const title = "Browser Extension Boilerplate";
  const { container } = render(<Header title={title} />);
  assertEquals(container.textContent, title);
});
