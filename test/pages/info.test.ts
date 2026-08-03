import { mount } from '@vue/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import GoogleFormsButton from '../../app/components/GoogleFormsButton.vue';
import PageHeading from '../../app/components/PageHeading.vue';
import RevolutLinkButton from '../../app/components/RevolutLinkButton.vue';
import NaszajandekPage from '../../app/pages/naszajandek.vue';
import VisszajelzesPage from '../../app/pages/visszajelzes.vue';

const seoMeta = vi.fn();
vi.stubGlobal('useSeoMeta', seoMeta);

const components = { PageHeading, RevolutLinkButton, GoogleFormsButton };

beforeEach(() => {
  seoMeta.mockClear();
});

describe('naszajandek page', () => {
  const mountPage = () => mount(NaszajandekPage, { global: { components } });

  it('is titled Nászajándék', () => {
    expect(mountPage().find('h1').text()).toBe('Nászajándék');
  });

  it('marks the bank details as still missing', () => {
    const text = mountPage().text();

    expect(text).toContain('TODO: név');
    expect(text).toContain('TODO: bankszámlaszám');
  });

  it('does not render a Revolut link button while the tag is unknown', () => {
    const wrapper = mountPage();

    expect(wrapper.findComponent(RevolutLinkButton).exists()).toBe(false);
    expect(wrapper.text()).toContain('TODO: Revolut tag');
  });

  it('sets the correct social share metadata', () => {
    mountPage();

    const meta = seoMeta.mock.calls[0][0];
    expect(meta.ogUrl).toBe('https://kataesdomi.info/naszajandek');
    expect(meta.ogImage).toBe('https://kataesdomi.info/images/og.jpg');
    expect(meta.ogLocale).toBe('hu_HU');
    expect(meta.ogSiteName).toBe('Kata és Domi esküvője');
  });
});

describe('visszajelzes page', () => {
  const mountPage = () => mount(VisszajelzesPage, { global: { components } });

  it('is titled Visszajelzés', () => {
    expect(mountPage().find('h1').text()).toBe('Visszajelzés');
  });

  it('marks the deadline as still missing', () => {
    expect(mountPage().text()).toContain('TODO: határidő');
  });

  it('does not render an RSVP button while the form URL is unknown', () => {
    const wrapper = mountPage();

    expect(wrapper.findComponent(GoogleFormsButton).exists()).toBe(false);
    expect(wrapper.text()).toContain('TODO: google forms link');
  });

  it('sets the correct social share metadata', () => {
    mountPage();

    const meta = seoMeta.mock.calls[0][0];
    expect(meta.ogUrl).toBe('https://kataesdomi.info/visszajelzes');
    expect(meta.ogImage).toBe('https://kataesdomi.info/images/og.jpg');
    expect(meta.ogLocale).toBe('hu_HU');
    expect(meta.ogSiteName).toBe('Kata és Domi esküvője');
  });
});
