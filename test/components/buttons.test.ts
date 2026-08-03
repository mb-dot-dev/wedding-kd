import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import GoogleFormsButton from '../../app/components/GoogleFormsButton.vue';
import MapButton from '../../app/components/MapButton.vue';
import RevolutLinkButton from '../../app/components/RevolutLinkButton.vue';

describe('MapButton', () => {
  const props = { lat: '47.51687720938038', long: '18.985569587647085' };

  it('offers a native geo link on small screens', () => {
    const wrapper = mount(MapButton, { props });
    const geo = wrapper.findAll('a').find((a) => a.attributes('href')?.startsWith('geo:'));

    expect(geo?.attributes('href')).toBe('geo:0,0?q=47.51687720938038,18.985569587647085');
    expect(geo?.classes()).toContain('sm:hidden');
  });

  it('offers a Google Maps link on larger screens', () => {
    const wrapper = mount(MapButton, { props });
    const maps = wrapper.findAll('a').find((a) => a.attributes('href')?.includes('google.com'));

    expect(maps?.attributes('href')).toBe(
      'https://www.google.com/maps/search/?api=1&query=47.51687720938038,18.985569587647085',
    );
    expect(maps?.classes()).toContain('hidden');
  });
});

describe('GoogleFormsButton', () => {
  it('links to the given form', () => {
    const wrapper = mount(GoogleFormsButton, { props: { link: 'https://forms.gle/example' } });

    expect(wrapper.find('a').attributes('href')).toBe('https://forms.gle/example');
  });
});

describe('RevolutLinkButton', () => {
  it('links to the revolut.me profile and shows the tag', () => {
    const wrapper = mount(RevolutLinkButton, {
      props: { tag: 'example', currency: 'huf', amount: '1000', note: 'nászajándék' },
    });

    expect(wrapper.find('a').attributes('href')).toBe('https://revolut.me/example');
    expect(wrapper.text()).toContain('example');
  });
});
