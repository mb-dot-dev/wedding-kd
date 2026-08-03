import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import App from '../app/app.vue';

const useHead = vi.fn();
vi.stubGlobal('useHead', useHead);

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

  it('sets the Hungarian document language and a title template with the couple name', () => {
    mount(App, { global: { stubs } });

    const head = useHead.mock.calls[0][0];
    expect(head.htmlAttrs.lang).toBe('hu');
    expect(head.titleTemplate).toBe('%s | Kata és Domi');
  });
});
