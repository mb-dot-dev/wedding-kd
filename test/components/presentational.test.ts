import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import HighlightStrip from '../../app/components/HighlightStrip.vue';
import MiddleHeading from '../../app/components/MiddleHeading.vue';
import PageHeading from '../../app/components/PageHeading.vue';
import VenuePlaceholder from '../../app/components/VenuePlaceholder.vue';

describe('PageHeading', () => {
  it('renders its slot as an h1', () => {
    const wrapper = mount(PageHeading, { slots: { default: 'Esküvő' } });

    expect(wrapper.find('h1').text()).toBe('Esküvő');
  });
});

describe('MiddleHeading', () => {
  it('renders its slot as an h3', () => {
    const wrapper = mount(MiddleHeading, { slots: { default: 'Program' } });

    expect(wrapper.find('h3').text()).toBe('Program');
  });
});

describe('HighlightStrip', () => {
  it('renders its slot on the clay band', () => {
    const wrapper = mount(HighlightStrip, { slots: { default: '<span>Parkolás</span>' } });

    expect(wrapper.text()).toContain('Parkolás');
    expect(wrapper.classes()).toContain('bg-clay');
  });
});

describe('VenuePlaceholder', () => {
  it('marks the missing map image', () => {
    const wrapper = mount(VenuePlaceholder);

    expect(wrapper.text()).toContain('TODO: térkép kép');
  });
});
