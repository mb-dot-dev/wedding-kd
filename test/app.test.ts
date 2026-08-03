import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from '../app/app.vue';

vi.stubGlobal('useHead', vi.fn());

const stubs = {
  NuxtLayout: { template: '<div class="layout-stub"><slot /></div>' },
  NuxtPage: true,
};

describe('app.vue', () => {
  it('renders a page inside a layout', () => {
    const wrapper = mount(App, { global: { stubs } });

    expect(wrapper.find('.layout-stub').exists()).toBe(true);
    expect(wrapper.find('nuxt-page-stub').exists()).toBe(true);
  });

  it('no longer renders the scaffold placeholder', () => {
    const wrapper = mount(App, { global: { stubs } });

    expect(wrapper.text()).not.toContain('Jön');
  });
});
