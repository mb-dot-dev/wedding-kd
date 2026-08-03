import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import DefaultLayout from '../../app/layouts/default.vue';

describe('default layout', () => {
  it('links to all five pages', () => {
    const wrapper = mount(DefaultLayout);
    const links = wrapper.findAll('nav a').map((a) => [a.attributes('href'), a.text()]);

    expect(links).toEqual([
      ['/', 'Köszöntő'],
      ['/eskuvo', 'Esküvő'],
      ['/lakodalom', 'Lakodalom'],
      ['/naszajandek', 'Nászajándék'],
      ['/visszajelzes', 'Visszajelzés'],
    ]);
  });

  it('renders page content in its slot', () => {
    const wrapper = mount(DefaultLayout, {
      slots: { default: '<p>oldal tartalom</p>' },
    });

    expect(wrapper.text()).toContain('oldal tartalom');
  });
});
