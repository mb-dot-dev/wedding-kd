import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import HighlightStrip from '../../app/components/HighlightStrip.vue';
import MapButton from '../../app/components/MapButton.vue';
import MiddleHeading from '../../app/components/MiddleHeading.vue';
import PageHeading from '../../app/components/PageHeading.vue';
import VenuePlaceholder from '../../app/components/VenuePlaceholder.vue';
import EskuvoPage from '../../app/pages/eskuvo.vue';
import LakodalomPage from '../../app/pages/lakodalom.vue';

const seoMeta = vi.fn();
vi.stubGlobal('useSeoMeta', seoMeta);

const components = { PageHeading, HighlightStrip, MiddleHeading, VenuePlaceholder, MapButton };

beforeEach(() => {
  seoMeta.mockClear();
});

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

  it('sets the correct social share metadata', () => {
    mountPage();

    const meta = seoMeta.mock.calls[0][0];
    expect(meta.ogUrl).toBe('https://kataesdomi.info/eskuvo');
    expect(meta.ogImage).toBe('https://kataesdomi.info/images/og.jpg');
    expect(meta.ogLocale).toBe('hu_HU');
    expect(meta.ogSiteName).toBe('Kata és Domi esküvője');
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

  it('sets the correct social share metadata', () => {
    mountPage();

    const meta = seoMeta.mock.calls[0][0];
    expect(meta.ogUrl).toBe('https://kataesdomi.info/lakodalom');
    expect(meta.ogImage).toBe('https://kataesdomi.info/images/og.jpg');
    expect(meta.ogLocale).toBe('hu_HU');
    expect(meta.ogSiteName).toBe('Kata és Domi esküvője');
  });
});
