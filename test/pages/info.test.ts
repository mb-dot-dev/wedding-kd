import { mount } from '@vue/test-utils';
import { describe, expect, it, vi } from 'vitest';
import GoogleFormsButton from '../../app/components/GoogleFormsButton.vue';
import PageHeading from '../../app/components/PageHeading.vue';
import RevolutLinkButton from '../../app/components/RevolutLinkButton.vue';
import NaszajandekPage from '../../app/pages/naszajandek.vue';
import VisszajelzesPage from '../../app/pages/visszajelzes.vue';

vi.stubGlobal('useSeoMeta', vi.fn());

const components = { PageHeading, RevolutLinkButton, GoogleFormsButton };

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

  it('renders a Revolut link button', () => {
    expect(mountPage().findComponent(RevolutLinkButton).exists()).toBe(true);
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

  it('renders a Google Forms button', () => {
    expect(mountPage().findComponent(GoogleFormsButton).exists()).toBe(true);
  });
});
