import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import App from "./app.vue";

describe("App", () => {
  it("renders the placeholder text", () => {
    const wrapper = mount(App, {
      global: {
        stubs: { NuxtRouteAnnouncer: true },
      },
    });

    expect(wrapper.text()).toContain("Jön");
  });
});
