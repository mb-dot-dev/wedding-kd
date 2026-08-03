import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import HighlightStrip from '../../app/components/HighlightStrip.vue';
import MapButton from '../../app/components/MapButton.vue';
import MiddleHeading from '../../app/components/MiddleHeading.vue';
import PageHeading from '../../app/components/PageHeading.vue';
import VenuePlaceholder from '../../app/components/VenuePlaceholder.vue';
import EskuvoPage from '../../app/pages/eskuvo.vue';
import LakodalomPage from '../../app/pages/lakodalom.vue';

vi.stubGlobal('useSeoMeta', vi.fn());

const components = { PageHeading, HighlightStrip, MiddleHeading, VenuePlaceholder, MapButton };

describe('eskuvo page', () => {
  const mountPage = () => mount(EskuvoPage, { global: { components } });

  it('is titled Esküvő', () => {
    expect(mountPage().find('h1').text()).toBe('Esküvő');
  });

  it('gives the church name, address and planned time', () => {
    const text = mountPage().text();

    expect(text).toContain('Zugligeti Szent Család Plébánia');
    expect(text).toContain('1125. Szarvas Gábor út 52.');
    expect(text).toContain('tervezetten 14:30');
  });

  it('offers a working map link with the church coordinates', () => {
    const maps = mountPage()
      .findAll('a')
      .find((a) => a.attributes('href')?.includes('google.com'));

    expect(maps?.attributes('href')).toContain('47.51687720938038,18.985569587647085');
  });

  it('shows a parking section', () => {
    expect(mountPage().text()).toContain('Parkolás');
  });
});

describe('lakodalom page', () => {
  const mountPage = () => mount(LakodalomPage, { global: { components } });

  it('is titled Lakodalom', () => {
    expect(mountPage().find('h1').text()).toBe('Lakodalom');
  });

  it('names the venue with the correct spelling', () => {
    const text = mountPage().text();

    expect(text).toContain('Lóvasút Kulturális és Rendezvényközpont');
    expect(text).not.toContain('KULTÚRÁLIS');
  });

  it('tells guests it is walking distance from the church', () => {
    expect(mountPage().text()).toContain('pár perc sétára');
  });

  it('marks the address as still missing rather than guessing one', () => {
    const wrapper = mountPage();

    expect(wrapper.text()).toContain('TODO: cím');
    expect(wrapper.findAll('a').some((a) => a.attributes('href')?.includes('google.com'))).toBe(false);
  });
});
