import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import HighlightStrip from '../../app/components/HighlightStrip.vue';
import MiddleHeading from '../../app/components/MiddleHeading.vue';
import IndexPage from '../../app/pages/index.vue';

vi.stubGlobal('useSeoMeta', vi.fn());

const mountPage = () => mount(IndexPage, { global: { components: { HighlightStrip, MiddleHeading } } });

describe('index page', () => {
  it('shows the couple and the date', () => {
    const wrapper = mountPage();

    expect(wrapper.find('h1').text()).toBe('Kata és Domi');
    expect(wrapper.text()).toContain('2027. május 22.');
  });

  it('shows the save-the-date image at its real dimensions', () => {
    const img = mountPage().find('img');

    expect(img.attributes('src')).toBe('/images/save-the-date.jpg');
    expect(img.attributes('width')).toBe('1000');
    expect(img.attributes('height')).toBe('1409');
    expect(img.attributes('alt')).toBeTruthy();
  });

  it('carries the invitation copy including its emoji', () => {
    const text = mountPage().text();

    expect(text).toContain('Kedves Családunk és Barátaink!🤍');
    expect(text).toContain('hajnalig tartó mulatsággal várunk mindenkit.🎉🤍');
  });

  it('spells the reception venue with "Kulturális"', () => {
    const text = mountPage().text();

    expect(text).toContain('Lóvasút Kulturális és Rendezvényközpont');
    expect(text).not.toContain('KULTÚRÁLIS');
  });

  it('lists the program, with the known ceremony time', () => {
    const text = mountPage().text();

    expect(text).toContain('Program');
    expect(text).toContain('14:30 - Esküvő');
    expect(text).toContain('Vacsora');
    expect(text).toContain('Buli');
  });
});
